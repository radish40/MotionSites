const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const results = {};
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[]; const failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400) failed.push({url:r.url(),status:r.status()})});
  await page.goto('http://localhost:5173/motionsites-results/ecovolta-hero/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>{const v=document.querySelector('video'); return v.readyState>=3 && v.currentTime>0;},{timeout:20000});
  await page.waitForTimeout(3000);
  results[name]=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,video:{readyState:document.querySelector('video').readyState,playing:!document.querySelector('video').paused,width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight},images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),font:document.fonts.check('400 16px Inter'),heading:document.querySelector('h1').getAttribute('aria-label'),letterOpacity:[...document.querySelectorAll('h1 span span')].every(s=>getComputedStyle(s).opacity==='1')}));
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Pause background video',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('video').paused);
  await page.getByRole('button',{name:'Play background video',exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector('video').paused);
  results[name].playPausePassed=true;
  await page.getByRole('button',{name:'Explore Options',exact:true}).click();
  await page.getByRole('button',{name:'Start Network',exact:true}).click();
  await page.getByRole('button',{name:'Clean Energy',exact:true}).click();
  await page.getByRole('button',{name:'Language: English',exact:true}).click();
  results[name].errors=errors;results[name].failedResponses=failed;
  results[name].noOverflow=results[name].scrollWidth===width&&results[name].scrollHeight===height;
  await page.close();
 }
 await browser.close();
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 if(Object.values(results).some(r=>!r.noOverflow||r.errors.length||r.failedResponses.length||!r.video.playing||r.images.some(i=>!i.loaded)))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
