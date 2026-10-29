const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/contact-cybernetic/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.ttf': 'font/ttf', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Accept-Ranges', 'bytes');
  if (req.headers.range) {
    const [startStr, endStr] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(startStr), end = endStr ? Number(endStr) : size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.setHeader('Content-Length', size); fs.createReadStream(file).pipe(res); }
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { checks: [], errors: [], failedRequests: [], media: {} };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      page.on('pageerror', e => report.errors.push(`${name}: ${e.message}`));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(`${name}: ${msg.text()}`); });
      page.on('requestfailed', req => report.failedRequests.push({ viewport: name, url: req.url(), error: req.failure()?.errorText }));
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForFunction(() => document.querySelector('h1').textContent === "we'd love to\nhear from you!");
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.animate-blink').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2, { timeout: 30000 });
      report.media[name] = await page.locator('video').evaluate(v => ({ src: v.currentSrc, duration: v.duration, width: v.videoWidth, height: v.videoHeight, paused: v.paused, currentTime: v.currentTime }));
      if (name === 'desktop') {
        assert.equal(report.media[name].paused, true);
        await page.mouse.move(100, 850);
        await page.mouse.move(900, 850, { steps: 15 });
        await page.waitForFunction(() => document.querySelector('video').currentTime > 1 && !document.querySelector('video').seeking);
        report.checks.push('Desktop mouse scrubbing changes the paused video time');
      } else {
        assert.equal(report.media[name].paused, false);
        const startTime = await page.locator('video').evaluate(v => v.currentTime);
        await page.waitForTimeout(500);
        assert.ok(await page.locator('video').evaluate(v => v.currentTime) > startTime);
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.waitForTimeout(350);
        assert.equal(await page.locator('#mobile-navigation').evaluate(v => v.inert), false);
        assert.equal(await page.evaluate(() => document.elementFromPoint(70, 330).closest('#mobile-navigation') !== null), true);
        await page.screenshot({ path: 'screenshots/mobile-menu.png', fullPage: false });
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Get in touch' }).click();
        assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
        report.checks.push('Mobile video autoplays; overlay displays above content, Escape and links close menu');
      }
      const brand = page.getByRole('button', { name: 'Brand', exact: true });
      const digital = page.getByRole('button', { name: 'Digital', exact: true });
      await brand.click();
      await digital.click();
      await page.waitForTimeout(400);
      assert.equal(await brand.getAttribute('aria-pressed'), 'true');
      assert.equal(await digital.getAttribute('aria-pressed'), 'true');
      assert.ok((await page.locator('[aria-live]').innerText()).includes('Brand, Digital'));
      assert.ok((await page.getByRole('link', { name: "Let's Go" }).getAttribute('href')).includes('Brand%2C%20Digital'));
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: false });
      if (name === 'mobile') await page.screenshot({ path: 'screenshots/mobile-full.png', fullPage: true });
      for (const service of ['Campaign', 'Other']) await page.getByRole('button', { name: service, exact: true }).click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      for (const service of ['Brand', 'Digital', 'Campaign', 'Other']) await page.getByRole('button', { name: service, exact: true }).click();
      await page.waitForTimeout(500);
      assert.ok((await page.locator('[aria-live]').innerText()).includes('Please click to select services above.'));
      report.checks.push(`${name} ${width}x${height}: typewriter completes, multi-select and deselect work, inquiry link includes selections, no horizontal overflow`);
      await page.close();
    }
    assert.deepEqual(report.errors, []);
    report.checks.push('No browser script or console errors');
    const offline = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await offline.route('https://**/*', route => route.abort());
    await offline.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
    await offline.waitForFunction(() => document.querySelector('video').readyState >= 2 && document.querySelector('video').currentSrc.includes('/assets/cybernetic.mp4'));
    assert.equal(await offline.evaluate(async () => { await document.fonts.ready; return document.fonts.check('400 16px Inter') && document.fonts.check('500 16px Inter'); }), true);
    report.checks.push('With external network requests blocked, bundled video fallback and local Inter font load');
    await offline.close();
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(err => { console.error(err); server.close(); process.exitCode = 1; });
