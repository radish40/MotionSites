const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root='/work/dist', base='/motionsites-results/planet-orbit/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2','.woff':'font/woff'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(req.url.split('?')[0]);
 const file=path.join(root,pathname.startsWith(base)?pathname.slice(base.length):pathname);
 let target=file.endsWith('/')?file+'index.html':file;
 if(!fs.existsSync(target)){res.writeHead(404);return res.end('Not found')}
 if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
 const stat=fs.statSync(target); const range=req.headers.range;
 res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');
 if(range){const [startRaw,endRaw]=range.replace(/bytes=/,'').split('-');const start=Number(startRaw),end=endRaw?Number(endRaw):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(target,{start,end}).pipe(res)}
 else {res.setHeader('Content-Length',stat.size);fs.createReadStream(target).pipe(res)}
});
(async()=>{await new Promise(r=>server.listen(4173,'0.0.0.0',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});const results=[];const errors=[];const failed=[];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(r.url()));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1200);
 const initial=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,font:document.fonts.check('400 18px "Geist Sans"'),video:{readyState:document.querySelector('video').readyState,playing:!document.querySelector('video').paused,time:document.querySelector('video').currentTime,width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight},heading:document.querySelector('h1').getBoundingClientRect().toJSON(),social:document.querySelector('.social-proof').getBoundingClientRect().toJSON()}));
 if(initial.overflow||!initial.font||!initial.video.playing||initial.video.readyState<2)throw new Error(name+' initial check failed '+JSON.stringify(initial));
 const motionStart=await page.evaluate(()=>({video:document.querySelector('video').currentTime,marquee:document.querySelector('.marquee-track').getAnimations()[0].currentTime}));await page.waitForTimeout(300);const motionEnd=await page.evaluate(()=>({video:document.querySelector('video').currentTime,marquee:document.querySelector('.marquee-track').getAnimations()[0].currentTime}));if(motionEnd.video<=motionStart.video||motionEnd.marquee<=motionStart.marquee)throw new Error('Motion is not advancing');initial.motion='video and marquee advancing';await page.evaluate(()=>{document.querySelector('video').currentTime=3;const animation=document.querySelector('.marquee-track').getAnimations()[0];animation.pause();animation.currentTime=0;});await page.waitForTimeout(500);await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
 if(name==='desktop'){await page.getByRole('button',{name:'Features',exact:true}).click();await page.getByRole('button',{name:'Clever workflows'}).click();await page.getByRole('heading',{name:'A smarter way to grow.'}).waitFor();await page.getByRole('button',{name:'Close dialog'}).click();await page.getByRole('button',{name:'Learning',exact:true}).click();await page.getByRole('button',{name:'Workflow essentials'}).click();await page.keyboard.press('Escape');}
 else {await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Features',exact:true}).click();await page.getByRole('heading',{name:'A smarter way to grow.'}).waitFor();await page.keyboard.press('Escape');}
 for(const label of ['Sign Up','Start Free Right Now','Schedule a Consult']){await page.getByRole('button',{name:label,exact:true}).click();await page.locator('dialog').waitFor();await page.getByLabel('Your name').fill('Alex Morgan');await page.getByLabel('Work email').fill('alex@example.com');if(label==='Schedule a Consult')await page.getByLabel('Company',{exact:true}).fill('Example');await page.locator('form button[type="submit"]').click();await page.getByRole('status').waitFor();await page.keyboard.press('Escape');}
 await page.getByRole('button',{name:'Nova+ Launched! Explore'}).click();await page.getByRole('heading',{name:'Meet Nova+'}).waitFor();await page.keyboard.press('Escape');
 results.push({viewport:name,width,height,...initial,interactions:'passed'});await page.close();
 }
 await browser.close();server.close();fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify({results,errors,failed},null,2));if(errors.length||failed.length)process.exitCode=1;console.log(JSON.stringify({results,errors,failed},null,2));
})().catch(e=>{console.error(e);server.close();process.exit(1)});
