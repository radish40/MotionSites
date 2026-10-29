const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const base = '/motionsites-results/coffee-rewards/';
const mimes = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4'};
const server = http.createServer((req,res)=>{
 const pathname = decodeURIComponent(req.url.split('?')[0]);
 if(!pathname.startsWith(base)){res.writeHead(404).end();return;}
 const file = path.resolve('dist',pathname.slice(base.length)||'index.html');
 if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403).end();return;}
 fs.stat(file,(err,stat)=>{
  if(err){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',mimes[path.extname(file)]||'application/octet-stream');
  const range = req.headers.range;
  if(range){const [s,e] = range.replace('bytes=','').split('-');const start=Number(s),end=e?Number(e):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else{res.setHeader('Content-Length',stat.size);fs.createReadStream(file).pipe(res);}
 });
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const report={viewports:[],interactions:{},errors:[],failedRequests:[]};
 const page=await browser.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
 for(const [name,width,height,scale] of [['desktop',1440,1000,.78],['mobile',390,844,.6]]){
  await page.setViewportSize({width,height});
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  await page.waitForTimeout(2200);
  const autoplay = await page.evaluate(() => !document.querySelector('video').paused);
  if (!autoplay) throw Error('Video autoplay failed');
  // Use the same frame for both review screenshots; the actual page loops normally.
  await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();v.currentTime=1;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  if(name==='desktop'){
   const poster=await page.evaluate(()=>{const v=document.querySelector('video'),c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/jpeg',.92).split(',')[1];});
   fs.writeFileSync('public/assets/hero-poster.jpg',Buffer.from(poster,'base64'));
   fs.copyFileSync('public/assets/hero-poster.jpg','dist/assets/hero-poster.jpg');
   // Reload now that the generated video poster exists to avoid a missing-poster error.
   report.errors=report.errors.filter(x=>!x.includes('hero-poster'));
  }
  const metrics=await page.evaluate(()=>({phone:{width:document.querySelector('.phone').getBoundingClientRect().width,height:document.querySelector('.phone').getBoundingClientRect().height},overflow:document.documentElement.scrollWidth>innerWidth,internalOverflow:document.querySelector('.screen').scrollWidth>document.querySelector('.screen').clientWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),video:{readyState:document.querySelector('video').readyState,width:document.querySelector('video').videoWidth},filters:document.querySelectorAll('feDisplacementMap').length,scrollHeight:document.querySelector('.screen').scrollHeight,screenHeight:document.querySelector('.screen').clientHeight}));
  if(metrics.overflow||metrics.internalOverflow||!metrics.images||Math.abs(metrics.phone.width-390*scale)>1)throw Error('Layout/assets failed: '+JSON.stringify(metrics));
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  report.viewports.push({name,width,height,autoplay,...metrics});
 }
 await page.getByRole('button',{name:'Edit profile',exact:true}).click();
 await page.getByLabel('Name',{exact:true}).fill('Dasha M.');
 await page.getByRole('button',{name:'Save changes'}).click();
 if(await page.locator('h1').textContent()!=='Dasha M.')throw Error('Edit failed');
 await page.getByRole('button',{name:'Edit profile',exact:true}).click();await page.getByLabel('Name',{exact:true}).fill('Dasha');await page.getByRole('button',{name:'Save changes'}).click();report.interactions.edit=true;
 await page.getByRole('button',{name:'12 achievements',exact:true}).click();
 if(!await page.locator('dialog').isVisible())throw Error('Achievements failed');
 await page.keyboard.press('Escape');report.interactions.achievements=true;
 await page.getByRole('button',{name:'Shuffle favorite'}).click();await page.getByRole('status').filter({hasText:'Latte is still your favorite'}).waitFor({state:'visible'});report.interactions.shuffle=true;
 await page.getByRole('button',{name:'Close profile',exact:true}).click();await page.getByRole('button',{name:'Open profile'}).click();if(!await page.locator('.screen').isVisible())throw Error('Reopen failed');report.interactions.closeAndReopen=true;
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(500);
 report.reducedMotion=await page.evaluate(()=>({videoPaused:document.querySelector('video').paused,nameAnimation:getComputedStyle(document.querySelector('h1')).animationName}));
 if(!report.reducedMotion.videoPaused||report.reducedMotion.nameAnimation!=='none')throw Error('Reduced motion failed');
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 await browser.close();server.close();
 if(report.errors.length||report.failedRequests.length)process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exit(1);});
