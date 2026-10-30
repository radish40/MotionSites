const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '../dist');
const prefix = '/motionsites-results/mindloop/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(prefix, '');
  const file = path.join(root, relative || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end(); return;
  }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [startText, endText] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(startText), end = endText ? Number(endText) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${size}` });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  }
});

(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      const page = await context.newPage();
      const errors = [], failedRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('requestfailed', req => failedRequests.push(req.url()));
      page.on('response', res => { if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`); });
      await page.goto(`http://127.0.0.1:4173${prefix}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').currentTime > .2);
      await page.waitForTimeout(1200);
      const initialTime = await page.locator('video').evaluate(video => video.currentTime);
      await page.waitForTimeout(300);
      const media = await page.locator('video').evaluate(video => ({ currentTime: video.currentTime, width: video.videoWidth, height: video.videoHeight, paused: video.paused, muted: video.muted, loop: video.loop, autoplay: video.autoplay, playsInline: video.playsInline, error: video.error }));
      assert(media.currentTime > initialTime && !media.paused && media.width > 0 && !media.error);
      assert(media.muted && media.loop && media.autoplay && media.playsInline);
      const layout = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        navVisible: getComputedStyle(document.querySelector('nav')).display !== 'none',
        headingFont: getComputedStyle(document.querySelector('h1')).fontFamily,
        bodyFont: getComputedStyle(document.body).fontFamily,
        fontsLoaded: document.fonts.check('48px "Instrument Serif"') && document.fonts.check('16px Inter'),
        heading: document.querySelector('h1').textContent,
      }));
      assert(layout.scrollWidth <= layout.clientWidth);
      assert.equal(layout.navVisible, name === 'desktop');
      assert(layout.fontsLoaded);
      assert.equal(layout.heading, 'Focus in a Distracted World');
      assert.equal(await page.getByRole('link', { name: 'Begin Journey', exact: true }).count(), 2);
      await page.locator('.hero-cta').click();
      assert.equal(new URL(page.url()).hash, '#home');
      if (name === 'desktop') {
        for (const link of await page.locator('nav a').all()) await link.click();
        await page.locator('.nav-cta').hover();
        await page.waitForTimeout(300);
        assert.equal(await page.locator('.nav-cta').evaluate(el => getComputedStyle(el).scale), '1.03');
      }
      await page.locator('.nav-cta').click();
      await page.keyboard.press('Tab');
      assert(await page.evaluate(() => document.activeElement.tagName === 'A'));
      await page.mouse.move(0, 0);
      await page.evaluate(() => document.activeElement.blur());
      await page.locator('video').evaluate(video => { video.pause(); video.currentTime = 2; });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      assert.deepEqual(errors, []);
      assert.deepEqual(failedRequests, []);
      results.push({ viewport: { width, height }, name, media, layout, errors, failedRequests, interactions: 'Both CTAs, keyboard focus, desktop navigation and hover passed; links return to the single hero.' });
      await context.close();
    }
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
