const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');

const base = '/motionsites-results/wellbeing-os/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const stat = fs.statSync(file);
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [startText, endText] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(startText);
    const end = endText ? Math.min(Number(endText), stat.size - 1) : stat.size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...headers, 'Content-Length': stat.size });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${base}`, checks: [], errors: [], failedRequests: [], cancelledMediaRequests: [], assets: {} };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
    page.on('requestfailed', request => {
      const failure = { url: request.url(), error: request.failure()?.errorText };
      if (failure.error === 'net::ERR_ABORTED' && request.resourceType() === 'media') report.cancelledMediaRequests.push(failure);
      else report.failedRequests.push(failure);
    });
    await page.goto(report.url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => { const video = document.querySelector('video'); return video.readyState >= 2 && video.currentTime > 0 && !video.paused; }, { timeout: 30000 });
    report.assets = await page.evaluate(() => ({ video: { src: document.querySelector('video').currentSrc, autoplay: !document.querySelector('video').paused, muted: document.querySelector('video').muted, loop: document.querySelector('video').loop, width: document.querySelector('video').videoWidth, height: document.querySelector('video').videoHeight }, fonts: [...document.fonts].map(font => ({ family: font.family, status: font.status })) }));
    assert.equal(await page.locator('section').count(), 1);
    assert.equal(await page.locator('h1').innerText(), 'Bridge the\ngaps. Ditch the\ngrindwork.');
    for (const [label, item] of [['Product', 'Connections'], ['Solutions', 'Guides'], ['About', 'Our story']]) {
      const button = page.getByRole('button', { name: label, exact: true }).first();
      await button.hover();
      await page.getByRole('button', { name: item, exact: true }).first().waitFor({ state: 'visible' });
      assert.equal(await button.getAttribute('aria-expanded'), 'true');
      await page.waitForTimeout(220);
      const box = await page.locator(`#dropdown-${label}`).boundingBox();
      const navBox = await button.boundingBox();
      assert.ok(box.y >= navBox.y + navBox.height - 1);
      await page.getByRole('button', { name: item, exact: true }).first().click();
      assert.equal(await button.getAttribute('aria-expanded'), 'false');
    }
    await page.mouse.move(800, 800);
    const product = page.getByRole('button', { name: 'Product', exact: true }).first();
    await product.focus(); await page.keyboard.press('Enter');
    assert.equal(await product.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await product.getAttribute('aria-expanded'), 'false');
    report.checks.push('Desktop dropdown hover, item selection, keyboard toggle, Escape dismissal and absolute placement passed.');
    const dimensions = () => page.evaluate(() => ({ width: innerWidth, height: innerHeight, documentWidth: document.documentElement.scrollWidth, documentHeight: document.documentElement.scrollHeight, sectionHeight: document.querySelector('section').getBoundingClientRect().height }));
    report.desktop = await dimensions();
    assert.equal(report.desktop.documentWidth, 1440);
    assert.equal(report.desktop.documentHeight, 1000);
    await page.evaluate(() => document.activeElement.blur());
    await page.evaluate(async () => { const v = document.querySelector('video'); v.pause(); v.currentTime = 1; await new Promise(resolve => v.addEventListener('seeked', resolve, { once: true })); });
    await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
    await toggle.click();
    await page.waitForTimeout(450);
    assert.equal(await page.locator('#mobile-menu').getAttribute('aria-hidden'), 'false');
    assert.equal(await page.locator('#mobile-menu button').count(), 15);
    await page.screenshot({ path: 'screenshots/mobile-menu.png', fullPage: true });
    await page.locator('#mobile-menu').getByRole('button', { name: 'Connections', exact: true }).click();
    assert.equal(await page.locator('#mobile-menu').getAttribute('aria-hidden'), 'true');
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-menu').getAttribute('aria-hidden'), 'true');
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page.getByRole('button', { name: 'Close menu', exact: true }).click();
    assert.equal(await page.locator('#mobile-menu').getAttribute('aria-hidden'), 'true');
    await page.waitForTimeout(450);
    await page.evaluate(() => document.activeElement.blur());
    report.mobile = await dimensions();
    assert.equal(report.mobile.documentWidth, 390);
    assert.equal(report.mobile.documentHeight, 844);
    await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
    report.checks.push('Mobile menu animation, all navigation entries, item selection and Escape dismissal passed.');
    report.checks.push('Desktop 1440×1000 and mobile 390×844 fill the viewport without document overflow.');
    // Verify the bundled assets independently of the external endpoints.
    await page.route('https://d8j0ntlcm91z4.cloudfront.net/**', route => route.abort());
    await page.route('https://db.onlinewebfonts.com/**', route => route.abort());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('video').currentSrc.includes('/assets/flowpath.mp4') && document.querySelector('video').currentTime > 0);
    await page.evaluate(() => document.fonts.load('16px "Helvetica Now Text Local"'));
    assert.equal(await page.evaluate(() => document.fonts.check('16px "Helvetica Now Text Local"')), true);
    report.checks.push('Local video fallback plays when the specified remote video is deliberately blocked.');
    report.checks.push('Bundled Helvetica Now Text font loads when the remote font provider is deliberately blocked.');
    report.expectedFallbackFailures = report.failedRequests.filter(item => item.url.includes('cloudfront.net') || item.url.includes('onlinewebfonts.com'));
    report.failedRequests = report.failedRequests.filter(item => !report.expectedFallbackFailures.includes(item));
    report.expectedFallbackErrors = report.errors.filter(item => item.includes('ERR_FAILED'));
    report.errors = report.errors.filter(item => !report.expectedFallbackErrors.includes(item));
    assert.equal(report.errors.length, 0);
    assert.equal(report.failedRequests.length, 0);
    report.status = 'passed';
  } finally {
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2) + '\n');
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
