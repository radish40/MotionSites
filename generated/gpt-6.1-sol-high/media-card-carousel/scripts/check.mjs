import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import server from './serve.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/app/node_modules/playwright-core');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const report = { url: 'http://localhost:4173/motionsites-results/media-card-carousel/', viewports: [], errors: [], failedRequests: [] };
await mkdir('screenshots', { recursive: true });
try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: name === 'mobile', hasTouch: name === 'mobile', deviceScaleFactor: 1 });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) report.failedRequests.push({ url: r.url(), status: r.status() }); });
    await page.goto(report.url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2 && v.videoWidth > 0) && !document.querySelector('video').paused);
    const initial = await page.evaluate(() => ({
      width: innerWidth, documentWidth: document.documentElement.scrollWidth,
      cards: document.querySelectorAll('.story-card').length,
      fontLoaded: document.fonts.check('300 38px Geist'),
      opacity: getComputedStyle(document.querySelector('.story-card')).opacity,
      railOverflow: document.querySelector('.video-stories__rail').scrollWidth > document.querySelector('.video-stories__rail').clientWidth,
      snap: getComputedStyle(document.querySelector('.video-stories__rail')).scrollSnapType,
      videos: [...document.querySelectorAll('video')].map(v => ({ src: v.getAttribute('src'), width: v.videoWidth, height: v.videoHeight, time: v.currentTime, paused: v.paused, muted: v.muted, loop: v.loop, autoplay: v.autoplay, playsInline: v.playsInline, error: v.error?.code || null }))
    }));
    assert.equal(initial.documentWidth, width, 'Page must not overflow horizontally');
    assert.equal(initial.cards, 5);
    assert(initial.fontLoaded && initial.railOverflow);
    assert.equal(initial.snap, 'x mandatory');
    assert.equal(initial.opacity, name === 'mobile' ? '1' : '0.54');
    assert(initial.videos.every(v => v.muted && v.loop && v.autoplay && v.playsInline && !v.error));
    await page.waitForTimeout(400);
    assert(await page.locator('video').first().evaluate((v, before) => v.currentTime > before, initial.videos[0].time), 'Video playback advances');
    // Use a consistent frame for reproducible screenshots after verifying playback.
    await page.evaluate(async () => {
      await Promise.all([...document.querySelectorAll('video')].map(v => new Promise(resolve => {
        v.pause(); v.addEventListener('seeked', resolve, { once: true }); v.currentTime = 1;
      })));
    });
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    const rail = page.locator('.video-stories__rail');
    if (name === 'desktop') {
      await page.locator('.story-card').first().hover();
      await page.waitForTimeout(300);
      assert.equal(await page.locator('.story-card').first().evaluate(e => getComputedStyle(e).opacity), '1');
      await page.mouse.move(0, 0);
      await page.waitForTimeout(300);
      assert.equal(await page.locator('.story-card').first().evaluate(e => getComputedStyle(e).opacity), '0.54');
      await rail.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(600);
      assert(await rail.evaluate(e => e.scrollLeft > 0), 'Keyboard arrow scrolls the rail');
      await page.locator('.story-card').nth(2).focus();
      await page.waitForTimeout(400);
      assert.equal(await page.locator('.story-card').nth(2).evaluate(e => getComputedStyle(e).opacity), '1');
      await page.mouse.move(700, 550);
      const before = await rail.evaluate(e => e.scrollLeft);
      await page.mouse.wheel(650, 0);
      await page.waitForTimeout(700);
      assert(await rail.evaluate((e, value) => e.scrollLeft > value, before), 'Horizontal wheel advances rail');
    } else {
      const session = await context.newCDPSession(page);
      const box = await rail.boundingBox();
      const y = box.y + 80;
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 340, y }] });
      for (let x = 310; x >= 60; x -= 25) {
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
        await page.waitForTimeout(20);
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(800);
      assert(await rail.evaluate(e => e.scrollLeft > 0), 'Touch swipe advances rail');
    }
    await page.locator('.story-card').last().focus();
    await page.waitForTimeout(700);
    const lastVisible = await page.locator('.story-card').last().evaluate(e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; });
    assert(lastVisible, 'Final story is reachable and visible');
    report.viewports.push({ name, width, height, ...initial, hoverAndFocus: name === 'desktop' ? 'passed' : 'full opacity as specified', navigation: name === 'desktop' ? 'keyboard, wheel, final card passed' : 'touch swipe, final card passed', screenshot: `screenshots/${name}.png` });
    await context.close();
  }
  assert.equal(report.errors.length, 0, 'No browser errors');
  assert.equal(report.failedRequests.length, 0, 'No failed asset requests');
  report.status = 'passed';
} finally {
  await writeFile('screenshots/checks.json', JSON.stringify(report, null, 2) + '\n');
  await browser.close();
  server.close();
}
console.log(JSON.stringify(report, null, 2));
