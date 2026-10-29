const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');

const base = '/motionsites-results/bento-grid-stats/';
const root = path.resolve('dist');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.ttf': 'font/ttf', '.jpeg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404).end(); return; }
  const filename = path.join(root, decodeURIComponent(req.url.slice(base.length).split('?')[0]) || 'index.html');
  fs.readFile(filename, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: base, errors: [], failedRequests: [], viewports: [], interactions: [] };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['tablet', 768, 1024], ['small-mobile', 320, 800]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
      page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure() }));
      page.on('response', res => { if (res.status() >= 400) report.failedRequests.push({ url: res.url(), status: res.status() }); });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const cards = page.locator('[data-card]:visible');
      if (await cards.count() !== 6) throw new Error(`${name}: expected six visible cards`);
      if (name === 'mobile') {
        const photo = page.locator('[data-card="photo"]:visible');
        const initial = await photo.evaluate(el => getComputedStyle(el).opacity);
        report.interactions.push({ name: 'Offscreen mobile photo waits for scroll', passed: initial === '0' });
      }
      for (let i = 0; i < 6; i++) {
        await cards.nth(i).scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        const opacity = await cards.nth(i).evaluate(el => getComputedStyle(el).opacity);
        if (opacity !== '1') throw new Error(`${name}: card ${i} did not animate in`);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      const measurements = await page.evaluate(() => {
        const visible = [...document.querySelectorAll('[data-card]')].filter(el => el.getClientRects().length);
        const image = [...document.images].find(img => img.getClientRects().length);
        return {
          pageWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          fontLoaded: document.fonts.check('400 16px "DM Sans"'),
          imageLoaded: image.complete && image.naturalWidth > 0,
          cards: visible.map(el => {
            const r = el.getBoundingClientRect();
            return { name: el.dataset.card, x: r.x, y: r.y, width: r.width, height: r.height, opacity: getComputedStyle(el).opacity };
          }),
          dotColumns: document.querySelector('.dot-chart').children.length,
          dotCells: document.querySelector('.dot-chart').querySelectorAll('.dot').length,
          decorativePlusSigns: [...document.querySelectorAll('span[aria-hidden="true"]')].filter(el => el.textContent === '+' && el.getClientRects().length).length,
        };
      });
      if (measurements.pageWidth !== width) throw new Error(`${name}: horizontal overflow`);
      if (!measurements.fontLoaded || !measurements.imageLoaded) throw new Error(`${name}: asset failed`);
      if (!measurements.cards.every(card => card.opacity === '1')) throw new Error(`${name}: animation replayed after scroll`);
      report.viewports.push({ name, width, height, ...measurements, passed: true });
      if (name === 'desktop' || name === 'mobile') await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      report.interactions.push({ name: `${name}: all scroll entrances finish and remain visible`, passed: true });
      await page.close();
    }
    if (report.errors.length || report.failedRequests.length || report.interactions.some(item => !item.passed)) throw new Error('Browser errors, asset failures, or interaction failures');
    report.passed = true;
  } finally {
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2) + '\n');
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
