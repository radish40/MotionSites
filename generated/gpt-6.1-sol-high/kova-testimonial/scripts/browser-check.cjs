const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/kova-testimonial/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  if (!rel.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', rel.slice(base.length) || 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${base}`, viewports: [], errors: [], failedRequests: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const mobile = viewport.width === 390;
      const page = await browser.newPage({ viewport });
      page.on('pageerror', e => report.errors.push(e.message));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
      page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1500);
      const video = page.locator('video');
      const initialVideoOpacity = await video.evaluate(el => getComputedStyle(el.parentElement.parentElement).opacity);
      await video.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2, { timeout: 30000 });
      const metrics = await page.evaluate(() => {
        const v = document.querySelector('video');
        const grid = document.querySelector('section > div');
        const rect = v.getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          fonts: {
            light: document.fonts.check('18px "Cooper BT W01 Light"'),
            medium: document.fonts.check('30px "Cooper BT W01 Medium"'),
            loadedFaces: [...document.fonts].map(f => ({ family: f.family, status: f.status })),
          },
          headingSize: getComputedStyle(document.querySelector('h2')).fontSize,
          quoteSize: getComputedStyle(document.querySelector('blockquote')).fontSize,
          gridColumns: getComputedStyle(grid).gridTemplateColumns,
          video: { width: rect.width, height: rect.height, paused: v.paused, muted: v.muted, loop: v.loop, playsInline: v.playsInline, currentTime: v.currentTime, readyState: v.readyState, error: v.error?.message || null },
          animation: getComputedStyle(v.parentElement.parentElement).opacity,
        };
      });
      assert.equal(metrics.overflow, false, 'No horizontal overflow');
      assert.equal(metrics.fonts.light, true, 'Light font loaded');
      assert.equal(metrics.fonts.medium, true, 'Medium font loaded');
      assert.ok(metrics.fonts.loadedFaces.every(f => f.status === 'loaded'));
      assert.equal(metrics.headingSize, mobile ? '24px' : '30px');
      assert.equal(metrics.quoteSize, mobile ? '18px' : '24px');
      assert.equal(metrics.video.width, metrics.video.height);
      assert.equal(metrics.video.paused, false);
      assert.equal(metrics.video.muted, true);
      assert.equal(metrics.video.loop, true);
      assert.equal(metrics.video.playsInline, true);
      assert.ok(metrics.video.currentTime > 0);
      assert.equal(metrics.animation, '1');
      const button = page.getByRole('button', { name: 'All Stories' });
      await button.hover();
      await page.waitForTimeout(250);
      assert.equal(await button.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(26, 46, 31)');
      await page.mouse.move(0, 0);
      await button.focus();
      assert.equal(await button.evaluate(el => document.activeElement === el), true);
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
      await button.evaluate(el => el.blur());
      await page.waitForTimeout(250);
      await page.evaluate(() => { const v = document.querySelector('video'); v.pause(); v.currentTime = 1.5; window.scrollTo(0, 0); });
      await page.waitForTimeout(400);
      await page.screenshot({ path: `/work/screenshots/${mobile ? 'mobile' : 'desktop'}.png`, fullPage: true });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.equal(await page.locator('h2').evaluate(el => getComputedStyle(el.parentElement).opacity), '1', 'Animation fires once');
      report.viewports.push({ viewport, initialVideoOpacity, ...metrics, buttonHover: 'passed', buttonKeyboard: 'passed', animationOnce: 'passed', screenshot: `screenshots/${mobile ? 'mobile' : 'desktop'}.png` });
      await page.close();
    }
    const scrollPage = await browser.newPage({ viewport: { width: 390, height: 400 } });
    await scrollPage.goto(report.url, { waitUntil: 'networkidle' });
    await scrollPage.waitForTimeout(1400);
    const offscreenVideo = scrollPage.locator('video');
    assert.equal(await offscreenVideo.evaluate(el => getComputedStyle(el.parentElement.parentElement).opacity), '0');
    await offscreenVideo.scrollIntoViewIfNeeded();
    await scrollPage.waitForTimeout(1200);
    assert.equal(await offscreenVideo.evaluate(el => getComputedStyle(el.parentElement.parentElement).opacity), '1');
    report.scrollTrigger = 'passed: offscreen video stays hidden until scrolled into view';
    await scrollPage.close();
    assert.deepEqual(report.errors, []);
    assert.deepEqual(report.failedRequests, []);
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.failure = error.stack;
    process.exitCode = 1;
  } finally {
    fs.writeFileSync('/work/screenshots/browser-report.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
    server.close();
  }
})();
