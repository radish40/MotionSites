const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('/app/node_modules/playwright-core');
const root = path.resolve('dist');
const base = '/motionsites-results/unwind-hero/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(req.url.split('?')[0]);
 if(!pathname.startsWith(base)){res.writeHead(404);return res.end()}
 const filename=path.join(root,pathname.slice(base.length)||'index.html');
 if(!filename.startsWith(root)||!fs.existsSync(filename)){res.writeHead(404);return res.end()}
 const stat=fs.statSync(filename);res.setHeader('Content-Type',types[path.extname(filename)]||'application/octet-stream');
 const range=req.headers.range;
 if(range){const parts=range.replace('bytes=','').split('-');const start=Number(parts[0]);const end=parts[1]?Number(parts[1]):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(filename,{start,end}).pipe(res)}else{res.setHeader('Content-Length',stat.size);fs.createReadStream(filename).pipe(res)}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const results={};const errors=[];const failed=[];const mediaAborts=[];
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['reference',1545,997],['tablet',768,1024],['small-desktop',1024,768]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('requestfailed',r=>{const issue={url:r.url(),error:r.failure()?.errorText};if(issue.url.endsWith('.mp4')&&issue.error==='net::ERR_ABORTED')mediaAborts.push(issue);else failed.push(issue)});
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1100);
  const metrics=await page.evaluate(async()=>{
   const initiallyPlaying=!document.querySelector('video').paused && document.querySelector('video').currentTime>0;
   const v=document.querySelector('video');await new Promise((resolve,reject)=>{if(v.readyState>=2)return resolve();v.addEventListener('loadeddata',resolve,{once:true});setTimeout(()=>reject(Error('Video load timeout')),8000)});v.pause();v.currentTime=1;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));
   const box=s=>{const {x,y,width,height}=document.querySelector(s).getBoundingClientRect();return {x,y,width,height}};
   return {initiallyPlaying,overflow:document.documentElement.scrollWidth>innerWidth,cardInBounds:document.querySelector('.reserve-card').getBoundingClientRect().right<=innerWidth,font400:document.fonts.check('400 16px "PP Mori"'),font600:document.fonts.check('600 16px "PP Mori"'),video:{readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop},heading:box('h1'),card:box('.reserve-card'),description:box('#experience'),rating:box('.rating')}
  });assert(!metrics.overflow,`${name}: horizontal overflow`);assert(metrics.cardInBounds,`${name}: clipped card`);assert(metrics.font400&&metrics.font600);assert(metrics.initiallyPlaying);assert(metrics.video.width>0&&!metrics.video.loop&&metrics.video.muted);
  if(['desktop','mobile'].includes(name))await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  if(name==='desktop'){
   await page.getByRole('button',{name:'Check-in date: February 11',exact:true}).click();await page.getByRole('button',{name:'February 18, 2025',exact:true}).click();assert(await page.getByRole('button',{name:'Check-in date: February 18',exact:true}).count());
   await page.getByRole('button',{name:'Check-out date: March 25',exact:true}).click();await page.getByRole('button',{name:'March 29, 2025',exact:true}).click();
   await page.getByRole('button',{name:'Reserve',exact:true}).click();assert(await page.locator('#arrival-calendar').isVisible());await page.keyboard.press('Escape');await page.locator('#arrival-calendar').waitFor({state:'hidden'});
   await page.getByRole('button',{name:'Book Now',exact:true}).click();assert(await page.locator('#arrival-calendar').isVisible());await page.locator('h1').click();await page.locator('#arrival-calendar').waitFor({state:'hidden'});
   await page.getByRole('button',{name:'Edit cabin name'}).click();assert(await page.locator('h2').getAttribute('contenteditable')==='true');await page.keyboard.press('Enter');assert(await page.locator('h2').getAttribute('contenteditable')==='false');
   await page.getByRole('button',{name:'Check-out date: March 29',exact:true}).click();await page.waitForTimeout(250);await page.screenshot({path:'screenshots/desktop-calendar.png',fullPage:true});
   metrics.interactions=['check-in selection','check-out selection','Reserve date entry','Book Now date entry','outside-click dismissal','Escape dismissal','edit title'];
  }
  if(name==='mobile'){
   await page.getByRole('button',{name:'Open menu'}).click();assert(await page.locator('#mobile-menu').isVisible());await page.waitForTimeout(350);await page.screenshot({path:'screenshots/mobile-menu.png',fullPage:true});await page.locator('#mobile-menu a').filter({hasText:'Rooms'}).click();await page.locator('#mobile-menu').waitFor({state:'hidden'});
   await page.getByRole('button',{name:'Check-in date: February 11',exact:true}).click();await page.getByRole('button',{name:'February 20, 2025',exact:true}).click();
   metrics.interactions=['mobile menu open','menu anchor and dismissal','mobile date selection'];
  }
  results[name]=metrics;await page.close();
 }
 assert.equal(errors.length,0,errors.join('\n'));assert.equal(failed.length,0,failed.join('\n'));
 fs.writeFileSync('screenshots/checks.json',JSON.stringify({passed:true,viewports:results,scriptErrors:errors,failedRequests:failed,expectedVideoSeekAborts:mediaAborts},null,2));console.log(JSON.stringify({passed:true,viewports:results,scriptErrors:errors,failedRequests:failed,expectedVideoSeekAborts:mediaAborts},null,2));
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
