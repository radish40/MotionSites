const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/guardnet-benefits/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(process.cwd(), 'dist', url.pathname.slice(base.length) || 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [], failures = [], responses = [];
      page.on('pageerror', error => errors.push(String(error)));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('requestfailed', req => failures.push({ url: req.url(), error: req.failure().errorText }));
      page.on('response', res => { if (res.status() >= 400) responses.push({ url: res.url(), status: res.status() }); });
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2, { timeout: 30000 });
      const state = await page.evaluate(async () => {
        const video = document.querySelector('video');
        const firstTime = video.currentTime;
        await new Promise(resolve => setTimeout(resolve, 1200));
        const cards = [...document.querySelectorAll('article')].map(el => {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        });
        return {
          title: document.title, heading: document.querySelector('h1').textContent,
          overflow: document.documentElement.scrollWidth > innerWidth,
          fontLoaded: document.fonts.check('16px "Futura Md BT Medium"'),
          fonts: [...document.fonts].map(f => ({ family: f.family, status: f.status })),
          cards,
          video: { readyState: video.readyState, playing: !video.paused, advanced: video.currentTime > firstTime, muted: video.muted, loop: video.loop, playsInline: video.playsInline, width: video.videoWidth, height: video.videoHeight }
        };
      });
      assert.equal(state.heading, 'Key Benefits');
      assert.equal(state.overflow, false);
      assert.equal(state.cards.length, 3);
      assert.equal(state.video.playing, true);
      assert.equal(state.video.advanced, true);
      assert.equal(state.video.muted && state.video.loop && state.video.playsInline, true);
      assert.equal(state.cards[0].height, width < 640 ? 380 : 460);
      assert.equal(state.cards[0].y === state.cards[1].y, width >= 768);
      assert.equal(errors.length, 0, JSON.stringify(errors));
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      results.push({ viewport: { width, height }, name, ...state, errors, failures, responses });
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
