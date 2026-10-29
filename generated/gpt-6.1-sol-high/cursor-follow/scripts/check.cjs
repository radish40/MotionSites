const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/cursor-follow/';
const root = path.resolve('dist');
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(root, pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' }[path.extname(file)] || 'application/octet-stream';
  const headers = { 'Content-Type': mime, 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [, startString, endString] = /bytes=(\d+)-(\d*)/.exec(req.headers.range);
    const start = Number(startString), end = endString ? Number(endString) : size - 1;
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
  const errors = [], assetIssues = [], checks = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => assetIssues.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on('response', response => { if (response.status() >= 400) assetIssues.push({ url: response.url(), status: response.status() }); });
    await page.goto(`http://127.0.0.1:4173${base}`);
    await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && Number.isFinite(v.duration); });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), 'Orbis.Nft');
    const initial = await page.locator('video').evaluate(v => ({ paused: v.paused, time: v.currentTime, duration: v.duration, width: v.videoWidth, height: v.videoHeight }));
    assert.equal(initial.paused, true);
    assert.equal(initial.time, 0);
    assert(initial.width > 0);
    checks.push({ name: 'Video decoded, paused at zero, no autoplay', ...initial });
    const fonts = await page.evaluate(() => ({ Anton: document.fonts.check('90px Anton'), Condiment: document.fonts.check('48px Condiment') }));
    assert(fonts.Anton && fonts.Condiment);
    checks.push({ name: 'Google Fonts loaded', ...fonts });
    const layout = async () => page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: innerHeight, scrollHeight: document.documentElement.scrollHeight }));
    let dimensions = await layout();
    assert.equal(dimensions.scrollWidth, 1440);
    assert.equal(dimensions.scrollHeight, 1000);
    checks.push({ name: 'Desktop 1440x1000, no overflow', ...dimensions });
    await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
    await page.mouse.move(100, 500);
    await page.mouse.move(1100, 500, { steps: 30 });
    const expected = (1000 / 1440) * 0.8 * initial.duration;
    await page.waitForFunction(t => Math.abs(document.querySelector('video').currentTime - t) < 0.02, expected);
    const forward = await page.locator('video').evaluate(v => v.currentTime);
    await page.mouse.move(400, 500, { steps: 20 });
    const reverseExpected = (300 / 1440) * 0.8 * initial.duration;
    await page.waitForFunction(t => Math.abs(document.querySelector('video').currentTime - t) < 0.02, reverseExpected);
    const reverse = await page.locator('video').evaluate(v => v.currentTime);
    await page.mouse.move(0, 500, { steps: 10 });
    await page.waitForFunction(() => document.querySelector('video').currentTime < 0.02);
    // Synthetic deltas verify accumulation and the upper clamp across repeated sweeps.
    await page.evaluate(() => {
      for (let i = 0; i < 4; i++) {
        window.dispatchEvent(new Event('blur'));
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0 }));
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: innerWidth }));
      }
    });
    await page.waitForFunction(() => { const v = document.querySelector('video'); return Math.abs(v.currentTime - v.duration) < 0.02; });
    checks.push({ name: 'Forward/reverse scrub, rapid seek chaining, lower/upper clamps', sensitivity: 0.8, forward, reverse, upper: initial.duration });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
    await page.evaluate(() => document.fonts.ready);
    dimensions = await layout();
    assert.equal(dimensions.scrollWidth, 390);
    assert.equal(dimensions.scrollHeight, 844);
    await page.getByRole('button', { name: 'Open menu' }).waitFor();
    await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
    checks.push({ name: 'Mobile 390x844, no overflow', ...dimensions });
    await page.getByRole('button', { name: 'Open menu' }).click();
    assert.equal(await page.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('#mobile-menu button').count(), 6);
    await page.screenshot({ path: 'screenshots/mobile-menu.png', fullPage: true });
    await page.locator('#mobile-menu').getByRole('button', { name: 'Science' }).click();
    assert.equal(await page.locator('#mobile-menu').count(), 0);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-menu').count(), 0);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('#mobile-menu').getByRole('button', { name: 'Reserve Yours' }).click();
    assert.equal(await page.locator('#mobile-menu').count(), 0);
    checks.push({ name: 'Mobile menu opens, closes, item/CTA dismissal and Escape', passed: true });
    assert.deepEqual(errors, []);
    checks.push({ name: 'No browser console or script errors', passed: true });
    fs.writeFileSync('screenshots/checks.json', JSON.stringify({ checks, errors, assetIssues }, null, 2) + '\n');
    console.log(JSON.stringify({ checks, errors, assetIssues }, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
