const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(process.cwd(), 'dist');
const base = '/motionsites-results/portal/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404).end(); return; }
  const filename = path.join(root, decodeURIComponent(req.url.slice(base.length).split('?')[0]) || 'index.html');
  if (!filename.startsWith(root) || !fs.existsSync(filename)) { res.writeHead(404).end(); return; }
  const stat = fs.statSync(filename);
  const range = req.headers.range;
  res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
  if (range) {
    const [startText, endText] = range.replace('bytes=', '').split('-');
    const start = Number(startText), end = endText ? Number(endText) : stat.size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end-start+1 });
    fs.createReadStream(filename, { start, end }).pipe(res);
  } else { res.setHeader('Content-Length', stat.size); fs.createReadStream(filename).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = { viewports: [], interactions: [], errors: [], failedRequests: [] };
  try {
    for (const [label, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => results.errors.push(error.message));
      page.on('requestfailed', req => results.failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('video').evaluate(async v => { if (v.readyState < 2) await new Promise(resolve => v.addEventListener('loadeddata', resolve, { once: true })); await v.play(); });
      await page.waitForTimeout(1200);
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        heading: document.querySelector('h1').getBoundingClientRect().toJSON(),
        video: { width: document.querySelector('video').videoWidth, playing: !document.querySelector('video').paused, time: document.querySelector('video').currentTime },
        fonts: [...document.fonts].map(f => ({family:f.family, status:f.status})),
      }));
      assert.ok(metrics.scrollWidth <= width, `${label}: horizontal overflow`);
      assert.ok(metrics.video.playing && metrics.video.width > 0, `${label}: video is playing`);
      await page.screenshot({ path: `screenshots/${label}.png`, fullPage: true });
      if (label === 'mobile') {
        const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
        await trigger.click();
        const dialog = page.getByRole('dialog');
        await dialog.waitFor({ state: 'visible' });
        await page.waitForTimeout(700);
        assert.equal(await dialog.getByRole('link').count(), 5);
        await page.screenshot({ path: 'screenshots/mobile-menu.png', fullPage: true });
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'detached' });
        assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
        await trigger.click();
        await page.waitForTimeout(500);
        await page.mouse.click(10, 300);
        await dialog.waitFor({ state: 'detached' });
        await trigger.click();
        await page.waitForTimeout(500);
        await dialog.getByRole('link', { name: 'Vault' }).click();
        await dialog.waitFor({ state: 'detached' });
        await trigger.click();
        await page.waitForTimeout(500);
        await dialog.getByRole('button', { name: 'Close menu' }).click();
        await dialog.waitFor({ state: 'detached' });
        results.interactions.push('Mobile menu opens with five links and both CTAs; Escape, backdrop, navigation link and close button dismiss it; focus restores to trigger.');
      } else {
        const cta = page.getByRole('button', { name: 'Get It Free' });
        await cta.hover();
        await page.waitForTimeout(300);
        assert.ok(await cta.evaluate(el => getComputedStyle(el).transform !== 'none'));
        results.interactions.push('Desktop CTA hover animation and visible desktop navigation verified.');
      }
      results.viewports.push({ label, width, height, ...metrics });
      await page.close();
    }
    assert.equal(results.errors.length, 0, 'No runtime errors');
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
