// Strict local production acceptance checks. No interception or error suppression.
// The external management checker and its live-check.json report are untouched.
const fs = require('fs');
const assert = require('node:assert/strict');
const {start} = require('./browser-helpers.cjs');
(async()=>{
 const app=await start(); const report={};
 try {
  for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const page=await app.browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[],consoleErrors=[],failedRequests=[],badResponses=[],mediaRequests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
   page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()})});
   page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
   page.on('request',r=>{if(/cloudflarestream|\/_videos\//.test(r.url()))mediaRequests.push(r.url())});
   await page.goto(app.url,{waitUntil:'networkidle'});
   await page.waitForTimeout(1500);
   // A repeat load must also avoid all known unavailable media requests.
   await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(1500);
   const a=await page.locator('.slider-track').evaluate(e=>getComputedStyle(e).transform);
   await page.waitForTimeout(350);
   const b=await page.locator('.slider-track').evaluate(e=>getComputedStyle(e).transform);
   await page.screenshot({path:`/work/screenshots/${label}.png`,fullPage:true});
   const result={viewport:{width,height},errors,consoleErrors,failedRequests,badResponses,mediaRequests,
    overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),
    logosLoaded:await page.locator('.logo-set:first-child img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)),
    sliderAnimated:a!==b,heading:await page.locator('h1').innerText(),
    cta:await page.locator('.cta').getAttribute('href'),mediaMode:await page.locator('.hero-media').getAttribute('data-media-mode'),
    mediaStatus:await page.locator('.hero-media').getAttribute('data-playback-status'),videoElements:await page.locator('video').count()};
   await page.locator('.cta').focus();result.ctaKeyboardFocus=await page.locator('.cta').evaluate(e=>e===document.activeElement);
   // Observe native anchor activation without opening an OS email client in headless CI.
   await page.locator('.cta').evaluate(e=>e.addEventListener('click',event=>{event.preventDefault();e.dataset.activated=String(event.isTrusted)},{once:true}));
   await page.keyboard.press('Enter');result.ctaKeyboardActivated=await page.locator('.cta').getAttribute('data-activated')==='true';
   assert.deepEqual([errors,consoleErrors,failedRequests,badResponses,mediaRequests],[[],[],[],[],[]]);
   assert.equal(result.overflow,false);assert.equal(result.logosLoaded,true);assert.equal(result.sliderAnimated,true);
   assert.equal(result.ctaKeyboardFocus,true);assert.equal(result.ctaKeyboardActivated,true);assert.match(result.cta,/^mailto:\?subject=Book/);
   assert.equal(result.mediaMode,'local-approximation');assert.equal(result.mediaStatus,'disabled');assert.equal(result.videoElements,0);
   report[label]=result;await page.close();
  }
  const page=await app.browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(app.url,{waitUntil:'networkidle'});
  const before=await page.locator('.slider-track').evaluate(e=>getComputedStyle(e).transform);
  await page.waitForTimeout(350);
  report.reducedMotion={sliderStopped:before===await page.locator('.slider-track').evaluate(e=>getComputedStyle(e).transform),artStopped:await page.locator('.orbital').evaluateAll(es=>es.every(e=>getComputedStyle(e).animationName==='none'))};
  assert.equal(report.reducedMotion.sliderStopped,true);assert.equal(report.reducedMotion.artStopped,true);
  report.passed=true;
 } finally {fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2)+'\n');await app.close();}
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
