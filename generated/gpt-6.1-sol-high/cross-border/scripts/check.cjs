const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
const http=require('http');
const path=require('path');
const root=path.resolve('dist'),prefix='/motionsites-results/cross-border/';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.mp4':'video/mp4','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(req.url.split('?')[0]);
  if(!pathname.startsWith(prefix)){res.writeHead(404);return res.end();}
  const file=path.join(root,pathname.slice(prefix.length)||'index.html');
  if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);return res.end();}
  const size=fs.statSync(file).size,range=req.headers.range;
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  if(range){const m=/bytes=(\d+)-(\d*)/.exec(range);const start=Number(m[1]),end=m[2]?Math.min(Number(m[2]),size-1):size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else{res.writeHead(200,{'Content-Length':size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const reports=[];
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
 await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(1600);
 const video=await page.locator('video').evaluate(v=>({readyState:v.readyState,paused:v.paused,time:v.currentTime,width:v.videoWidth,height:v.videoHeight}));
 if(video.paused||!video.width)throw Error('Video not playing');
 await page.locator('video').evaluate(v=>{v.pause();v.currentTime=2;});await page.waitForTimeout(250);
 await page.screenshot({path:`screenshots/${name}.png`});
 await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(500);
 if(!await page.getByRole('navigation',{name:'Sections'}).isVisible())throw Error('Menu failed');
 const closeClickable=await page.getByRole('button',{name:'Close menu',exact:true}).evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});
 if(!closeClickable)throw Error('Menu close is obscured');
 await page.screenshot({path:`screenshots/${name}-menu.png`});
 await page.keyboard.press('Escape');await page.waitForTimeout(350);
 await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(350);
 await page.getByRole('button',{name:'Close menu',exact:true}).click();await page.waitForTimeout(350);
 await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(350);
 await page.getByRole('link',{name:'Services',exact:true}).click();await page.waitForTimeout(1500);
 const infoTop=await page.locator('.phone-screen').evaluate(el=>el.scrollTop);if(infoTop<500)throw Error('Menu navigation failed');
 await page.screenshot({path:`screenshots/${name}-info.png`});
 await page.evaluate(()=>document.querySelector('.phone-screen').scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(250);
 await page.getByRole('button',{name:'Get in touch'}).click();await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Send',exact:true}).click();
 if(await page.getByRole('status').count())throw Error('Empty form submitted');
 if(!await page.locator('input:invalid').count())throw Error('Missing required validation');
 await page.getByPlaceholder('First Name').fill('Alex');await page.getByPlaceholder('Last Name').fill('Morgan');await page.getByPlaceholder('E-mail').fill('invalid-email');
 if(!await page.getByPlaceholder('E-mail').evaluate(el=>!el.validity.valid))throw Error('Email validation missing');
 await page.getByPlaceholder('E-mail').fill('alex@example.com');
 await page.getByRole('button',{name:'Send',exact:true}).click();await page.getByRole('status').waitFor();
 await page.evaluate(()=>{const s=document.querySelector('.phone-screen');s.scrollTo({top:document.getElementById('contact').offsetTop,behavior:'instant'});});await page.waitForTimeout(300);
 await page.screenshot({path:`screenshots/${name}-contact.png`});
 const layout=await page.evaluate(()=>{const screen=document.querySelector('.phone-screen');return {bodyOverflow:document.documentElement.scrollWidth>innerWidth,screenOverflow:screen.scrollWidth>screen.clientWidth,screenWidth:screen.clientWidth,screenHeight:screen.clientHeight,contentHeight:screen.scrollHeight,missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),fontLoaded:document.fonts.check('800 32px "Barlow Condensed"')};});
 await page.getByRole('button',{name:'Scroll to top'}).click();await page.waitForTimeout(1200);
 const returnedToTop=await page.locator('.phone-screen').evaluate(el=>el.scrollTop<2);
 if(errors.length||failed.length||layout.bodyOverflow||layout.screenOverflow||layout.missingImages.length||!returnedToTop||!layout.fontLoaded)throw Error(JSON.stringify({errors,failed,layout,returnedToTop}));
 reports.push({viewport:name,width,height,video,menu:true,closeButton:true,escapeClosesMenu:true,menuNavigation:true,ctaNavigation:true,formValidationAndFeedback:true,scrollToTop:returnedToTop,layout,errors,failed});
 await page.close();
 }
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports,null,2));
 }finally{await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
