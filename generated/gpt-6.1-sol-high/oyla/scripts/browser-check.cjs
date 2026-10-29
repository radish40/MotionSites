const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const page=await context.newPage();const errors=[],failed=[],http=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)http.push({url:r.url(),status:r.status()});});
  await page.goto('http://localhost:3000/motionsites-results/oyla/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.documentElement.dataset.ready==='true',{timeout:60000});
  await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2),{timeout:60000});
  await page.waitForTimeout(1200);
  const initial=await page.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,videos:[...document.querySelectorAll('video')].map(v=>({duration:v.duration,readyState:v.readyState,paused:v.paused,source:v.currentSrc})),fonts:[document.fonts.check('16px "Instrument Serif"'),document.fonts.check('16px "Inter Tight"')],images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),triggers:ScrollTrigger.getAll().length}));
  await page.screenshot({path:`screenshots/${name}.png`});
  await page.locator('.menu-toggle').click();const menuOpen=await page.locator('#menu-panel').isVisible();await page.keyboard.press('Escape');
  await page.locator('[data-dialog="bag"]').click();const bag=await page.locator('dialog').isVisible();await page.locator('.dialog-done').click();
  await page.locator('.header-nav [data-scroll="about"]').click();await page.waitForTimeout(1800);
  const about=await page.evaluate(()=>({y:scrollY,top:document.querySelector('.studio').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth}));
  await page.screenshot({path:`screenshots/${name}-studio.png`});
  await page.locator('.studio-copy [data-scroll="collection"]').click();await page.waitForTimeout(1800);
  await page.screenshot({path:`screenshots/${name}-collection.png`});
  const collection=await page.evaluate(()=>({top:document.querySelector('.awards').getBoundingClientRect().top,transform:getComputedStyle(document.querySelector('.awards-grid')).transform}));
  const trigger=await page.evaluate(()=>{const t=ScrollTrigger.getAll().find(t=>t.vars.pin);return {start:t.start,end:t.end};});
  await page.evaluate(({start,end})=>scrollTo(0,start+(end-start)*.88),trigger);await page.waitForTimeout(1800);
  const reveal=await page.evaluate(()=>({width:document.querySelector('.video-scaling-wrapper').getBoundingClientRect().width,videoTime:document.querySelector('.craft-video').currentTime}));
  await page.screenshot({path:`screenshots/${name}-reveal.png`});
  await page.evaluate(()=>scrollTo(0,2000));await page.waitForTimeout(1400);
  const heroSeek=await page.locator('.hero-video').evaluate(v=>v.currentTime);
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);await page.locator('.discover').click();await page.waitForTimeout(1800);
  await page.screenshot({path:`screenshots/${name}-footer.png`});
  const footer=await page.evaluate(()=>({atBottom:Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight)<3,top:document.querySelector('footer').getBoundingClientRect().top,spacer:document.querySelector('.footer-spacer').offsetHeight,height:document.querySelector('footer').offsetHeight,overflow:document.documentElement.scrollWidth>innerWidth}));
  await page.locator('#email').fill('hello@example.com');let alertText='';page.once('dialog',async d=>{alertText=d.message();await d.accept();});await page.locator('.newsletter-form button').click();await page.waitForTimeout(300);
  report[name]={viewport:{width,height},initial,menuOpen,bag,about,collection,reveal,heroSeek,footer,newsletter:alertText,errors,failed,http};
  await context.close();
 }
 fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
