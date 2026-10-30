const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('/app/node_modules/playwright-core');
const root = path.resolve('dist');
const prefix = '/motionsites-results/rivr-hero/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const name = decodeURIComponent(req.url.split('?')[0].slice(prefix.length)) || 'index.html';
  const file = path.resolve(root, name);
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      const page = await context.newPage();
      const errors = [], failedRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
      await page.goto('http://127.0.0.1:4173' + prefix, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('video').evaluate(video => new Promise((resolve, reject) => {
        if (video.readyState >= 2) return resolve();
        video.addEventListener('loadeddata', resolve, { once: true });
        setTimeout(() => reject(new Error('Video did not load')), 25000);
      }));
      await page.waitForTimeout(1500);
      const firstTime = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(350);
      const media = await page.locator('video').evaluate(v => ({ src: v.currentSrc, width: v.videoWidth, height: v.videoHeight, currentTime: v.currentTime, paused: v.paused, muted: v.muted, loop: v.loop, playsInline: v.playsInline }));
      const demo = page.getByRole('button', { name: 'Book Demo' });
      const before = await demo.boundingBox();
      await demo.hover();
      await page.waitForTimeout(300);
      const hovered = await demo.boundingBox();
      await demo.click();
      await page.getByRole('button', { name: 'Join Discord' }).click();
      await page.getByText('Library', { exact: true }).click();
      if (name === 'desktop') {
        for (const item of ['Ecosystem', 'Economics', 'Developers', 'Governance']) await page.getByText(item, { exact: true }).hover();
      }
      await page.mouse.move(1, 1);
      await page.waitForTimeout(350);
      const layout = await page.evaluate(() => ({
        viewportWidth: innerWidth, viewportHeight: innerHeight,
        scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight,
        fontLoaded: document.fonts.check('16px "Helvetica Regular"'),
        mainCount: document.querySelectorAll('main').length,
        heading: document.querySelector('h1').textContent,
        visibleOverflow: [...document.querySelectorAll('main *')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width && r.height && (r.left < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1);
        }).map(el => el.tagName + '.' + el.className).slice(0, 10)
      }));
      await page.locator('video').evaluate(async video => {
        video.pause();
        video.currentTime = 2;
        await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
      });
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      const result = { name, width, height, errors, failedRequests, media, autoplayAdvanced: media.currentTime > firstTime, hoverScale: hovered.width / before.width, interactions: 'Specified hover and tap surfaces checked; no destinations supplied by prompt.', layout };
      results.push(result);
      if (errors.length || failedRequests.length || !result.autoplayAdvanced || !layout.fontLoaded || layout.visibleOverflow.length || layout.scrollWidth > width || layout.scrollHeight > height) throw new Error(`${name} verification failed: ${JSON.stringify(result)}`);
      await context.close();
    }
  } finally {
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results, null, 2) + '\n');
    await browser.close();
    server.close();
  }
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
