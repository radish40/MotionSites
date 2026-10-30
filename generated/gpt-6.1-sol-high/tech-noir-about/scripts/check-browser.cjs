const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/tech-noir-about/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.ttf':'font/ttf', '.png':'image/png', '.webm':'video/webm', '.svg':'image/svg+xml' };
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.resolve('dist', relative || 'index.html');
  if (!file.startsWith(path.resolve('dist') + path.sep)) {res.writeHead(403).end(); return;}
  fs.readFile(file, (error, data) => { if(error) {res.writeHead(404).end(); return;} res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'}); res.end(data); });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox'] });
  const results = {};
  for (const [name, size] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
    const page = await browser.newPage({viewport:size,deviceScaleFactor:1});
    const errors = [], failedRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => failedRequests.push({url:r.url(),failure:r.failure()?.errorText}));
    await page.goto('http://127.0.0.1:4173' + base, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    await page.locator('video').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const before = await page.locator('video').evaluate(v => v.currentTime);
    await page.waitForTimeout(800);
    const metrics = await page.evaluate(() => {
      const video = document.querySelector('video');
      const sig = [...document.querySelectorAll('div')].find(d=>d.textContent==='S.P.D');
      return {title:document.title, viewport:{width:innerWidth,height:innerHeight}, document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}, horizontalOverflow:document.documentElement.scrollWidth>innerWidth, background:getComputedStyle(document.querySelector('section')).backgroundColor, signatureFont:getComputedStyle(sig).fontFamily, fontsLoaded:[...document.fonts].filter(f=>f.status === 'loaded').map(f=>({font:f.family,weight:f.weight,status:f.status})), logo:{x:document.querySelector('svg').getBoundingClientRect().x,y:document.querySelector('svg').getBoundingClientRect().y + scrollY,width:80,height:80},video:{autoplay:video.autoplay,error:video.error?.message,readyState:video.readyState,paused:video.paused,muted:video.muted,loop:video.loop,playsInline:video.playsInline,width:video.videoWidth,height:video.videoHeight,currentTime:video.currentTime,objectFit:getComputedStyle(video).objectFit}, bodyText:document.body.innerText};
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
    await page.screenshot({path:`screenshots/${name}-viewport.png`});
    // Scroll to the media and check native, uncropped layout and continuing playback.
    await page.locator('video').scrollIntoViewIfNeeded();
    metrics.video.playbackAdvanced = metrics.video.currentTime > before;
    metrics.scrollReachedMedia = await page.locator('video').isVisible();
    results[name] = {...metrics,errors,failedRequests};
    await page.close();
  }
  const reduced = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reduced.goto('http://127.0.0.1:4173' + base,{waitUntil:'networkidle'});
  await reduced.waitForTimeout(1000);
  results.reducedMotion = await reduced.locator('video').evaluate(v => ({paused:v.paused,autoPlay:v.autoplay}));
  await reduced.close();
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
  await browser.close(); server.close();
  const passed = ['desktop','mobile'].every(n=>!results[n].horizontalOverflow && results[n].errors.length===0 && results[n].video.readyState>=2 && results[n].video.playbackAdvanced) && results.reducedMotion.paused;
  if(!passed) process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
