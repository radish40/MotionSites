const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/vize-footer/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${base}`, checks: [], errors: [], failedRequests: [], fontResponses: [] };
  try {
    fs.mkdirSync('/work/screenshots', { recursive: true });
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['tablet', 768, 1024]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', err => report.errors.push({ viewport: name, message: err.message }));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push({ viewport: name, message: msg.text() }); });
      page.on('requestfailed', req => report.failedRequests.push({ viewport: name, url: req.url(), error: req.failure()?.errorText }));
      page.on('response', res => { if (/fonts\.(googleapis|gstatic)\.com/.test(res.url())) report.fontResponses.push({ viewport: name, status: res.status(), url: res.url() }); });
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.title(), 'Vize Footer');
      assert.equal(await page.locator('footer nav').count(), 3);
      assert.equal(await page.locator('footer a').count(), 13);
      assert.equal(await page.locator('footer button').count(), 3);
      assert.equal(await page.locator('#glass-effect feMergeNode').count(), 4);
      const layout = await page.evaluate(() => ({
        viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        font: getComputedStyle(document.body).fontFamily,
        interLoaded: document.fonts.check('16px Inter'),
        footerHeight: document.querySelector('footer').getBoundingClientRect().height,
      }));
      assert.ok(layout.scrollWidth <= width, `Horizontal overflow at ${name}`);
      const feature = page.getByRole('link', { name: 'Features', exact: true });
      await feature.hover();
      await page.waitForTimeout(200);
      assert.equal(await feature.evaluate(el => getComputedStyle(el).color), 'rgb(49, 168, 255)');
      await feature.click();
      assert.ok(page.url().endsWith('#'), 'Placeholder link should navigate to #');
      for (const label of ['LinkedIn', 'Twitter', 'Instagram']) {
        const button = page.getByRole('button', { name: label, exact: true });
        await button.click();
        await button.focus();
        assert.equal(await button.evaluate(el => el === document.activeElement), true);
      }
      const wordmark = page.locator('h1');
      await wordmark.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      const motion = await wordmark.evaluate(el => ({ opacity: getComputedStyle(el.parentElement).opacity, filter: getComputedStyle(el).filter }));
      assert.equal(motion.opacity, '1');
      assert.ok(motion.filter.includes('glass-effect'));
      await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
      await page.mouse.move(0, 0);
      await page.waitForTimeout(200);
      if (name !== 'tablet') await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      report.checks.push({ viewport: name, width, height, layout, motion, passed: ['render', 'directory and legal links', 'social button click and focus', 'link hover color', 'hash navigation', 'SVG filter', 'Motion entrance completed', 'no horizontal overflow'] });
      await page.close();
    }
    fs.writeFileSync('/work/screenshots/browser-report.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    assert.equal(report.errors.length, 0, 'Browser script or console errors');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(err => { console.error(err); process.exitCode = 1; });
