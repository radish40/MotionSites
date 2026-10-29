const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/nimbus-pricing/';
const root = path.resolve('dist');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.resolve(root, url.pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root + '/')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: base, browser: 'Chromium', errors: [], failedRequests: [], viewports: {} };
  try {
    fs.mkdirSync('screenshots', { recursive: true });
    for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', err => report.errors.push(String(err)));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
      page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);
      const layout = await page.evaluate(() => ({
        width: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        fontSans: document.fonts.check('400 16px "IBM Plex Sans"'),
        fontMono: document.fonts.check('500 16px "IBM Plex Mono"'),
        loadedFonts: [...document.fonts].filter(font => font.status === 'loaded').map(font => `${font.family} ${font.weight}`),
        topColumns: getComputedStyle(document.querySelector('.pricing-top')).gridTemplateColumns,
        planColumns: getComputedStyle(document.querySelector('.pricing-plan-row')).gridTemplateColumns,
        bars: [...document.querySelectorAll('.pricing-bar')].map(el => ({ height: el.getBoundingClientRect().height, morph: el.style.getPropertyValue('--bar-morph') })),
      }));
      assert.equal(layout.documentWidth, viewport.width, `${name}: horizontal overflow`);
      assert.equal(await page.locator('.pricing-row').count(), 5);
      assert.equal(await page.locator('.pricing-plan').count(), 3);
      assert.equal(layout.bars.length, 12);
      assert.equal(await page.locator('.pricing-bar.muted').count(), 6);
      if (name === 'mobile') assert.equal(layout.topColumns.split(' ').length, 1);
      else assert.equal(layout.topColumns.split(' ').length, 2);
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      await page.screenshot({ path: `screenshots/${name}-viewport.png`, fullPage: false });
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(300);
      const after = await page.locator('.pricing-bar').evaluateAll(els => els.map(el => el.style.getPropertyValue('--bar-morph')));
      assert.notDeepEqual(layout.bars.map(bar => bar.morph), after, `${name}: bars must morph on scroll`);
      await page.screenshot({ path: `screenshots/${name}-bars.png`, fullPage: false });
      for (const [label, hash] of [['Start small', '#pricing'], ['Build team plan', '#pricing'], ['Talk to sales', '#plans']]) {
        await page.getByRole('link', { name: label, exact: true }).click();
        await page.waitForTimeout(650);
        assert.equal(await page.evaluate(() => location.hash), hash);
        assert.equal(await page.locator(hash).count(), 1);
      }
      await page.keyboard.press('Tab');
      await page.getByRole('link', { name: 'Start small', exact: true }).focus();
      const focusOutline = await page.getByRole('link', { name: 'Start small', exact: true }).evaluate(el => getComputedStyle(el).outlineStyle);
      assert.equal(focusOutline, 'solid', `${name}: visible keyboard focus`);
      report.viewports[name] = { ...viewport, ...layout, scrollAnimation: 'passed', planLinks: 'passed', focusOutline };
      await page.close();
    }
    assert.deepEqual(report.errors, [], 'Browser errors');
    assert.deepEqual(report.failedRequests, [], 'Failed requests');
    report.status = 'passed';
  } catch (err) {
    report.status = 'failed';
    report.failure = String(err);
    process.exitCode = 1;
  } finally {
    fs.writeFileSync('browser-checks.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})();
