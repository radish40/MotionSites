const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const server = spawn(process.execPath, ['serve.mjs'], {stdio:'inherit'});
 let browser;
 try {
  await new Promise(r => setTimeout(r, 500));
  browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = {viewports:[], errors:[], failedRequests:[], interactions:[], checks:{}};
  const page = await browser.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()}));
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   await page.setViewportSize({width,height});
   await page.goto('http://localhost:5173/motionsites-results/place-saver/',{waitUntil:'networkidle'});
   await page.waitForSelector('.ze-ready');
   await page.waitForTimeout(3000);
   const state = await page.evaluate(()=>({
    fonts:document.fonts.status,
    garamond:document.fonts.check('300 66px "ITC Garamond Std Narrow"'),
    inter:document.fonts.check('400 16px Inter'),
    videos:[...document.querySelectorAll('video')].map(v=>({readyState:v.readyState,videoWidth:v.videoWidth,currentTime:v.currentTime,paused:v.paused,error:v.error?.message||null})),
    overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight,
    phones:[...document.querySelectorAll('.phone')].map(p=>{const r=p.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}})
   }));
   assert.equal(state.fonts,'loaded'); assert(state.garamond&&state.inter);assert(!state.overflow);
   state.videos.forEach(v=>{assert(v.readyState>=2);assert(v.videoWidth>0);assert(v.currentTime>0);assert(!v.paused);assert.equal(v.error,null)});
   state.phones.forEach(p=>assert(p.x>=0&&p.y>=0&&p.right<=width&&p.bottom<=height));
   await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('video')].map(v=>new Promise(resolve=>{v.pause();v.addEventListener('seeked',resolve,{once:true});v.currentTime=3;})))});
   await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
   report.viewports.push({name,width,height,...state});
   await page.getByRole('button',{name:/Yearly.*200/}).click();
   assert.equal(await page.locator('.yearly').getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('.monthly').getAttribute('aria-pressed'),'false');
   await page.getByRole('button',{name:'Subscribe',exact:true}).click();
   await page.getByRole('dialog').waitFor();assert((await page.locator('#dialog-copy').textContent()).includes('$200 billed yearly'));
   await page.getByRole('button',{name:'Got it'}).click();
   await page.locator('.monthly').click();
   await page.getByRole('button',{name:'Subscribe',exact:true}).click();
   assert((await page.locator('#dialog-copy').textContent()).includes('$20 billed monthly'));
   await page.keyboard.press('Escape');
   await page.getByRole('button',{name:'Continue with Apple',exact:true}).click();
   assert((await page.locator('#dialog-copy').textContent()).includes('Apple sign-in is not connected'));
   await page.getByRole('button',{name:'Got it'}).click();
   await page.getByRole('button',{name:'Terms of Use',exact:true}).click();
   assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');
   report.interactions.push({viewport:name,planSelection:'passed',subscribeMonthly:'passed',subscribeYearly:'passed',apple:'passed',terms:'passed',dialogDismissal:'passed'});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload({waitUntil:'networkidle'});
  report.checks.reducedMotion = await page.evaluate(()=>[...document.querySelectorAll('.animate')].every(x=>getComputedStyle(x).animationName==='none')&&[...document.querySelectorAll('video')].every(v=>v.paused));
  assert(report.checks.reducedMotion);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.route('**/*.mp4',route=>route.abort());
  const start=Date.now();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('.ze-ready',{timeout:6500});
  const elapsed=Date.now()-start;
  report.checks.safetyTimeout={passed:elapsed>=4900&&elapsed<6500,elapsedMs:elapsed};
  assert(report.checks.safetyTimeout.passed);
  // The intentionally aborted video requests verify the safety fallback.
  report.expectedFallbackErrors=report.errors.filter(x=>x.includes('ERR_FAILED'));
  report.errors=report.errors.filter(x=>!x.includes('ERR_FAILED'));
  report.expectedAbortedVideoRequests=report.failedRequests.filter(x=>x.url.endsWith('.mp4') && /ERR_ABORTED|ERR_FAILED/.test(x.error.errorText));
  report.failedRequests=report.failedRequests.filter(x=>!report.expectedAbortedVideoRequests.includes(x));
  assert.equal(report.failedRequests.length,0);
  assert.equal(report.errors.length,0);
  fs.writeFileSync('browser-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
 } finally { if(browser)await browser.close();server.kill(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
