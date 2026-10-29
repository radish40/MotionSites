const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/rocket-cta/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve('dist', url.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(data); });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://127.0.0.1:4173${base}`, checks: [], errors: [], consoleErrors: [], failedRequests: [], responses: [], viewports: {} };
  try {
    for (const [name, size] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
      const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push({ viewport: name, message: error.message }));
      page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ viewport: name, message: message.text() }); });
      page.on('requestfailed', request => report.failedRequests.push({ viewport: name, url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) report.responses.push({ viewport: name, url: response.url(), status: response.status() }); });
      await page.goto(report.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(async () => { await document.fonts.load('16px \"Material Symbols Outlined\"'); await document.fonts.ready; });
      await page.waitForTimeout(2200);
      await page.waitForFunction(() => document.querySelector('img').complete && document.querySelector('img').naturalWidth > 0);
      let videoLoaded = true;
      try { await page.waitForFunction(() => document.querySelector('video').readyState >= 2, { timeout: 30000 }); } catch { videoLoaded = false; }
      const beforeTime = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(700);
      const data = await page.evaluate(() => {
        const video = document.querySelector('video');
        const grass = document.querySelector('img');
        const dashboard = document.querySelector('#cta > div:nth-child(2)');
        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          sectionHeight: document.querySelector('#cta').getBoundingClientRect().height,
          fonts: { inter: document.fonts.check('16px Inter'), instrumentSerif: document.fonts.check('16px "Instrument Serif"'), materialSymbols: document.fonts.check('16px "Material Symbols Outlined"') },
          grass: { source: grass.currentSrc, width: grass.naturalWidth, height: grass.naturalHeight, fallback: grass.dataset.fallback, transform: getComputedStyle(grass).transform, zIndex: getComputedStyle(grass).zIndex },
          dashboard: { transform: getComputedStyle(dashboard).transform, zIndex: getComputedStyle(dashboard).zIndex },
          chatVisible: getComputedStyle(document.querySelector('[aria-label="Course conversation"]').parentElement.parentElement).display !== 'none',
          video: { source: video.currentSrc, readyState: video.readyState, width: video.videoWidth, height: video.videoHeight, time: video.currentTime, paused: video.paused, autoplay: video.autoplay, muted: video.muted, loop: video.loop, playsInline: video.playsInline, preload: video.preload, error: video.error?.message || null }
        };
      });
      report.viewports[name] = data;
      assert.equal(data.documentWidth, size.width, `${name} horizontal overflow`);
      assert.equal(data.chatVisible, name === 'desktop');
      assert.equal(await page.locator('h2').innerText(), 'Learn how can one go from 0 to $11.5k with AI in 60 days.');
      assert.ok(Object.values(data.fonts).every(Boolean), 'all required fonts loaded');
      assert.ok(videoLoaded && !data.video.paused && data.video.time > beforeTime, 'video plays');
      assert.equal(data.grass.width, 640);
      if (name === 'desktop') assert.equal(await page.locator('[aria-label="Course conversation"]').evaluate(el => el.scrollTop), 0);
      await page.screenshot({ path: `screenshots/${name}.png` });
      report.checks.push(`${name}: required copy, fonts, video playback, responsive chat visibility, loaded foreground, no horizontal overflow`);
      const button = page.getByRole('button', { name: 'Start for free' });
      await button.hover();
      await page.waitForTimeout(300);
      assert.notEqual(await button.locator('.animated-text > span').first().evaluate(el => getComputedStyle(el).transform), 'none');
      await button.focus();
      assert.ok(await button.evaluate(el => el === document.activeElement));
      report.checks.push(`${name}: CTA hover slide and keyboard focus`);
      if (name === 'desktop') {
        const input = page.getByRole('textbox', { name: 'Ask about the course' });
        await input.fill('How can I build a cinematic hero?');
        await input.press('Enter');
        await page.getByText('How can I build a cinematic hero?', { exact: true }).waitFor();
        await page.getByText("Let's build it together!", { exact: false }).waitFor();
        assert.equal(await input.inputValue(), '');
        let count = await page.locator('[aria-label="Course conversation"] > div').count();
        assert.equal(count, 5);
        await input.press('Enter');
        assert.equal(await page.locator('[aria-label="Course conversation"] > div').count(), count);
        await input.fill('First line');
        await input.press('Shift+Enter');
        await input.press('KeyA');
        assert.ok((await input.inputValue()).includes('\n'));
        await page.getByRole('button', { name: 'Send message', exact: true }).click();
        assert.equal(await page.locator('[aria-label="Course conversation"] > div').count(), 7);
        assert.equal(await input.inputValue(), '');
        report.checks.push('desktop: Enter sends user message and canned assistant reply, empty Enter ignored, Shift+Enter inserts newline, send button works, input clears');
      }
      await page.setViewportSize({ width: size.width, height: name === 'desktop' ? 700 : 600 });
      await page.waitForTimeout(250);
      const initialParallax = await page.evaluate(() => ({ dashboard: getComputedStyle(document.querySelector('#cta > div:nth-child(2)')).transform, grass: getComputedStyle(document.querySelector('img')).transform }));
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(350);
      const moved = await page.evaluate(() => ({ scrollY, dashboard: getComputedStyle(document.querySelector('#cta > div:nth-child(2)')).transform, grass: getComputedStyle(document.querySelector('img')).transform }));
      report.viewports[name].parallaxTestHeight = name === 'desktop' ? 700 : 600;
      report.viewports[name].beforeScroll = initialParallax;
      report.viewports[name].afterScroll = moved;
      if (moved.scrollY > 0) {
        assert.notEqual(moved.dashboard, initialParallax.dashboard);
        assert.notEqual(moved.grass, initialParallax.grass);
        report.checks.push(`${name}: both parallax layers move on scroll`);
      }
      await page.close();
    }
    assert.equal(report.errors.length, 0, 'no uncaught JavaScript errors');
    report.checks.push('No uncaught JavaScript errors');
    report.status = 'passed';
  } catch (error) { report.status = 'failed'; report.failure = error.stack; process.exitCode = 1; }
  finally { fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2)); await browser.close(); server.close(); }
  console.log(JSON.stringify(report, null, 2));
})();
