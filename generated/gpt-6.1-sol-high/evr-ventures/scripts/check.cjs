const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/evr-ventures/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf','.svg':'image/svg+xml','.mp4':'video/mp4'};
const server = http.createServer((req,res) => {
 const file = path.join('/work/dist',decodeURIComponent(req.url.split('?')[0]).replace(prefix,'') || 'index.html');
 if(!file.startsWith('/work/dist/') || !fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
 const stat=fs.statSync(file); const range=req.headers.range;
 if(range){const [a,b]=range.replace('bytes=','').split('-');const start=+a,end=b?+b:stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}else{res.setHeader('Content-Length',stat.size);fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',820,1180]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];const failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});page.on('requestfailed',r=>failed.push(r.url()));
  await page.goto(`http://localhost:4173${prefix}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
  await page.waitForTimeout(1700);
  const before=await page.locator('video').evaluate(v=>v.currentTime);await page.waitForTimeout(300);
  const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,fonts:document.fonts.check('300 16px Geist')&&document.fonts.check('16px "Gilda Display"'),video:{ready:document.querySelector('video').readyState,playing:!document.querySelector('video').paused,time:document.querySelector('video').currentTime,width:document.querySelector('video').videoWidth},progress:getComputedStyle(document.querySelector('.progress-fill')).strokeDashoffset,headingTracking:getComputedStyle(document.querySelector('h1')).letterSpacing}));
  assert(metrics.scrollWidth<=width,'Horizontal overflow');assert(metrics.fonts,'Fonts loaded');assert(metrics.video.time>before,'Video playing');assert.equal(metrics.progress,'84.823px');
  if(name!=='tablet')await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Menu',exact:true}).click();await page.waitForTimeout(800);
  assert.equal(await page.locator('body').evaluate(e=>e.style.overflow),'hidden');assert.equal(await page.getByRole('dialog').count(),1);
  assert.equal(await page.locator('.menu-links a').count(),5);
  if(name==='desktop')await page.screenshot({path:'/work/screenshots/menu.png'});
  await page.getByRole('button',{name:'Close menu'}).focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Contact');
  await page.keyboard.press('Escape');await page.waitForTimeout(800);assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.locator('body').evaluate(e=>e.style.overflow),'');
  await page.getByRole('button',{name:'Menu',exact:true}).click();await page.waitForTimeout(800);await page.getByRole('link',{name:'Services',exact:true}).click();await page.waitForTimeout(800);assert(page.url().endsWith('#services'));assert.equal(await page.getByRole('dialog').count(),0);
  if(name!=='mobile')for(const label of ['About Us','Services','Get Started']){await page.getByRole('button',{name:label,exact:true}).click();await page.waitForTimeout(800);assert.equal(await page.evaluate(()=>document.activeElement.textContent),label==='Get Started'?'Contact':label);await page.getByRole('button',{name:'Close menu'}).click();await page.waitForTimeout(800);}
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);report[name]={...metrics,menuOpenClose:true,escape:true,focusTrap:true,hashNavigation:true,errors,failed};
  await page.close();
 }
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
