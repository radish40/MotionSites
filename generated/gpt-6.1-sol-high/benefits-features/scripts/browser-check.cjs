const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('node:assert/strict');
const http = require('http');
const path = require('path');
const base = '/motionsites-results/benefits-features/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0]).replace(base,''));
  const target = req.url.split('?')[0] === base ? '/work/dist/index.html' : file;
  fs.readFile(target,(err,data) => {res.writeHead(err?404:200, {'Content-Type': types[path.extname(target)] || 'application/octet-stream'});res.end(err?'Not found':data);});
});
(async () => {
 await new Promise(r=>server.listen(4173,r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--no-proxy-server']});
 const results=[];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failedRequests=[],httpErrors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure().errorText}));
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(2700);
  const defaultExpanded = await page.getByRole('button',{name:'Connections'}).getAttribute('aria-expanded');
  await page.getByRole('button',{name:'Sport Pacakge'}).click();
  await page.waitForTimeout(500);
  const sportExpanded = await page.getByRole('region',{name:'Sport Pacakge'}).isVisible();
  const connectionCollapsed = await page.getByRole('button',{name:'Connections'}).getAttribute('aria-expanded') === 'false';
  await page.getByRole('button',{name:'Connections'}).focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const keyboardExpanded = await page.getByRole('button',{name:'Connections'}).getAttribute('aria-expanded') === 'true';
  await page.locator('video').scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000);
  const data=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth>innerWidth,
   font:document.fonts.check('500 18px Inter'),
   video:{readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,currentTime:document.querySelector('video').currentTime,error:document.querySelector('video').error?.message||null},
   counter:document.querySelector('[data-testid="counter"]').textContent,
   fallback:!!document.querySelector('.inline-fallback'),
   cardBounds:document.querySelector('video').parentElement.getBoundingClientRect().toJSON()
  }));
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(500);
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  assert.equal(defaultExpanded,'true');
  assert.ok(sportExpanded && connectionCollapsed && keyboardExpanded);
  assert.equal(data.overflow,false);
  assert.ok(data.font && data.video.readyState >= 3 && !data.video.paused && data.video.currentTime > 0);
  assert.equal(data.counter,'86%');
  assert.deepEqual(errors,[]);
  results.push({name,viewport:{width,height},defaultExpanded,sportExpanded,connectionCollapsed,keyboardExpanded,...data,errors,failedRequests,httpErrors});
  await page.close();
 }
 fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
