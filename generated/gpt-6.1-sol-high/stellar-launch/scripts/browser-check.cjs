const { chromium } = require('/app/node_modules/playwright-core');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const results={};
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
 const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
 await page.goto('http://127.0.0.1:4173/motionsites-results/stellar-launch/',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await Promise.all([document.fonts.load('400 14px Inter'),document.fonts.load('400 48px "TT Firs Neue"')]);await document.fonts.ready});
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('video')).every(v=>v.readyState>=2));
 const media=await page.locator('video').evaluateAll(vs=>vs.map(v=>({width:v.videoWidth,height:v.videoHeight,playing:!v.paused,muted:v.muted,loop:v.loop,error:v.error?.message||null})));
 console.log(name,media);assert(media.every(v=>v.width>0&&!v.error));assert(media[0].playing);
 const overflow=await page.evaluate(()=>({body:document.body.scrollWidth>innerWidth,sections:[...document.querySelectorAll('section')].map(s=>({id:s.id,overflow:s.scrollWidth>s.clientWidth}))}));
 assert(!overflow.body);assert(overflow.sections.every(s=>!s.overflow));
 await page.locator('#hero video').evaluate(v=>{v.pause();v.currentTime=.4});
 await page.waitForTimeout(250);
 await page.screenshot({path:`screenshots/${name}.png`});
 await page.getByRole('link',{name:name==='mobile'?'Enter':'Send in your entry form',exact:true}).click();
 await page.waitForTimeout(1000);
 assert(await page.locator('.no-scrollbar').evaluate(s=>s.scrollTop)>height-100);
 await page.waitForFunction(()=>!document.querySelectorAll("video")[1].paused);
 media[1].playing_when_visible=true;
 await page.screenshot({path:`screenshots/${name}-submissions.png`});
 const categoryLinks=await page.locator('.nomination').evaluateAll(es=>es.map(e=>e.href));
 assert(categoryLinks.every(h=>h==='https://base.launchex.vc/'));
 if(name==='desktop'){
  for(const link of ['Venue','Judges','Connect']) assert.equal(await page.getByRole('link',{name:link,exact:true}).getAttribute('href'),'https://base.launchex.vc/');
  await page.getByRole('link',{name:'About',exact:true}).click();
 }else await page.locator('#about').evaluate(e=>e.scrollIntoView());
 await page.waitForTimeout(1000);
 await page.screenshot({path:`screenshots/${name}-about.png`});
 const images=await page.locator('#about [style*="background-image"]').evaluateAll(async es=>Promise.all(es.map(e=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve({loaded:true,width:i.width});i.onerror=()=>resolve({loaded:false});i.src=e.style.backgroundImage.slice(5,-2)}))));
 assert(images.every(i=>i.loaded));assert(errors.length===0);
 const fonts=await page.evaluate(()=>({inter:document.fonts.check('400 14px Inter'),firs:document.fonts.check('400 48px "TT Firs Neue"')}));
 assert(fonts.inter&&fonts.firs);
 results[name]={viewport:{width,height},media,overflow,images,script_errors:errors,failed_requests:failed,interactions:'CTA scroll, about section, category and founder destination links'+(name==='desktop'?', About navigation, Venue/Judges/Connect destination links':''),fonts:await page.evaluate(()=>({inter:document.fonts.check('400 14px Inter'),firs:document.fonts.check('400 48px "TT Firs Neue"')}))};
 await page.close();
}
fs.writeFileSync('browser-checks.json',JSON.stringify(results,null,2));
await browser.close();console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
