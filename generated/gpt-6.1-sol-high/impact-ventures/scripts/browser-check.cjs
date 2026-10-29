const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/impact-ventures/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const file = path.join('/work/dist', decodeURIComponent(pathname.slice(base.length)) || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(file);
  const range = req.headers.range;
  if (range) {
    const [startText, endText] = range.replace('bytes=', '').split('-');
    const start = Number(startText), end = endText ? Number(endText) : stat.size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(file).pipe(res);
  }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = { errors: [], failedRequests: [], cancelledVideoRequests: [], checks: [] };
  try {
    for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      const page = await context.newPage();
      page.on('pageerror', error => results.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') results.errors.push(message.text()); });
      page.on('requestfailed', request => {
        const detail = { url: request.url(), error: request.failure().errorText };
        if (request.url().endsWith('.mp4') && detail.error === 'net::ERR_ABORTED') results.cancelledVideoRequests.push(detail);
        else results.failedRequests.push(detail);
      });
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        video: { width: document.querySelector('video').videoWidth, playing: !document.querySelector('video').paused, currentTime: document.querySelector('video').currentTime },
        fonts: { serif: document.fonts.check('16px "Instrument Serif"'), sans: document.fonts.check('300 16px Inter') },
        heroHeight: document.querySelector('main').getBoundingClientRect().height,
      }));
      assert.equal(state.overflow, false);
      assert.equal(state.video.playing, true);
      assert.equal(state.fonts.serif, true);
      assert.equal(state.fonts.sans, true);
      assert.equal(state.heroHeight, viewport.height);
      await page.evaluate(async () => {
        const v = document.querySelector('video');
        v.pause(); v.currentTime = 2;
        await new Promise(resolve => v.addEventListener('seeked', resolve, { once: true }));
      });
      await page.screenshot({ path: `/work/screenshots/${name}.png` });
      await page.evaluate(() => document.querySelector('video').play());
      if (name === 'mobile') {
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.waitForTimeout(1150);
        await page.getByRole('dialog').getByRole('link', { name: 'Expertise', exact: true }).waitFor({ state: 'visible' });
        await page.screenshot({ path: '/work/screenshots/mobile-menu.png' });
        assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(750);
        assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.waitForTimeout(750);
        await page.getByRole('dialog').getByRole('link', { name: 'Projects', exact: true }).click();
        await page.waitForTimeout(750);
        assert.equal(new URL(page.url()).hash, '#projects');
        assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.waitForTimeout(750);
        await page.getByRole('button', { name: 'Close menu' }).click();
        await page.waitForTimeout(750);
        results.checks.push('Mobile menu opens, closes by button and Escape, and closes on navigation.');
      } else {
        await page.getByRole('link', { name: 'See Cases' }).click();
        assert.equal(new URL(page.url()).hash, '#projects');
        await page.getByRole('button', { name: 'Watch Reel' }).click();
        await page.waitForFunction(() => document.fullscreenElement?.tagName === 'VIDEO');
        await page.evaluate(() => document.exitFullscreen());
        results.checks.push('See Cases navigation and Watch Reel fullscreen playback work.');
      }
      results.checks.push({ viewport: name, ...state });
      await context.close();
    }
    assert.equal(results.errors.length, 0, 'Browser errors');
    assert.equal(results.failedRequests.length, 0, 'Failed asset requests');
    fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
