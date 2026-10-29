const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/reveal-hero/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404); res.end(); return; }
  const file = path.join('/work/dist', pathname.slice(prefix.length) || 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { scriptErrors: [], consoleErrors: [], failedRequests: [], responses: [], checks: [] };
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => report.scriptErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), failure: req.failure() }));
  page.on('response', res => { if (/higgs|googleapis|gstatic/.test(res.url())) report.responses.push({ url: res.url(), status: res.status() }); });
  await page.goto('http://localhost:4173' + prefix, { waitUntil: 'networkidle', timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  const assets = await page.evaluate(async () => {
    const urls = [...document.querySelectorAll('section > div[aria-hidden]')].map(el => el.style.backgroundImage.slice(5, -2));
    return Promise.all(urls.map(url => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ url, loaded: true, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ url, loaded: false });
      img.src = url;
    })));
  });
  report.assets = assets;
  report.fontLoaded = await page.evaluate(() => document.fonts.check('500 14px Inter'));
  const layout = async (name, width, height, bottom) => {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(500);
    const metrics = await page.evaluate(() => {
      const section = document.querySelector('section');
      const text = document.querySelector('h1').parentElement.getBoundingClientRect();
      const canvas = document.querySelector('canvas');
      return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, documentHeight: document.documentElement.scrollHeight, heroHeight: section.getBoundingClientRect().height, textBottom: innerHeight - text.bottom, canvas: [canvas.width, canvas.height] };
    });
    assert.equal(metrics.documentWidth, width);
    assert.equal(metrics.documentHeight, height);
    assert.equal(metrics.heroHeight, height);
    assert.equal(metrics.textBottom, bottom);
    assert.deepEqual(metrics.canvas, [width, height]);
    report.checks.push({ name: name + ' layout', passed: true, metrics });
  };
  await layout('desktop', 1440, 1000, 224);
  await page.mouse.move(990, 480);
  await page.waitForFunction(() => document.querySelector('canvas').getContext('2d').getImageData(990, 480, 1, 1).data[3] > 250 && Number(document.querySelector('pattern').getAttribute('x')) > 0, { timeout: 20000 });
  const sample = () => page.evaluate(() => {
    const c = document.querySelector('canvas');
    return { alpha: c.getContext('2d').getImageData(990, 480, 1, 1).data[3], offset: Number(document.querySelector('pattern').getAttribute('x')), mask: document.querySelector('section > div.z-30').style.maskImage.startsWith('url("data:image/png') };
  });
  const near = await sample();
  assert(near.alpha > 250 && near.mask && near.offset > 0);
  await page.screenshot({ path: '/work/screenshots/desktop.png' });
  await page.mouse.move(200, 170);
  await page.waitForFunction(() => document.querySelector('canvas').getContext('2d').getImageData(990, 480, 1, 1).data[3] === 0 && Number(document.querySelector('pattern').getAttribute('x')) < 0, { timeout: 20000 });
  const far = await sample();
  assert(far.alpha === 0 && far.offset < 0);
  report.checks.push({ name: 'cursor spotlight and eased grid movement', passed: true, near, far });
  await layout('tablet', 700, 1000, 48);
  await layout('mobile', 390, 844, 48);
  await page.mouse.move(195, 380);
  await page.waitForTimeout(900);
  await page.screenshot({ path: '/work/screenshots/mobile.png' });
  const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
  await toggle.click();
  assert.equal(await page.getByRole('button', { name: 'Close menu', exact: true }).getAttribute('aria-expanded'), 'true');
  assert(await page.locator('#mobile-menu').isVisible());
  assert.equal(await page.locator('#mobile-menu button').count(), 6);
  await page.screenshot({ path: '/work/screenshots/mobile-menu.png' });
  await page.locator('#mobile-menu').getByRole('button', { name: 'Science', exact: true }).click();
  assert.equal(await page.locator('#mobile-menu').count(), 0);
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-menu').count(), 0);
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('button', { name: 'Close menu', exact: true }).click();
  assert.equal(await page.locator('#mobile-menu').count(), 0);
  report.checks.push({ name: 'mobile menu opens, closes, selects item, and handles Escape', passed: true });
  assert.equal(report.scriptErrors.length, 0);
  assert.equal(report.consoleErrors.length, 0);
  assert.equal(report.failedRequests.length, 0);
  assert(report.fontLoaded && report.assets.every(asset => asset.loaded));
  report.checks.push({ name: 'no browser script errors', passed: true });
  fs.writeFileSync('/work/screenshots/browser-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  server.close();
})().catch(error => { console.error(error); process.exit(1); });
