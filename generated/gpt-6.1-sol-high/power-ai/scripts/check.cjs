const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('assert');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const results = { url: 'http://127.0.0.1:4173/motionsites-results/power-ai/', viewports: [], errors: [], failedRequests: [] };
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
  page.on('pageerror', e => results.errors.push(e.message));
  page.on('requestfailed', r => results.failedRequests.push({url:r.url(),error:r.failure().errorText}));
  await page.goto(results.url, {waitUntil:'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => { const v=document.querySelector('video'); return v.readyState>=3 && v.currentTime>0.6; });
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  const layout = await page.evaluate(() => {
   const video=document.querySelector('video');
   return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,video:{duration:video.duration,currentTime:video.currentTime,paused:video.paused,width:video.videoWidth,height:video.videoHeight,opacity:video.style.opacity},font:Array.from(document.fonts).some(f=>f.family==='General Sans'&&f.status==='loaded'),headlineSize:getComputedStyle(document.querySelector('h1')).fontSize};
  });
  assert.equal(layout.scrollWidth,width,'Horizontal overflow'); assert.equal(layout.scrollHeight,height,'Vertical overflow'); assert(!layout.video.paused); assert(layout.font);
  if(name==='mobile') await page.getByRole('button',{name:'Open menu',exact:true}).click();
  for (const item of ['Features','Solutions','Plans','Learning']) {
   await page.getByRole('button',{name:item,exact:true}).click();
   await page.locator('#nav-panel').waitFor({state:'visible'});
   assert.equal(await page.getByRole('button',{name:item,exact:true}).getAttribute('aria-expanded'),'true');
  }
  await page.keyboard.press('Escape'); assert.equal(await page.locator('#nav-panel').count(),0);
  for(const item of ['Schedule a Consult','Sign Up']) {
   await page.getByRole('button',{name:item,exact:true}).click();
   await page.locator('dialog').waitFor({state:'visible'});
   await page.keyboard.press('Escape'); await page.locator('dialog').waitFor({state:'hidden'});
  }
  const videoLoop = await page.evaluate(async () => {
   const v=document.querySelector('video'); const output={};
   v.pause(); v.currentTime=.2; await new Promise(r=>setTimeout(r,80)); output.fadeIn=Number(v.style.opacity);
   v.currentTime=v.duration-.2; await new Promise(r=>setTimeout(r,80)); output.fadeOut=Number(v.style.opacity);
   v.currentTime=v.duration-.06; await v.play(); await new Promise(r=>setTimeout(r,550)); output.restarted=v.currentTime<1&&!v.paused; return output;
  });
  console.log('Video loop',name,videoLoop); assert(videoLoop.fadeIn>.2&&videoLoop.fadeIn<.6); assert(videoLoop.fadeOut>.2&&videoLoop.fadeOut<.6); assert(videoLoop.restarted);
  const marquee = await page.evaluate(async () => {const el=document.querySelector('.marquee-track');const a=getComputedStyle(el).transform;await new Promise(r=>setTimeout(r,150));return a!==getComputedStyle(el).transform;}); assert(marquee);
  results.viewports.push({name,...layout,checks:{navigation:true,dialogs:true,escape:true,videoLoop,marquee}});
  await page.close();
 }
 assert.equal(results.errors.length,0);
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
