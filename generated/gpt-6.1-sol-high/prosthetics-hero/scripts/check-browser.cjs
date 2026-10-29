const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const checks = [];
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    const failedRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
    await page.goto('http://127.0.0.1:4173/motionsites-results/prosthetics-hero/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => {
      const video = document.querySelector('video');
      return video.readyState >= 3 && !video.paused && video.currentTime > 0;
    }, { timeout: 30000 });
    const initialTime = await page.locator('video').evaluate(video => video.currentTime);
    await page.waitForTimeout(500);
    const video = await page.locator('video').evaluate(video => ({ src: video.currentSrc, readyState: video.readyState, paused: video.paused, muted: video.muted, loop: video.loop, playsInline: video.playsInline, width: video.videoWidth, height: video.videoHeight, time: video.currentTime, duration: video.duration, error: video.error?.message ?? null }));
    assert(video.time > initialTime, 'Video must be playing');
    assert(video.muted && video.loop && video.playsInline && !video.error);
    assert.equal(await page.locator('h1').textContent().then(s => s.trim()), 'Simple, smart prosthetics made for people who keep fighting.');
    assert.equal(await page.locator('nav a').count(), 4);
    const layout = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, height: innerHeight }));
    assert(layout.scrollWidth <= width, 'No horizontal overflow');
    assert(layout.scrollHeight <= height, 'Hero fits viewport');
    const cta = page.getByRole('link', { name: 'Try a free fitting' });
    await cta.hover();
    await page.waitForTimeout(250);
    const hover = await cta.evaluate(el => ({ background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color, arrow: getComputedStyle(el.querySelector('span')).transform }));
    assert.equal(hover.background, 'rgb(59, 130, 246)');
    assert.equal(hover.color, 'rgb(255, 255, 255)');
    assert.equal(hover.arrow, 'matrix(1, 0, 0, 1, 2, 0)');
    await cta.click();
    for (const link of await page.locator('nav a').all()) await link.click();
    await page.getByRole('link', { name: 'Seen on Shark Tank in India' }).hover();
    await page.waitForTimeout(250);
    assert.equal(await page.getByRole('link', { name: 'Seen on Shark Tank in India' }).evaluate(el => getComputedStyle(el.querySelector('span')).transform), 'matrix(1, 0, 0, 1, 2, 0)');
    await page.locator('nav a').first().hover();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('nav a').first().evaluate(el => getComputedStyle(el).color), 'rgb(17, 24, 39)');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.tagName), 'A');
    await page.mouse.move(width - 1, 100);
    await page.waitForTimeout(250);
    // Fix the video frame for repeatable screenshots; playback was checked above.
    await page.locator('video').evaluate(async video => { video.pause(); video.currentTime = 2; await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true })); });
    await page.evaluate(() => document.activeElement?.blur());
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    assert.deepEqual(errors, [], 'No script or console errors');
    assert.deepEqual(failedRequests, [], 'No failed requests');
    checks.push({ name, viewport: { width, height }, layout, video, hover, errors, failedRequests, screenshot: `screenshots/${name}.png`, passed: true });
    await page.close();
  }
  fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(checks, null, 2) + '\n');
  console.log(JSON.stringify(checks, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
