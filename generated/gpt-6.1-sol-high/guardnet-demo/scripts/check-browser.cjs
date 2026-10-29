const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'pipe' });
  let browser;
  const reports = [];
  try {
    for (let i = 0; i < 50; i++) {
      try { if ((await fetch('http://127.0.0.1:4173/motionsites-results/guardnet-demo/')).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [], failedRequests = [], httpErrors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) httpErrors.push({ url: response.url(), status: response.status() }); });
      await page.goto('http://127.0.0.1:4173/motionsites-results/guardnet-demo/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2, { timeout: 30000 });
      const before = await page.locator('video').evaluate(video => video.currentTime);
      await page.waitForTimeout(500);
      const layout = await page.evaluate(() => {
        const video = document.querySelector('video');
        const grid = document.querySelector('[aria-label="companies"] > div');
        return {
          viewportWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth,
          mainWidth: document.querySelector('main').getBoundingClientRect().width,
          sectionCount: document.querySelectorAll('main > section').length,
          gridColumns: getComputedStyle(grid).gridTemplateColumns,
          fontLoaded: document.fonts.check('18px "Futura Md BT Medium"'),
          video: { readyState: video.readyState, currentTime: video.currentTime, paused: video.paused, muted: video.muted, loop: video.loop, videoWidth: video.videoWidth, videoHeight: video.videoHeight },
          buttonsInBounds: [...document.querySelectorAll('button')].every(button => { const r = button.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }),
        };
      });
      assert.equal(layout.scrollWidth, width, 'horizontal overflow');
      assert.equal(layout.sectionCount, 2);
      assert.equal(layout.buttonsInBounds, true);
      assert.equal(layout.video.paused, false);
      assert.ok(layout.video.currentTime > before, 'video advances');
      assert.equal(layout.gridColumns.split(' ').length, name === 'desktop' ? 4 : 2);
      const ghost = page.getByRole('button', { name: 'confirm real person' });
      await ghost.hover();
      await page.waitForTimeout(200);
      const hoverColor = await ghost.evaluate(element => getComputedStyle(element).color);
      assert.equal(hoverColor, 'rgb(255, 255, 255)');
      await ghost.click();
      await page.getByRole('button', { name: 'run demo', exact: true }).first().click();
      await page.getByRole('button', { name: 'Run Demo', exact: true }).click();
      await page.keyboard.press('Tab');
      await ghost.focus();
      const focusOutline = await ghost.evaluate(element => getComputedStyle(element).outlineStyle);
      assert.equal(focusOutline, 'solid');
      await ghost.evaluate(element => element.blur());
      await page.mouse.move(0, 0);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      assert.deepEqual(errors, []);
      reports.push({ name, viewport: { width, height }, ...layout, hoverColor, focusOutline, buttonClicks: 'all three buttons clickable; no workflow specified', errors, failedRequests, httpErrors });
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(reports, null, 2) + '\n');
    console.log(JSON.stringify(reports, null, 2));
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
