const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const prefix = '/motionsites-results/organic-odyssey/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(prefix)) { res.writeHead(404); return res.end(); }
  const filename = path.join('/work/dist',pathname.slice(prefix.length) || 'index.html');
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) { res.writeHead(404); return res.end(); }
  const size=fs.statSync(filename).size;
  const range = req.headers.range;
  if (range) { const [a,b] = range.replace('bytes=','').split('-'); const start=Number(a), end=b?Number(b):size-1; res.writeHead(206,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1}); fs.createReadStream(filename,{start,end}).pipe(res); }
  else { res.writeHead(200, {'Content-Type':types[path.extname(filename)]||'application/octet-stream','Content-Length':size,'Accept-Ranges':'bytes'}); fs.createReadStream(filename).pipe(res); }
});
(async () => {
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={url:`http://localhost:4173${prefix}`, checks:[]};
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const errors=[],failed=[];
  page.on('pageerror',err=>errors.push(err.message));
  page.on('requestfailed',req=>failed.push({url:req.url(),error:req.failure()?.errorText}));
  await page.goto(report.url,{waitUntil:'networkidle'});
  await page.waitForTimeout(3500);
  await page.evaluate(async()=>{ await document.fonts.ready; await Promise.all([300,400,500].map(weight=>document.fonts.load(`${weight} 16px Geist`))); });
  await page.locator('video').evaluate(v=>new Promise(resolve=>{v.pause();v.currentTime=1;v.addEventListener('seeked',resolve,{once:true});}));
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  const metrics=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,fonts:{garamond:document.fonts.check('16px Garamond'),geist300:document.fonts.check('300 16px Geist'),geist400:document.fonts.check('400 16px Geist'),geist500:document.fonts.check('500 16px Geist')},video:{readyState:document.querySelector('video').readyState,width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight,duration:document.querySelector('video').duration}}));
  if(name==='mobile') {
   await page.getByRole('button',{name:'Open menu',exact:true}).click();
   await page.locator('#mobile-navigation').waitFor({state:'visible'});
   await page.waitForTimeout(500);
   await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
   await page.locator('#mobile-navigation').getByRole('link',{name:'Story'}).click();
   await page.locator('#mobile-navigation').waitFor({state:'detached'});
   if(!page.url().endsWith('#story'))throw Error('Link navigation failed');
   await page.getByRole('button',{name:'Open menu',exact:true}).click();
   await page.keyboard.press('Escape');
   await page.locator('#mobile-navigation').waitFor({state:'detached'});
  }
  await page.getByRole('button',{name:'Begin the Experience'}).click();
  await page.getByRole('button',{name:'Return to introduction'}).waitFor();
  await page.waitForTimeout(1000);
  const immersive=await page.locator('section').evaluate(el=>getComputedStyle(el).opacity==='0');
  await page.getByRole('button',{name:'Return to introduction'}).click();
  await page.waitForTimeout(1000);
  const returned=await page.locator('section').evaluate(el=>getComputedStyle(el).opacity==='1');
  const videoPlaying=await page.locator('video').evaluate(v=>!v.paused && v.currentTime>1);
  report.checks.push({name,metrics,errors,failed,immersive,returned,videoPlaying,mobileMenu:name==='mobile'?'open, link close, Escape close passed':'not applicable'});
  await page.close();
 }
 fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));
 await browser.close();server.close();
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
