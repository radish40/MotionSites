const {chromium} = require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
const errors=[],failed=[],external=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})});
page.on('request',r=>{if(!r.url().startsWith('http://localhost:4173'))external.push(r.url())});
await page.goto('http://localhost:4173/motionsites-results/luxury-botanical/',{waitUntil:'networkidle'});
await page.evaluate(async()=>{await document.fonts.load('16px "Great Vibes"');await document.fonts.ready});
await page.waitForFunction(()=>document.querySelector('video').readyState>=2,{timeout:20000});
await page.evaluate(()=>{const v=document.querySelector('video');v.pause();v.currentTime=3});
await page.waitForTimeout(500);
await page.screenshot({path:`screenshots/${name}.png`});
const video=await page.locator('video').evaluate(v=>({readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,duration:v.duration,error:v.error?.message||null}));
const fontChecks=await page.evaluate(()=>({serif:document.fonts.check('16px "Instrument Serif"'),sans:document.fonts.check('16px Manrope'),script:document.fonts.check('16px "Great Vibes"')}));
const overflow=[];
for(const progress of [0,.1,.3,.5,.75,.96]){
await page.evaluate(p=>window.scrollTo({top:innerHeight*5*p,behavior:'instant'}),progress);
await page.waitForTimeout(400);
overflow.push(await page.evaluate(()=>({y:scrollY,width:document.documentElement.scrollWidth,viewport:innerWidth})));
if(progress===.1||progress===.5)await page.screenshot({path:`screenshots/${name}-${progress===.1?'orbit':'fragrance'}.png`});
}
await page.evaluate(()=>window.scrollTo({top:innerHeight*.5,behavior:'instant'}));await page.waitForTimeout(400);
await page.getByRole('button',{name:'BUY COLLECTION',exact:true}).click();await page.waitForTimeout(1200);
const buyScroll=await page.evaluate(()=>scrollY);
await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(400);
await page.getByRole('link',{name:/Shop/}).click();await page.waitForTimeout(1200);
const shopScroll=await page.evaluate(()=>scrollY);
await page.locator('#newsletter').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
const form=page.locator('#newsletter form');
const rejectsEmptyEmail=await form.locator('input').evaluate(input=>!input.checkValidity());
await form.locator('input').fill('botanical@example.com');await form.getByRole('button').click();
const newsletter=await page.locator('#newsletter [role=status]').textContent();
await page.screenshot({path:`screenshots/${name}-newsletter.png`});
await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(1300);
overflow.push(await page.evaluate(()=>({y:scrollY,width:document.documentElement.scrollWidth,viewport:innerWidth})));
await page.locator('footer input').fill('studio@example.com');await page.locator('footer button').click();
const footerNewsletter=await page.locator('footer [role=status]').textContent();
await page.screenshot({path:`screenshots/${name}-footer.png`});
const images=await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})));
results.push({name,viewport:{width,height},video,fontChecks,shopScroll,buyScroll,rejectsEmptyEmail,newsletter,footerNewsletter,overflow,images,errors,failed,external});
await page.close();
}
fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));
for (const result of results) {
if (result.errors.length || result.failed.length || result.external.length) throw new Error(`${result.name}: browser resource or script error`);
if (!Object.values(result.fontChecks).every(Boolean) || !result.images.every(i=>i.loaded)) throw new Error(`${result.name}: missing asset`);
if (!result.overflow.every(o=>o.width===o.viewport)) throw new Error(`${result.name}: horizontal overflow`);
if (!result.rejectsEmptyEmail || result.shopScroll<=0 || result.buyScroll<=0) throw new Error(`${result.name}: interaction failure`);
}

console.log(JSON.stringify(results,null,2));
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
