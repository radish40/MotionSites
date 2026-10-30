const fs=require('node:fs');
const {spawn}=require('node:child_process');
const {chromium}=require('/app/node_modules/playwright-core');
const assert=require('node:assert/strict');
(async()=>{
const server=spawn(process.execPath,['scripts/serve.cjs'],{stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const report={url:'http://localhost:4173/motionsites-results/data-signal/',checks:[],console_errors:[],failed_requests:[]};
try{
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',768,1024],['short-mobile',360,640],['landscape',844,390]]){
const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
const page=await context.newPage();
page.on('pageerror',e=>report.console_errors.push({viewport:name,message:e.message}));
page.on('console',msg=>{if(msg.type()==='error')report.console_errors.push({viewport:name,message:msg.text()});});
page.on('requestfailed',req=>report.failed_requests.push({viewport:name,url:req.url(),error:req.failure()?.errorText}));
await page.goto(report.url,{waitUntil:'networkidle'});
await page.evaluate(()=>document.fonts.ready);
await page.waitForFunction(()=>!document.documentElement.classList.contains('motion-pending'));
await page.waitForFunction(()=>document.querySelector('.background').readyState>=2,{},{timeout:20000});
const state=await page.evaluate(()=>{const v=document.querySelector('.background'),r=document.querySelector('.hero-content').getBoundingClientRect();return{scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,width:innerWidth,height:innerHeight,video:{src:v.currentSrc,readyState:v.readyState,paused:v.paused,videoWidth:v.videoWidth,currentTime:v.currentTime},fonts:document.fonts.check('500 76px "Reference Display"')&&document.fonts.check('430 16px "Reference Sans"'),hero:{x:r.x,y:r.y,bottom:r.bottom},copy:document.querySelector('.hero-copy').textContent.replace(/\s+/g,' ').trim()};});
assert.equal(state.scrollWidth,width);assert.equal(state.scrollHeight,height);assert(state.video.readyState>=2);assert(!state.video.paused);assert(state.fonts);assert(state.hero.y>70);assert(state.hero.bottom<=height);
// Freeze the same true video frame for comparable screenshot evidence.
await page.evaluate(async()=>{const v=document.querySelector('.background');v.pause();v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
if(name==='desktop'||name==='mobile')await page.screenshot({path:`screenshots/${name}.png`});
if(name==='mobile'||name==='tablet'||name==='short-mobile'){
assert(await page.locator('#tablet-navigation').evaluate(e=>e.inert));
await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Home');
await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
await page.locator('.menu-toggle').click();await page.locator('.nav a').nth(1).click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
await page.locator('.menu-toggle').click();await page.locator('.hero-copy').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
if(name==='mobile'){await page.locator('.menu-toggle').click();await page.screenshot({path:'screenshots/mobile-menu.png'});await page.keyboard.press('Escape');}
}
await page.locator('.play').click();assert(await page.locator('.demo-dialog').evaluate(d=>d.open));await page.keyboard.press('Escape');assert(!(await page.locator('.demo-dialog').evaluate(d=>d.open)));
await page.locator('.watch-button').click();assert(await page.locator('.demo-dialog').evaluate(d=>d.open));await page.locator('.close-demo').click();assert(!(await page.locator('.demo-dialog').evaluate(d=>d.open)));
await page.evaluate(()=>{window.hookCalls=[];window.addEventListener('vantage:get-started',()=>hookCalls.push('get-started'));window.addEventListener('vantage:signup',()=>hookCalls.push('signup'));});
await page.locator('.primary-cta').click();
if(await page.locator('.menu-toggle').isVisible())await page.locator('.menu-toggle').click();await page.locator('.sign-up').click();assert.deepEqual(await page.evaluate(()=>hookCalls),['get-started','signup']);
report.checks.push({viewport:name,size:`${width}x${height}`,passed:true,state,interactions:'Demo open/close, Escape, CTA hooks; compact menu focus, Escape, outside click and link closure where applicable'});
await context.close();
}
const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const p=await reduced.newPage();await p.goto(report.url,{waitUntil:'networkidle'});assert(!(await p.locator('html').evaluate(e=>e.classList.contains('motion-pending'))));assert(await p.locator('.background').evaluate(v=>v.paused));report.checks.push({name:'prefers-reduced-motion',passed:true,details:'No entrance animation; background paused'});await reduced.close();
assert.equal(report.console_errors.length,0);
report.passed=true;
}catch(e){report.passed=false;report.error=e.stack;process.exitCode=1;}finally{fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));await browser.close();server.kill();console.log(JSON.stringify(report,null,2));}
})();
