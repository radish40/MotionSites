const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/package-fits-pricing/';
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', name.slice(base.length) || 'index.html');
  fs.readFile(file,(err,data)=>{
    if(err) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', file.endsWith('.webp') ? 'image/webp' : 'text/html; charset=utf-8'); res.end(data);
  });
});
(async()=>{
  await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const errors=[], failures=[], contacts=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text()); if(m.text().startsWith('[c2]'))contacts.push(m.text());});
  page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure().errorText}));
  await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1300);
  const read=()=>page.locator('[data-price]').textContent();
  const settled=()=>page.waitForTimeout(450);
  assert.equal(await read(),'$1,500');
  assert.equal(await page.locator('[data-price-note]').textContent(),'One-time');
  const images=await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight})));
  assert(images.every(i=>i.loaded));
  const fonts=await page.evaluate(()=>({playfair:document.fonts.check('16px "Playfair Display"'),inter:document.fonts.check('16px Inter'),cormorant:document.fonts.check('16px "Cormorant Garamond"')}));
  await page.screenshot({path:'screenshots/desktop.png',fullPage:true});
  await page.getByRole('tab',{name:'Multi-page',exact:true}).click();await settled();assert.equal(await read(),'$2,500');
  await page.getByRole('switch').click();await settled();assert.equal(await read(),'$3,300');assert.equal(await page.locator('[data-price-note]').textContent(),'One-time + Framer');
  await page.locator('[data-package="Web Design"]').click();
  await page.getByRole('tab',{name:'Multi-page',exact:true}).focus();await page.keyboard.press('ArrowLeft');await settled();assert.equal(await read(),'$2,300');assert.equal(await page.locator('[data-pages="single"]').getAttribute('aria-selected'),'true');
  await page.getByRole('switch').focus();await page.keyboard.press('Space');await settled();assert.equal(await read(),'$1,500');assert.equal(await page.getByRole('switch').getAttribute('aria-checked'),'false');
  await page.getByRole('tab',{name:'Multi-page',exact:true}).focus();await page.keyboard.press('Enter');await settled();assert.equal(await read(),'$2,500');
  await page.getByRole('tab',{name:'Single-page',exact:true}).focus();await page.keyboard.press('Space');await settled();assert.equal(await read(),'$1,500');
  await page.getByRole('switch').focus();await page.keyboard.press('Enter');await settled();assert.equal(await read(),'$2,300');await page.keyboard.press('Enter');await settled();
  await page.locator('[data-package="Product Design"]').click();await page.locator('[data-package="Custom"]').click();assert.equal(contacts.length,3);
  const overflow=[];
  for(const width of [1440,390,375]){
    await page.setViewportSize({width,height:width===1440?1000:844});await settled();
    const layout=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,columns:getComputedStyle(document.querySelector('.c2-grid')).gridTemplateColumns,tree:getComputedStyle(document.querySelector('.c2-tree')).width,landscape:getComputedStyle(document.querySelector('.c2-landscape')).width}));
    assert(layout.scrollWidth<=width);overflow.push(layout);
    if(width===390)await page.screenshot({path:'screenshots/mobile.png',fullPage:true});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  const reducedMotion=await page.locator('.c2-title').evaluate(e=>getComputedStyle(e).animationDuration);assert.equal(reducedMotion,'1e-05s');
  const result={viewports:overflow,images,fonts,contactLogs:contacts,scriptErrors:errors,failedRequests:failures,reducedMotion,interactionChecks:'PASS: default, multi, Framer, combined total, keyboard arrows/Enter/Space, selected/checked ARIA, contact logs'};
  fs.writeFileSync('browser-checks.json',JSON.stringify(result,null,2));
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  console.log(JSON.stringify(result,null,2));
  await browser.close();server.close();
})().catch(err=>{console.error(err);server.close();process.exit(1);});
