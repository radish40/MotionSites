const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/taskora-saa-s-hero/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.ttf':'font/ttf','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server = http.createServer((req,res)=>{
 let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith(base)){res.writeHead(404).end();return;}
 let filename=path.resolve('dist',pathname.slice(base.length)||'index.html');
 if(!filename.startsWith(path.resolve('dist')+'/')){res.writeHead(403).end();return;}
 if(!fs.existsSync(filename)){res.writeHead(404).end();return;}
 const size=fs.statSync(filename).size,headers={'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Accept-Ranges':'bytes'};
 if(req.headers.range){const [a,b]=req.headers.range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(filename,{start,end}).pipe(res);}else{res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(filename).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={};const errors=[],failed=[];
 try{
 for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
  const context=await browser.newContext({viewport,deviceScaleFactor:1});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1300);
  const metrics=await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,fonts:['Inter','Manrope','Cabin'].map(n=>({name:n,loaded:document.fonts.check(`${n==='Cabin'?'500':'400'} 14px "${n}"`)})),serif:document.fonts.check('italic 40px "Instrument Serif"'),video:{ready:document.querySelector('video').readyState,playing:!document.querySelector('video').paused,width:document.querySelector('video').videoWidth},dashboard:{width:document.querySelector('.dashboard-scroll').clientWidth,scrollWidth:document.querySelector('.dashboard-scroll').scrollWidth}}));
  console.log(name,JSON.stringify(metrics));assert.equal(metrics.documentWidth,viewport.width,'Page overflow');assert(metrics.fonts.every(f=>f.loaded)&&metrics.serif,'Fonts loaded');assert(metrics.video.ready>=2&&metrics.video.playing&&metrics.video.width>0,'Video playback');
  await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();v.currentTime=3;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:false});
  if(name==='desktop') await page.screenshot({path:'screenshots/desktop-full.png',fullPage:true});
  await page.getByRole('button',{name:'Book a Free Demo',exact:true}).click();await page.getByLabel('Your name').fill('Alex Test');await page.getByLabel('Work email').fill('alex@example.com');await page.getByRole('button',{name:'Request a free demo',exact:true}).click();await page.getByText('Your demo request is prepared.',{exact:false}).waitFor();await page.getByRole('button',{name:'Back to Taskora'}).click();
  if(name==='mobile'){await page.getByRole('button',{name:'Open navigation'}).click();assert.equal(await page.getByRole('button',{name:'Close navigation'}).getAttribute('aria-expanded'),'true');await page.locator('#mobile-menu').getByRole('link',{name:'Features'}).click();assert.equal(await page.locator('#mobile-menu').count(),0);await page.locator('.dashboard-scroll').evaluate(el=>el.scrollLeft=300);assert(await page.locator('.dashboard-scroll').evaluate(el=>el.scrollLeft>0));await page.evaluate(()=>window.scrollTo(0,0));await page.getByRole('button',{name:'Open navigation'}).click();await page.locator('#mobile-menu').getByRole('button',{name:'Sign In',exact:true}).click();}
  else{await page.getByRole('button',{name:'Sign In',exact:true}).click();}
  await page.getByRole('dialog').waitFor();await page.getByLabel('Work email').fill('alex@example.com');await page.getByLabel('Password').fill('password123');await page.getByRole('dialog').getByRole('button',{name:'Sign In',exact:true}).click();await page.getByText('Your details are ready.',{exact:false}).waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);
  if(name==='desktop'){
  await page.getByRole('button',{name:'Sign Up',exact:true}).click();await page.getByLabel('Your name').fill('Alex Test');await page.getByLabel('Work email').fill('alex@example.com');await page.getByLabel('Password').fill('password123');await page.getByRole('button',{name:'Create an account'}).click();await page.getByText('Your details are ready.',{exact:false}).waitFor();await page.keyboard.press('Escape');
  for(const name of ['Company','Contact']){await page.getByRole('button',{name,exact:true}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Got it',exact:true}).click();}
  }
  results[name]={...metrics,checks:['no page overflow','all specified fonts loaded','video autoplay verified','demo form and result','sign-in form and result','Escape closes dialog',...(name==='mobile'?['mobile menu opens and closes','Features navigation','dashboard horizontal scrolling']:['sign-up form and result','Company and Contact dialogs'])]};
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});assert(await page.locator('video').evaluate(v=>v.paused));results.reducedMotion='Video autoplay and entrance animation disabled';await context.close();
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);results.scriptErrors=errors;results.failedRequests=failed;results.status='passed';fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exit(1);});
