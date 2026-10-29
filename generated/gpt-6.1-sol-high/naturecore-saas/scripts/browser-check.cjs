const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const base = '/motionsites-results/naturecore-saas/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404).end(); return; }
  const relative = decodeURIComponent(req.url.slice(base.length).split('?')[0]) || 'index.html';
  const file = path.join(process.cwd(), 'dist', relative);
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const stat = fs.statSync(file);
  const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  if (range) {
    const start = Number(range[1]), end = range[2] ? Number(range[2]) : stat.size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end-start+1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.setHeader('Content-Length', stat.size); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const report = {};
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    const errors = [], failedRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2400);
    const initial = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
      font: document.fonts.check('16px Inter'),
      emojiFont: document.fonts.check('14px "Noto Color Emoji"', '🌱'),
      logoLoaded: document.querySelector('img').naturalWidth > 0,
      video: { width: document.querySelector('video').videoWidth, duration: document.querySelector('video').duration, currentTime: document.querySelector('video').currentTime },
      heading: document.querySelector('h1').getBoundingClientRect().toJSON(),
      navLinkCount: [...document.querySelectorAll('nav a')].filter(a => a.getBoundingClientRect().width > 0).length
    }));
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Explore Options' }).hover();
    await page.waitForTimeout(200);
    const hoverOpacity = await page.getByRole('button', { name: 'Explore Options' }).evaluate(el => getComputedStyle(el).opacity);
    await page.getByRole('button', { name: 'Explore Options' }).click();
    await page.getByRole('button', { name: 'Start Network' }).click();
    await page.getByRole('link', { name: 'Clean Energy', exact: true }).click();
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => ({ tag: document.activeElement.tagName, text: document.activeElement.textContent }));
    await page.waitForFunction(() => document.querySelector('[data-video-ready]').dataset.videoReady === 'true', null, { timeout: 60000 });
    const canvas = await page.evaluate(() => ({ visible: getComputedStyle(document.querySelector('canvas')).display !== 'none', width: document.querySelector('canvas').width, frame: document.querySelector('canvas').dataset.frame }));
    await page.waitForFunction(() => document.querySelector('canvas').dataset.direction === 'reverse', null, { timeout: 60000 });
    const reverse = await page.evaluate(() => document.querySelector('canvas').dataset.direction);
    assert.equal(initial.overflow, false);
    assert.equal(initial.font, true);
    assert.equal(initial.emojiFont, true);
    assert.equal(initial.logoLoaded, true);
    assert.equal(initial.navLinkCount, name === 'desktop' ? 8 : 2);
    assert.equal(canvas.visible, true);
    assert.equal(canvas.width, 960);
    assert.equal(reverse, 'reverse');
    assert.equal(hoverOpacity, '0.9');
    assert.deepEqual(errors, []);
    report[name] = { hoverOpacity, viewport, ...initial, canvas, reverse, focused, ctaClicks: 'pass (presentational controls per prompt)', errors, failedRequests };
    await page.close();
  }
  fs.writeFileSync('screenshots/checks.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  server.close();
})().catch(e => { console.error(e); process.exit(1); });
