const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const server = spawn('npm', ['run', 'preview', '--', '--port', '4173'], { stdio: 'ignore' });
const base = 'http://127.0.0.1:4173/motionsites-results/blog-showcase/';
(async () => {
  let browser;
  try {
    for (let i = 0; i < 50; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise(r => setTimeout(r, 200)); }
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const results = { scriptErrors: [], failedRequests: [], viewports: [], interactions: {} };
    const page = await browser.newPage();
    page.on('pageerror', error => results.scriptErrors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) results.failedRequests.push({ url: response.url(), status: response.status() }); });
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844],['tablet',1024,1000],['small',768,1000]]) {
      await page.setViewportSize({ width, height });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2));
      const state = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        gridColumns: getComputedStyle(document.querySelector('.post-grid')).gridTemplateColumns.split(' ').length,
        featuredColumns: getComputedStyle(document.querySelector('.featured')).gridTemplateColumns.split(' ').length,
        headingSize: getComputedStyle(document.querySelector('h1')).fontSize,
        fontsLoaded: document.fonts.check('500 64px Outfit') && document.fonts.check('400 17px Inter'),
        videos: [...document.querySelectorAll('video')].map(v => ({ playing: !v.paused, muted: v.muted, loop: v.loop, inline: v.playsInline, width: v.videoWidth, height: v.videoHeight, readyState: v.readyState, currentTime: v.currentTime }))
      }));
      assert.equal(state.width, state.scrollWidth, `${name}: overflow`);
      assert(state.fontsLoaded, `${name}: fonts`);
      assert.equal(state.videos.length, 4);
      assert(state.videos.every(v => v.muted && v.loop && v.inline && v.width > 0), `${name}: video attributes`);
      for (const video of await page.locator('video').all()) {
        await video.scrollIntoViewIfNeeded();
        await page.waitForFunction(el => !el.paused && el.currentTime > 0, await video.elementHandle());
        assert(await video.evaluate(v => !v.paused && v.currentTime > 0), `${name}: visible playback`);
      }
      results.interactions.visiblePlayback = 'All four videos play when scrolled into view at every tested viewport';
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      assert.equal(state.gridColumns, width <= 768 ? 1 : width <= 1024 ? 2 : 3);
      assert.equal(state.featuredColumns, width <= 1024 ? 1 : 2);
      results.viewports.push({ name, ...state });
      if (name === 'desktop' || name === 'mobile') {
        await page.mouse.move(0,0);
        await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      }
      if (name === 'desktop') {
        for (const frame of await page.locator('.video-frame').all()) {
          await frame.hover(); await page.waitForTimeout(550);
          const hover = await frame.evaluate(el => ({ transform: getComputedStyle(el.querySelector('video')).transform, overlay: getComputedStyle(el.querySelector('.video-overlay')).opacity, plus: getComputedStyle(el.querySelector('.preview-plus')).opacity }));
          assert.equal(hover.overlay, '1'); assert.equal(hover.plus, '1'); assert(hover.transform.startsWith('matrix(1.08'));
        }
        results.interactions.videoHover = 'All four videos scale to 1.08; overlay and plus fade in';
        await page.locator('.all-posts').click();
        await page.waitForTimeout(600);
        assert.equal(new URL(page.url()).hash, '#posts');
        assert(await page.evaluate(() => scrollY > 0));
        results.interactions.viewAllPosts = 'Navigates to #posts and scrolls to post grid';
        await page.goto(base);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.all-posts').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.video-frame').first().evaluate(el => el === document.activeElement), true);
        results.interactions.keyboard = 'View all posts and video previews are keyboard focusable';
      }
    }
    assert.deepEqual(results.scriptErrors, []);
    assert.deepEqual(results.failedRequests, []);
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally { if (browser) await browser.close(); server.kill('SIGTERM'); }
})().catch(error => { console.error(error); process.exitCode = 1; });
