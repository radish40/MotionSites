const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/eco-intelligence/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const report = { path: base, checks: [], errors: [], failedRequests: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844], ['tablet',640,900]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
      page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
      page.on('response', res => { if(res.status() >= 400) report.errors.push(`${res.status()} ${res.url()}`); });
      await page.goto('http://localhost:4173' + base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 3 && v.currentTime > 0; });
      const details = await page.evaluate(() => {
        const v = document.querySelector('video');
        const card = document.getElementById('findings').getBoundingClientRect();
        return { viewport: [innerWidth, innerHeight], document: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], video: { readyState: v.readyState, width: v.videoWidth, height: v.videoHeight, playing: !v.paused, currentTime: v.currentTime }, fonts: { bebas: document.fonts.check('20px "Bebas Neue"'), helvetica: document.fonts.check('20px "Helvetica Neue Light"') }, card: { x: card.x, right: card.right, bottom: card.bottom }, headingColor: getComputedStyle(document.querySelector('h1')).color };
      });
      assert.ok(details.document[0] <= width, 'No horizontal overflow');
      assert.ok(details.card.right <= width && details.card.x >= 0, 'Findings card within viewport');
      assert.ok(details.card.bottom <= height, 'Hero content within viewport');
      assert.ok(details.video.playing && details.video.width > 0, 'Background video playing');
      assert.ok(details.fonts.bebas && details.fonts.helvetica, 'Both fonts loaded');
      await page.evaluate(async () => { const v = document.querySelector('video'); v.pause(); v.currentTime = 2; await new Promise(r => v.addEventListener('seeked', r, {once:true})); });
      if (name !== 'tablet') await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      await page.getByRole('button', { name: /menu/i }).click();
      await page.waitForTimeout(750);
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      assert.equal(await page.getByRole('dialog').getByRole('link').count(), 6);
      assert.ok(await page.getByRole('button', {name: 'Close'}).evaluate(el => document.activeElement === el));
      await page.keyboard.press('Shift+Tab');
      assert.ok(await page.getByRole('link', {name:'hello@terranova.earth',exact:true}).evaluate(el => document.activeElement === el));
      if (name !== 'tablet') await page.screenshot({ path: `/work/screenshots/${name}-menu.png`, fullPage: true });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(550);
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      await page.getByRole('link', {name:'Start listening'}).click();
      assert.ok(page.url().endsWith('#findings'));
      await page.getByRole('button', { name: /menu/i }).click();
      await page.waitForTimeout(650);
      await page.getByRole('link', { name:'Research', exact:true }).click();
      await page.waitForTimeout(550);
      assert.equal(await page.getByRole('button', {name:/menu/i}).getAttribute('aria-expanded'), 'false');
      const book = await page.getByRole('link', {name:'Book a call'}).getAttribute('href');
      assert.ok(book.startsWith('mailto:hello@terranova.earth'));
      if (name === 'desktop') {
        await page.getByRole('button', {name:/menu/i}).click();
        await page.waitForTimeout(550);
        await page.mouse.click(1000, 200);
        await page.waitForTimeout(550);
        assert.equal(await page.getByRole('button', {name:/menu/i}).getAttribute('aria-expanded'), 'false');
      }
      report.checks.push({ name, ...details, interactions: 'Menu opens, focus enters and traps, Escape closes and restores scroll, nav closes, CTA targets findings, call uses email; desktop backdrop closes.' });
      await page.close();
    }
    assert.equal(report.errors.length,0, 'No browser errors');
    assert.equal(report.failedRequests.length,0, 'No failed assets');
    report.status = 'passed';
  } catch (err) { report.status = 'failed'; report.failure = err.stack; process.exitCode = 1; }
  fs.writeFileSync('/work/screenshots/browser-report.json', JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close(); server.close();
})().catch(err => { console.error(err); process.exit(1); });
