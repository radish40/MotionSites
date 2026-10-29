const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/nex-max-upgrade/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const relative = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { viewports: [], errors: [], failedRequests: [], httpErrors: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure() }));
      page.on('response', res => { if (res.status() >= 400) report.httpErrors.push({ url: res.url(), status: res.status() }); });
      await page.addInitScript(() => {
        window.__plays = 0;
        const play = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function (...args) { window.__plays++; return play.apply(this, args); };
      });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2000);
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v.currentTime > 0.1 && v.getVideoPlaybackQuality().totalVideoFrames > 0; }, null, { timeout: 60000 }).catch(async error => { console.log(JSON.stringify(report)); console.log(await page.locator('video').evaluate(v => ({readyState:v.readyState, error:v.error?.message, networkState:v.networkState, currentTime:v.currentTime, duration:v.duration, seeking:v.seeking, buffered:Array.from({length:v.buffered.length},(_,i)=>[v.buffered.start(i),v.buffered.end(i)]), ua:navigator.userAgent}))); throw error; });
      await page.screenshot({ path: `screenshots/${viewport.width === 1440 ? 'desktop' : 'mobile'}.png`, fullPage: false });
      const layout = await page.evaluate(() => {
        const v = document.querySelector('video');
        return {
          viewport: { width: innerWidth, height: innerHeight },
          document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          gridColumns: getComputedStyle(document.querySelector('.c4-grid')).gridTemplateColumns,
          cards: document.querySelectorAll('.c4-card').length,
          fontLoaded: document.fonts.check('400 16px Inter'),
          video: { duration: v.duration, readyState: v.readyState, paused: v.paused, currentTime: v.currentTime, decodedFrames: v.getVideoPlaybackQuality().totalVideoFrames, nativePlayCalls: window.__plays, error: v.error?.message || null }
        };
      });
      await page.getByRole('button', { name: 'Download Nex to start' }).click();
      layout.buttonClickable = true;
      await page.getByRole('link', { name: 'Usage Policy' }).click();
      layout.policyHref = await page.getByRole('link', { name: 'Usage Policy' }).getAttribute('href');
      await page.keyboard.press('Tab');
      if (viewport.width === 1440) {
        layout.boomerang = await page.evaluate(async () => {
          const v = document.querySelector('video');
          const sample = async (count) => {
            const times = [];
            for (let i = 0; i < count; i++) { await new Promise(r => setTimeout(r, 50)); times.push(v.currentTime); }
            return times;
          };
          v.currentTime = v.duration - 0.02;
          const upper = await sample(200);
          v.currentTime = 0.01;
          const lower = await sample(60);
          return { upper, lower, reversedAtEnd: upper.some((x,i) => i && x < upper[i-1]), reversedAtStart: lower.some((x,i) => i && x > lower[i-1]), paused: v.paused, nativePlayCalls: window.__plays };
        });
      }
      report.viewports.push(layout);
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    if (report.errors.length || report.httpErrors.length || report.viewports.some(v => v.horizontalOverflow || v.video.error || !v.fontLoaded) || !report.viewports[0].boomerang.reversedAtEnd || !report.viewports[0].boomerang.reversedAtStart) process.exitCode = 1;
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
