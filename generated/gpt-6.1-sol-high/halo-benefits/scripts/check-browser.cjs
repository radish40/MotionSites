const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/halo-benefits/';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') { res.writeHead(204).end(); return; }
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length);
  const file = path.resolve(root, relative || 'index.html');
  if (!req.url.startsWith(base) || !file.startsWith(root + '/') || !fs.existsSync(file)) {
    res.writeHead(404).end(); return;
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = { url: `http://127.0.0.1:4173${base}`, viewports: [], console_errors: [], page_errors: [], failed_requests: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 640, height: 900 }, { width: 768, height: 1000 }, { width: 1024, height: 1000 }]) {
      const page = await browser.newPage({ viewport });
      page.on('pageerror', e => results.page_errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') results.console_errors.push(m.text()); });
      page.on('requestfailed', r => results.failed_requests.push({ url: r.url(), error: r.failure().errorText }));
      const response = await page.goto(results.url, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await page.evaluate(async () => {
        await document.fonts.load('16px "TT Norms Pro Regular"');
        await document.fonts.ready;
      });
      const layout = await page.evaluate(async () => {
        const cards = document.querySelector('#benefits');
        const rects = [...cards.children].map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
        const image = new Image();
        image.src = getComputedStyle(cards.firstElementChild).backgroundImage.slice(5, -2);
        await image.decode();
        return {
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          columns: getComputedStyle(cards).gridTemplateColumns,
          cards: rects,
          imageLoaded: image.naturalWidth === 1280,
          fontLoaded: document.fonts.check('16px "TT Norms Pro Regular"'),
          fontFamily: getComputedStyle(document.body).fontFamily,
          animationDuration: getComputedStyle(document.querySelector('.backers-track')).animationDuration,
        };
      });
      console.log(JSON.stringify({ layout, errors: results.console_errors, failed: results.failed_requests }));
      assert.equal(layout.scrollWidth, viewport.width, 'Horizontal overflow');
      assert.equal(layout.imageLoaded, true);
      assert.equal(layout.fontLoaded, true);
      assert.equal(layout.animationDuration, '30s');
      assert.equal(layout.columns.split(' ').length, viewport.width >= 1024 ? 4 : viewport.width >= 640 ? 2 : 1);
      assert.ok(layout.cards.every(card => card.height >= 320));
      const transformBefore = await page.locator('.backers-track').evaluate(el => getComputedStyle(el).transform);
      await page.waitForTimeout(150);
      const transformAfter = await page.locator('.backers-track').evaluate(el => getComputedStyle(el).transform);
      assert.notEqual(transformBefore, transformAfter, 'Marquee must move');
      if (viewport.width === 1440 || viewport.width === 390) {
        await page.screenshot({ path: `screenshots/${viewport.width === 1440 ? 'desktop' : 'mobile'}.png`, fullPage: true, animations: 'disabled' });
      }
      const button = page.getByRole('button', { name: 'Discover it' });
      await button.hover();
      await page.waitForTimeout(250);
      assert.equal(await button.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(31, 41, 55)');
      await button.click();
      await page.waitForTimeout(600);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'benefits');
      await page.evaluate(() => scrollTo(0, 0));
      await button.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'benefits');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.backers-track').evaluate(el => getComputedStyle(el).animationName), 'none');
      results.viewports.push({ ...viewport, ...layout, marquee_moves: true, cta_click: 'passed', cta_keyboard: 'passed', hover: 'passed', reduced_motion: 'passed' });
      await page.close();
    }
    assert.equal(results.page_errors.length, 0);
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
