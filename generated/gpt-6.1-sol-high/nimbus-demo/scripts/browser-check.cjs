const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/nimbus-demo/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const file = path.resolve('dist', pathname.slice(prefix.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: 'http://localhost:4173' + prefix, viewports: [], errors: [], failedRequests: [] };
  try {
    for (const size of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 820, height: 1000 }]) {
      const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1, isMobile: size.width === 390, hasTouch: size.width === 390 });
      page.on('pageerror', err => report.errors.push(err.message));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
      page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), failure: req.failure() }));
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(['IBM Plex Sans', 'IBM Plex Mono'].flatMap(family => [400,500].map(weight => document.fonts.load(`${weight} 16px "${family}"`))));
      });
      const layout = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => ({family: f.family, weight: f.weight, status: f.status})),
        cellsOverflowing: [...document.querySelectorAll('.dashboard-row span, .dashboard-row strong')].filter(el => getComputedStyle(el).display !== 'none' && el.scrollWidth > el.clientWidth).map(el => el.textContent),
        sidebarColumns: getComputedStyle(document.querySelector('.dashboard-body')).gridTemplateColumns,
        toastPosition: getComputedStyle(document.querySelector('.dashboard-toast')).position,
        policyDisplay: getComputedStyle(document.querySelector('.dashboard-row.header span:nth-child(4)')).display,
      }));
      assert.equal(layout.fonts.length, 4, 'Both font families load at weights 400 and 500');
      assert.equal(layout.scrollWidth, size.width, 'No horizontal page overflow');
      assert.deepEqual(layout.cellsOverflowing, [], 'No overflowing table cells');
      assert.equal(await page.locator('.dashboard-row').count(), 5);
      assert.equal(await page.locator('.dashboard-sidebar nav span').count(), 6);
      assert.equal(layout.policyDisplay === 'none', size.width <= 820);
      assert.equal(layout.toastPosition, size.width <= 820 ? 'static' : 'absolute');
      await page.getByRole('button', {name:'New pool'}).click();
      if (size.width > 820) {
        await page.mouse.move(0,0);
        await page.waitForTimeout(550);
        const before = await page.locator('.dashboard-shell').evaluate(el => getComputedStyle(el).transform);
        await page.locator('.dashboard-shell').hover();
        await page.waitForTimeout(600);
        const hover = await page.locator('.dashboard-shell').evaluate(el => ({ transform: getComputedStyle(el).transform, shine: getComputedStyle(el, '::before').opacity }));
        assert.notEqual(hover.transform, before);
        assert.equal(hover.shine, '1');
        const row = page.locator('.dashboard-row').nth(1);
        await row.hover();
        await page.waitForTimeout(200);
        assert.equal(await row.evaluate(el=>getComputedStyle(el).backgroundColor), 'rgba(151, 211, 235, 0.06)');
        layout.hoverTiltAndShine = 'passed';
        layout.rowHighlight = 'passed';
      }
      await page.mouse.move(0,0);
      await page.evaluate(() => window.scrollTo(0,0));
      await page.waitForTimeout(650);
      if (size.width !== 820) await page.screenshot({ path: 'screenshots/' + (size.width === 1440 ? 'desktop' : 'mobile') + '.png', fullPage: true });
      report.viewports.push({ ...size, ...layout });
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    assert.deepEqual(report.errors, [], 'No browser errors');
    assert.deepEqual(report.failedRequests, [], 'No failed asset requests');
  } finally { await browser.close(); server.close(); }
})().catch(err => { console.error(err); server.close(); process.exitCode = 1; });
