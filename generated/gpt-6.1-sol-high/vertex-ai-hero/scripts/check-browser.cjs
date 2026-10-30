const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/vertex-ai-hero/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', pathname.slice(prefix.length) || 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${prefix}`, viewports: {}, errors: [], failedRequests: [], badResponses: [], mediaCancellations: [] };
  try {
    for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', e => report.errors.push({ viewport: name, message: e.message }));
      page.on('requestfailed', r => {
        const entry = { viewport: name, url: r.url(), failure: r.failure() };
        if (r.resourceType() === 'media' && r.failure()?.errorText === 'net::ERR_ABORTED') report.mediaCancellations.push(entry);
        else report.failedRequests.push(entry);
      });
      page.on('response', r => { if (r.status() >= 400) report.badResponses.push({ viewport: name, url: r.url(), status: r.status() }); });
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 3 && !v.paused && v.currentTime > 0; }, { timeout: 30000 });
      const before = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(500);
      const info = await page.evaluate(() => {
        const v = document.querySelector('video');
        const hero = document.querySelector('.hero-section').getBoundingClientRect();
        const bounds = [...document.querySelectorAll('nav, h1, button, .description')].map(e => ({ text: e.textContent.trim(), rect: e.getBoundingClientRect().toJSON() }));
        return {
          title: document.title,
          viewport: { width: innerWidth, height: innerHeight },
          hero: { width: hero.width, height: hero.height },
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          bounds,
          fonts: { inter: document.fonts.check('400 16px Inter'), cormorant: document.fonts.check('italic 400 16px "Cormorant Garamond"') },
          video: { currentTime: v.currentTime, duration: v.duration, width: v.videoWidth, height: v.videoHeight, paused: v.paused, muted: v.muted, loop: v.loop, autoplay: v.autoplay, playsInline: v.playsInline, objectFit: getComputedStyle(v).objectFit, zIndex: getComputedStyle(v).zIndex },
          navLinksDisplay: getComputedStyle(document.querySelector('.nav-links')).display,
          footerDirection: getComputedStyle(document.querySelector('.footer-elements')).flexDirection,
          headline: { fontSize: getComputedStyle(document.querySelector('h1')).fontSize, lineHeight: getComputedStyle(document.querySelector('h1')).lineHeight },
        };
      });
      assert(info.video.currentTime > before, 'Video advances');
      assert(info.video.muted && info.video.loop && info.video.autoplay && info.video.playsInline);
      assert(info.fonts.inter && info.fonts.cormorant, 'Fonts loaded');
      assert(!info.horizontalOverflow, 'No horizontal overflow');
      assert.equal(info.hero.width, viewport.width);
      assert.equal(info.hero.height, viewport.height);
      for (const b of info.bounds) if (b.rect.width > 0) {
        assert(b.rect.x >= 0 && b.rect.right <= viewport.width + 1 && b.rect.y >= 0 && b.rect.bottom <= viewport.height + 1, `Visible bounds: ${b.text}`);
      }
      await page.locator('video').evaluate(v => { v.currentTime = v.duration - 0.3; });
      await page.waitForFunction(() => document.querySelector('video').currentTime < 2, null, { timeout: 10000 });
      info.video.loopWrapVerified = true;
      info.interactions = {};
      for (const selector of ['.login-btn', '.cta-btn', '.tag-btn', '.icon-btn', ...(name === 'desktop' ? ['.nav-link'] : [])]) {
        await page.locator(selector).first().hover();
        await page.waitForTimeout(350);
        info.interactions[selector] = await page.locator(selector).first().evaluate(e => ({ transform: getComputedStyle(e).transform, background: getComputedStyle(e).backgroundColor, color: getComputedStyle(e).color }));
      }
      assert.equal(info.interactions['.login-btn'].transform, 'matrix(1, 0, 0, 1, 0, -1)');
      assert.equal(info.interactions['.cta-btn'].transform, 'matrix(1.05, 0, 0, 1.05, 0, 0)');
      assert.match(info.interactions['.icon-btn'].transform, /0.707107/);
      if (name === 'desktop') {
        for (const label of ['Product', 'Platform', 'Customers', 'Company']) {
          await page.getByRole('link', { name: label, exact: true }).click();
          assert.equal(new URL(page.url()).hash, '#' + label.toLowerCase());
        }
        info.navigationHashesVerified = true;
        await page.goto(report.url, { waitUntil: 'networkidle' });
      }
      for (const selector of ['.login-btn', '.cta-btn', '.tag-btn', '.icon-btn']) await page.locator(selector).first().click();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(350);
      await page.locator('video').evaluate(async v => {
        v.pause();
        v.currentTime = Math.min(3, v.duration / 2);
        await new Promise(resolve => v.addEventListener('seeked', resolve, { once: true }));
      });
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      report.viewports[name] = info;
      await page.close();
    }
    assert.equal(report.errors.length, 0, 'No script errors');
    assert.equal(report.failedRequests.length, 0, 'No failed asset requests');
    assert.equal(report.badResponses.length, 0, 'No HTTP errors');
    report.status = 'passed';
  } catch (e) {
    report.status = 'failed'; report.failure = e.stack; process.exitCode = 1;
  } finally {
    fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ status: report.status, viewports: Object.keys(report.viewports), errors: report.errors, failedRequests: report.failedRequests, mediaCancellations: report.mediaCancellations.length, failure: report.failure }, null, 2));
    await browser.close();
    server.close();
  }
})();
