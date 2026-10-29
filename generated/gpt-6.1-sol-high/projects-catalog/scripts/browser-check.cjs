const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/projects-catalog/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(base)) {res.writeHead(404).end();return;}
  const filename = path.join('/work/dist',name.slice(base.length) || 'index.html');
  if(!fs.existsSync(filename)) {res.writeHead(404).end();return;}
  res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
  fs.createReadStream(filename).pipe(res);
});
(async () => {
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = {viewports:[],errors:[],failedRequests:[]};
 try {
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
   const page = await context.newPage();
   page.on('pageerror',e=>report.errors.push(e.message));
   page.on('requestfailed',r=>report.failedRequests.push({viewport:name,url:r.url(),error:r.failure().errorText}));
   await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle',timeout:60000});
   await page.evaluate(async()=>{ await document.fonts.load('900 160px Kanit'); await document.fonts.ready; });
   await page.waitForTimeout(900);
   assert.equal(await page.locator('h1').textContent(),'Project');
   assert.equal(await page.locator('article').count(),3);
   assert.equal(await page.locator('img').count(),9);
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,font:document.fonts.check('900 160px Kanit'),images:[...document.images].map(i=>({loaded:i.complete&&i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight})),cards:[...document.querySelectorAll('article')].map(e=>({height:e.offsetHeight,top:e.getBoundingClientRect().top})),bodyHeight:document.documentElement.scrollHeight}));
   assert.equal(state.overflow,false);
   assert.equal(state.font,true);
   assert(state.images.every(i=>i.loaded));
   await page.screenshot({path:`/work/screenshots/${name}.png`});
   const scrollStates=[];
   for(let y=0;y<state.bodyHeight-height;y+=220){
    await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(30);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   }
   for(const y of [500,1300,state.bodyHeight-height]){
    await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(150);
    scrollStates.push(await page.locator('article').evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,transform:getComputedStyle(e).transform}))));
   }
   await page.evaluate(y=>scrollTo(0,y),Math.min(state.bodyHeight-height,state.cards[2].top-24));
   await page.waitForTimeout(150);
   await page.screenshot({path:`/work/screenshots/${name}-stacked.png`});
   // Test each real link at its initial scroll position before another card covers it.
   for(let i=0;i<3;i++){
    const target=await page.locator('.project-wrapper').nth(i).evaluate(e=>e.offsetTop);
    await page.evaluate(y=>scrollTo(0,y),Math.max(0,target-150));await page.waitForTimeout(150);
    const link=page.locator('.live-project').nth(i);
    assert.equal(await link.getAttribute('href'),'#');
    assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
    const [popup]=await Promise.all([page.waitForEvent('popup'),link.click()]);
    await popup.waitForLoadState('domcontentloaded');await popup.close();
   }
   await page.evaluate(()=>scrollTo(0,0));
   await page.locator('h1').evaluate(e=>{e.setAttribute('tabindex','-1'); e.focus();});
   await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('live-project')),true);
   report.viewports.push({name,width,height,...state,scrollStates,linksOpened:3,keyboardFocus:true});
   await context.close();
  }
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>scrollTo(0,1500));await page.waitForTimeout(100);
  report.reducedMotion = await page.locator('article').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'));
  assert.equal(report.reducedMotion,true);
  await context.close();
  assert.equal(report.errors.length,0);
  report.passed=true;
 } finally {
  fs.writeFileSync('/work/browser-checks.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();server.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1});
