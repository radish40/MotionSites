const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const errors=[],failed=[],responses=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure().errorText}));
  page.on('response',r=>{if(r.status()>=400)responses.push({url:r.url(),status:r.status()});});
  await page.goto('http://localhost:4173/motionsites-results/outdoor-apparel/',{waitUntil:'networkidle',timeout:90000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1000);
  const initial=await page.evaluate(()=>({title:document.title,font:document.fonts.check('600 18px "Inter Tight"'),video:{ready:document.querySelector('video').readyState,duration:document.querySelector('video').duration,paused:document.querySelector('video').paused},images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),overflow:document.documentElement.scrollWidth>innerWidth}));
  await page.screenshot({path:`screenshots/${name}.png`});
  const before=await page.locator('#clock-text').textContent();await page.waitForTimeout(1100);const clockChanges=before!==await page.locator('#clock-text').textContent();
  let mobileMenu;
  if(name==='mobile') {
   await page.locator('#menu-toggle-btn').click(); await page.waitForTimeout(500);
   mobileMenu={opens:await page.locator('#menu-toggle-btn').textContent()==='Close',visible:await page.locator('#mobile-menu-overlay').evaluate(e=>e.classList.contains('active'))};
   await page.screenshot({path:'screenshots/mobile-menu.png'});
   await page.locator('.mobile-menu-content a[href="#about"]').click();await page.waitForTimeout(700);
   mobileMenu.closesOnLink=await page.locator('#menu-toggle-btn').textContent()==='Menu';
  }
  await page.evaluate(()=>scrollTo(0,innerHeight)); await page.waitForTimeout(1600);
  const scrub=await page.evaluate(()=>({currentTime:document.querySelector('video').currentTime,titleOpacity:+getComputedStyle(document.querySelector('#bottom-title-container')).opacity}));
  await page.evaluate(()=>scrollTo(0,document.querySelector('#about').offsetTop+150));await page.waitForTimeout(1000);
  await page.screenshot({path:`screenshots/${name}-collage.png`});
  const collage=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,transform:document.querySelector('.item-cap').style.transform}));
  await page.locator(name==='mobile'?'.mobile-menu-content a[href="#collection"]':'#header-center a[href="#collection"]').evaluate(el=>el.click());await page.waitForTimeout(2200);
  const collection=await page.evaluate(()=>({clip:document.querySelector('#product-slider-overlay').style.clipPath,position:scrollY,label:document.querySelector('.product-info').textContent}));
  await page.screenshot({path:`screenshots/${name}-collection.png`});
  const transitions=[];
  for(let i=0;i<4;i++){
   await page.evaluate(i=>scrollTo(0,document.documentElement.scrollHeight-innerHeight-2700+i*900),i);await page.waitForFunction(i=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#product-slider-track')).transform).m41+i*innerWidth)<1,i,{timeout:20000});
   await page.waitForTimeout(400);
   transitions.push(await page.evaluate(()=>({visible:[...document.querySelectorAll('.product-card')].find(c=>c.getAttribute('aria-hidden')==='false').getAttribute('aria-label'),symbol:document.querySelector('#slider-symbol').textContent})));
  }
  await page.screenshot({path:`screenshots/${name}-last-card.png`});
  await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>document.querySelector('video').currentTime<.1,null,{timeout:20000});
  const reverses=await page.evaluate(()=>({video:document.querySelector('video').currentTime,clip:document.querySelector('#product-slider-overlay').style.clipPath,overflow:document.documentElement.scrollWidth>innerWidth}));
  assert.equal(initial.title,'ALP1NE™'); assert.ok(initial.font && initial.video.ready>=2 && initial.video.paused);
  assert.ok(initial.images.every(i=>i.loaded)); assert.ok(!initial.overflow&&!collage.overflow&&!reverses.overflow);
  assert.ok(clockChanges && scrub.currentTime>0 && scrub.titleOpacity<1);
  assert.deepEqual(transitions.map(t=>t.visible),['Shell Jacket','Arc Layer','Field Cap','Summit Haul 40']);
  assert.ok(reverses.video<.1); assert.equal(errors.length,0); assert.equal(failed.length,0); assert.equal(responses.length,0);
  if(mobileMenu) assert.ok(mobileMenu.opens && mobileMenu.visible && mobileMenu.closesOnLink);
  report[name]={initial,clockChanges,mobileMenu,scrub,collage,collection,transitions,reverses,errors,failed,responses};
  await page.close();
 }
 fs.writeFileSync('browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
