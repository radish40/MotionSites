const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const base = '/motionsites-results/prisma-landing/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg'};
const server = http.createServer((req,res) => {
 const file = path.join('/work/dist',decodeURIComponent(req.url.split('?')[0]).replace(base,'') || 'index.html');
 if(!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
 const stat=fs.statSync(file); const range=req.headers.range;
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
 if(range) { const [a,b]=range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res); }
 else {res.setHeader('Content-Length',stat.size);fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={url:'http://localhost:4173'+base,checks:[],errors:[],failedRequests:[]};
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',768,1024]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push({viewport:name,message:e.message}));
  page.on('requestfailed',r=>report.failedRequests.push({viewport:name,url:r.url(),error:r.failure()}));
  page.on('response',r=>{if(r.status()>=400)report.errors.push({viewport:name,status:r.status(),url:r.url()})});
  await page.goto(report.url,{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(1800);
  report.checks.push({viewport:name,type:'initial',data:await page.evaluate(()=>({title:document.title,scrollWidth:document.documentElement.scrollWidth,width:innerWidth,fonts:[document.fonts.check('16px Almarai'),document.fonts.check('italic 16px "Instrument Serif"')],videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,readyState:v.readyState,width:v.videoWidth,paused:v.paused,error:v.error?.message}))}))});
  // Save exact stills from supplied videos as loading / reduced-motion posters.
  if(name==='desktop')for(const [i,file] of ['hero-poster.jpg','canvas-poster.jpg'].entries()) {
   const data=await page.evaluate(async i=>{const v=document.querySelectorAll('video')[i]; if(v.readyState<2)return null;v.pause();v.currentTime=1;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/jpeg',.88).split(',')[1]},i);
   if(data)fs.writeFileSync('/work/public/assets/'+file,Buffer.from(data,'base64'));
  }
  const destinations = [];
  for (const label of ['Our story','Collective','Workshops','Programs','Inquiries','Join the lab']) {
   await page.getByRole('link',{name:label,exact:true}).click();
   await page.waitForTimeout(650);
   destinations.push({label,hash:await page.evaluate(()=>location.hash)});
  }
  report.checks.push({viewport:name,type:'all-links',destinations});
  await page.getByRole('link',{name:'Our story',exact:true}).click(); await page.waitForTimeout(1800);
  report.checks.push({viewport:name,type:'navigation',hash:await page.evaluate(()=>location.hash)});
  await page.getByRole('link',{name:'Workshops',exact:true}).click();await page.waitForTimeout(2200);
  for(const button of await page.locator('.feature-card button').all()) {
   await button.click();await page.waitForTimeout(100);if(await button.getAttribute('aria-expanded')!=='true')throw Error('Card failed to expand');await button.click();
  }
  report.checks.push({viewport:name,type:'feature-interactions',passed:true});
  // Trigger every scroll-linked and entrance animation before full-page capture.
  const total=await page.evaluate(()=>document.body.scrollHeight);
  for(let y=0;y<total;y+=500){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(180);}
  await page.waitForTimeout(2200);
  await page.evaluate(()=>{document.querySelectorAll('video').forEach(v=>{v.pause();v.currentTime=1});scrollTo({top:0,behavior:'instant'})});
  await page.waitForTimeout(500);
  if(name!=='tablet')await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  report.checks.push({viewport:name,type:'overflow',passed:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),overflowing:await page.evaluate(()=>[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.tagName+'.'+e.className).slice(0,10))});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload({waitUntil:'networkidle'});
  report.checks.push({viewport:name,type:'reduced-motion',videosPaused:await page.evaluate(()=>[...document.querySelectorAll('video')].every(v=>v.paused))});
  await page.close();
 }
 fs.writeFileSync('/work/browser-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
