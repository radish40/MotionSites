import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/retro-futurist/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { response.writeHead(404).end(); return; }
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/') || !fs.existsSync(file)) { response.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = request.headers.range?.match(/bytes=(\d+)-(\d*)/);
  if (range) {
    const start = Number(range[1]);
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(response);
  } else {
    response.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(response);
  }
});
await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const report = { url: `http://localhost:4173${base}`, checks: [], pageErrors: [], consoleErrors: [], failedRequests: [], screenshots: [] };
function observe(page) {
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
}
function check(name, details) { report.checks.push({ name, passed: true, ...details }); }
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage(); observe(page);
  await page.goto(report.url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(470);
  assert.equal(await page.getByText('Pitch us an idea').evaluate(el => Number(getComputedStyle(el.parentElement).opacity) > 0), true);
  assert.equal(await page.locator('.cursor').count(), 1);
  check('Pills appear before typewriter completes');
  await page.waitForFunction(() => !document.querySelector('.cursor'));
  assert.equal(await page.locator('main p').innerText(), 'Glad you stopped in. Good taste tends to find us. Now, what are we building?');
  check('Typewriter completes and removes cursor');
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
  const video = await page.locator('video').evaluate(v => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight, paused: v.paused, time: v.currentTime }));
  assert(video.duration > 0 && video.width > 0 && video.paused && video.time === 0);
  check('Original video loads and remains paused without autoplay', video);
  await page.mouse.move(100, 500);
  await page.mouse.move(1100, 500, { steps: 25 });
  await page.waitForFunction(() => { const v = document.querySelector('video'); return !v.seeking && v.currentTime > 0; });
  const forward = await page.locator('video').evaluate(v => v.currentTime);
  await page.mouse.move(400, 500, { steps: 15 });
  await page.waitForFunction(t => { const v = document.querySelector('video'); return !v.seeking && v.currentTime < t; }, forward);
  const backward = await page.locator('video').evaluate(v => v.currentTime);
  check('Mouse scrubs forward and backward with queued seeks', { forward, backward });
  await page.mouse.move(0, 500, { steps: 10 });
  await page.waitForTimeout(250);
  await page.evaluate(() => document.fonts.ready);
  const desktopLayout = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, fonts: ['HelveticaNowDisplay-Medium', 'HelveticaNowDisplayW01-Rg'].every(family => Array.from(document.fonts).some(face => face.family === family && face.status === 'loaded')) }));
  assert(desktopLayout.width <= 1440 && desktopLayout.height <= 1000 && desktopLayout.fonts);
  check('Desktop 1440×1000: no overflow and both fonts loaded', desktopLayout);
  await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
  report.screenshots.push('screenshots/desktop.png');
  await page.getByRole('button', { name: 'Copy email' }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'hello@mainframe.co');
  assert.equal(await page.getByRole('status').innerText(), 'Email copied');
  check('Copy button writes exact email and announces success');
  assert.equal(await page.getByText('Pitch us an idea').getAttribute('href'), 'mailto:hello@mainframe.co?subject=Pitch%20an%20idea');
  check('Contact actions have working mailto destinations');
  await context.close();
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const phone = await mobile.newPage(); observe(phone);
  await phone.goto(report.url, { waitUntil: 'networkidle' });
  await phone.waitForFunction(() => !document.querySelector('.cursor') && document.querySelector('video').readyState >= 2);
  const mobileLayout = await phone.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
  assert(mobileLayout.width <= 390 && mobileLayout.height <= 844);
  const bounds = await phone.getByRole('button', { name: 'Copy email' }).boundingBox();
  assert(bounds.y + bounds.height <= 844);
  check('Mobile 390×844: no overflow and all actions in viewport', mobileLayout);
  await phone.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
  report.screenshots.push('screenshots/mobile.png');
  await phone.getByRole('button', { name: 'Open menu' }).click();
  assert.equal(await phone.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded'), 'true');
  assert.equal(await phone.locator('#mobile-menu').getAttribute('aria-hidden'), 'false');
  assert.equal(await phone.locator('#mobile-menu a').count(), 5);
  await phone.waitForTimeout(350);
  await phone.screenshot({ path: 'screenshots/mobile-menu.png' });
  await phone.keyboard.press('Escape');
  assert.equal(await phone.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
  await phone.getByRole('button', { name: 'Open menu' }).click();
  await phone.getByRole('button', { name: 'Close menu' }).click();
  assert.equal(await phone.locator('#mobile-menu').getAttribute('aria-hidden'), 'true');
  check('Mobile menu opens, closes, exposes all links, and supports Escape');
  await mobile.close();
  assert.equal(report.pageErrors.length, 0);
  check('No browser JavaScript errors');
  report.passed = true;
} catch (error) {
  report.passed = false; report.error = error.stack; process.exitCode = 1;
} finally {
  fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  await browser.close(); server.close();
}
