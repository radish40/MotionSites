const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/arceage-testimonial/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', url.pathname.slice(base.length) || 'index.html');
  try { res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(fs.readFileSync(file)); }
  catch { res.writeHead(404).end(); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { viewports: [], consoleErrors: [], pageErrors: [], failedRequests: [], failedResponses: [], interactions: [] };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('console', msg => { if (msg.type() === 'error') report.consoleErrors.push({ viewport: name, message: msg.text() }); });
      page.on('pageerror', error => report.pageErrors.push({ viewport: name, message: error.message }));
      page.on('requestfailed', request => report.failedRequests.push({ viewport: name, url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) report.failedResponses.push({ viewport: name, url: response.url(), status: response.status() }); });
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(4500);
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      const layout = await page.evaluate(() => ({
        viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        font: getComputedStyle(document.querySelector('h2')).fontFamily,
        barlowLoaded: document.fonts.check('300 44px Barlow'),
        section: document.querySelector('section').getBoundingClientRect().toJSON(),
        images: [...document.images].map(img => ({ src: img.src, complete: img.complete, width: img.naturalWidth })),
      }));
      assert.ok(layout.scrollWidth <= width, `${name}: horizontal overflow`);
      assert.equal(await page.title(), 'Arceage Testimonial');
      assert.equal(await page.locator('h3').innerText(), 'Maranda Walsh');
      for (const expected of ['John Doe', 'Sarah Smith', 'Maranda Walsh']) {
        await page.getByRole('button', { name: 'Next feedback' }).click();
        await page.waitForTimeout(3500);
        assert.equal(await page.locator('h3').innerText(), expected);
        assert.ok(await page.locator('img').evaluate(img => img.complete && img.naturalWidth > 0), `${expected}: avatar missing`);
        report.interactions.push(`${name}: Next → ${expected}; avatar loaded`);
      }
      await page.getByRole('button', { name: 'Previous feedback' }).click();
      await page.waitForTimeout(3500);
      assert.equal(await page.locator('h3').innerText(), 'Sarah Smith');
      report.interactions.push(`${name}: Previous wraps from first to last`);
      await page.getByRole('button', { name: 'Next feedback' }).focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3500);
      assert.equal(await page.locator('h3').innerText(), 'Maranda Walsh');
      report.interactions.push(`${name}: keyboard activation works`);
      report.viewports.push({ name, width, height, ...layout });
      await page.close();
    }
    assert.equal(report.pageErrors.length, 0, 'Runtime errors');
    assert.equal(report.consoleErrors.length, 0, 'Console errors');
    assert.equal(report.failedRequests.length, 0, 'Failed asset requests');
    assert.equal(report.failedResponses.length, 0, 'Failed HTTP responses');
    fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
