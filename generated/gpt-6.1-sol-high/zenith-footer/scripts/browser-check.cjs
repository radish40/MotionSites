const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const prefix = '/motionsites-results/zenith-footer/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const clean = decodeURIComponent(req.url.split('?')[0]);
  if (!clean.startsWith(prefix)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', clean.slice(prefix.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(4173, '0.0.0.0', r));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const report = {};
  try {
    for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      const errors = [], failedRequests = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('requestfailed', r => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
      await page.goto('http://localhost:4173' + prefix, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2, { timeout: 30000 });
      await page.waitForTimeout(1500);
      const before = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(400);
      const state = await page.evaluate(() => {
        const v = document.querySelector('video');
        return {
          viewport: { width: innerWidth, height: innerHeight },
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          video: { readyState: v.readyState, paused: v.paused, currentTime: v.currentTime, width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop, source: v.currentSrc },
          font: document.fonts.check('16px Geist'),
          footer: document.querySelector('footer').getBoundingClientRect().toJSON(),
          heading: document.querySelector('h2').textContent,
          buttons: [...document.querySelectorAll('button')].map(b => b.textContent),
          links: document.querySelectorAll('nav a').length,
        };
      });
      state.video.advancing = state.video.currentTime > before;
      const join = page.getByRole('button', { name: 'Join Today' });
      await join.hover();
      await page.waitForTimeout(300);
      state.hoverTransform = await join.evaluate(el => getComputedStyle(el).transform);
      await join.click();
      await page.getByRole('button', { name: 'View Clubs' }).click();
      await page.getByRole('link', { name: 'Vitality Lab' }).click();
      await page.keyboard.press('Tab');
      state.keyboardFocus = await page.evaluate(() => document.activeElement.textContent);
      await page.mouse.move(0, 0);
      await page.locator('h2').click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      report[name] = { ...state, errors, failedRequests };
      await page.close();
    }
    fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exit(1); });
