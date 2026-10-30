const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('assert');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results = [];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://127.0.0.1:4173/motionsites-results/ecovolta-v2-hero/',{waitUntil:'networkidle',timeout:60000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').currentTime>0,null,{timeout:30000}).catch(()=>{});
  await page.waitForFunction(()=>document.querySelector('video').videoWidth===1104,null,{timeout:30000}).catch(()=>{});
  await page.evaluate(async()=>{ await document.fonts.load('500 16px "Instrument Sans"'); await document.fonts.ready; await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); });
  await page.waitForTimeout(500);
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  const metrics=await page.evaluate(()=>{
   const v=document.querySelector('video'),h=document.querySelector('h1'),content=document.querySelector('.hero-content');
   return {viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],headline:h.getBoundingClientRect().toJSON(),content:content.getBoundingClientRect().toJSON(),fonts:{serif:document.fonts.check('48px "Instrument Serif"'),manrope:document.fonts.check('18px Manrope'),sans:document.fonts.check('500 16px "Instrument Sans"')},navVisible:getComputedStyle(document.querySelector('.nav-links')).display!=='none',video:{time:v.currentTime,readyState:v.readyState,paused:v.paused,muted:v.muted,loop:v.loop,playsInline:v.playsInline,width:v.videoWidth,height:v.videoHeight,requestedLevel:v.dataset.requestedLevel,activeLevel:v.dataset.activeLevel},headlineSize:getComputedStyle(h).fontSize};
  });
  assert(metrics.document[0]<=width,'Horizontal overflow');
  assert(metrics.document[1]<=height,'Vertical overflow');
  assert.equal(metrics.navVisible,name==='desktop');
  assert.equal(metrics.video.width,1104,'Highest resolution playback');
  assert.equal(metrics.video.requestedLevel,metrics.video.activeLevel,'Requested highest level active');
  assert(Object.values(metrics.fonts).every(Boolean),'Fonts loaded');
  assert.equal(metrics.headlineSize,name==='desktop'?'70px':'48px');
  assert.equal(errors.length,0,errors.join('\n'));
  await page.locator('.cta').hover();
  await page.waitForTimeout(250);
  const hoverOpacity=await page.locator('.cta').evaluate(el=>getComputedStyle(el).opacity);
  assert.equal(hoverOpacity,'0.9');
  await page.locator('.cta').focus();
  const focusOutline=await page.locator('.cta').evaluate(el=>getComputedStyle(el).outlineStyle);
  assert.equal(focusOutline,'solid');
  await page.locator('.cta').click();
  await page.locator('.login').click();
  if(name==='desktop') for(const label of ['Product','How it works','Pricing','Customers','Docs']) { await page.getByRole('link',{name:label,exact:true}).click(); assert.equal(new URL(page.url()).hash,'#'+label.toLowerCase().replaceAll(' ','-')); }
  results.push({name,metrics,hoverOpacity,focusOutline,errors,failedRequests:failed,interactions:'CTA/Login click, CTA hover and keyboard focus, desktop navigation hash checks'});
  await page.close();
 }
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
