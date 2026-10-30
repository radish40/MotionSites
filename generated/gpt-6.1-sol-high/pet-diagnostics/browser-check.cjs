const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('node:fs');
const http=require('node:http');
const assert=require('node:assert/strict');
const prefix='/motionsites-results/pet-diagnostics/';
const server=http.createServer((req,res)=>{if(req.url===prefix||req.url===prefix+'index.html'){res.setHeader('Content-Type','text/html');res.end(fs.readFileSync('dist/index.html'));}else if(req.url==='/favicon.ico'){res.writeHead(204);res.end();}else{res.writeHead(404);res.end();}});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const errors=[],failures=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});});
 await page.goto('http://localhost:4173'+prefix,{waitUntil:'load',timeout:120000});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState===4&&!v.paused;},{timeout:90000});
 await page.waitForTimeout(1100);
 const measure=()=>page.evaluate(()=>{const s=q=>getComputedStyle(document.querySelector(q)),r=q=>{const a=document.querySelector(q).getBoundingClientRect();return{x:a.x,y:a.y,width:a.width,height:a.height}};const v=document.querySelector('video');return{viewport:[innerWidth,innerHeight],measure:r('.hero__inner').width,hero:r('.hero'),headline:s('h1').fontSize,pills:s('.hero__actions').fontSize,table:s('.compare').fontSize,nav:r('.nav'),cream:r('.hugo-col'),header:r('.h-feature'),panel:r('.panel--features'),video:{readyState:v.readyState,paused:v.paused,width:v.videoWidth,duration:v.duration,display:s('video').display,opacity:s('video').opacity},desktopImage:{loaded:document.querySelector('img').naturalWidth>0,display:s('.hero__media--desktop').display},mobileImage:{loaded:document.querySelector('.hero__media--mobile').naturalWidth>0,display:s('.hero__media--mobile').display},fonts:{inter:document.fonts.check('12px Inter'),serif:document.fonts.check('24px "Instrument Serif"')},overflow:document.documentElement.scrollWidth>innerWidth,columns:s('.compare__grid').gridTemplateColumns};});
 const desktop=await measure();
 assert.equal(desktop.video.width,1928);assert(Math.abs(desktop.video.duration-8.04)<.005);assert.equal(desktop.video.opacity,'1');assert(desktop.cream.y<desktop.header.y);assert(desktop.panel.x+desktop.panel.width>desktop.cream.x);
 await page.screenshot({path:'screenshots/desktop.png',fullPage:true});
 const interactions=[];
 for(const selector of ['.btn--dark','.btn--cream','.btn--glass']){
  await page.mouse.move(0,0);await page.waitForTimeout(200);const before=await page.locator(selector).evaluate(e=>getComputedStyle(e).backgroundColor);
  await page.locator(selector).hover();await page.waitForFunction(({selector,before})=>getComputedStyle(document.querySelector(selector)).backgroundColor!==before,{selector,before});await page.waitForTimeout(220);const hover=await page.locator(selector).evaluate(e=>getComputedStyle(e).backgroundColor);assert.notEqual(before,hover);
  await page.mouse.down();await page.waitForTimeout(200);const pressed=await page.locator(selector).evaluate(e=>getComputedStyle(e).transform);assert.notEqual(pressed,'none');await page.mouse.up();
  await page.locator(selector).focus();assert(await page.locator(selector).evaluate(e=>e===document.activeElement));await page.keyboard.press('Enter');
  interactions.push({selector,hover:true,press:true,keyboard:true,destination:'placeholder #; no booking destination supplied'});
 }
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);
 const mobile=await measure();assert.equal(mobile.video.display,'none');assert.equal(mobile.mobileImage.display,'block');assert(mobile.mobileImage.loaded);assert(!mobile.overflow);
 await page.mouse.move(0,0);await page.locator('body').click({position:{x:1,y:1}});await page.screenshot({path:'screenshots/mobile.png',fullPage:true});
 const scales=[];
 for(const width of [320,375,390,640,820,821,1024,1280,1440,1920,2560]){await page.setViewportSize({width,height:900});const m=await measure();assert(!m.overflow);scales.push({width,measure:m.measure,headline:m.headline,pills:m.pills,table:m.table,overflow:m.overflow});}
 const acceptance=scales.find(x=>x.width===1440);assert(Math.abs(parseFloat(acceptance.headline)-24)<.1);assert(Math.abs(parseFloat(acceptance.table)-10.9)<.1);
 const reducedPage=await context.newPage();await reducedPage.emulateMedia({reducedMotion:'reduce'});await reducedPage.setViewportSize({width:1440,height:1000});await reducedPage.goto('http://localhost:4173'+prefix,{waitUntil:'load',timeout:120000});
 const reduced=await reducedPage.evaluate(()=>({video:getComputedStyle(document.querySelector('video')).display,still:getComputedStyle(document.querySelector('img')).display,loaded:document.querySelector('img').naturalWidth>0,transition:getComputedStyle(document.querySelector('.btn')).transitionDuration}));assert.equal(reduced.video,'none');assert(reduced.loaded);assert.equal(reduced.transition,'0s');
 const report={desktop,mobile,scales,reducedMotion:reduced,interactions,scriptErrors:errors,requestFailures:failures};fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));assert.equal(errors.length,0);
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1);});
