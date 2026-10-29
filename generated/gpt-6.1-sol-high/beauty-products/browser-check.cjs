const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/beauty-products/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404); return res.end(); }
  const relative = decodeURIComponent(req.url.split('?')[0].slice(base.length)) || 'index.html';
  const file = path.join(process.cwd(), 'dist', relative);
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = { url: `http://localhost:4173${base}`, checks: [], errors: [], failedRequests: [] };
  try {
    for (const [label, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, isMobile: label === 'mobile', hasTouch: label === 'mobile' });
      const page = await context.newPage();
      page.on('pageerror', error => results.errors.push(`${label}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') results.errors.push(`${label}: ${message.text()}`); });
      page.on('requestfailed', request => results.failedRequests.push(request.url()));
      page.on('response', response => { if (response.status() >= 400) results.errors.push(`${label}: HTTP ${response.status()} ${response.url()}`); });
      await page.goto(results.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      assert.equal(await page.locator('article').count(), 7);
      assert.equal(await page.getByRole('tab', { name: 'best sellers' }).getAttribute('aria-selected'), 'true');
      const images = await page.locator('article img').evaluateAll(images => images.map(image => ({ src: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0 })));
      assert.ok(images.every(image => image.loaded), JSON.stringify(images));
      const layout = await page.evaluate(() => ({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, cardWidth: document.querySelector('article').getBoundingClientRect().width, background: getComputedStyle(document.querySelector('main')).backgroundColor, articleOpacity: getComputedStyle(document.querySelector('article')).opacity }));
      assert.ok(layout.documentWidth <= viewport.width, JSON.stringify(layout));
      assert.equal(layout.background, 'rgb(249, 244, 240)');
      assert.equal(layout.articleOpacity, '1');
      await page.screenshot({ path: `screenshots/${label}.png`, fullPage: true });
      const carousel = page.locator('#products');
      await carousel.hover();
      await page.mouse.wheel(0, 450);
      await page.waitForTimeout(250);
      const afterWheel = await carousel.evaluate(el => el.scrollLeft);
      assert.ok(afterWheel > 0, 'wheel scrolls horizontally');
      const thumbTransform = await page.locator('[aria-hidden="true"] > div').evaluate(el => getComputedStyle(el).transform);
      assert.notEqual(thumbTransform, 'matrix(1, 0, 0, 1, 0, 0)');
      await carousel.evaluate(el => { el.scrollLeft = 0; });
      const box = await carousel.boundingBox();
      await page.mouse.move(box.x + 240, box.y + 150);
      await page.mouse.down();
      await page.mouse.move(box.x + 60, box.y + 150, { steps: 8 });
      await page.mouse.up();
      assert.ok(await carousel.evaluate(el => el.scrollLeft) > 100, 'mouse drag scrolls carousel');
      if (label === 'mobile') {
        await carousel.evaluate(el => { el.scrollLeft = 0; });
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 290, y: 420 }] });
        for (let x = 270; x >= 70; x -= 20) {
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 420 }] });
          await page.waitForTimeout(20);
        }
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForTimeout(300);
        assert.ok(await carousel.evaluate(el => el.scrollLeft) > 100, 'native touch swipe scrolls carousel');
        await cdp.detach();
      }
      await page.getByRole('tab', { name: 'sets', exact: true }).click();
      assert.equal(await page.locator('article').count(), 1);
      assert.equal(await page.locator('article h2').textContent(), 'Super glow set');
      assert.equal(await carousel.evaluate(el => el.scrollLeft), 0);
      await page.getByRole('tab', { name: 'sets', exact: true }).press('ArrowLeft');
      assert.equal(await page.locator('article').count(), 7);
      assert.equal(await page.getByRole('tab', { name: 'best sellers' }).getAttribute('aria-selected'), 'true');
      results.checks.push({ viewport: label, dimensions: viewport, layout, imagesLoaded: images.length, defaultProducts: 7, setsFilter: 'passed', tabKeyboardNavigation: 'passed', wheelScroll: 'passed', dragScroll: 'passed', scrollProgress: 'passed', nativeTouchSwipe: label === 'mobile' ? 'passed' : 'not applicable', screenshot: `screenshots/${label}.png`, documentOverflow: false });
      await context.close();
    }
    assert.deepEqual(results.errors, []);
    assert.deepEqual(results.failedRequests, []);
    results.status = 'passed';
  } catch (error) {
    results.status = 'failed';
    results.failure = error.stack;
    process.exitCode = 1;
  } finally {
    fs.writeFileSync('browser-results.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
