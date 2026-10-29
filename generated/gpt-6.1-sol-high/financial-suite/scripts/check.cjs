const {chromium}=require('/app/node_modules/playwright-core');
const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const base='/motionsites-results/financial-suite/';
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.mp4':'video/mp4','.woff2':'font/woff2','.woff':'font/woff'};
const server=http.createServer((req,res)=>{let relative=decodeURIComponent(req.url.split('?')[0]);if(!relative.startsWith(base)){res.writeHead(404).end();return;}relative=relative.slice(base.length)||'index.html';const file=path.join('/work/dist',relative);if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}const stat=fs.statSync(file);const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};if(req.headers.range){const parts=req.headers.range.replace('bytes=','').split('-');const start=Number(parts[0]),end=parts[1]?Number(parts[1]):stat.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}else{res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}});
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
(async()=>{await new Promise(r=>server.listen(4173,'0.0.0.0',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const report={checks:[],errors:[],failedRequests:[],responses:[]};
try {
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});page.on('pageerror',e=>report.errors.push({viewport:name,message:e.message}));page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText,type:r.resourceType()}));page.on('response',r=>{if(r.status()>=400)report.responses.push({url:r.url(),status:r.status()});});
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});await page.waitForTimeout(1800);
  assert(await page.title()==='Infinite - Premium Credit Card','Page title');
  assert(await page.locator('h1').isVisible(),'Hero is visible');
  const geist=await page.evaluate(async()=>{await document.fonts.ready;return Array.from(document.fonts).some(face=>face.family==='Geist'&&face.status==='loaded')&&document.fonts.check('400 16px Geist');});report.checks.push({viewport:name,geistLoaded:geist});assert(geist,'Geist font loaded');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:false});
  const assets=await page.evaluate(async()=>{const urls=Array.from(document.querySelectorAll('[style*="background-image"]')).map(e=>e.style.backgroundImage.slice(5,-2));return Promise.all(urls.map(url=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve({url,width:im.naturalWidth,height:im.naturalHeight});im.onerror=()=>resolve({url,error:true});im.src=url;})));});
  assert(assets.length===4&&assets.every(asset=>!asset.error&&asset.width>0),'All supplied background images loaded');
  report.checks.push({viewport:name,hero:true,overflow:false,assets});
  if(name==='mobile'){
   await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(600);assert(await page.getByRole('button',{name:'Open menu',exact:true}).count()===0,'Menu toggles');await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
   await page.locator('#mobile-menu').getByRole('button',{name:'Rewards',exact:true}).click();assert(await page.locator('dialog').isVisible(),'Mobile item opens details');await page.getByRole('button',{name:'Close details'}).click();
  }else{
   await page.mouse.move(1050,370);await page.waitForTimeout(450);const mask=await page.locator('[aria-label="Infinite premium credit card"] .z-30').evaluate(e=>e.style.maskImage);assert(mask.includes('data:image/png'),'Canvas spotlight mask');await page.screenshot({path:'/work/screenshots/desktop-spotlight.png'});
   await page.getByRole('button',{name:'Rewards',exact:true}).click();assert(await page.locator('dialog').isVisible(),'Desktop nav');await page.keyboard.press('Escape');
  }
  await page.getByRole('button',{name:'How It Works',exact:true}).click();await page.waitForTimeout(1800);
  const video=await page.locator('video').evaluate(el=>({duration:el.duration,currentTime:el.currentTime,readyState:el.readyState,error:el.error?.message||null}));report.checks.push({viewport:name,video});assert(video.readyState>=2&&video.currentTime>0,'Video loaded and scrubbed');await page.screenshot({path:`/work/screenshots/${name}-video.png`});
  await page.evaluate(()=>window.scrollTo(0,1800));await page.waitForTimeout(1800);
  const card=page.locator('[aria-label="Instant activation"]');assert(await card.getAttribute('aria-hidden')==='false','Card section revealed');assert(await card.evaluate(el=>getComputedStyle(el).opacity)==='1','Card fully opaque');
  if(name==='desktop'){await page.mouse.move(720,450);await page.waitForTimeout(500);assert(await card.locator('.z-\\[3\\]').count()===1,'Card reveal layer');}
  await page.screenshot({path:`/work/screenshots/${name}-card.png`});
  await page.getByRole('button',{name:'More',exact:true}).click();assert(await page.locator('dialog').isVisible(),'More details');await page.getByRole('button',{name:'Close details'}).click();
  await page.getByRole('button',{name:'Apply now for free',exact:true}).click();assert(await page.locator('dialog').isVisible(),'Apply preview');await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Infinite home',exact:true}).click();await page.waitForTimeout(1800);assert(await page.evaluate(()=>scrollY)===0,'Return to hero');
  await page.getByRole('button',{name:'See Features',exact:true}).click();await page.waitForTimeout(1800);assert(await card.getAttribute('aria-hidden')==='false','See Features reaches card');
  report.checks.push({viewport:name,menuAndButtons:true,scrollReveal:true,reverseScroll:true,featuresButton:true});await page.close();
 }
 assert(report.errors.length===0,'No script errors');
 assert(report.responses.length===0,`No asset HTTP errors, including fonts: ${JSON.stringify(report.responses)}`);
 // Chromium can cancel a redundant video range request while seeking. No other failures are allowed.
 const unexpectedFailures=report.failedRequests.filter(request=>!(request.type==='media'&&request.error==='net::ERR_ABORTED'));
 assert(unexpectedFailures.length===0,`No unexpected failed asset requests: ${JSON.stringify(unexpectedFailures)}`);
 report.checks.push({assetHttpErrors:report.responses.length,unexpectedFailedRequests:unexpectedFailures.length});report.status='passed';
}catch(e){report.status='failed';report.failure=e.stack;console.error(e);}finally{fs.writeFileSync('/work/browser-checks.json',JSON.stringify(report,null,2));await browser.close();server.close();}if(report.status!=='passed')process.exitCode=1;
})();
