const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');

const base = '/motionsites-results/fun-404-page/';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!route.startsWith(base)) { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<title>Home destination fixture</title>'); return; }
  const target = path.join('/work/dist', route.slice(base.length) || 'index.html');
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const results = { viewports: [], script_errors: [], failed_requests: [], interaction_checks: [] };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => results.script_errors.push(error.message));
      page.on('requestfailed', request => results.failed_requests.push({ viewport: name, url: request.url(), failure: request.failure() }));
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3, { timeout: 45000 });
      await page.waitForTimeout(1200);
      const metrics = await page.evaluate(() => {
        const video = document.querySelector('video');
        return {
          viewport: { width: innerWidth, height: innerHeight },
          document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
          font: document.fonts.check('500 20px Inter'),
          video: { readyState: video.readyState, width: video.videoWidth, height: video.videoHeight, playing: !video.paused, currentTime: video.currentTime, source: video.currentSrc },
          scale: document.querySelector('[aria-hidden="true"] > div').style.transform,
        };
      });
      assert.equal(metrics.document.width, width);
      assert.equal(metrics.document.height, height);
      assert(metrics.video.playing && metrics.video.currentTime > 0);
      assert(metrics.font);
      await page.screenshot({ path: `/work/screenshots/${name}.png` });
      await page.setViewportSize({ width, height: height - 100 });
      await page.waitForTimeout(100);
      const resizedScale = await page.evaluate(() => document.querySelector('[aria-hidden="true"] > div').style.transform);
      assert.notEqual(resizedScale, metrics.scale);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(100);
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.waitForTimeout(850);
      await assert.doesNotReject(() => page.getByRole('dialog').waitFor({ state: 'visible' }));
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      assert.equal(await page.getByRole('navigation', { name: 'Menu navigation', exact: true }).getByRole('link').count(), 5);
      await page.screenshot({ path: `/work/screenshots/${name}-menu.png` });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), height);
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Close menu');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'TinyTrails home');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Back to Home');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'TinyTrails home');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(550);
      assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.waitForTimeout(550);
      await page.getByRole('button', { name: 'Close menu' }).click();
      await page.waitForTimeout(550);
      if (name === 'desktop') {
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.waitForTimeout(550);
        await page.mouse.click(100, 500);
        await page.waitForTimeout(550);
        assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
      }
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.waitForTimeout(850);
      await page.getByRole('navigation', { name: 'Menu navigation', exact: true }).getByRole('link', { name: 'Programs' }).click();
      await page.waitForURL('http://localhost:4173/#programs');
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.getByRole('main').getByRole('link', { name: 'Back to Home' }).click();
      await page.waitForURL('http://localhost:4173/');
      results.viewports.push({ name, ...metrics });
      results.interaction_checks.push(`${name}: resize recalculation, open, close, Escape, focus trap, scroll lock, no menu overflow, navigation destination, home destination${name === 'desktop' ? ', backdrop dismissal' : ''}`);
      await page.close();
    }
    const fallbackPage = await browser.newPage();
    await fallbackPage.route('https://d8j0ntlcm91z4.cloudfront.net/**', route => route.abort());
    await fallbackPage.goto(`http://localhost:4173${base}`);
    await fallbackPage.waitForFunction(() => document.querySelector('video').readyState >= 3);
    results.local_video_fallback = await fallbackPage.locator('video').evaluate(video => ({ source: video.currentSrc, playing: !video.paused }));
    assert(results.local_video_fallback.source.includes('/assets/tinytrails-404.mp4'));
    await fallbackPage.close();
    assert.equal(results.script_errors.length, 0);
    results.status = 'passed';
    fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
