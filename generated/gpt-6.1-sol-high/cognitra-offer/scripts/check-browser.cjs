const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/cognitra-offer/';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(root, decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [, startText, endText] = /bytes=(\d+)-(\d*)/.exec(req.headers.range);
    const start = Number(startText), end = endText ? Number(endText) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const report = { url: `http://localhost:4173${base}`, viewports: [], scriptErrors: [], failedRequests: [], httpErrors: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', e => report.scriptErrors.push(e.message));
      page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
      page.on('response', r => { if (r.status() >= 400) report.httpErrors.push({ url: r.url(), status: r.status() }); });
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2 && !v.paused && v.videoWidth > 0));
      await page.waitForTimeout(1800);
      const before = await page.locator('video').evaluateAll(videos => videos.map(v => v.currentTime));
      await page.waitForTimeout(500);
      const after = await page.locator('video').evaluateAll(videos => videos.map(v => v.currentTime));
      assert(after.every((time, i) => time > before[i]), 'Every video advances');
      // Scroll through every card to exercise the once-only viewport reveals.
      for (const card of await page.locator('.card').all()) {
        await card.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);
        assert.equal(await card.evaluate(el => getComputedStyle(el).opacity), '1');
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const layout = await page.evaluate(() => ({
        viewport: { width: innerWidth, height: innerHeight },
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        sectionHeight: document.querySelector('section').getBoundingClientRect().height,
        columns: getComputedStyle(document.querySelector('.cards')).gridTemplateColumns,
        fontLoaded: document.fonts.check('700 42px "Helvetica Now Var"'),
        background: getComputedStyle(document.querySelector('section')).backgroundColor,
        videos: [...document.querySelectorAll('video')].map(v => ({ width: v.videoWidth, height: v.videoHeight, paused: v.paused, muted: v.muted, loop: v.loop, playsInline: v.playsInline, error: v.error?.message || null })),
      }));
      assert.equal(layout.scrollWidth, viewport.width, 'No horizontal overflow');
      assert.equal(layout.background, 'rgb(197, 197, 197)');
      assert(layout.fontLoaded, 'Font loaded');
      assert.equal(await page.locator('.card').count(), 3);
      if (viewport.width > 900) {
        assert.equal(layout.sectionHeight, viewport.height);
        assert.equal(layout.scrollHeight, viewport.height, 'No desktop vertical overflow');
      }
      await page.screenshot({ path: `screenshots/${viewport.width > 900 ? 'desktop' : 'mobile'}.png`, fullPage: true });
      report.viewports.push(layout);
      await page.close();
    }
    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await reduced.goto(report.url, { waitUntil: 'networkidle' });
    assert.equal(await reduced.locator('h2 span').first().evaluate(el => getComputedStyle(el).opacity), '1');
    report.reducedMotion = 'passed';
    await reduced.close();
    assert.equal(report.scriptErrors.length, 0, 'No script errors');
    assert.equal(report.httpErrors.length, 0, 'No HTTP errors');
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
