const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/sync-ai/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', decodeURIComponent(req.url.slice(prefix.length)).split('?')[0] || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [startRaw, endRaw] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(startRaw); const end = endRaw ? Number(endRaw) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end-start+1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size }); fs.createReadStream(file).pipe(res);
  }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const report = { url: `http://localhost:4173${prefix}`, views: [], errors: [], consoleErrors: [], httpErrors: [], requestFailures: [] };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(String(error)));
      page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ url: response.url(), status: response.status() }); });
      page.on('requestfailed', req => report.requestFailures.push({ url: req.url(), error: req.failure().errorText }));
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1600);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
      const time1 = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(400);
      const state = await page.evaluate(async () => {
        const video = document.querySelector('video');
        return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, video: { readyState: video.readyState, currentTime: video.currentTime, paused: video.paused, muted: video.muted, loop: video.loop, width: video.videoWidth, height: video.videoHeight }, font: document.fonts.check('400 16px Inter'), heading: document.querySelector('h1').innerText, ctaVisible: document.querySelector('h1').getBoundingClientRect().bottom < innerHeight };
      });
      assert(state.document.width <= width && state.document.height <= height, `${name}: overflow`);
      assert(!state.video.paused && state.video.currentTime > time1, `${name}: video must play`);
      assert(state.font, `${name}: font missing`);
      assert.equal(await page.locator('footer span').count(), 5);
      await page.screenshot({ path: `/work/screenshots/${name}.png` });
      await page.getByRole('button', { name: 'Begin Free Trial', exact: true }).click();
      if (name === 'mobile') {
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        await assert.doesNotReject(() => page.getByRole('navigation', { name: 'Mobile navigation' }).waitFor({state:'visible'}));
        assert.equal(await page.getByRole('button', {name:'Close menu'}).getAttribute('aria-expanded'), 'true');
        await page.screenshot({ path: '/work/screenshots/mobile-menu.png' });
        await page.getByRole('button', { name: 'Close menu', exact: true }).click();
        assert.equal(await page.locator('#mobile-menu').count(), 0);
        await page.getByRole('button', {name:'Open menu',exact:true}).click();
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#mobile-menu').count(), 0);
        state.menuChecks = 'open, close, aria-expanded, Escape passed';
      } else {
        assert.equal(await page.getByRole('button', {name:'Solutions',exact:true}).count(), 1);
        await page.getByRole('button', {name:'Get started free',exact:true}).click();
      }
      report.views.push({ name, ...state });
      await page.close();
    }
    fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    assert.equal(report.errors.length, 0);
    assert.equal(report.consoleErrors.length, 0);
    assert.equal(report.httpErrors.length, 0);
    assert.equal(report.requestFailures.length, 0);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exit(1); });
