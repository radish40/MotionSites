const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');
const root = path.resolve(__dirname, '..');
const prefix = '/motionsites-results/jewelry-store/';
const types = {'.html':'text/html','.png':'image/png','.css':'text/css','.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(prefix)) {res.writeHead(404);return res.end();}
  const file = path.join(root, 'dist', url.pathname.slice(prefix.length) || 'index.html');
  fs.readFile(file, (err, data) => {
    res.writeHead(err ? 404 : 200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(err ? 'Not found' : data);
  });
});
(async () => {
 await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium', args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = {url:prefix, checks:[], errors:[], failedRequests:[]};
 try {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   page.on('pageerror', e => report.errors.push(e.message));
   page.on('console', m => {if(m.type()==='error') report.errors.push(m.text());});
   page.on('requestfailed', r => report.failedRequests.push(r.url()));
   page.on('response', r => {if(r.status()>=400) report.failedRequests.push(r.url()+': '+r.status());});
   await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
   await page.evaluate(() => document.fonts.ready);
   await page.waitForTimeout(2400);
   const state = await page.evaluate(() => ({
     title:document.title,
     width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
     height:innerHeight, scrollHeight:document.documentElement.scrollHeight,
     images:[...document.images].every(i=>i.complete && i.naturalWidth>0),
     fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),
     product: (()=>{const e=document.querySelector(innerWidth<1024?'.mobile-product-card':'.product-card-desktop');const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};})()
   }));
   assert.equal(state.title,'Blue Nile');
   assert.equal(state.scrollWidth,width);
   assert.equal(state.scrollHeight,height);
   assert.equal(state.images,true);
   assert(state.fonts.every(f=>f.status==='loaded'));
   assert(state.product.y>=0 && state.product.y+state.product.height<=height);
   await page.screenshot({path:path.join(root,'screenshots',name+'.png'),fullPage:true});
   if(name==='mobile') {
    const toggle=page.getByRole('button',{name:'Toggle menu'});
    await toggle.click();
    await page.waitForTimeout(650);
    assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    assert(await page.locator('.menu-item').first().isVisible());
    assert.equal(await page.locator('#menu-panel').evaluate(e=>Math.round(e.getBoundingClientRect().x)),0);
    await page.screenshot({path:path.join(root,'screenshots/mobile-menu.png')});
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    await toggle.click(); await page.waitForTimeout(600);
    await page.locator('#menu-backdrop').click({position:{x:370,y:400}});
    await page.waitForTimeout(600);
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    await toggle.click(); await page.waitForTimeout(600);
    await page.locator('.menu-item').nth(1).click();
    await page.waitForTimeout(600);
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    report.checks.push('Mobile menu opens; Escape, backdrop, and menu link close it');
   } else {
    await page.locator('.explore-button').hover();
    assert.equal(await page.locator('.explore-button').evaluate(e=>getComputedStyle(e).cursor),'pointer');
    report.checks.push('Desktop supplied CTA hover and navigation visible');
   }
   report.checks.push({viewport:name,...state});
   await page.close();
  }
  assert.deepEqual(report.errors,[]);
  assert.deepEqual(report.failedRequests,[]);
  report.status='passed';
 } finally {
  fs.writeFileSync(path.join(root,'screenshots/checks.json'),JSON.stringify(report,null,2)+'\n');
  await browser.close(); server.close();
 }
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
