const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/3d-collectible-hero/';
const root = path.resolve('dist');
const report = { checks: [], pageErrors: [], consoleErrors: [], requestFailures: [], httpErrors: [], assets: [] };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const filename = path.resolve(root, pathname.slice(base.length) || 'index.html');
  if (!pathname.startsWith(base) || !filename.startsWith(root + '/') || !fs.existsSync(filename)) { res.writeHead(404); res.end(); return; }
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
  res.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream');
  fs.createReadStream(filename).pipe(res);
});

async function run() {
  fs.mkdirSync('screenshots', { recursive: true });
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => report.pageErrors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
    page.on('requestfailed', r => report.requestFailures.push({ url: r.url(), error: r.failure()?.errorText }));
    page.on('response', r => { if (r.status() >= 400) report.httpErrors.push({ url: r.url(), status: r.status() }); });
    await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0), { timeout: 60000 });
    report.assets = await page.locator('img').evaluateAll(images => images.map(i => ({ src: i.src, width: i.naturalWidth, height: i.naturalHeight, loaded: i.complete && i.naturalWidth > 0 })));
    const fonts = await page.evaluate(() => ({ anton: document.fonts.check('16px Anton'), inter: document.fonts.check('16px Inter') }));
    assert(fonts.anton && fonts.inter);
    report.fonts = fonts;
    report.checks.push('All four supplied images and both Google font families loaded');
    async function layout(label, mobile) {
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight), false);
      assert.equal(await page.locator('main').evaluate(el => el.getBoundingClientRect().height), mobile ? 844 : 1000);
      assert.equal(await page.getByText('The artwork is stunning,', { exact: false }).isVisible(), !mobile);
      report.checks.push(`${label}: full viewport, no page overflow, correct description visibility`);
    }
    const carousel = page.locator('[aria-roledescription="carousel"]');
    const next = page.getByRole('button', { name: 'Next figurine' });
    const previous = page.getByRole('button', { name: 'Previous figurine' });
    async function index(expected) { assert.equal(await carousel.getAttribute('data-active-index'), String(expected)); }
    async function settle() {
      await page.waitForFunction(() => document.querySelector('[aria-roledescription="carousel"]').dataset.animating === 'false');
      await page.waitForTimeout(80);
    }
    await layout('Desktop 1440x1000', false);
    await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
    await next.click();
    await index(1);
    await page.evaluate(() => { for (let n = 0; n < 8; n++) document.querySelector('[aria-label="Next figurine"]').click(); });
    await index(1);
    assert.equal(await carousel.getAttribute('data-animating'), 'true');
    await settle();
    assert.equal(await page.locator('main').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(107, 191, 122)');
    report.checks.push('Next arrow, 650ms animation lock, green background transition');
    for (const expected of [2, 3, 0]) { await next.click(); await settle(); await index(expected); }
    await previous.click(); await settle(); await index(3);
    await next.click(); await settle(); await index(0);
    report.checks.push('All four carousel states, next wraparound, previous wraparound');
    await next.focus(); await page.keyboard.press('Enter'); await settle(); await index(1);
    await previous.focus(); await page.keyboard.press('Space'); await settle(); await index(0);
    report.checks.push('Keyboard Enter/Space operate arrow buttons');
    await page.getByRole('link', { name: 'DISCOVER IT' }).hover();
    await page.waitForTimeout(250);
    assert.equal(await page.getByRole('link', { name: 'DISCOVER IT' }).evaluate(el => getComputedStyle(el).opacity), '1');
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'DISCOVER IT' }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert.equal(popup.url(), report.assets[0].src);
    await popup.close();
    report.checks.push('Discover it hover and link open the active original artwork');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(750);
    await page.mouse.move(0, 0);
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await layout('Mobile 390x844', true);
    assert(Math.abs(await page.locator('[data-role="center"]').evaluate(el => el.getBoundingClientRect().height) - 844 * 0.6 * 1.25) < 1);
    await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
    await next.tap({ force: true }).catch(() => next.click());
    await settle(); await index(1);
    await previous.click(); await settle(); await index(0);
    report.checks.push('Mobile navigation and resize-derived figurine sizing');
    assert.deepEqual(report.pageErrors, []);
    assert.deepEqual(report.consoleErrors, []);
    assert.deepEqual(report.requestFailures, []);
    assert.deepEqual(report.httpErrors, []);
    report.checks.push('No script errors, console errors, failed requests or HTTP errors');
    report.status = 'passed';
  } finally {
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2) + '\n');
    await browser.close();
    server.close();
  }
  console.log(JSON.stringify(report, null, 2));
}
run().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
