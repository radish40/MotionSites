const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/impressive-hero/';
const root = path.resolve('dist');
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(root, url.slice(base.length) || 'index.html');
  if (!url.startsWith(base) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' }[path.extname(file)];
  const headers = { 'Content-Type': mime || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  if (range) {
    const start = Number(range[1]); const end = range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size }); fs.createReadStream(file).pipe(res);
  }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2800);
      const state = await page.evaluate(() => {
        const video = document.querySelector('video');
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          navLinksVisible: getComputedStyle(document.querySelector('nav > div:nth-child(2)')).display !== 'none',
          headingCharactersVisible: [...document.querySelectorAll('h1 span')].every(s => getComputedStyle(s).opacity === '1'),
          video: { readyState: video.readyState, paused: video.paused, time: video.currentTime, width: video.videoWidth, height: video.videoHeight, muted: video.muted, loop: video.loop },
        };
      });
      assert.equal(state.overflow, false);
      assert.equal(state.navLinksVisible, name === 'desktop');
      assert.equal(state.headingCharactersVisible, true);
      assert.ok(state.video.readyState >= 2 && !state.video.paused && state.video.time > 0);
      assert.equal(errors.length, 0, errors.join('\n'));
      await page.getByRole('link', { name: 'Explore Now' }).hover();
      await page.waitForTimeout(250);
      const hover = await page.getByRole('link', { name: 'Explore Now' }).evaluate(e => ({ background: getComputedStyle(e).backgroundColor, color: getComputedStyle(e).color }));
      assert.equal(hover.background, 'rgb(255, 255, 255)');
      await page.getByRole('link', { name: 'Explore Now' }).click();
      assert.ok(page.url().endsWith('#ventures'));
      if (name === 'desktop') {
        for (const label of ['Story', 'Investing', 'Building', 'Advisory']) await page.getByRole('link', { name: label, exact: true }).click();
      }
      await page.getByRole('button', { name: 'Start a Chat' }).first().click();
      await page.getByRole('button', { name: 'Start a Chat' }).nth(1).click();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(300);
      // Freeze the real video at a reproducible moment for the saved still.
      await page.evaluate(async () => {
        const video = document.querySelector('video'); video.pause(); video.currentTime = 3;
        await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
      });
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      results.push({ viewport: { width, height }, ...state, errors, hover, interactionChecks: 'Navigation anchors and Explore Now target the tagline; both chat buttons accept clicks (no destination supplied in prompt).' });
      await page.close();
    }
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
