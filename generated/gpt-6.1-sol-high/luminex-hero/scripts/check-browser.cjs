const {chromium}=require('/app/node_modules/playwright-core');
const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve('dist');const base='/motionsites-results/luminex-hero/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf','.jpg':'image/jpeg','.m3u8':'application/vnd.apple.mpegurl','.ts':'video/mp2t','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]);if(!name.startsWith(base)){res.writeHead(404);return res.end();}let p=path.resolve(root,name.slice(base.length)||'index.html');if(!p.startsWith(root+'/')){res.writeHead(403);return res.end();}fs.readFile(p,(e,data)=>{if(e){res.writeHead(404);return res.end();}res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream'});res.end(data);});});
(async()=>{await new Promise(r=>server.listen(4173,'0.0.0.0',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const reports=[];
try{for(const [name,width,height]of[['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[],badRequests=[],mediaRequests=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)badRequests.push(r.url());if(/\.m3u8|\.ts$/.test(r.url()))mediaRequests.push({url:r.url(),status:r.status()});});
 await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>1&&v.videoWidth>0},{timeout:30000});
 const video=await page.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,time:v.currentTime,duration:v.duration,playing:!v.paused}));
 await page.getByRole('button',{name:'Pause background video'}).click();const stopped=await page.locator('video').evaluate(v=>v.paused);if(!stopped)throw Error('Pause failed');
 await page.evaluate(()=>{document.querySelector('video').currentTime=3});await page.waitForTimeout(400);await page.screenshot({path:`screenshots/${name}.png`});
 await page.getByRole('button',{name:'Play background video'}).click();await page.waitForFunction(()=>!document.querySelector('video').paused);
 await page.getByRole('button',{name:'Explore our work'}).click();await page.getByRole('dialog').waitFor({state:'visible'});await page.getByRole('heading',{name:'Made to move you.'}).waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
 if(name==='mobile')await page.getByRole('button',{name:'Open navigation'}).click();
 await page.getByRole('button',{name:'The studio',exact:true}).click();await page.getByRole('heading',{name:'Curious minds. Shared vision.'}).waitFor();await page.getByRole('button',{name:'Meet your next creative partner'}).click();await page.getByRole('link',{name:'hello@luminex.studio'}).waitFor();await page.getByRole('button',{name:'Close details'}).click();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)throw Error('Horizontal overflow');if(errors.length||badRequests.length)throw Error(JSON.stringify({errors,badRequests}));if(!mediaRequests.some(r=>r.url.endsWith('.ts')))throw Error('HLS segments not requested');
 reports.push({viewport:name,width,height,video,hls:true,playPause:true,workDialog:true,studioDialog:true,contactDialog:true,mobileMenu:name==='mobile',horizontalOverflow:overflow,errors,badRequests});await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});if(!await reduced.locator('video').evaluate(v=>v.paused))throw Error('Reduced motion autoplayed');reports.push({reducedMotion:'passed: paused poster, manual playback available'});await reduced.close();
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports,null,2));
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exit(1)});
