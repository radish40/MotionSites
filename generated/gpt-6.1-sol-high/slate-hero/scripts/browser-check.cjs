const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/slate-hero/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  let relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  const file = path.join('/work/dist', relative);
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const size = fs.statSync(file).size;
  const type = mime[path.extname(file)] || 'application/octet-stream';
  const range = req.headers.range;
  if (range) {
    const [startString, endString] = range.replace(/bytes=/, '').split('-');
    const start = Number(startString), end = endString ? Number(endString) : size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Content-Type': type });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' }); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const errors = [], failures = [], checks = [];
  try {
    for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }], ['tablet', { width: 768, height: 1024 }]]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`${name}: ${message.text()}`); });
      page.on('requestfailed', req => failures.push(`${name}: ${req.url()} ${req.failure().errorText}`));
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => { const video = document.querySelector('video'); return video.readyState >= 3 && video.currentTime > 0.1 && !video.paused; });
      await page.waitForTimeout(2000);
      assert.equal(await page.locator('h1').count(), 2);
      assert.equal(await page.locator('.split-piece').first().evaluate(e => getComputedStyle(e).opacity), '1');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.getByRole('navigation').isVisible(), name === 'desktop');
      const video = await page.locator('video').first().evaluate(v => ({ width: v.videoWidth, height: v.videoHeight, duration: v.duration, time: v.currentTime, muted: v.muted, loop: v.loop, playsInline: v.playsInline }));
      await page.locator('video').first().evaluate(async v => { v.pause(); v.currentTime = 3; await new Promise(resolve => v.addEventListener('seeked', resolve, { once: true })); });
      if (name !== 'tablet') await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      await page.getByRole('button', { name: 'Read Guide', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#dialog-title').textContent(), 'Read Guide');
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').isVisible(), false);
      await page.getByRole('button', { name: 'Start today', exact: true }).last().click();
      await page.getByLabel('Work email').fill('preview@example.com');
      await page.getByRole('button', { name: 'Continue' }).click();
      assert.match(await page.getByRole('status').textContent(), /not been sent or stored/);
      await page.getByRole('button', { name: 'Close dialog' }).click();
      await page.getByRole('button', { name: 'Watch demo' }).click();
      await page.waitForFunction(() => document.querySelector('dialog video').readyState >= 3);
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('dialog').open && document.querySelector('dialog video').paused);
      if (name === 'desktop') {
        for (const label of ['Our Approach', 'Products', 'Story', 'Resources', 'Billing']) {
          await page.getByRole('button', { name: label, exact: true }).click();
          assert.equal(await page.locator('#dialog-title').textContent(), label);
          await page.keyboard.press('Escape');
        }
      }
      checks.push({ name, viewport, video, horizontalOverflow: false, interactions: 'passed' });
      await page.close();
    }
    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await reduced.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
    assert.equal(await reduced.locator('.split-piece').first().evaluate(e => getComputedStyle(e).opacity), '1');
    assert.equal(await reduced.locator('.hero-fade-up').first().evaluate(e => getComputedStyle(e).opacity), '1');
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    const report = { passed: true, checks, reducedMotion: 'passed', scriptErrors: errors, failedRequests: failures };
    fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
