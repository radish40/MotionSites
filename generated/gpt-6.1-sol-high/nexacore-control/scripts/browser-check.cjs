const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/nexacore-control/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const target = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  fs.readFile(target, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${base}`, checks: [], errors: [], failedRequests: [] };
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
    page.on('requestfailed', request => { if (request.failure().errorText !== 'net::ERR_ABORTED') report.failedRequests.push({ url: request.url(), error: request.failure().errorText }); });
    for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
      await page.setViewportSize({width,height});
      await page.goto(report.url, { waitUntil:'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => {
        const video = document.querySelector('video');
        return video.readyState >= 2 && video.currentTime > 0 && !video.paused;
      }, { timeout:45000 });
      const before = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(800);
      const metrics = await page.evaluate(() => {
        const video = document.querySelector('video');
        const box = element => { const r=element.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
        return {
          viewport: {width:innerWidth,height:innerHeight},
          scrollWidth:document.documentElement.scrollWidth,
          pageHeight:document.documentElement.scrollHeight,
          cards:document.querySelectorAll('[data-column] > .flex.flex-col').length,
          columns:Object.fromEntries([...document.querySelectorAll('[data-column]')].map(e=>[e.dataset.column,box(e)])),
          fonts: [400,500].map(weight=>({weight,loaded:document.fonts.check(`${weight} 16px "Mazzard H"`)})),
          images:[...document.images].map(img=>({url:img.src,loaded:img.complete && img.naturalWidth>0})),
          video:{time:video.currentTime,duration:video.duration,width:video.videoWidth,height:video.videoHeight,muted:video.muted,loop:video.loop,paused:video.paused,objectFit:getComputedStyle(video).objectFit},
          animations:document.getAnimations().length,
        };
      });
      assert(metrics.scrollWidth <= width, `${name} horizontal overflow`);
      assert.equal(metrics.cards,10);
      assert(metrics.fonts.every(f=>f.loaded));
      assert(metrics.images.every(i=>i.loaded));
      assert(metrics.video.time > before, 'video must advance');
      assert(metrics.video.muted && metrics.video.loop);
      assert.equal(metrics.animations,0);
      if (name === 'mobile') {
        assert(metrics.columns.video.y < metrics.columns.negatives.y);
        assert(metrics.columns.negatives.y < metrics.columns.positives.y);
        await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
        assert(await page.locator('[data-column="positives"]').isVisible());
        await page.evaluate(()=>window.scrollTo(0,0));
      } else {
        assert(metrics.columns.negatives.x < metrics.columns.video.x);
        assert(metrics.columns.video.x < metrics.columns.positives.x);
      }
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      report.checks.push({name,status:'passed',...metrics});
      if (name === 'desktop') {
        await page.locator('video').evaluate(v => { v.currentTime = v.duration - 0.4; });
        await page.waitForFunction(() => { const v = document.querySelector('video'); return v.currentTime < 2 && !v.paused; }, {timeout:10000});
        report.checks.push({name:'video-loop',status:'passed'});
      }
    }
    for (const width of [320,768,1024,1920]) {
      await page.setViewportSize({width,height:1000});
      const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
      assert(scrollWidth<=width, `overflow at ${width}`);
      report.checks.push({name:`responsive-${width}`,status:'passed',width,scrollWidth});
    }
    assert.equal(report.errors.length,0,'browser errors');
    assert.equal(report.failedRequests.length,0,'failed requests');
    report.status='passed';
  } catch (error) {
    report.status='failed'; report.failure=error.stack; process.exitCode=1;
  } finally {
    fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
    await browser.close(); server.close();
  }
})();
