const {chromium} = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 for(const mobile of [false,true]) {
  const name=mobile?'mobile':'desktop';const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  const page=await ctx.newPage();const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>failed.push(r.url()+': '+r.failure().errorText));
  await page.goto('http://localhost:4173/motionsites-results/prompt-hero/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2));await page.waitForTimeout(1200);
  const initial=await page.evaluate(()=>({videos:[...document.querySelectorAll('video')].map(v=>({duration:v.duration,readyState:v.readyState,paused:v.paused,display:getComputedStyle(v).display,currentTime:v.currentTime})),images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),font:document.fonts.check('500 12px "Inter Tight"'),overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(document.querySelector('.gallery-grid')).gridTemplateColumns.split(' ').length}));
  if(!mobile){await page.mouse.move(90,500);await page.waitForTimeout(900);report.scrubLeft=await page.evaluate(()=>document.querySelectorAll('video')[1].currentTime);await page.mouse.move(1350,500);await page.waitForTimeout(900);report.scrubRight=await page.evaluate(()=>document.querySelector('video').currentTime);await page.mouse.move(720,500);await page.waitForTimeout(700);report.deadZone=await page.evaluate(()=>[...document.querySelectorAll('video')].map(v=>v.currentTime));await page.mouse.move(120,500);await page.waitForTimeout(800);}
  await page.screenshot({path:`screenshots/${name}.png`});
  await page.evaluate(()=>scrollTo(0,innerHeight/2));await page.waitForTimeout(400);
  const half=await page.evaluate(()=>({panelTop:document.querySelector('.black-panel').getBoundingClientRect().top,viewport:innerHeight}));
  await page.evaluate(()=>scrollTo(0,innerHeight*1.5));await page.waitForTimeout(500);
  const gallery=await page.evaluate(()=>({panelTop:document.querySelector('.black-panel').getBoundingClientRect().top,videoHidden:getComputedStyle(document.querySelector('#main-canvas')).visibility,cards:[...document.querySelectorAll('.bp-card')].map(c=>({top:c.getBoundingClientRect().top,transform:getComputedStyle(c).transform})),overflow:document.documentElement.scrollWidth>innerWidth}));
  await page.screenshot({path:`screenshots/${name}-gallery.png`});
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(500);
  const outro=await page.evaluate(()=>({overlay:getComputedStyle(document.querySelector('#outro-overlay')).opacity,view:getComputedStyle(document.querySelector('#outro-buy')).transform,footer:getComputedStyle(document.querySelector('#outro-footer')).opacity,overflow:document.documentElement.scrollWidth>innerWidth}));
  await page.screenshot({path:`screenshots/${name}-outro.png`});
  if(mobile){await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);report.touchResume=await page.evaluate(()=>[...document.querySelectorAll('video')].some(v=>!v.paused));await page.evaluate(()=>{const v=[...document.querySelectorAll('video')].find(v=>!v.paused);v.currentTime=v.duration-.15});await page.waitForTimeout(700);report.touchAlternation=await page.evaluate(()=>[...document.querySelectorAll('video')].map(v=>({paused:v.paused,display:v.style.display})));}
  report[name]={initial,half,gallery,outro,errors,failed};await ctx.close();
 }
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const page=await ctx.newPage();await page.goto('http://localhost:4173/motionsites-results/prompt-hero/',{waitUntil:'networkidle'});report.reducedMotion=await page.evaluate(()=>[...document.querySelectorAll('video')].every(v=>v.paused));await ctx.close();
 const assert = require('assert/strict');
 for (const name of ['desktop','mobile']) { const r=report[name]; assert.equal(r.errors.length,0,`${name} console errors`);assert.equal(r.failed.length,0);assert.equal(r.initial.images,true);assert.equal(r.initial.font,true);assert.equal(r.initial.overflow,false);assert.equal(r.gallery.overflow,false);assert.equal(r.outro.overflow,false);assert.equal(r.outro.overlay,'1');assert.equal(r.outro.footer,'1');assert.equal(r.gallery.panelTop,0);assert.equal(r.half.panelTop,r.half.viewport/2); }
 assert.ok(report.scrubLeft>0 && report.scrubRight>0);assert.deepEqual(report.deadZone,[0,0]);assert.equal(report.touchResume,true);assert.equal(report.touchAlternation[1].paused,false);assert.equal(report.reducedMotion,true);report.passed=true;
 fs.writeFileSync('browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
