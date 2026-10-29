const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const server = spawn(process.execPath, ['scripts/serve.mjs'], {stdio:'ignore'});
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = { base:'/motionsites-results/aerocore/', viewports:[], errors:[], failedRequests:[], consoleErrors:[] };
 try {
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('console',msg=>{if(msg.type()==='error')report.consoleErrors.push({viewport:name,text:msg.text()});});
  page.on('pageerror',e=>report.errors.push({viewport:name,message:e.message}));
  page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)report.failedRequests.push({url:r.url(),status:r.status()});});
  await page.goto('http://localhost:4173'+report.base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1200);
  const engine=await page.locator('.engine-visual__asset').evaluate(el=>({complete:el.complete,width:el.naturalWidth,height:el.naturalHeight,src:el.currentSrc,visibility:getComputedStyle(el).visibility,rect:{top:el.getBoundingClientRect().top,left:el.getBoundingClientRect().left,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}}));
  assert(engine.complete && engine.width>0 && engine.visibility==='visible','Local reconstructed engine is visible');
  assert(engine.src.endsWith('/assets/engine-reconstructed.png'));
  await page.screenshot({path:`screenshots/${name}.png`});
  const result={name,width,height,engine,title:await page.title(),font:await page.evaluate(()=>document.fonts.check('200 20px Geist')),overflow:[],tabs:[],showcase:[]};
  for (const selector of ['#heroScroll','#company','#technology','#solutions','#our-edge','#our-team','.site-footer']) {
   await page.locator(selector).evaluate(el=>el.scrollIntoView()); await page.waitForTimeout(200);
   result.overflow.push({section:selector,...await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}))});
  }
  for (const key of ['cities','materials','fuels','hydrogen']) {
   await page.locator(`[data-stats-tab="${key}"]`).click(); await page.waitForTimeout(1200);
   assert.equal(await page.locator(`[data-stats-tab="${key}"]`).getAttribute('aria-selected'),'true');
   assert.equal(await page.locator('.stats__bar-row').count(),4);
   result.tabs.push({key,title:await page.locator('.stats__chart-head span').innerText(),values:await page.locator('.stats__value').allTextContents()});
  }
  await page.locator('#our-edge').evaluate(el=>el.scrollIntoView());
  await page.waitForTimeout(450); await page.screenshot({path:`screenshots/${name}-stats.png`});
  for(const progress of [.12,.4,.65,.92]) {
   await page.locator('#technology').evaluate((el,p)=>window.scrollTo(0,el.offsetTop+p*(el.offsetHeight-innerHeight)),progress);
   await page.waitForTimeout(600);
   result.showcase.push({progress,active:await page.locator('.showcase__panel.is-active .showcase__panel-num').innerText(),opacity:await page.locator('.showcase__ui').evaluate(el=>getComputedStyle(el).opacity)});
  }
  await page.screenshot({path:`screenshots/${name}-showcase.png`});
  if (name === 'desktop') {
   await page.locator('.showcase__tab').nth(1).click();
   await page.waitForTimeout(1600);
   assert.equal(await page.locator('.showcase__panel.is-active .showcase__panel-num').innerText(),'02');
   result.showcaseTabClick = 'passed';
  }
  await page.locator('#our-team').evaluate(el=>el.scrollIntoView());
  result.rail=await page.locator('.video-stories__rail').evaluate(el=>{el.scrollLeft=el.scrollWidth;return {scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollLeft:el.scrollLeft}});
  await page.waitForTimeout(500); await page.screenshot({path:`screenshots/${name}-stories.png`});
  await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(500);
  await page.locator('.hero__cta').click(); await page.waitForTimeout(500);
  assert.equal(new URL(page.url()).hash,'#contact');
  result.contact=await page.locator('#contact').evaluate(el=>({top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom}));
  result.videos=await page.locator('video').evaluateAll(els=>els.map(el=>({src:el.currentSrc,readyState:el.readyState,error:el.error?.message||null})));
  result.missingAnchors=await page.locator('a[href^="#"]').evaluateAll(els=>[...new Set(els.map(el=>el.getAttribute('href')).filter(h=>!document.getElementById(h.slice(1))))]);
  assert(result.overflow.every(o=>o.document===width && o.body===width),'No horizontal overflow');
  assert(result.videos.every(v=>v.readyState>=2 && !v.error),'All supplied videos decode');
  assert.deepEqual(result.showcase.map(s=>s.active),['01','02','03','04']);
  assert(result.showcase.every(s=>s.opacity==='1'));
  assert(result.contact.top < height && result.contact.bottom > 0, 'Contact is in view');
  assert.equal(await page.locator('.brand').getAttribute('href'), report.base);
  report.viewports.push(result); await page.close();
 }
 fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 assert.equal(report.errors.length,0,'No script errors');
 assert.equal(report.consoleErrors.length,0,'No console errors');
 assert.equal(report.failedRequests.filter(r=>r.status>=400 || (r.error && r.error!=='net::ERR_ABORTED')).length,0,'No broken visible assets');
 } finally {await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
