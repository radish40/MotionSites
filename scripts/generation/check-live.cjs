const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const [url, output] = process.argv.slice(2);
  if (!url || !output) throw Error('Usage: check-live.cjs URL OUTPUT');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const results = [];
  try {
    for (const [name, viewport] of [['desktop', {width:1440,height:1000}], ['mobile', {width:390,height:844}]]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const errors = [], failedRequests = [], badResponses = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
      page.on('response', response => {if(response.status() >= 400) badResponses.push({url:response.url(),status:response.status()});});
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(5000);
      const layout = await page.evaluate(() => ({
        title: document.title,
        bodyChars: document.body.innerText.trim().length,
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
        images: [...document.images].map(i => {
          const rect=i.getBoundingClientRect();
          return {src:i.currentSrc,loaded:i.complete && i.naturalWidth>0,
            visible:rect.width>0 && rect.height>0 && rect.bottom>0 && rect.top<innerHeight && getComputedStyle(i).visibility!=='hidden'};
        }),
        videos: [...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,readyState:v.readyState,paused:v.paused})),
      }));
      await page.screenshot({ path: path.join(output, `${name}.png`) });
      results.push({ viewport:name,status:response.status(),...layout,errors,failedRequests,badResponses });
      await context.close();
    }
  } finally { await browser.close(); }
  const sameOrigin = target => new URL(target).origin === new URL(url).origin;
  const passed = results.every(r => r.status === 200 && r.bodyChars > 0 && r.horizontalOverflow <= 3 && !r.errors.length &&
    !r.badResponses.some(e=>sameOrigin(e.url)) && !r.images.some(i=>i.visible && !i.loaded));
  const report = { url, checked_at: new Date().toISOString(), passed, results };
  fs.writeFileSync(path.join(output, 'live-check.json'), JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({url,passed,results:results.map(r=>({viewport:r.viewport,status:r.status,
    horizontalOverflow:r.horizontalOverflow,errors:r.errors,
    brokenVisibleImages:r.images.filter(i=>i.visible && !i.loaded),failedRequests:r.failedRequests,badResponses:r.badResponses}))}));
  if (!passed) process.exitCode = 1;
})().catch(error => {console.error(error);process.exitCode=1;});
