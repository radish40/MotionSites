const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const report={url:'http://127.0.0.1:4173/motionsites-results/wealth-video-hero/',checks:[],errors:[],failedRequests:[]};
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)report.failedRequests.push({url:r.url(),status:r.status()})});
 await page.goto(report.url,{waitUntil:'networkidle'});await page.locator('video').evaluate(v=>new Promise(resolve=>{if(v.readyState>=3)resolve();else v.oncanplay=resolve}));
 await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>0},{timeout:30000});
 const initial=await page.locator('video').evaluate(v=>({paused:v.paused,time:v.currentTime,muted:v.muted,loop:v.loop,width:v.videoWidth,height:v.videoHeight,scale:getComputedStyle(v).scale,transform:getComputedStyle(v).transform,position:getComputedStyle(v).objectPosition,origin:getComputedStyle(v).transformOrigin}));
 await page.waitForTimeout(700);assert.equal(initial.paused,false);assert(initial.muted&&initial.loop);assert.equal(initial.scale,'1.5');assert.equal(initial.position,'0% 0%');assert.equal(initial.origin,'0px 0px');assert(await page.locator('video').evaluate(v=>v.currentTime)>initial.time);report.checks.push({name:'Original video autoplay, muted, looping, 150% scale, top-left',result:'pass',details:initial});
 await page.locator('video').evaluate(async v=>{v.pause();v.currentTime=2;await new Promise(r=>v.onseeked=r)});await page.waitForTimeout(300);
 assert.equal((await page.locator('h1').innerText()).replace(/\s+/g,' '),'Build Wealth That Lasts Generations');
 assert.equal(await page.locator('.step').count(),4);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'/work/screenshots/desktop.png',fullPage:true});report.checks.push({name:'1440x1000 desktop layout, exact headline, four steps, no overflow',result:'pass'});
 await page.getByRole('button',{name:'Features',exact:true}).click();await page.getByRole('link',{name:'02 Connect Your Bank Accounts'}).click();assert.equal(await page.locator('.feature-menu').count(),0);report.checks.push({name:'Features dropdown and anchor navigation',result:'pass'});
 for(const label of ['Company','Blogs','Sign in','Get Started','Start Building Wealth']){
 await page.getByRole('button',{name:label,exact:true}).click();assert(await page.locator('dialog').isVisible());
 if(['Company','Blogs'].includes(label)){await page.getByRole('button',{name:'Explore the features'}).click();}
 else {await page.getByLabel('Email address').fill('preview@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('status').waitFor();await page.getByRole('button',{name:'Back to Aureon'}).click();}
 assert.equal(await page.locator('dialog').isVisible(),false);
 }
 report.checks.push({name:'All navigation actions, CTA forms and preview confirmation',result:'pass'});
 await page.getByRole('button',{name:'Get Started',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);report.checks.push({name:'Dialog Escape close',result:'pass'});
 await page.setViewportSize({width:390,height:844});await page.goto(report.url,{waitUntil:'networkidle'});await page.locator('video').evaluate(async v=>{v.pause();v.currentTime=2;await new Promise(r=>v.onseeked=r)});await page.waitForTimeout(300);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/work/screenshots/mobile.png',fullPage:true});await page.screenshot({path:'/work/screenshots/mobile-viewport.png'});
 await page.getByRole('button',{name:'Open menu'}).click();assert(await page.locator('.mobile-menu').isVisible());await page.locator('.mobile-menu').getByRole('button',{name:'Sign in'}).click();assert(await page.locator('dialog').isVisible());await page.getByRole('button',{name:'Close dialog'}).click();assert.equal(await page.locator('.mobile-menu').count(),0);report.checks.push({name:'390x844 mobile layout, mobile menu and sign in',result:'pass'});
 for(const width of [320,768,1024,1920]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`)}report.checks.push({name:'Additional overflow checks at 320, 768, 1024, 1920px',result:'pass'});
 assert.equal(report.errors.length,0);assert.equal(report.failedRequests.length,0);report.checks.push({name:'No browser script errors or failing asset requests',result:'pass'});
 fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
