const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/faq-cta/';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404).end(); return; }
  const relative = req.url.slice(base.length).split('?')[0] || 'index.html';
  const file = path.join('/work/dist', relative);
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { checks: [], pageErrors: [], consoleErrors: [], failedRequests: [], assetIssues: [] };
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => report.pageErrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
    page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const assets = await page.evaluate(() => ({
        interLoaded: document.fonts.check('14px Inter') && [...document.fonts].some(font => font.family === 'Inter' && font.status === 'loaded'),
        logoLoaded: document.querySelector('footer img').naturalWidth > 0,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      assert.equal(assets.overflow, false, `${name} horizontal overflow`);
      if (!assets.interLoaded) report.assetIssues.push(`${name}: Google Inter font did not load`);
      if (!assets.logoLoaded) report.assetIssues.push(`${name}: requested remote SVG did not load`);
      const items = page.getByRole('button', { name: /What is the maximum|Does my recipient|Is there a mobile|Can I cancel|What currencies/ });
      assert.equal(await items.count(), 5);
      assert.equal(await items.nth(0).getAttribute('aria-expanded'), 'true');
      const cta = page.getByRole('button', { name: 'Get Started Today', exact: true });
      await cta.hover();
      await page.waitForTimeout(250);
      assert.equal(await cta.evaluate(el => el.style.boxShadow), 'rgba(0, 0, 0, 0.4) 0px 14px 30px');
      await cta.click();
      await page.mouse.move(0, 0);
      assert.equal(await cta.evaluate(el => el.style.boxShadow), 'rgba(0, 0, 0, 0.3) 0px 10px 20px');
      for (let index = 0; index < 5; index++) {
        await items.nth(index).click();
        if (index === 0) {
          assert.equal(await items.nth(0).getAttribute('aria-expanded'), 'false');
          await items.nth(0).click();
        }
        assert.equal(await items.nth(index).getAttribute('aria-expanded'), 'true');
        assert.equal(await page.locator('[aria-expanded="true"]').count(), 1);
      }
      await items.nth(4).focus();
      await page.keyboard.press('Enter');
      assert.equal(await items.nth(4).getAttribute('aria-expanded'), 'false');
      await page.keyboard.press('Space');
      assert.equal(await items.nth(4).getAttribute('aria-expanded'), 'true');
      const input = page.getByRole('textbox', { name: 'Email address' });
      await input.fill('invalid');
      assert.equal(await input.evaluate(el => el.checkValidity()), false);
      await input.fill('reader@example.com');
      assert.equal(await input.evaluate(el => el.checkValidity()), true);
      await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
      assert.equal(new URL(page.url()).pathname, base);
      const card = page.locator('.c5-animated-gradient');
      const before = await card.evaluate(el => getComputedStyle(el).getPropertyValue('--c5-x1'));
      await page.waitForTimeout(250);
      const after = await card.evaluate(el => getComputedStyle(el).getPropertyValue('--c5-x1'));
      assert.notEqual(before, after, 'Gradient must animate');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await card.evaluate(el => getComputedStyle(el).animationName), 'none');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await items.nth(0).click();
      await input.fill('');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      report.checks.push({ viewport: `${width}x${height}`, assets, accordion: 'all five toggle; one open; keyboard Enter/Space', newsletter: 'native email validation; submission stays on page', gradient: 'custom properties animate; reduced motion disables animation', screenshot: `screenshots/${name}.png` });
    }
    // Additional responsive boundary checks.
    for (const width of [320, 480, 768, 900, 901, 1100]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}px`);
    }
    report.checks.push({ responsiveWidths: [320, 480, 768, 900, 901, 1100], overflow: false });
    assert.deepEqual(report.pageErrors, []);
    assert.deepEqual(report.consoleErrors, []);
    fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
