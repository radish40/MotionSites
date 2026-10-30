const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/quantum-lucid/';
const server = http.createServer((req,res)=>{
 if(req.url.split('?')[0]===prefix || req.url.split('?')[0]===prefix+'index.html') {res.writeHead(200,{'Content-Type':'text/html'});res.end(fs.readFileSync('dist/index.html'));}
 else {res.writeHead(404);res.end();}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const errors=[],failed=[],checks={};
 const page = await browser.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle',timeout:60000});
 await page.waitForFunction(()=>document.documentElement.dataset.enter==='done');
 await page.evaluate(()=>document.fonts.ready);
 async function snapshot(name,width,height) {
   await page.setViewportSize({width,height});
   await page.waitForTimeout(200);
   const data=await page.evaluate(()=>{
    const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}};
    const v=document.querySelector('video');
    return {viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],nav:rect('.nav'),headline:rect('.hero-h1'),band:rect('.band'),card:rect('.card'),fontFaces:[...document.fonts].map(f=>({family:f.family,weight:f.weight,status:f.status})),fontLoaded:[...document.fonts].some(f=>f.family==='Figtree'&&f.status==='loaded'),fontFamily:getComputedStyle(document.body).fontFamily,video:{readyState:v.readyState,currentTime:v.currentTime,paused:v.paused,width:v.videoWidth,height:v.videoHeight,error:v.error?.message||null},stageTransform:getComputedStyle(document.querySelector('#stage')).transform};
   });
   assert.ok(data.scroll[0]<=width, name+' horizontal overflow');
   if(height>520)assert.ok(data.scroll[1]<=height,name+' vertical overflow');
   assert.ok(data.fontLoaded,'Figtree loaded');
   if(name==='desktop'||name==='mobile')await page.screenshot({path:'screenshots/'+name+'.png'});
   checks[name]=data;
 }
 fs.mkdirSync('screenshots',{recursive:true});
 await snapshot('desktop',1440,1000);
 assert.ok(checks.desktop.video.readyState>=2,'Video loaded');
 assert.equal(checks.desktop.video.paused,false,'Video autoplay');
 const time=checks.desktop.video.currentTime;await page.waitForTimeout(300);assert.ok(await page.locator('video').evaluate(v=>v.currentTime)>time,'Video advances');
 await snapshot('referenceDesktop',1290,860);
 await snapshot('mobile',390,844);
 assert.equal(checks.mobile.stageTransform,'none');
 const burger=page.locator('.burger');
 await burger.click();assert.equal(await burger.getAttribute('aria-expanded'),'true');
 await page.waitForTimeout(250);await page.screenshot({path:'screenshots/mobile-menu.png'});
 await page.keyboard.press('Escape');assert.equal(await burger.getAttribute('aria-expanded'),'false');assert.equal(await burger.evaluate(e=>e===document.activeElement),true);
 await burger.click();await page.locator('.hero-h1').click();assert.equal(await burger.getAttribute('aria-expanded'),'false');
 await burger.click();await page.locator('.navmenu__link').first().click();assert.equal(await burger.getAttribute('aria-expanded'),'false');
 await burger.click();await page.setViewportSize({width:1440,height:1000});assert.equal(await burger.getAttribute('aria-expanded'),'false');
 await page.locator('.btn--hero').click();await page.locator('.btn--nav').click();
 checks.interactions={menuToggle:true,escapeClosesAndFocuses:true,outsideCloses:true,linkCloses:true,desktopResizeCloses:true,ctaAnchors:true};
 await snapshot('tablet',768,1024);
 await snapshot('smallMobile',320,568);
 await snapshot('landscape',844,390);
 assert.ok(checks.landscape.card.bottom<=checks.landscape.band.bottom+1,'Landscape card contained in band');
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-enter'),null);assert.equal(await page.locator('.hero-h1').evaluate(e=>getComputedStyle(e).animationName),'none');checks.reducedMotion=true;
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();await np.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});assert.equal(await np.locator('#stage').evaluate(e=>getComputedStyle(e).display),'grid');await np.locator('.burger').focus();assert.equal(await np.locator('.navmenu').evaluate(e=>getComputedStyle(e).pointerEvents),'auto');checks.noJavaScriptGridAndMenu=true;
 assert.deepEqual(errors,[],'No script errors');
 checks.scriptErrors=errors;checks.failedRequests=failed;
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(checks,null,2)+'\n');
 console.log(JSON.stringify(checks,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
