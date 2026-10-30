const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve('dist');
const base = '/motionsites-results/10/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(root, url.pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const results = [];
  fs.mkdirSync('screenshots', { recursive: true });
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
    const errors = [], failedRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    let playbackError = null;
    try { await page.waitForFunction(() => document.querySelector('video').currentTime > 0, { timeout: 30000 }); }
    catch (error) { playbackError = error.message; }
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    const info = await page.evaluate(() => {
      const video = document.querySelector('video');
      const buttons = [...document.querySelectorAll('.cta')].map(el => ({ text: el.textContent.trim(), href: el.getAttribute('href'), bounds: el.getBoundingClientRect().toJSON() }));
      return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight,
        heading: document.querySelector('h1').getAttribute('aria-label'), buttons,
        video: { readyState: video.readyState, currentTime: video.currentTime, width: video.videoWidth, height: video.videoHeight, paused: video.paused, muted: video.muted, loop: video.loop, status: video.dataset.streamStatus || 'ok' } };
    });
    await page.getByRole('link', { name: 'Learn now' }).click();
    info.learnInteraction = await page.evaluate(() => location.hash === '#platform-overview' && document.activeElement.id === 'platform-overview');
    await page.keyboard.press('Tab');
    info.keyboardFocus = await page.evaluate(() => document.activeElement.tagName === 'A');
    info.bookCallHref = await page.getByRole('link', { name: 'Book A Free Call' }).getAttribute('href');
    results.push({ name, ...info, playbackError, errors, failedRequests });
    await page.close();
  }
  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(`http://localhost:4173${base}`);
  results.push({ name: 'reduced-motion', headingVisible: await reduced.getByRole('heading').isVisible() });
  fs.writeFileSync('screenshots/checks.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  server.close();
  for (const result of results.filter(result => result.name !== 'reduced-motion')) {
    if (result.scrollWidth !== result.width || result.scrollHeight !== result.height ||
        result.errors.length || result.failedRequests.length || result.playbackError ||
        result.video.paused || !result.video.muted || !result.video.loop ||
        !result.learnInteraction || !result.keyboardFocus || result.bookCallHref !== '/book-call') {
      throw new Error(`Browser checks failed: ${result.name}`);
    }
  }
  if (!results.at(-1).headingVisible) throw new Error('Reduced-motion heading is not visible');
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
