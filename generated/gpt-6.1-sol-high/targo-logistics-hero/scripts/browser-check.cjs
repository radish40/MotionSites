const {chromium}=require('/app/node_modules/playwright-core');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base='/motionsites-results/targo-logistics-hero/';
const root=path.resolve('dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf','.mp4':'video/mp4','.txt':'text/plain'};
const server=http.createServer((req,res)=>{
 const filename=path.resolve(root,decodeURIComponent(req.url.split('?')[0].replace(base,''))||'index.html');
 if(!req.url.startsWith(base)||!filename.startsWith(root+'/')||!fs.existsSync(filename)){res.writeHead(404);res.end();return;}
 const size=fs.statSync(filename).size;const headers={'Content-Type':types[path.extname(filename)]||'application/octet-stream','Accept-Ranges':'bytes'};
 if(req.headers.range){const [a,b]=req.headers.range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(filename,{start,end}).pipe(res)}
 else{res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(filename).pipe(res)}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={url:`http://localhost:4173${base}`,checks:[],errors:[],requestsFailed:[]};
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)report.requestsFailed.push({url:r.url(),status:r.status()})});
 await page.goto(report.url,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name}: horizontal overflow`);
 assert.equal(await page.evaluate(()=>document.fonts.check('700 64px Rubik')),true);
 assert.equal(await page.locator('h1').evaluate(h=>h.scrollWidth<=h.clientWidth),true,`${name}: headline clipping`);
 const video=await page.evaluate(()=>{const v=document.querySelector('video');return {playing:!v.paused,muted:v.muted,loop:v.loop,opacity:getComputedStyle(v).opacity,width:v.videoWidth,height:v.videoHeight}});
 assert(video.playing&&video.muted&&video.loop&&video.opacity==='1');
 await page.getByRole('button',{name:'Pause background video'}).click();
 assert.equal(await page.locator('video').evaluate(v=>v.paused),true);
 await page.locator('video').evaluate(v=>{v.currentTime=1.5});
 await page.waitForTimeout(400);
 await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Play background video'}).click();
 await page.waitForTimeout(150);
 assert.equal(await page.locator('video').evaluate(v=>v.paused),false);
 if(name==='mobile')await page.getByRole('button',{name:'Open navigation'}).click();
 await page.getByRole('button',{name:'About',exact:true}).click();
 await page.getByRole('dialog').waitFor({state:'visible'});
 assert(await page.getByText('Built to move').isVisible());
 await page.keyboard.press('Escape');
 assert.equal(await page.getByRole('dialog').count(),0);
 await page.getByRole('button',{name:'Get Started'}).click();
 await page.getByRole('button',{name:'Prepare enquiry'}).click();
 assert.equal(await page.locator('form').evaluate(f=>f.checkValidity()),false);
 await page.getByLabel('Your name').fill('Alex Test');
 await page.getByLabel('Email address').fill('alex@example.com');
 await page.getByLabel('How can we help?').fill('Test transport enquiry.');
 await page.getByRole('button',{name:'Prepare enquiry'}).click();
 assert(await page.getByText('ENQUIRY PREPARED',{exact:true}).isVisible());
 await page.getByRole('button',{name:'Back to targo'}).click();
 await page.getByRole('button',{name:'Book a Call'}).click();
 assert(await page.getByLabel('Email address').isVisible());
 await page.getByRole('button',{name:'Close dialog'}).click();
 if(name==='mobile')await page.getByRole('button',{name:'Open navigation'}).click();
 await page.getByRole('button',{name:'Contact Us',exact:true}).first().click();
 assert(await page.getByRole('dialog').isVisible());
 await page.keyboard.press('Escape');
 report.checks.push({viewport:name,width,height,video,font:'Rubik loaded',horizontalOverflow:false,interactions:['navigation','contact','get started','book a call','form validation and preparation','dialog escape/close','video pause/play'],screenshot:`screenshots/${name}.png`});
 await page.close();
 }
 assert.equal(report.errors.length,0);assert.equal(report.requestsFailed.length,0);
 report.status='passed';
 }catch(e){report.status='failed';report.failure=e.stack;process.exitCode=1}finally{
 fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();await new Promise(r=>server.close(r));
 }
})();
