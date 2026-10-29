const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/orbis-hello/';
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  try {
    const data = fs.readFileSync(file);
    const type = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css' }[path.extname(file)] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type':type}).end(data);
  } catch { res.writeHead(404).end(); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
  const report = [];
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport:{width,height}, deviceScaleFactor:1 });
      const errors = [], failedRequests = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('requestfailed', r => failedRequests.push({url:r.url(), error:r.failure()?.errorText}));
      await page.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle', timeout:60000});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3, {timeout:60000});
      const initialTime = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(1200);
      const state = await page.evaluate(() => {
        const video = document.querySelector('video');
        const heading = document.querySelector('h2');
        const columns = document.querySelectorAll('section > div > div')[1];
        return {
          width:innerWidth, height:innerHeight,
          scrollWidth:document.documentElement.scrollWidth,
          sectionHeight:document.querySelector('section').getBoundingClientRect().height,
          heading:heading.innerText,
          headingFont:getComputedStyle(heading).fontFamily,
          antonLoaded:document.fonts.check('60px Anton'),
          condimentLoaded:document.fonts.check('68px Condiment'),
          rightColumnDisplay:getComputedStyle(columns.lastElementChild).display,
          video:{currentTime:video.currentTime,paused:video.paused,muted:video.muted,loop:video.loop,playsInline:video.playsInline,width:video.videoWidth,height:video.videoHeight,error:video.error?.message || null},
          controls:document.querySelectorAll('button, a, input, [tabindex]').length,
        };
      });
      assert.equal(state.scrollWidth,width,'No horizontal overflow');
      assert.ok(state.sectionHeight >= height,'Full viewport section');
      assert.ok(state.video.currentTime > initialTime && !state.video.paused,'Video autoplays');
      assert.ok(state.video.muted && state.video.loop && state.video.playsInline,'Video attributes');
      assert.ok(state.antonLoaded && state.condimentLoaded,'Both Google fonts loaded');
      assert.equal(state.rightColumnDisplay,name === 'desktop' ? 'flex' : 'none');
      assert.deepEqual(errors,[],'No script errors');
      await page.locator('video').evaluate(async v => {
        v.pause();
        await new Promise(resolve => { v.addEventListener('seeked',resolve,{once:true}); v.currentTime=3; });
      });
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      await page.locator('video').evaluate(v => v.play());
      report.push({name,viewport:{width,height},...state,errors,failedRequests,screenshot:`screenshots/${name}.png`});
      await page.close();
    }
    fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify({passed:true,checks:report},null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
