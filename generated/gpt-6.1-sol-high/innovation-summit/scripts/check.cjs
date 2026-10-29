const {chromium}=require('/app/node_modules/playwright-core');
const http=require('http'),fs=require('fs'),path=require('path');
const base='/motionsites-results/innovation-summit/';
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mp4':'video/mp4','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(!pathname.startsWith(base)){res.writeHead(404).end();return;}
  const file=path.join('/work/dist',pathname.slice(base.length)||'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  const stat=fs.statSync(file),range=req.headers.range;
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  if(range){const [a,b]=range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else{res.setHeader('Content-Length',stat.size);fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results=[];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',820,1180],['small',320,740],['compact-desktop',1024,1000]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failed=[],mediaAborts=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});page.on('requestfailed',req=>{const failure={url:req.url(),reason:req.failure()?.errorText};if(req.url().endsWith('.mp4')&&failure.reason==='net::ERR_ABORTED')mediaAborts.push(failure);else failed.push(failure)});page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url())});
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2800);
  const checks=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,phones:[...document.querySelectorAll('.phone')].map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}}),images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),video:{readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,time:document.querySelector('video').currentTime},fontStatus:document.fonts.status,fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),chipRowsFit:[...document.querySelectorAll('.chip-row')].every(el=>el.scrollWidth<=el.clientWidth),faqFits:document.querySelector('.faq-groups').getBoundingClientRect().bottom<document.querySelector('.faqs').getBoundingClientRect().bottom}));
  if(['desktop','mobile'].includes(name))await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Home menu (visual preview)',exact:true}).click();
  await page.getByRole('button',{name:'Get a ticket (visual preview)',exact:true}).click();
  await page.getByRole('button',{name:'Get a ticket (visual preview)',exact:true}).focus();
  checks.ctaFocusable=await page.evaluate(()=>document.activeElement.classList.contains('ticket'));
  results.push({name,viewport:{width,height},...checks,errors,failed,mediaAborts});await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await reduced.goto('http://localhost:4173'+base);const reducedMotion=await reduced.evaluate(()=>({animation:getComputedStyle(document.querySelector('h1')).animationName,videoVisibility:getComputedStyle(document.querySelector('video')).visibility}));await reduced.close();
 const passed=results.every(r=>!r.overflow&&r.chipRowsFit&&r.faqFits&&r.ctaFocusable&&r.images.every(i=>i.loaded)&&r.video.readyState>=3&&!r.video.paused&&r.errors.length===0&&r.failed.length===0)&&reducedMotion.animation==='none'&&reducedMotion.videoVisibility==='hidden';
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify({passed,results,reducedMotion},null,2));if(!passed)process.exitCode=1;console.log(JSON.stringify({results,reducedMotion},null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
