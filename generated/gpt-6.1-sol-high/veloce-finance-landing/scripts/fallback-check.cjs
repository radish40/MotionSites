const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.route('https://d8j0ntlcm91z4.cloudfront.net/**',r=>r.abort());
 await page.route('https://images.higgs.ai/**',r=>r.abort());
 await page.goto('http://127.0.0.1:4173/motionsites-results/veloce-finance-landing/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2)&&[...document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0));
 const result=await page.evaluate(()=>({videos:[...document.querySelectorAll('video')].map(v=>({source:v.currentSrc,ready:v.readyState})),images:[...document.querySelectorAll('img')].map(i=>({source:i.currentSrc,loaded:i.naturalWidth>0}))}));
 assert.ok(result.videos.every(v=>v.source.includes('/assets/')&&v.ready>=2));
 assert.ok(result.images.every(i=>i.source.includes('/assets/')&&i.loaded));
 fs.writeFileSync('/work/screenshots/fallback-report.json',JSON.stringify(result,null,2));
 console.log('All four videos and both badge images recovered using local assets.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
