const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/apex-program-accordion/';
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length) || 'index.html';
  if (!req.url.startsWith(base) || relative.includes('..')) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', relative);
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', ({ '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2' })[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
 await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = { checks: [], errors: [], failedRequests: [], fonts: {} };
 try {
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const context = await browser.newContext({ viewport:{ width,height }, deviceScaleFactor:1 });
   const page = await context.newPage();
   page.on('pageerror', e=>report.errors.push(e.message));
   page.on('console', m=>{if(m.type()==='error') report.errors.push(m.text());});
   page.on('requestfailed', r=>report.failedRequests.push({url:r.url(),error:r.failure().errorText}));
   await page.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(1300);
   const buttons = page.getByRole('button');
   assert.equal(await buttons.count(),4);
   assert.equal(await buttons.nth(0).getAttribute('aria-expanded'),'true');
   assert.equal(await page.locator('li').count(),4);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
   report.fonts[name] = await page.evaluate(()=>({ inter:document.fonts.check('14px Inter'), symbols:document.fonts.check('16px "Material Symbols Outlined"'), faces:[...document.fonts].map(f=>({family:f.family,status:f.status})) }));
   await buttons.nth(3).scrollIntoViewIfNeeded();
   await page.waitForTimeout(1000);
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.waitForTimeout(200);
   await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
   report.checks.push(`${name} ${width}x${height}: default state, lesson count, no horizontal overflow, screenshot`);
   for (let i=1; i<4; i++) {
    await buttons.nth(i).click();
    if(i===1) {
     await page.waitForTimeout(100);
     const panel = page.getByRole('region').last();
     const midHeight = await panel.evaluate(e=>e.getBoundingClientRect().height);
     await page.waitForTimeout(500);
     assert.ok(await panel.evaluate(e=>e.getBoundingClientRect().height) > midHeight);
     assert.ok(await buttons.nth(i).locator('.rotate-180').evaluate(e=>getComputedStyle(e).transform.startsWith('matrix(-1')));
     report.checks.push(`${name}: animated height transition and 180-degree chevron verified`);
    } else await page.waitForTimeout(650);
    assert.equal(await page.locator('button[aria-expanded="true"]').count(),1);
    assert.equal(await buttons.nth(i).getAttribute('aria-expanded'),'true');
    assert.equal(await page.locator('li').count(),[4,7,4,3][i]);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
   }
   await buttons.nth(3).click(); await page.waitForTimeout(400);
   assert.equal(await page.locator('li').count(),0);
   await buttons.nth(0).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
   assert.equal(await page.locator('li').count(),4);
   await page.keyboard.press('Space'); await page.waitForTimeout(400);
   assert.equal(await page.locator('li').count(),0);
   report.checks.push(`${name}: every module opens exclusively, lesson counts 4/7/4/3, close-all, Enter/Space keyboard toggles`);
   await page.mouse.move(230,240);
   assert.ok(await page.locator('[aria-hidden="true"]').evaluateAll(els=>els.some(e=>e.style.getPropertyValue('--spot-x'))));
   report.checks.push(`${name}: global pointer updates spotlight CSS variables`);
   await context.close();
  }
  const context = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const page = await context.newPage();
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.getByRole('button').nth(1).click(); await page.waitForTimeout(60);
  assert.equal(await page.locator('li').count(),7);
  assert.ok(await page.locator('h2').evaluate(e=>getComputedStyle(e.parentElement).transform==='none'||getComputedStyle(e.parentElement).transform==='matrix(1, 0, 0, 1, 0, 0)'));
  report.checks.push('Reduced motion: no reveal translation; immediate accordion transition');
  await context.close();
  assert.equal(report.errors.length,0, JSON.stringify(report.errors));
  fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
 } finally { await browser.close(); server.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
