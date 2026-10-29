const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'pipe' });
  const base = 'http://127.0.0.1:4173/motionsites-results/travel-explorer/';
  let browser;
  const report = { viewports: [], errors: [], requestFailures: [] };
  try {
    for (let i = 0; i < 100; i++) {
      try { if ((await fetch(base)).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(`${name}: ${error.message}`));
      page.on('requestfailed', request => report.requestFailures.push({ viewport: name, url: request.url(), failure: request.failure()?.errorText }));
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('video').evaluate(video => new Promise((resolve, reject) => {
        if (video.readyState >= 2) return resolve();
        video.addEventListener('loadeddata', resolve, { once: true });
        video.addEventListener('error', () => reject(new Error('Video failed')), { once: true });
        setTimeout(() => reject(new Error('Video load timeout')), 15000);
      }));
      await page.waitForTimeout(1400);
      const home = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        video: { width: document.querySelector('video').videoWidth, playing: !document.querySelector('video').paused, time: document.querySelector('video').currentTime },
        fonts: { nomada: Array.from(document.fonts).some(f => f.family.replaceAll('"', '') === 'Nomada Didone' && f.status === 'loaded'), inter: Array.from(document.fonts).some(f => f.family.replaceAll('"', '') === 'Inter' && f.status === 'loaded') },
        frame: (() => { const r = document.querySelector('.phone-frame').getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; })(),
      }));
      assert.equal(home.overflow, false);
      assert.equal(home.frame.width, 340); assert.equal(home.frame.height, 740);
      assert(home.video.playing && home.video.width > 0 && home.video.time > 0);
      await page.screenshot({ path: `screenshots/${name}.png` });
      assert(home.fonts.nomada && home.fonts.inter);
      await page.getByRole('button', { name: 'Begin Your Journey' }).click();
      await page.waitForTimeout(1500);
      await page.getByRole('heading', { name: 'Elena Castillo' }).waitFor();
      const images = await page.locator('img').evaluateAll(images => images.map(image => ({ source: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0 })));
      assert(images.every(image => image.loaded));
      await page.screenshot({ path: `screenshots/${name}-explore.png` });
      const cardScroller = page.getByLabel('Destination cards; scroll horizontally to explore');
      await cardScroller.evaluate(element => { element.scrollLeft = element.scrollWidth; });
      assert(await cardScroller.evaluate(element => element.scrollLeft > 0));
      await page.getByRole('searchbox').fill('Japan');
      assert.equal(await page.locator('article').count(), 1);
      await page.getByRole('heading', { name: 'Japan', exact: true }).waitFor();
      await page.getByRole('button', { name: 'View all' }).click();
      assert.equal(await page.locator('article').count(), 4);
      await page.getByRole('button', { name: 'Europe', exact: true }).click();
      assert.equal(await page.locator('article').count(), 3);
      await page.getByRole('button', { name: 'South America', exact: true }).click();
      assert.equal(await page.locator('article').count(), 0);
      await page.getByRole('status').filter({ hasText: 'No destinations found' }).waitFor();
      await page.getByRole('button', { name: 'Home', exact: true }).click();
      assert.equal(await page.locator('article').count(), 4);
      await page.getByRole('button', { name: 'Explore', exact: true }).click();
      assert(await page.getByRole('searchbox').evaluate(element => document.activeElement === element));
      await page.getByRole('button', { name: 'Notifications', exact: true }).click();
      await page.getByText('No new notifications.').waitFor();
      await page.getByRole('button', { name: 'Close message' }).click();
      await page.getByRole('button', { name: 'Saved destinations', exact: true }).click();
      await page.getByText('No saved destinations yet. Explore somewhere new.').waitFor();
      await page.getByRole('button', { name: 'Close message' }).click();
      const exploreOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(exploreOverflow, false);
      await page.getByRole('button', { name: 'Profile', exact: true }).click();
      await page.getByRole('button', { name: 'Back to welcome' }).click();
      await page.getByRole('button', { name: 'Begin Your Journey' }).waitFor();
      report.viewports.push({ name, width, height, home, images, exploreOverflow, interactionChecks: 'passed' });
      await page.close();
    }
    assert.equal(report.errors.length, 0);
    report.status = 'passed';
  } catch (error) { report.status = 'failed'; report.error = error.stack; process.exitCode = 1; }
  finally {
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser?.close(); server.kill();
  }
})();
