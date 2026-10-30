const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/glow-features/';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.resolve(root, url.pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root + '/')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(8080, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const errors = [];
  const failedRequests = [];
  const checks = [];
  fs.mkdirSync('screenshots', { recursive: true });
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['tablet', 768, 1024], ['small-mobile', 320, 760]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('requestfailed', request => failedRequests.push(request.url()));
      page.on('response', response => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`); });
      await page.goto(`http://127.0.0.1:8080${base}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => [...document.querySelectorAll('.feature-card')].every(card => Number(getComputedStyle(card).opacity) === 1 && getComputedStyle(card).transform === 'none'));
      const layout = await page.evaluate(() => ({
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        cards: [...document.querySelectorAll('article')].map(card => {
          const bounds = card.getBoundingClientRect();
          const p = card.querySelector('p').getBoundingClientRect();
          const icon = card.querySelector('svg').getBoundingClientRect();
          return { title: card.querySelector('h2').textContent, x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, textInside: p.bottom <= bounds.bottom - 8, iconSize: [icon.width, icon.height], borderWidth: getComputedStyle(card).borderTopWidth };
        }),
      }));
      assert.equal(layout.cards.length, 3);
      assert.equal(layout.documentWidth, width, `${name}: horizontal overflow`);
      assert.deepEqual(layout.cards.map(card => card.title), ['Hardware', 'Studio', 'Motion']);
      for (const card of layout.cards) {
        assert.equal(card.height, width >= 768 ? 300 : 260);
        assert.equal(card.borderWidth, '8px');
        assert.deepEqual(card.iconSize, [32, 32]);
        assert(card.textInside, `${name}: clipped text`);
      }
      if (width >= 768) assert(layout.cards.every(card => card.y === layout.cards[0].y));
      else assert(layout.cards[1].y > layout.cards[0].y);
      const selection = await page.locator('p').first().evaluate(p => {
        const range = document.createRange();
        range.selectNodeContents(p);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        return getSelection().toString();
      });
      assert.equal(selection, 'My entire desktop setup is built for power. It is silent, durable, and holds my focus.');
      await page.evaluate(() => getSelection().removeAllRanges());
      if (name === 'desktop' || name === 'mobile') await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      checks.push({ name, viewport: { width, height }, ...layout, textSelection: 'passed', entranceAnimationCompleted: true });
      await page.close();
    }
    // Inspect the actual entrance sequence with browser animation frames.
    const animationPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await animationPage.addInitScript(() => {
      window.entranceSamples = [];
      const sample = () => {
        const cards = [...document.querySelectorAll('.feature-card')];
        if (cards.length) window.entranceSamples.push(cards.map(card => ({ opacity: Number(getComputedStyle(card).opacity), transform: getComputedStyle(card).transform })));
        if (performance.now() < 1800) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await animationPage.goto(`http://127.0.0.1:8080${base}`);
    await animationPage.waitForTimeout(1900);
    const samples = await animationPage.evaluate(() => window.entranceSamples);
    assert(samples.some(frame => frame[0].opacity > 0 && frame[0].opacity < 1), 'Entrance transition is visible');
    assert(samples.some(frame => frame[0].opacity > frame[1].opacity && frame[1].opacity > frame[2].opacity), 'Entrances are staggered');
    assert(samples.at(-1).every(card => card.opacity === 1 && card.transform === 'none'));
    assert.deepEqual(errors, []);
    assert.deepEqual(failedRequests, []);
    fs.writeFileSync('browser-checks.json', JSON.stringify({ status: 'passed', checks, animation: 'Visible opacity and translation entrance with stagger verified', errors, failedRequests }, null, 2) + '\n');
    console.log('Browser checks passed: four viewports, animation, selection, no overflow, no console errors or failed requests.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
