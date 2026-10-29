import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const require = createRequire('/app/package.json');
const { chromium } = require('playwright-core');
const prefix = '/motionsites-results/codercrest-hero/';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
    const relative = url.pathname.slice(prefix.length) || 'index.html';
    const file = path.resolve('dist', relative);
    if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
await mkdir('screenshots', { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const results = { url: `http://localhost:4173${prefix}`, viewports: [], errors: [], failedRequests: [], httpErrors: [] };
try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
    const page = await context.newPage();
    page.on('pageerror', error => results.errors.push({ viewport: name, message: error.message }));
    page.on('console', msg => { if (msg.type() === 'error') results.errors.push({ viewport: name, message: msg.text() }); });
    page.on('requestfailed', req => { if (req.failure()?.errorText !== 'net::ERR_ABORTED') results.failedRequests.push({ viewport: name, url: req.url(), error: req.failure()?.errorText }); });
    page.on('response', res => { if (res.status() >= 400) results.httpErrors.push({ viewport: name, url: res.url(), status: res.status() }); });
    await page.goto(results.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2 && v.currentTime > 0 && !v.paused), { timeout: 45000 });
    await page.waitForTimeout(1500);
    const state = await page.evaluate(() => {
      const section = document.querySelector('section');
      const button = document.querySelector('button');
      const rect = button.getBoundingClientRect();
      return {
        title: document.title,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        verticalOverflow: document.documentElement.scrollHeight > innerHeight,
        sectionHeight: section.getBoundingClientRect().height,
        contentMarginTop: getComputedStyle(document.querySelector('section > div')).marginTop,
        buttonInViewport: rect.top >= 0 && rect.bottom <= innerHeight && rect.left >= 0 && rect.right <= innerWidth,
        videos: [...document.querySelectorAll('video')].map(v => ({ source: v.currentSrc, playing: !v.paused, time: v.currentTime, readyState: v.readyState, width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop, inline: v.playsInline, error: v.error?.message || null })),
        font: getComputedStyle(document.querySelector('h1')).fontFamily,
      };
    });
    assert.equal(state.horizontalOverflow, false);
    assert.equal(state.verticalOverflow, false);
    assert.equal(state.sectionHeight, height);
    assert.equal(state.contentMarginTop, '380px');
    assert.equal(state.buttonInViewport, true);
    assert.equal(state.videos.length, 3);
    assert.ok(state.videos.every(v => v.playing && v.muted && v.loop && v.inline && !v.error));
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    const button = page.getByRole('button', { name: 'Join The Movement!' });
    if (name === 'desktop') {
      await button.hover();
      await page.waitForTimeout(350);
      const hover = await button.evaluate(el => ({ scale: getComputedStyle(el).scale, shadow: getComputedStyle(el).boxShadow }));
      assert.equal(hover.scale, '1.03');
      assert.ok(hover.shadow.includes('0.22'));
      await page.mouse.down();
      await page.waitForTimeout(350);
      const activeScale = await button.evaluate(el => getComputedStyle(el).scale);
      assert.equal(activeScale, '0.98');
      await page.mouse.up();
      await page.mouse.click(0, 0);
      await page.keyboard.press('Tab');
      const keyboardFocus = await button.evaluate(el => el === document.activeElement && el.matches(':focus-visible'));
      assert.equal(keyboardFocus, true);
      await page.keyboard.press('Enter');
      state.interactions = { hover, activeScale, keyboardFocus, keyboardActivation: 'passed' };
    } else {
      await button.tap();
      state.interactions = { tap: 'passed' };
    }
    results.viewports.push({ name, width, height, ...state });
    await context.close();
  }
  assert.deepEqual(results.errors, []);
  assert.deepEqual(results.failedRequests, []);
  assert.deepEqual(results.httpErrors, []);
  results.status = 'passed';
} catch (error) {
  results.status = 'failed';
  results.failure = error.stack;
  process.exitCode = 1;
} finally {
  await writeFile('screenshots/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  server.close();
}
