const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');

const base = '/motionsites-results/skybridge-404/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.resolve('dist', url.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/') || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  if (range) {
    const start = Number(range[1]);
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  }
});

function assert(condition, message) { if (!condition) throw new Error(message); }

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { browser: await browser.version(), pages: [], errors: [], failedRequests: [], mediaRequestCancellations: [] };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['short', 390, 360], ['narrow', 320, 568]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width <= 640, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
      page.on('requestfailed', req => {
        const entry = { url: req.url(), error: req.failure()?.errorText };
        if (req.resourceType() === 'media' && entry.error === 'net::ERR_ABORTED') report.mediaRequestCancellations.push(entry);
        else report.failedRequests.push(entry);
      });
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3);
      const before = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(350);
      const state = await page.evaluate(() => {
        const v = document.querySelector('video');
        const c = document.querySelector('.error-content');
        const h = document.querySelector('h1');
        const bounds = e => { const r = e.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; };
        return {
          viewport: { width: innerWidth, height: innerHeight },
          scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight,
          content: bounds(c), heading: bounds(h), logo: bounds(document.querySelector('.brand')),
          divider: bounds(document.querySelector('.divider')),
          fontLoaded: document.fonts.check('600 24px "Geist Mono:SemiBold"'),
          fontSize: getComputedStyle(h).fontSize, gap: getComputedStyle(c).gap,
          video: { currentTime: v.currentTime, duration: v.duration, paused: v.paused, muted: v.muted, loop:v.loop, autoplay:v.autoplay, playsInline:v.playsInline, opacity:getComputedStyle(v).opacity, width:v.videoWidth, height:v.videoHeight },
          firstChildIsVideo: document.querySelector('main').firstElementChild === v,
          contentChildren: c.children.length,
          uiCount: document.querySelectorAll('button,a,input,[tabindex]').length,
          message: document.querySelector('p').textContent,
        };
      });
      assert(state.fontLoaded, `${name}: font not loaded`);
      assert(state.video.currentTime > before && !state.video.paused, `${name}: autoplay did not advance`);
      assert(state.video.muted && state.video.loop && state.video.autoplay && state.video.playsInline && state.video.opacity === '1', `${name}: video attributes`);
      assert(state.scrollWidth === width, `${name}: horizontal overflow`);
      assert(state.firstChildIsVideo && state.contentChildren === 3 && state.uiCount === 0, `${name}: structure`);
      assert(Math.abs(state.content.x + state.content.width / 2 - width / 2) < 1, `${name}: horizontal center`);
      assert(Math.abs(state.content.y + state.content.height / 2 - state.scrollHeight / 2) < 1, `${name}: vertical center`);
      assert(state.content.y > state.logo.y + state.logo.height, `${name}: logo overlaps content`);
      if (name !== 'short') assert(state.scrollHeight === height, `${name}: unnecessary vertical scroll`);
      await page.keyboard.press('Tab');
      assert(await page.evaluate(() => document.activeElement === document.body), `${name}: unexpected tab stop`);
      await page.locator('video').evaluate(async v => {
        const seeked = new Promise(resolve => v.addEventListener('seeked', resolve, { once: true }));
        v.currentTime = v.duration - 0.3;
        await seeked;
        await v.play();
      });
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v.currentTime < 2 && !v.paused; }, { timeout: 10000 });
      assert(await page.locator('video').evaluate(v => v.currentTime < 2 && !v.paused), `${name}: video loop failed`);
      // Fix only the video timestamp for repeatable evidence of the real page.
      await page.locator('video').evaluate(async v => { v.pause(); const seeked = new Promise(resolve => v.addEventListener('seeked', resolve, { once: true })); v.currentTime = 1; await seeked; });
      if (name === 'desktop' || name === 'mobile') await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      report.pages.push({ name, ...state, autoplayPassed: true, loopPassed: true, tabPassed: true });
      await page.close();
    }
    assert(report.errors.length === 0, 'Browser console or script errors');
    assert(report.failedRequests.length === 0, 'Failed network requests');
    report.passed = true;
  } finally {
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(report, null, 2) + '\n');
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
