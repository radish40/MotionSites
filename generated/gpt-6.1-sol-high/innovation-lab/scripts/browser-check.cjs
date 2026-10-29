const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/innovation-lab/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]);
  if (!relative.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(process.cwd(), 'dist', relative.slice(base.length) || 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${base}`, viewports: [], errors: [], failedRequests: [], abortedMediaRequests: [], assetResponses: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
      page.on('requestfailed', req => {
        const entry = { url: req.url(), failure: req.failure() };
        if (req.url().endsWith('.mp4') && req.failure()?.errorText === 'net::ERR_ABORTED') report.abortedMediaRequests.push(entry);
        else report.failedRequests.push(entry);
      });
      page.on('response', response => { if (/google|gstatic|cloudfront/.test(response.url())) report.assetResponses.push({ url: response.url(), status: response.status() }); });
      await page.goto(report.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3, { timeout: 60000 });
      await page.waitForTimeout(2200);
      const before = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(300);
      const state = await page.evaluate(() => {
        const v = document.querySelector('video');
        return { title: document.title, width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, fontLoaded: document.fonts.check('400 16px Inter'), video: { currentTime: v.currentTime, paused: v.paused, width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop, playsInline: v.playsInline }, heading: document.querySelector('h1').innerText };
      });
      assert.equal(state.title, 'VortxLab Creations');
      assert.equal(state.scrollWidth, viewport.width);
      assert.equal(state.scrollHeight, viewport.height);
      assert(state.fontLoaded);
      assert(state.video.currentTime > before && !state.video.paused);
      assert(state.video.muted && state.video.loop && state.video.playsInline);
      const desktop = viewport.width >= 768;
      assert.equal(await page.getByRole('button', { name: 'Neural Synergy' }).isVisible(), desktop);
      assert.equal(await page.locator('aside').isVisible(), desktop);
      const discover = page.getByRole('button', { name: 'Discover Now' });
      await discover.hover();
      await page.waitForTimeout(200);
      const transform = await discover.locator('svg').evaluate(el => getComputedStyle(el).transform);
      assert.equal(transform, 'matrix(1, 0, 0, 1, 4, 0)');
      await discover.click();
      for (const label of ['X (Twitter)', 'LinkedIn', 'Facebook']) await page.getByRole('button', { name: label, exact: true }).click();
      if (desktop) {
        await page.getByRole('button', { name: 'Neural Synergy' }).click();
        await page.getByRole('button', { name: 'Cyber Synthesis' }).click();
      }
      await discover.focus();
      await page.keyboard.press('Tab');
      assert(await page.evaluate(() => document.activeElement.tagName === 'BUTTON'));
      await page.mouse.move(0, 0);
      await page.evaluate(async () => {
        document.activeElement.blur();
        const v = document.querySelector('video');
        v.pause();
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Video seek timed out')), 30000);
          v.addEventListener('seeked', () => { clearTimeout(timer); resolve(); }, { once: true });
          v.currentTime = 4;
        });
        await document.fonts.ready;
      });
      await page.waitForTimeout(1000);
      assert.equal(await discover.evaluate(el => getComputedStyle(el).color), 'rgb(0, 0, 0)');
      const screenshot = `screenshots/${desktop ? 'desktop' : 'mobile'}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      report.viewports.push({ ...state, screenshot, checks: ['no horizontal or vertical overflow', 'video autoplay advances; muted, loop, inline enabled', 'Inter loaded', 'responsive element visibility', 'Discover arrow hover transition', 'all visible controls clickable', 'keyboard button focus'] });
      await page.close();
    }
    assert.equal(report.errors.length, 0);
    assert.equal(report.failedRequests.length, 0);
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.failure = error.stack;
    process.exitCode = 1;
  } finally {
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
    server.close();
  }
})();
