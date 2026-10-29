const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/liquid-glass-features/';
const root = path.resolve('dist');
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.resolve(root, pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  fs.readFile(file, (err, bytes) => {
    if (err) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(bytes);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { viewports: [], errors: [], failedRequests: [], assetIssues: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', err => report.errors.push(err.message));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
      page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
      await page.goto('http://localhost:4173' + base, { waitUntil: 'networkidle', timeout: 90000 });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode().catch(() => null))));
      const state = await page.evaluate(() => {
        const section = document.querySelector('section');
        const rows = [...section.children].slice(1);
        const box = el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; };
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          fonts: { heading: document.fonts.check('italic 36px "Instrument Serif"'), body: document.fonts.check('300 16px Barlow') },
          images: [...document.images].map(i => ({ src:i.src, loaded:i.complete && i.naturalWidth > 0, naturalWidth:i.naturalWidth, naturalHeight:i.naturalHeight })),
          rows: rows.map(row => ({ direction:getComputedStyle(row).flexDirection, content:box(row.children[0]), image:box(row.children[1]) })),
          background: getComputedStyle(document.body).backgroundColor,
          headings: [...document.querySelectorAll('h2,h3')].map(el => el.textContent),
        };
      });
      assert.equal(state.overflow, false, 'Horizontal overflow');
      assert.equal(state.background, 'rgb(0, 0, 0)');
      assert.equal(state.headings[0], 'Pro features. Zero complexity.');
      for (const img of state.images) if (!img.loaded) report.assetIssues.push('Image unavailable: ' + img.src);
      for (const [font, loaded] of Object.entries(state.fonts)) if (!loaded) report.assetIssues.push('Font unavailable: ' + font);
      if (viewport.width > 1000) {
        assert.equal(state.rows[0].direction, 'row');
        assert.equal(state.rows[1].direction, 'row-reverse');
        assert(state.rows[0].content.x < state.rows[0].image.x);
        assert(state.rows[1].content.x > state.rows[1].image.x);
      } else {
        for (const row of state.rows) { assert.equal(row.direction, 'column'); assert(row.content.y < row.image.y); }
      }
      const buttons = page.getByRole('button');
      assert.equal(await buttons.count(), 2);
      const interactions = [];
      for (const button of await buttons.all()) {
        await button.scrollIntoViewIfNeeded();
        await button.hover();
        await page.waitForTimeout(200);
        const hoverBackground = await button.evaluate(el => getComputedStyle(el).backgroundColor);
        await button.click();
        await button.focus();
        assert(await button.evaluate(el => el === document.activeElement));
        await page.keyboard.press('Enter');
        interactions.push({ label:await button.innerText(), hoverBackground, click:true, keyboard:true, behavior:'Prompt-supplied button, no destination specified' });
      }
      await page.mouse.move(0,0);
      await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0,0); });
      await page.screenshot({ path: `screenshots/${viewport.width === 1440 ? 'desktop' : 'mobile'}.png`, fullPage:true });
      report.viewports.push({ viewport, ...state, interactions });
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    assert.equal(report.errors.length, 0, 'Browser errors');
  } finally { await browser.close(); server.close(); }
})().catch(err => { console.error(err); server.close(); process.exitCode = 1; });
