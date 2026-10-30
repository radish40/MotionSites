const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.route('https://**/*',route=>route.abort());
 await page.goto('http://localhost:4173/motionsites-results/vitara-hero/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
 const result=await page.evaluate(async()=>{await document.fonts.ready;const v=document.querySelector('video');return {videoSource:v.currentSrc,videoPlaying:!v.paused,videoReady:v.readyState,fontLoaded:document.fonts.check('400 16px "Inria Serif"'),reducedMotionOpacity:getComputedStyle(document.querySelector('.animated-word')).opacity};});
 if(!result.videoSource.includes('/assets/vitara-hero.mp4')||!result.videoPlaying||!result.fontLoaded||result.reducedMotionOpacity!=='1')throw Error(JSON.stringify(result));
 fs.writeFileSync('screenshots/fallback-checks.json',JSON.stringify(result,null,2));
 console.log(result);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
