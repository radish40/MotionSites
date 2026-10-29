const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('assert');
const base='http://localhost:4173/motionsites-results/luxury-real-estate/';
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const report={url:base, checks:[], errors:[], failedRequests:[], responses:[]};
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push({viewport:name,message:e.message}));
  page.on('requestfailed',r=>report.failedRequests.push({viewport:name,url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)report.responses.push({viewport:name,url:r.url(),status:r.status()})});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(900);
  if(name==='desktop')await page.screenshot({path:'/work/screenshots/intro.png'});
  await page.waitForTimeout(4800);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.hero-text-block').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await page.locator('.intro-overlay').evaluate(el=>Math.round(el.getBoundingClientRect().bottom)),0);
  assert(await page.locator('.house-entrance img').evaluate(el=>el.complete&&el.naturalWidth>0));
  const fonts=await page.evaluate(()=>({syne:document.fonts.check('800 20px Syne'),inter:document.fonts.check('300 20px Inter')}));
  await page.screenshot({path:`/work/screenshots/${name}.png`});
  await page.getByRole('button',{name:'Open menu'}).click();
  await page.getByRole('dialog').waitFor();
  assert.equal(await page.locator('.menu-overlay a').count(),4);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
  await page.getByRole('button',{name:'Open menu'}).click();
  await page.getByRole('link',{name:'Story',exact:true}).click();
  await page.waitForTimeout(2400);
  assert.equal(await page.locator('.menu-overlay').count(),0);
  assert.equal(await page.locator('.stat-number').allTextContents().then(v=>v.join(',')),'120+,12,98%');
  assert.equal(await page.locator('nav').evaluate(el=>getComputedStyle(el).color),'rgb(255, 255, 255)');
  const houseTransform=await page.locator('.house-wrapper').evaluate(el=>getComputedStyle(el).transform);
  assert(!houseTransform.includes('NaN'));
  await page.screenshot({path:`/work/screenshots/${name}-statement.png`});
  await page.locator('#listings').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const videos=await page.locator('video').evaluateAll(vs=>vs.map(v=>({readyState:v.readyState,width:v.videoWidth,playing:!v.paused,muted:v.muted})));
  assert(videos.every(v=>v.readyState>=2&&v.width>0&&v.playing&&v.muted));
  if(name==='desktop'){
   const before=await page.locator('.gallery-expand-item').first().evaluate(el=>el.getBoundingClientRect().width);
   await page.locator('.gallery-expand-item').first().hover();await page.waitForTimeout(650);
   const after=await page.locator('.gallery-expand-item').first().evaluate(el=>el.getBoundingClientRect().width);
   assert(after>before*2);
  }else{
   assert.equal(await page.locator('.gallery-expand-row').evaluate(el=>getComputedStyle(el).display),'grid');
  }
  await page.screenshot({path:`/work/screenshots/${name}-gallery.png`,fullPage:false});
  const overflow=[];
  for(const fraction of [0,.2,.4,.6,.8,1]){
   await page.evaluate(f=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*f),fraction);await page.waitForTimeout(60);
   overflow.push(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  }
  assert(overflow.every(v=>!v));
  report.checks.push({viewport:name,size:`${width}x${height}`,preloader:true,heroReveal:true,houseLoaded:true,menuLinksAndEscape:true,countUp:true,navColor:true,houseTransform,videoPlayback:videos,gallery:name==='desktop'?'hover expansion passed':'two-column grid passed',horizontalOverflow:false,fonts});
  await context.close();
 }
 await browser.close();fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
