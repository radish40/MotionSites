const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/securify-hero/';
const root = path.resolve('dist');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const filename = path.resolve(root, pathname.slice(base.length) || 'index.html');
  if (!filename.startsWith(root + '/') || !fs.existsSync(filename)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(filename).size;
  const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  const headers = { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (range) {
    const start = Number(range[1]);
    const end = range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${size}` });
    fs.createReadStream(filename, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(filename).pipe(res);
  }
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const report = { base, viewports: [], fallback: null };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [], failedRequests = [], badResponses = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() }); });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3, { timeout: 60000 });
      await page.waitForFunction(() => document.querySelector('video').currentTime > 0.2);
      const video = await page.evaluate(() => {
        const v = document.querySelector('video');
        return { src: v.currentSrc, width: v.videoWidth, height: v.videoHeight, duration: v.duration, paused: v.paused, loop: v.loop, muted: v.muted, playsInline: v.playsInline, time: v.currentTime };
      });
      assert(video.width > 0 && !video.paused && video.loop && video.muted && video.playsInline);
      await page.waitForTimeout(400);
      assert(await page.locator('video').evaluate((v, t) => v.currentTime > t, video.time));
      const layout = await page.evaluate(() => ({
        width: innerWidth, height: innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        font: getComputedStyle(document.body).fontFamily,
        loadedFonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.weight),
        headings: [...document.querySelectorAll('h1')].map(el => ({ text: el.textContent, size: getComputedStyle(el).fontSize })),
        visibleDividers: [...document.querySelectorAll('span[aria-hidden]')].filter(el => getComputedStyle(el).display !== 'none').length,
      }));
      assert.equal(layout.scrollWidth, width);
      assert.equal(layout.scrollHeight, height);
      assert(layout.loadedFonts.includes('400') && layout.loadedFonts.includes('500'));
      assert.equal(layout.visibleDividers, name === 'desktop' ? 3 : 0);
      assert.deepEqual(layout.headings.map(h => h.text), ['protect', 'your', 'data']);
      const links = page.locator('nav > div');
      assert.equal(await links.isVisible(), name === 'desktop');
      if (name === 'desktop') {
        const link = page.getByRole('link', { name: 'solutions', exact: true });
        await link.hover();
        await page.waitForTimeout(200);
        assert.equal(await link.evaluate(el => getComputedStyle(el).color), 'rgb(255, 255, 255)');
        for (const label of ['platform', 'solutions', 'company', 'support']) {
          await page.getByRole('link', { name: label, exact: true }).click();
          assert.equal(new URL(page.url()).hash, `#${label}`);
        }
      }
      const button = page.getByRole('button', { name: 'get started' });
      await button.hover();
      await page.waitForTimeout(200);
      assert.equal(await button.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(229, 229, 229)');
      await button.click();
      await button.focus();
      assert(await button.evaluate(el => document.activeElement === el));
      await page.mouse.move(width / 2, height / 2);
      await button.evaluate(el => el.blur());
      await page.evaluate(() => { history.replaceState(null, '', location.pathname); const v = document.querySelector('video'); v.pause(); v.currentTime = 1; });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      assert.deepEqual(errors, []);
      assert.deepEqual(badResponses, []);
      report.viewports.push({ name, width, height, video, layout, errors, failedRequests, badResponses, interactionChecks: 'navigation fragments, CTA hover/click/focus, responsive visibility passed; CTA has no supplied destination' });
      await page.close();
    }
    const page = await browser.newPage();
    await page.route('https://d8j0ntlcm91z4.cloudfront.net/**', route => route.abort());
    await page.goto(`http://127.0.0.1:4173${base}`);
    await page.waitForFunction(() => document.querySelector('video').currentTime > 0.1, { timeout: 30000 });
    report.fallback = await page.locator('video').evaluate(v => ({ src: v.currentSrc, playing: !v.paused, width: v.videoWidth }));
    assert(report.fallback.src.includes(base + 'assets/securify-background.mp4'));
    assert(report.fallback.playing && report.fallback.width > 0);
    await page.close();
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
