import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createServer, base } from './serve.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright-core');
const server=createServer();
await new Promise(resolve=>server.listen(4174,'0.0.0.0',resolve));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const report={checks:[]};
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.route('**/veldara-scroll.mp4',route=>route.request().resourceType()==='fetch' ? route.fulfill({status:503,body:'Intentional frame-fetch failure for fallback check'}) : route.continue());
 await page.goto('http://localhost:4174'+base);
 await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
 await page.waitForFunction(()=>Boolean(document.querySelector('#video-canvas').dataset.frameError));
 await page.evaluate(()=>scrollTo(0,innerHeight*3.8));
 await page.waitForFunction(()=>document.querySelector('video').currentTime>3 && !document.querySelector('video').seeking);
 assert.equal(await page.locator('#video-canvas').evaluate(e=>getComputedStyle(e).visibility),'hidden');
 const time=await page.locator('video').evaluate(v=>v.currentTime);
 report.checks.push({check:'video fallback scrubs when frame preloading fails',passed:true,videoTime:time});
 for(const viewport of [{width:390,height:844},{width:1440,height:1000}]) {
  await page.setViewportSize(viewport);
  for(const fraction of [0,0.1,0.3,0.5,0.7,1]) {
   await page.evaluate(f=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*f),fraction);
   await page.waitForTimeout(60);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const outside=await page.locator('nav a, nav .logo, #fixed-cards .card, #hero .ctas, #hero h1').evaluateAll(elements=>elements.filter(e=>{const r=e.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5;}).map(e=>e.textContent));
   assert.deepEqual(outside,[]);
  }
  report.checks.push({check:'viewport overflow across six scroll positions',passed:true,viewport});
 }
 report.passed=true;
} catch(e) {report.passed=false;report.failure=e.stack;process.exitCode=1;}
finally {await writeFile('screenshots/fallback-checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await browser.close();await new Promise(resolve=>server.close(resolve));}
