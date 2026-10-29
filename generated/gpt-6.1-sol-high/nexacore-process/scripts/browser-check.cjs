const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const base = '/motionsites-results/nexacore-process/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const relative = url.pathname.slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + path.sep) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${base}`, errors: [], failedRequests: [], checks: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 768, height: 1024 }]) {
      const context = await browser.newContext({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      const page = await context.newPage();
      page.on('pageerror', e => report.errors.push(e.message));
      page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure() }));
      page.on('response', r => { if (r.status() >= 400) report.errors.push(`HTTP ${r.status()} ${r.url()}`); });
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.service-card').count(), 4);
      const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, fonts: document.fonts.check('400 16px "Mazzard H"') && document.fonts.check('500 16px "Mazzard H"'), columns: getComputedStyle(document.querySelector('.service-card').parentElement).gridTemplateColumns.split(' ').length, brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).length }));
      assert(!layout.overflow, 'horizontal overflow'); assert(layout.fonts, 'fonts loaded'); assert.equal(layout.brokenImages, 0);
      assert.equal(layout.columns, viewport.width === 1440 ? 4 : viewport.width === 768 ? 2 : 1);
      if (viewport.width !== 768) await page.screenshot({ path: `screenshots/${viewport.width === 1440 ? 'desktop' : 'mobile'}.png`, fullPage: true });
      const card = page.locator('.service-card').first();
      const button = card.getByRole('link', { name: 'Learn more' });
      const opacity = () => button.locator('..').evaluate(el => Number(getComputedStyle(el).opacity));
      assert.equal(await opacity(), 0);
      if (viewport.width === 390) await card.tap(); else await card.hover();
      await page.waitForTimeout(600);
      assert.equal(await opacity(), 1);
      assert.equal(await card.locator('img').evaluate(el => getComputedStyle(el.parentElement).opacity), '1');
      if (viewport.width === 1440) {
        await page.screenshot({ path: 'screenshots/desktop-hover.png', fullPage: true });
        await page.mouse.move(0, 0); await page.waitForTimeout(600); assert.equal(await opacity(), 0);
        await card.focus(); await page.waitForTimeout(600); assert.equal(await opacity(), 1);
        await page.keyboard.press('Tab'); assert(await button.evaluate(el => el === document.activeElement));
      }
      await button.click();
      assert(new URL(page.url()).pathname === base);
      report.checks.push({ viewport, ...layout, cards: 4, hoverOrTapReveal: true, learnMoreAnchor: true, keyboardReveal: viewport.width === 1440 ? true : 'checked on desktop' });
      await context.close();
    }
    assert.equal(report.errors.length, 0); assert.equal(report.failedRequests.length, 0);
    report.status = 'passed';
  } finally {
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2));
    await browser.close(); server.close();
  }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
