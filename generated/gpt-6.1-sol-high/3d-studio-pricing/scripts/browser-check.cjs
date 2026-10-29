const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/3d-studio-pricing/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404); return res.end(); }
  const relative = pathname.slice(prefix.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const report = { pageErrors: [], failedRequests: [], responses: [], viewports: [] };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['tablet', 768, 1024], ['small-desktop', 1024, 900]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.pageErrors.push({ viewport: name, message: error.message }));
      page.on('requestfailed', request => report.failedRequests.push({ viewport: name, url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) report.responses.push({ url: response.url(), status: response.status() }); });
      await page.goto(`http://localhost:4173${prefix}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      const switchControl = page.getByRole('switch');
      assert.equal(await switchControl.getAttribute('aria-checked'), 'true');
      await switchControl.click();
      assert.equal(await switchControl.getAttribute('aria-checked'), 'false');
      assert.match(await page.getByRole('link', { name: 'Start a brief by email' }).getAttribute('href'), /Cinematic%20fidelity%3A%20No/);
      await switchControl.focus();
      await page.keyboard.press('Space');
      assert.equal(await switchControl.getAttribute('aria-checked'), 'true');
      await page.locator('h1').click();
      const measurements = await page.evaluate(async () => {
        const video = document.querySelector('video');
        await Promise.race([new Promise(resolve => video.readyState >= 2 ? resolve() : video.addEventListener('loadeddata', resolve, { once: true })), new Promise(resolve => setTimeout(resolve, 20000))]);
        return {
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          fontLoaded: document.fonts.check('300 16px Geist'),
          loadedFontFaces: [...document.fonts].filter(font => font.family === 'Geist' && font.status === 'loaded').length,
          video: { readyState: video.readyState, paused: video.paused, currentTime: video.currentTime, width: video.videoWidth, height: video.videoHeight, error: video.error?.message || null, objectPosition: getComputedStyle(video).objectPosition },
          cardHeight: document.querySelector('.backdrop-blur-md').getBoundingClientRect().height,
          featureCount: document.querySelectorAll('li').length,
          ctaVisible: (() => { const r = document.querySelector('a').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })(),
        };
      });
      assert.equal(measurements.scrollWidth, width, 'No horizontal overflow');
      assert.equal(measurements.featureCount, 4);
      assert.ok(measurements.fontLoaded && measurements.loadedFontFaces > 0, 'Geist is loaded');
      assert.ok(measurements.video.readyState >= 2 && !measurements.video.paused && measurements.video.currentTime > 0, 'Video autoplays');
      assert.equal(measurements.video.error, null);
      assert.ok(measurements.ctaVisible, 'CTA visible within viewport');
      if (name === 'desktop') assert.equal(measurements.cardHeight, 340);
      if (measurements.video.readyState >= 2) {
        await page.evaluate(async () => {
          const video = document.querySelector('video');
          video.pause();
          video.currentTime = 3;
          await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
        });
      }
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      report.viewports.push({ name, width, height, ...measurements, toggleClick: 'passed', toggleKeyboard: 'passed', briefLink: 'passed' });
      await page.close();
    }
    assert.equal(report.pageErrors.length, 0);
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
