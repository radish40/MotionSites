const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/railroad.ai/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const filename = path.join('/work/dist', decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  if (!fs.existsSync(filename)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' });
  fs.createReadStream(filename).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const report = { errors: [], failedRequests: [], checks: [] };
  try {
    for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', e => report.errors.push(e.message));
      page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), failure: r.failure() }));
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.locator('video').evaluate(v => new Promise((resolve, reject) => {
        if (v.readyState >= 2) return resolve();
        v.addEventListener('loadeddata', resolve, { once: true });
        setTimeout(() => reject(new Error('Video not ready')), 15000);
      }));
      const video = await page.locator('video').evaluate(v => ({ width: v.videoWidth, height: v.videoHeight, paused: v.paused, time: v.currentTime, muted: v.muted, loop: v.loop, inline: v.playsInline }));
      assert(video.width > 0 && !video.paused && video.time > 0 && video.muted && video.loop && video.inline);
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, height: innerHeight }));
      assert(layout.scrollWidth <= viewport.width, 'No horizontal overflow');
      assert(layout.scrollHeight <= viewport.height, 'Hero fits viewport');
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      await page.getByRole('button', { name: 'Get Started' }).click();
      assert(await page.locator('#email').evaluate(e => e === document.activeElement));
      await page.getByRole('button', { name: 'Join Waitlist' }).click();
      assert(await page.locator('#email').evaluate(e => !e.validity.valid));
      await page.locator('#email').fill('reader@example.com');
      await page.getByRole('button', { name: 'Join Waitlist' }).click();
      await page.getByRole('status').filter({ hasText: 'Email saved on this device' }).waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem('railroad-waitlist-email')), 'reader@example.com');
      if (name === 'desktop') {
        for (const nav of ['Voyages', 'Worlds', 'Innovation', 'Home']) {
          await page.getByRole('link', { name: nav, exact: true }).click();
          assert.equal(new URL(page.url()).hash, '#' + nav.toLowerCase());
        }
      } else { assert.equal(await page.locator('nav').isVisible(), false); }
      report.checks.push({ viewport: name, dimensions: viewport, video, layout, screenshot: `screenshots/${name}.png`, interactions: 'Get Started focus; required email; valid submission; local persistence; navigation visibility and desktop anchor links' });
      await page.close();
    }
    assert.equal(report.errors.length, 0);
    fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
