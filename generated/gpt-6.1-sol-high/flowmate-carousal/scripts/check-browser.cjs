const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/app/node_modules/playwright-core');

const base = '/motionsites-results/flowmate-carousal/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!req.url.startsWith(base) || !file.startsWith(path.resolve('dist') + path.sep) || !fs.existsSync(file)) {
    res.writeHead(404); res.end(); return;
  }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const errors = [];
  const failedRequests = [];
  const checks = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`${name}: ${message.text()}`); });
      page.on('requestfailed', request => failedRequests.push(request.url()));
      page.on('response', response => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`); });
      const open = async () => {
        await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(700);
      };
      const ids = () => page.locator('[data-card-id]').evaluateAll(cards => cards.map(card => Number(card.dataset.cardId)));
      await open();
      assert.deepEqual(await ids(), [1, 2, 3]);
      const layout = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('[data-card-id]')];
        const rects = cards.map(card => { const r = card.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
        return { viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, rects, sections: document.querySelectorAll('section').length, navs: document.querySelectorAll('nav,footer,aside').length };
      });
      assert.equal(layout.scrollWidth, width);
      assert.equal(layout.sections, 1);
      assert.equal(layout.navs, 0);
      layout.rects.forEach(rect => assert.equal(rect.height, 500));
      if (name === 'desktop') assert.equal(layout.rects[0].y, layout.rects[2].y);
      else assert.equal(layout.rects[1].y - layout.rects[0].y, 524);
      const assets = await page.evaluate(async () => Promise.all(Array.from({ length: 5 }, async (_, idx) => {
        const image = new Image(); image.src = `images/card-${idx + 1}.webp`; await image.decode();
        return { id: idx + 1, width: image.naturalWidth, height: image.naturalHeight };
      })));
      assert(assets.every(asset => asset.width > 0));
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: name === 'desktop' });
      if (name === 'mobile') await page.screenshot({ path: 'screenshots/mobile-full.png', fullPage: true });
      await page.getByRole('button', { name: 'Next cards' }).click();
      await page.waitForTimeout(120);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      await page.waitForTimeout(630);
      assert.deepEqual(await ids(), [2, 3, 4]);
      await page.getByRole('button', { name: 'Previous cards' }).click();
      await page.waitForTimeout(750);
      assert.deepEqual(await ids(), [1, 2, 3]);
      await open();
      await page.getByRole('button', { name: 'Previous cards' }).click();
      await page.waitForTimeout(750);
      assert.deepEqual(await ids(), [5, 1, 2]);
      await page.getByRole('button', { name: 'Next cards' }).click();
      await page.waitForTimeout(750);
      assert.deepEqual(await ids(), [1, 2, 3]);
      await open();
      const next = page.getByRole('button', { name: 'Next cards' });
      await next.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(750);
      assert.deepEqual(await ids(), [2, 3, 4]);
      if (name === 'desktop') {
        const card = page.locator('[data-card-id]').first();
        await card.hover();
        await page.waitForTimeout(550);
        const transform = await card.locator('div').first().evaluate(el => getComputedStyle(el).transform);
        assert.match(transform, /1\.05/);
      }
      await open();
      await page.waitForTimeout(3600);
      assert.deepEqual(await ids(), [2, 3, 4]);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      checks.push({ name, viewport: { width, height }, layout, assets, initial_cards: 'pass', next_previous: 'pass', wrap_both_directions: 'pass', keyboard: 'pass', auto_advance: 'pass', horizontal_overflow: 'none' });
      await page.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(failedRequests, []);
    fs.writeFileSync('browser-checks.json', JSON.stringify({ status: 'passed', checks, errors, failedRequests }, null, 2) + '\n');
    console.log('Browser checks passed: desktop, mobile, images, navigation, wraparound, keyboard, hover, auto-advance, layout, and console.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
