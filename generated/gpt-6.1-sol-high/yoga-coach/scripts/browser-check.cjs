const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const results=[];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
  const errors=[],failed=[],httpErrors=[];page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://localhost:5173/motionsites-results/yoga-coach/',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
  await page.waitForTimeout(5000);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`screenshots/${name}.png`});
  const before=await page.locator('video').evaluateAll(vs=>vs.map(v=>({readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,duration:v.duration,error:v.error?.message})));
  const overflow=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,font:[...document.fonts].some(f=>f.family==='Anton'&&f.status==='loaded')}));
  await page.getByRole('button',{name:"LET'S START"}).click();await page.waitForTimeout(3000);
  const playing=await page.locator('video').first().evaluate(v=>({paused:v.paused,currentTime:v.currentTime}));
  // Seek near the real ending to verify the actual ended event without waiting for the entire clip.
  const seeked=await page.locator('video').first().evaluate(v=>{if(Number.isFinite(v.duration)&&v.duration>0){v.currentTime=v.duration-.5;return true;}return false;});
  await page.waitForTimeout(5000);
  const collectionVisible=await page.locator('section').evaluate(el=>!el.inert&&Math.abs(el.getBoundingClientRect().top)<1);
  if(collectionVisible){
   await page.screenshot({path:`screenshots/${name}-collection.png`});
   const card=page.getByRole('button',{name:'Preview yoga session 2'});if(name==='desktop')await card.hover();else await card.tap();await page.waitForTimeout(1500);
   const hoverPlaying=await card.locator('video').evaluate(v=>!v.paused);
   const collectionOverflow=await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth&&document.documentElement.scrollHeight===innerHeight);
   await page.getByRole('button',{name:'BACK TO START'}).click();await page.waitForTimeout(1500);
   const reset=await page.locator('video').first().evaluate(v=>v.paused&&v.currentTime===0);
   results.push({name,overflow,before,playing,seeked,collectionVisible,collectionOverflow,hoverPlaying,reset,errors,failed,httpErrors});
  }else results.push({name,overflow,before,playing,seeked,collectionVisible,errors,failed,httpErrors});
  await page.close();
 }
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));await browser.close();
 if(results.some(r=>r.errors.length||!r.collectionVisible||!r.hoverPlaying||!r.reset||r.playing.paused||!r.overflow.font||r.overflow.scrollWidth!==r.overflow.width||r.overflow.scrollHeight!==r.overflow.height))throw new Error('Browser checks failed');
 console.log('Desktop and mobile: playback, actual ended transition, card preview, reset, font, no overflow and no script errors passed.');
})();
