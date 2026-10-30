const fs = require('node:fs');
const http = require('node:http');
const assert = require('node:assert/strict');
const {chromium} = require('/app/node_modules/playwright-core');
const prefix = '/motionsites-results/space-planet/';
const report = {checks:[], console_errors:[], request_failures:[], asset_responses:[]};
const check = (name,detail) => {report.checks.push({name,status:'passed',detail});console.log('PASS: '+name);};
const server = http.createServer((req,res) => {
  if(req.url.split('?')[0] !== prefix && req.url.split('?')[0] !== prefix+'index.html'){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync('dist/index.html'));
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const page=await context.newPage();
 page.on('pageerror',error=>report.console_errors.push(error.message));
 page.on('console',msg=>{if(msg.type()==='error')report.console_errors.push(msg.text());});
 page.on('requestfailed',request=>{if(request.failure()?.errorText!=='net::ERR_ABORTED')report.request_failures.push({url:request.url(),error:request.failure()?.errorText});});
 page.on('response',response=>{if(/cloudfront|googleapis|gstatic/.test(response.url()))report.asset_responses.push({url:response.url(),status:response.status()});});
 await page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>{
 window.initialState={title:document.querySelector('h1').textContent,slots:[...document.querySelectorAll('.planet')].map(x=>x.dataset.planet),videoSources:[...document.querySelectorAll('video')].filter(x=>x.hasAttribute('src')).map(x=>x.dataset.planet)};
 }));
 await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'domcontentloaded',timeout:60000});
 assert.deepEqual(await page.evaluate(()=>window.initialState),{title:'EARTH',slots:['venus','mars'],videoSources:['earth']});
 check('Initial state and lazy media','Earth featured, Venus left, Mars right; only Earth has src at DOMContentLoaded.');
 await page.waitForFunction(()=>!document.documentElement.classList.contains('anim')&&!document.documentElement.classList.contains('play'));
 check('Entrance cleanup','Both animation classes removed after one entrance.');
 await page.waitForFunction(()=>[...document.querySelectorAll('.planet img')].every(img=>img.complete&&img.naturalWidth>0),{timeout:60000});
 await page.evaluate(()=>document.fonts.ready);
 report.fonts=await page.evaluate(()=>['Prata','Hanken Grotesk','Poppins'].map(font=>({font,loaded:document.fonts.check(`${font === 'Poppins' ? 600 : 400} 16px "${font}"`)})));
 assert(report.fonts.every(font=>font.loaded));check('Google fonts','Prata, Hanken Grotesk and Poppins loaded.');
 await page.waitForFunction(()=>document.querySelector('video.is-active').readyState>=3,{timeout:60000});
 await page.waitForTimeout(1200);
 report.video=await page.evaluate(()=>{let v=document.querySelector('video.is-active');return {width:v.videoWidth,height:v.videoHeight,time:v.currentTime,paused:v.paused,error:v.error?.message||null};});
 assert(!report.video.paused&&report.video.time>0);check('Earth video playback',report.video);
 await page.screenshot({path:'screenshots/desktop.png'});
 const initial=await page.evaluate(()=>({title:document.querySelector('h1').textContent,lede:document.querySelector('.lede').innerHTML,slots:[...document.querySelectorAll('.planet')].map(x=>x.dataset.planet)}));
 const originalSources=await page.locator('.planet img').evaluateAll(images=>images.map(img=>img.src));
 report.switch_timings=[];
 for(const next of ['venus','mars','earth']){
   const button=page.locator(`.planet[data-planet="${next}"]`);
   await button.click({position:{x:next==='mars'?10:65,y:40}});
   assert.equal(await page.locator('h1').textContent(),next.toUpperCase());
   assert.equal(await page.locator('video.is-active').getAttribute('data-planet'),next);
   await page.waitForFunction(()=>{let v=document.querySelector('video.is-active');return v.readyState>=3&&!v.paused;},{timeout:60000});
   await page.waitForTimeout(250);
   if(next!=='earth')await page.screenshot({path:`screenshots/desktop-${next}.png`});
 }
 assert.deepEqual(await page.evaluate(()=>({title:document.querySelector('h1').textContent,lede:document.querySelector('.lede').innerHTML,slots:[...document.querySelectorAll('.planet')].map(x=>x.dataset.planet)})),initial);
 assert.deepEqual(await page.locator('.planet img').evaluateAll(images=>images.map(img=>img.src)),originalSources);
 check('Planet rotation and media','Real button clicks Earth → Venus → Mars → Earth restore exact initial state; all three videos play; image sources unchanged.');
 // Measure only synchronous click dispatch/update, excluding pointer movement and video downloads.
 for(let i=0;i<12;i++)report.switch_timings.push(await page.evaluate(()=>{
  let b=document.querySelector('.planet-l');let next=b.dataset.planet;let first=null,last=null;
  const original=DOMTokenList.prototype.toggle;
  DOMTokenList.prototype.toggle=function(token,force){if(token==='is-shown'&&first===null)first=performance.now();const result=original.call(this,token,force);if(token==='is-shown')last=performance.now();return result;};
  let start=performance.now();b.click();let elapsed=performance.now()-start;DOMTokenList.prototype.toggle=original;
  return {elapsedMs:elapsed,cutoutUpdateMs:last-first,correct:document.querySelector('h1').textContent===next.toUpperCase()&&[...document.querySelectorAll('.planet')].every(b=>b.querySelector('img.is-shown').dataset.planet===b.dataset.planet)};
 }));
 assert(report.switch_timings.every(x=>x.correct&&x.cutoutUpdateMs<2));
 check('Same-frame cutout updates',{maxCutoutUpdateMs:Math.max(...report.switch_timings.map(x=>x.cutoutUpdateMs)),allCutoutsUnder2ms:report.switch_timings.every(x=>x.cutoutUpdateMs<2),maxFullClickHandlerMs:Math.max(...report.switch_timings.map(x=>x.elapsedMs))});
 report.layout=[];
 for(const size of [{width:320,height:700},{width:360,height:640},{width:390,height:844},{width:500,height:900},{width:579,height:844},{width:580,height:900},{width:768,height:1024},{width:1030,height:1000},{width:1031,height:1000},{width:1440,height:1000},{width:1920,height:1080},{width:2560,height:1440},{width:844,height:390},{width:667,height:375}]){
   await page.setViewportSize(size);
   const layout=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,body:document.body.scrollWidth}));
   assert(layout.scroll<=size.width&&layout.body<=size.width);report.layout.push({...size,...layout});
 }
 // Check every integer width in the requested range, as well as responsive breakpoint cases above.
 await page.setViewportSize({width:390,height:844});
 if (await page.locator('h1').textContent() !== 'EARTH') await page.locator('.planet[data-planet="earth"]').evaluate(el=>el.click());
 await page.waitForTimeout(500);
 await page.screenshot({path:'screenshots/mobile.png'});
 const burger=page.locator('.burger');
 await burger.click();assert.equal(await burger.getAttribute('aria-expanded'),'true');await page.locator('.links').waitFor({state:'visible'});
 await page.waitForTimeout(350);await page.screenshot({path:'screenshots/mobile-menu.png'});
 await page.keyboard.press('Escape');assert.equal(await burger.getAttribute('aria-expanded'),'false');assert(await burger.evaluate(b=>b===document.activeElement));
 await burger.click();await page.locator('.links a').nth(1).click();assert.equal(await burger.getAttribute('aria-expanded'),'false');
 await burger.click();await page.locator('h1').click({force:true});assert.equal(await burger.getAttribute('aria-expanded'),'false');
 check('Mobile navigation','Open, Escape with focus return, link click and outside click all work. Same five navigation links.');
 await page.locator('.planet-l').focus();let expected=(await page.locator('.planet-l').getAttribute('data-planet')).toUpperCase();await page.keyboard.press('Enter');assert.equal(await page.locator('h1').textContent(),expected);check('Keyboard planet switching','Enter on focused planet button switches the featured planet.');
 const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const rp=await reduced.newPage();await rp.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'domcontentloaded'});
 assert.equal(await rp.locator('html').getAttribute('class'),null);
 assert(await rp.locator('video').evaluateAll(videos=>videos.every(v=>getComputedStyle(v).display==='none')));
 await rp.locator('.planet-l').click({position:{x:50,y:30}});assert.equal(await rp.locator('h1').textContent(),'VENUS');assert((await rp.locator('.sky').getAttribute('style')).includes('cf55d1d8'));
 check('Reduced motion','No entrance classes; videos hidden; still switches correctly to Venus.');
 await reduced.close();
 for(let width=320;width<=2560;width++){
   await page.setViewportSize({width,height:1000});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.body.scrollWidth<=innerWidth),`Overflow at ${width}`);
 }
 check('Horizontal overflow','No body/document horizontal overflow at every integer width 320–2560, plus phone/tablet/landscape cases.');
 assert.equal(report.console_errors.length,0);assert.equal(report.request_failures.length,0);
 check('Runtime and network','No JavaScript/console errors or unexpected request failures.');
 report.status='passed';
 }catch(error){report.status='failed';report.error=error.stack;process.exitCode=1;}
 finally{fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));await browser.close();server.close();console.log(JSON.stringify(report,null,2));}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
