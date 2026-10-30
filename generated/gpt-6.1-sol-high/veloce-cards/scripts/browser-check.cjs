const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve('dist');
const prefix = '/motionsites-results/veloce-cards/';
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const file = path.join(root, name.slice(prefix.length) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [a, b] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(a), end = b ? Number(b) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  }
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      console.log(`Checking ${name} ${width}x${height}`);
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [], failedRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      await page.goto(`http://localhost:4173${prefix}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1800);
      const heading = await page.locator('h1').evaluate(el => ({ text: el.textContent, opacity: getComputedStyle(el.parentElement).opacity, filter: getComputedStyle(el.parentElement).filter }));
      assert.equal(heading.opacity, '1');
      assert.equal(heading.filter, 'blur(0px)');
      const cards = page.locator('video').locator('..');
      const videos = [];
      for (let i = 0; i < 3; i++) {
        await cards.nth(i).scrollIntoViewIfNeeded();
        const video = page.locator('video').nth(i);
        await page.waitForFunction(index => {
          const v = document.querySelectorAll('video')[index];
          return v.readyState >= 2 && !v.paused && v.currentTime > 0;
        }, i, { timeout: 20000 });
        const before = await video.evaluate(v => v.currentTime);
        await page.waitForTimeout(700);
        const media = await video.evaluate(v => ({ src: v.currentSrc, time: v.currentTime, width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop, playsInline: v.playsInline }));
        assert(media.time > before && media.muted && media.loop && media.playsInline);
        videos.push(media);
      }
      const bounds = await cards.evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, opacity: getComputedStyle(el).opacity }; }));
      assert(bounds.every(b => b.opacity === '1'));
      assert.deepEqual(bounds.map(b => b.height), [450, 350, 450]);
      if (name === 'desktop') assert(bounds.every(b => b.bottom === bounds[0].bottom));
      else assert(bounds.every(b => b.x === 24 && b.width === 342));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false);
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      assert.equal(errors.length, 0);
      results.push({ name, viewport: { width, height }, heading, bounds, overflow, videos, errors, failedRequests });
      await page.close();
    }
    // Verify the bundled copies work if the original host becomes unavailable.
    const page = await browser.newPage();
    await page.route('https://d8j0ntlcm91z4.cloudfront.net/**', route => route.abort());
    await page.goto(`http://localhost:4173${prefix}`);
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.currentSrc.includes('/assets/') && v.readyState >= 2), null, { timeout: 20000 });
    results.push({ localVideoFallback: 'passed' });
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
