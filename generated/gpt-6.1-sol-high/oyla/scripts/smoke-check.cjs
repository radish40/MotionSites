const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');const assert=require('assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base='http://localhost:3000/motionsites-results/oyla/';
await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');
const mode=process.env.CHECK_MODE||'production';const report={mode};
report.api=await (await page.request.get(base+'api/higgsfield-video')).json();assert.equal(report.api.success,true);assert.match(report.api.url,/\.mp4/);
report.secondApi=await (await page.request.get(base+'api/higgsfield-video?url=https://higgsfield.ai/s/iK6bYyCxd0I')).json();assert.equal(report.secondApi.success,true);
report.invalidApiStatus=(await page.request.get(base+'api/higgsfield-video?url=https://example.com/')).status();assert.equal(report.invalidApiStatus,400);
report.breakpoints=[];
for(const width of [1000,390,1440]){
 await page.setViewportSize({width,height:1000});await page.waitForTimeout(500);
 const value=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,card:document.querySelector('.product-card').getBoundingClientRect().width,columns:getComputedStyle(document.querySelector('.studio')).gridTemplateColumns,footerColumns:getComputedStyle(document.querySelector('footer')).gridTemplateColumns,triggers:ScrollTrigger.getAll().length,spacer:document.querySelector('.footer-spacer').offsetHeight,footer:document.querySelector('footer').offsetHeight}));
 assert.equal(value.overflow,false);assert.equal(value.triggers,12);assert.equal(value.spacer,value.footer);report.breakpoints.push(value);
}
await page.evaluate(()=>{const t=ScrollTrigger.getAll().find(t=>t.vars.pin);scrollTo(0,t.start+(t.end-t.start)*.55)});await page.waitForTimeout(500);
report.horizontal=await page.locator('.awards-grid').evaluate(el=>getComputedStyle(el).transform);assert.notEqual(report.horizontal,'matrix(1, 0, 0, 1, 0, 0)');
await page.evaluate(()=>{const t=ScrollTrigger.getAll().find(t=>t.vars.pin);scrollTo(0,t.end-1)});await page.waitForTimeout(1000);
report.fullReveal=await page.locator('.video-scaling-wrapper').evaluate(el=>el.getBoundingClientRect().width);assert.ok(report.fullReveal>1430);
assert.deepEqual(errors,[]);report.errors=errors;
if(mode==='production'){
 const offline=await browser.newPage({viewport:{width:390,height:844}});
 await offline.route('**/*',route=>{const u=route.request().url();if(!u.startsWith('http://localhost:3000/'))return route.abort();if(u.includes('/api/'))return route.fulfill({status:503,contentType:'application/json',body:'{"success":false}'});return route.continue();});
 await offline.goto(base,{waitUntil:'domcontentloaded'});await offline.waitForFunction(()=>document.documentElement.dataset.ready==='true');await offline.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2));
 report.externalNetworkFallback=await offline.evaluate(()=>({gsap:gsap.version,videoSources:[...document.querySelectorAll('video')].map(v=>v.currentSrc),images:[...document.images].every(i=>i.naturalWidth>0),fonts:document.fonts.check('16px "Instrument Serif"')}));
 assert.equal(report.externalNetworkFallback.gsap,'3.12.5');assert.equal(report.externalNetworkFallback.images,true);assert.equal(report.externalNetworkFallback.fonts,true);await offline.close();
}
fs.writeFileSync(`screenshots/${mode}-smoke.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
