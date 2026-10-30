const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/ai-image-generator-ui/';
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const relative = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
  const file = path.join(__dirname, 'dist', relative);
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', ({'.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf'})[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const results = [];
  try {
    for (const [name, width, height, columns] of [['desktop',1440,1000,3], ['mobile',390,844,1], ['tablet',800,1000,2]]) {
      const page = await browser.newPage({ viewport: {width,height}, deviceScaleFactor: 1 });
      const errors = [], failedRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('requestfailed', request => failedRequests.push({url: request.url(), error: request.failure()?.errorText}));
      await page.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({
        columns: getComputedStyle(document.querySelector('.c1-grid')).gridTemplateColumns.split(' ').length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        cardCount: document.querySelectorAll('.c1-card').length,
        cardHeights: [...document.querySelectorAll('.c1-card')].map(el => el.getBoundingClientRect().height),
        imagesLoaded: [...document.images].every(img => img.complete && img.naturalWidth > 0),
        fontLoaded: document.fonts.check('400 16px Inter') && document.fonts.check('500 16px Inter') && document.fonts.check('600 16px Inter'),
        scripts: document.scripts.length,
        animations: document.getAnimations().length
      }));
      assert.equal(layout.columns, columns);
      assert.equal(layout.overflow, false);
      assert.equal(layout.cardCount, 3);
      assert.ok(layout.cardHeights.every(height => height === 340));
      assert.equal(layout.imagesLoaded, true);
      assert.equal(layout.scripts, 0);
      assert.equal(layout.animations, 0);
      const before = await page.locator('main').innerHTML();
      await page.locator('.c1-details').click();
      await page.locator('.c1-search').click();
      assert.equal(await page.locator('main').innerHTML(), before);
      await page.evaluate(() => scrollTo(0,0));
      if (name !== 'tablet') await page.screenshot({ path:`screenshots/${name}.png`, fullPage:true });
      results.push({name, viewport:{width,height}, ...layout, staticPillClicks:'unchanged as specified', errors, failedRequests});
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(results,null,2)+'\n');
    console.log(JSON.stringify(results,null,2));
    assert.ok(results.every(result => result.errors.length === 0 && result.failedRequests.length === 0));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode=1; server.close(); });
