const {chromium}=require('/app/node_modules/playwright-core');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const server=spawn('npm',['run','preview','--','--port','4173'],{stdio:'ignore'});
 let browser;
 const report={url:'http://localhost:4173/motionsites-results/nova-space-landing/',checks:[],consoleErrors:[],pageErrors:[],failedRequests:[]};
 try{
 for(let i=0;i<50;i++){try{const r=await fetch(report.url);if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text())});page.on('pageerror',e=>report.pageErrors.push(e.message));page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 await page.goto(report.url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=3));
 const videoStates=await page.locator('video').evaluateAll(v=>v.map(x=>({width:x.videoWidth,height:x.videoHeight,playing:!x.paused,muted:x.muted,loop:x.loop,time:x.currentTime})));
 assert(videoStates.every(v=>v.playing&&v.muted&&v.loop));report.checks.push({name:'Three local videos loaded and autoplaying muted/looping',passed:true,videoStates});
 await page.waitForTimeout(250);assert((await page.locator('video').first().evaluate(v=>v.currentTime))>videoStates[0].time);
 assert(await page.evaluate(()=>document.querySelector('.hero').getBoundingClientRect().bottom===innerHeight));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));report.checks.push({name:'Desktop hero exactly fills viewport with navbar; no horizontal overflow',passed:true});
 await page.evaluate(()=>document.querySelectorAll('video').forEach(v=>{v.pause();v.currentTime=1.5}));await page.waitForTimeout(250);
 await page.screenshot({path:'screenshots/desktop.png'});await page.screenshot({path:'screenshots/desktop-full.png',fullPage:true});
 await page.getByRole('link',{name:'View Our Fleet'}).click();await page.waitForTimeout(700);assert(await page.evaluate(()=>location.hash==='#fleet'));report.checks.push({name:'Fleet CTA scrolls to launch vehicles',passed:true});
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(400);
 await page.getByRole('button',{name:'Search NOVA'}).click();await page.getByRole('searchbox').fill('launch');assert(await page.getByRole('dialog').getByRole('link',{name:/Programs/}).count()===1);
 await page.getByRole('searchbox').fill('zzzz');assert(await page.getByText('No results.',{exact:false}).isVisible());await page.keyboard.press('Escape');assert(await page.getByRole('dialog').count()===0);assert(await page.getByRole('button',{name:'Search NOVA'}).evaluate(e=>e===document.activeElement));report.checks.push({name:'Search matching, empty state, Escape and focus restoration',passed:true});
 await page.getByRole('button',{name:'Open menu',exact:true}).filter({visible:true}).click();await page.keyboard.press('Shift+Tab');assert(await page.getByRole('dialog').getByRole('button',{name:'Search',exact:true}).evaluate(e=>e===document.activeElement));await page.keyboard.press('Tab');assert(await page.getByRole('button',{name:'Close panel'}).evaluate(e=>e===document.activeElement));report.checks.push({name:'Panel keyboard focus stays inside dialog in both directions',passed:true});await page.getByRole('dialog').getByRole('link',{name:/Systems/}).click();assert(await page.evaluate(()=>location.hash==='#science'));report.checks.push({name:'Desktop menu destination links',passed:true});
 await page.setViewportSize({width:390,height:844});await page.goto(report.url,{waitUntil:'networkidle'});await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=3));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));assert(await page.evaluate(()=>document.querySelector('.hero').getBoundingClientRect().bottom===innerHeight));
 await page.evaluate(()=>document.querySelectorAll('video').forEach(v=>{v.pause();v.currentTime=1.5}));await page.waitForTimeout(250);
 await page.screenshot({path:'screenshots/mobile.png'});await page.screenshot({path:'screenshots/mobile-full.png',fullPage:true});report.checks.push({name:'390×844 mobile layout, exact hero height, no overflow',passed:true});
 await page.getByRole('button',{name:'Open menu',exact:true}).filter({visible:true}).click();assert(await page.getByRole('dialog').isVisible());await page.getByRole('dialog').getByRole('button',{name:'Search',exact:true}).click();await page.getByRole('searchbox').fill('space');assert(await page.getByRole('dialog').getByRole('link',{name:/Discover/}).count()===1);await page.getByRole('dialog').getByRole('link',{name:/Discover/}).click();assert(await page.evaluate(()=>location.hash==='#discovery'));report.checks.push({name:'Mobile menu, search and destination navigation',passed:true});
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});assert(await page.locator('video').evaluateAll(v=>v.every(x=>x.paused)));report.checks.push({name:'Reduced motion pauses ambient video',passed:true});
 assert.equal(report.pageErrors.length,0);assert.equal(report.consoleErrors.length,0);report.checks.push({name:'No page or console errors',passed:true});
 report.status='passed';
 }catch(error){report.status='failed';report.error=error.stack;process.exitCode=1;}finally{fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser?.close();server.kill();}
})();
