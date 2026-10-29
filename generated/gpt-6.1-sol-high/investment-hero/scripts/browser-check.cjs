const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = {base:'/motionsites-results/investment-hero/', viewports:[], errors:[], failedRequests:[]};
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
  const context=await browser.newContext({viewport, deviceScaleFactor:1});
  const page=await context.newPage();
  await page.addInitScript(()=>{window.splashEnded=false;document.addEventListener('ended',e=>{if(e.target instanceof HTMLVideoElement && e.target.src.includes('splash.mp4')) window.splashEnded=true;},true);});
  page.on('pageerror', e=>report.errors.push(e.message));
  page.on('requestfailed', r=>report.failedRequests.push({url:r.url(),error:r.failure().errorText}));
  const response=await page.goto('http://127.0.0.1:5173'+report.base,{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  await page.waitForSelector('[aria-label="VELORA introduction"]',{state:'detached',timeout:25000});
  assert(await page.evaluate(()=>window.splashEnded));
  await page.evaluate(async()=>{await Promise.all([document.fonts.load('400 24px \"Haboro Norm Regular\"'),...[300,400,500,600].map(w=>document.fonts.load(w+' 16px Geist'))]);await document.fonts.ready;});
  await page.waitForFunction(()=>document.querySelector('video[loop]').readyState>=3);
  // Fix the film frame only for reproducible hero captures.
  await page.evaluate(()=>{let v=document.querySelector('video[loop]');v.pause();v.currentTime=2;});
  await page.waitForTimeout(500);
  assert.equal(await page.title(),'VELORA - Premium Real Estate');
  const media=await page.evaluate(()=>({hero:{width:document.querySelector('video[loop]').videoWidth,height:document.querySelector('video[loop]').videoHeight}, images:[...document.images].map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})),fonts:{haboro:[...document.fonts].some(f=>f.family==='Haboro Norm Regular'&&f.status==='loaded'),geist:[300,400,500,600].every(w=>[...document.fonts].some(f=>f.family==='Geist'&&f.weight===String(w)&&f.status==='loaded'))}}));
  assert(media.hero.width>0);assert(media.images.every(i=>i.loaded));assert(media.fonts.haboro&&media.fonts.geist);
  const noOverflow=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
  assert(await noOverflow());
  const name=viewport.width===1440?'desktop':'mobile';
  await page.screenshot({path:`screenshots/${name}.png`});
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  await page.waitForTimeout(600);
  assert(await page.getByRole('dialog').isVisible());
  assert.equal(await page.getByRole('button',{name:'Close menu'}).evaluate(el=>el.parentElement.offsetWidth),56);
  assert(await noOverflow());
  await page.screenshot({path:`screenshots/${name}-menu.png`});
  assert.equal(await page.locator('a[href="mailto:hello@velora.com"]').count(),2);
  await page.keyboard.press('Escape');await page.waitForTimeout(400);
  assert.equal(await page.getByRole('dialog').count(),0);
  await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(450);
  await page.mouse.click(10,10);await page.waitForTimeout(400);assert.equal(await page.getByRole('dialog').count(),0);
  await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(450);
  await page.getByRole('button',{name:'Properties',exact:true}).click();await page.waitForTimeout(1500);
  assert(Math.abs(await page.evaluate(()=>scrollY/(document.documentElement.scrollHeight-innerHeight))-.34)<.01);
  for(const p of [.03,.11,.34,.5,.64,.78,.84,1]) {
   await page.evaluate(p=>scrollTo(0,p*(document.documentElement.scrollHeight-innerHeight)),p);
   await page.waitForTimeout(120);
   assert(await noOverflow());
   const actual=Number(await page.locator('[data-progress]').getAttribute('data-progress'));
   assert(Math.abs(actual-p)<.003);
   if([.5,.78,1].includes(p)) await page.screenshot({path:`screenshots/${name}-gallery-${p}.png`});
  }
  await page.getByRole('button',{name:'Back to home'}).click();await page.waitForTimeout(1600);assert.equal(await page.evaluate(()=>scrollY),0);
  if(viewport.width===1440){await page.getByRole('button',{name:'GET IN TOUCH',exact:true}).click();await page.waitForTimeout(500);assert(await page.getByRole('dialog').isVisible());}
  report.viewports.push({viewport,media,splash:'ended and unmounted',menu:'open, morph, Escape, backdrop close, Properties navigation, contact links, home return passed',scroll:'all eight phases and overflow checks passed',screenshot:`screenshots/${name}.png`});
  await context.close();
 }
 await browser.close();
 fs.writeFileSync('browser-report.json',JSON.stringify(report,null,2));
 assert.equal(report.errors.length,0);
 assert(report.failedRequests.every(r=>r.error==='net::ERR_ABORTED'&&r.url.endsWith('.mp4')));
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
