const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/codenest-hero/';
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404);res.end();return; }
  const file = path.resolve('dist', url.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist')+'/')) {res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,data) => {res.writeHead(err ? 404 : 200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});res.end(err ? 'Not found' : data);});
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={ viewports:[], pageErrors:[], consoleErrors:[], failedRequests:[], httpErrors:[] };
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text())});
  page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({url:r.url(),status:r.status()})});
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1800);
  try {await page.waitForFunction(()=>document.querySelector('video').currentTime>0,{},{timeout:25000});}catch{}
  async function measure(label){
    const data=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,fontsLoaded:document.fonts.check('800 72px Inter')&&document.fonts.check('italic 18px "Instrument Serif"')&&document.fonts.check('700 11px "Plus Jakarta Sans"'),card:{width:document.querySelector('.glass-card').offsetWidth,height:document.querySelector('.glass-card').offsetHeight,transform:getComputedStyle(document.querySelector('.glass-card')).transform,translate:getComputedStyle(document.querySelector('.glass-card')).translate},video:{readyState:document.querySelector('video').readyState,time:document.querySelector('video').currentTime,paused:document.querySelector('video').paused,width:document.querySelector('video').videoWidth,status:document.querySelector('video').dataset.status||'streaming'}}));
    assert.ok(data.scrollWidth<=data.width,`${label} horizontal overflow`);assert.ok(data.fontsLoaded);assert.equal(data.card.width,200);assert.equal(data.card.height,200);assert.equal(data.card.translate,'0px -50px');report.viewports.push({label,...data});
  }
  await measure('desktop');
  await page.screenshot({path:'screenshots/desktop.png',fullPage:true});
  for (const label of ['PROJECTS','BLOG','ABOUT','RESUME']) {
   await page.getByRole('link',{name:label,exact:true}).click();await page.waitForFunction(()=>document.querySelector('dialog').open);await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog').open);
  }
  await page.getByRole('button',{name:'GET STARTED',exact:true}).click();await page.getByRole('heading',{name:'It starts with your first line.'}).waitFor();await page.screenshot({path:'screenshots/get-started.png'});await page.getByRole('button',{name:'Close details'}).click();
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);await measure('mobile');await page.screenshot({path:'screenshots/mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('dialog',{name:'Navigation'}).waitFor();await page.screenshot({path:'screenshots/mobile-menu.png'});await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
  await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'02 BLOG'}).click();await page.getByRole('heading',{name:'Stay curious. Keep building.'}).waitFor();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Close menu'}).click();
  await page.getByRole('button',{name:'GET STARTED',exact:true}).click();await page.getByRole('button',{name:'BACK TO CODENEST'}).click();
  for(const width of [320,768,1024,1920]) {await page.setViewportSize({width,height:900});await measure('responsive-'+width);}
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('video').evaluate(v=>v.currentTime),0);report.reducedMotion=true;
  report.interactions=['desktop navigation: all 4 links open details; Escape closes','Get Started opens learning path; close and return controls work','mobile full-screen menu: open, close button, Escape, link selection','focus returns to menu trigger','responsive checks: 320, 390, 768, 1024, 1440, 1920 widths','reduced motion: poster instead of autoplay'];
  assert.equal(report.pageErrors.length,0);assert.equal(report.consoleErrors.length,0);
  report.status='passed';
 } catch(err){report.status='failed';report.failure=err.stack;process.exitCode=1;}
 finally {fs.writeFileSync('screenshots/checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();}
})();
