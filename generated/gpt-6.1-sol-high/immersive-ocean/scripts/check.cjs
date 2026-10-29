const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/immersive-ocean/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  try {
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  } catch { res.writeHead(404); res.end(); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${base}`, errors: [], failedRequests: [], checks: [] };
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), failure: request.failure()?.errorText }));
  await page.goto(report.url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2000);
  report.assets = await page.evaluate(async () => {
    const video = document.querySelector('video');
    return { font: document.fonts.check('500 16px Geist'), loadedFontFaces: [...document.fonts].filter(face => face.family === 'Geist' && face.status === 'loaded').length, fontFamily: getComputedStyle(document.querySelector('h1')).fontFamily, video: { readyState: video.readyState, paused: video.paused, currentTime: video.currentTime, width: video.videoWidth, height: video.videoHeight, error: video.error?.message || null, autoPlay: video.autoplay, muted: video.muted, loop: video.loop, playsInline: video.playsInline } };
  });
  assert.equal(await page.title(), 'Foldcraft — Brand & Visual Storytelling');
  assert.equal(await page.locator('h1').innerText(), 'Shaping visual\nnarratives,\none pixel at a time.');
  assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).isVisible(), true);
  assert.equal(await page.getByRole('button', { name: 'Open menu' }).isVisible(), false);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), true);
  // Freeze the actual video at a repeatable frame for screenshots.
  if (report.assets.video.readyState >= 2) {
    await page.evaluate(() => new Promise(resolve => { const video = document.querySelector('video'); video.pause(); video.addEventListener('seeked', resolve, { once: true }); video.currentTime = 3; }));
  }
  await page.screenshot({ path: '/work/screenshots/desktop.png', fullPage: true });
  report.checks.push('Desktop 1440x1000: content, navigation, no overflow, screenshot');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).isVisible(), false);
  assert.equal(await page.getByRole('button', { name: 'Open menu' }).isVisible(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), true);
  await page.screenshot({ path: '/work/screenshots/mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(650);
  assert.equal(await page.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('#mobile-menu').evaluate(el => Math.round(el.getBoundingClientRect().height)), 844);
  await page.screenshot({ path: '/work/screenshots/mobile-menu.png', fullPage: true });
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Projects', exact: true }).click();
  await page.waitForTimeout(550);
  assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
  for (const label of ['Home', 'Studio', 'Reach Us', "Let's Talk"]) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForTimeout(600);
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: label, exact: true }).click();
    await page.waitForTimeout(550);
    assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
  }
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(600);
  assert.equal(await page.locator('#mobile-menu').getAttribute('aria-hidden'), 'true');
  report.checks.push('Mobile 390x844: no overflow, menu opens/closes, all menu links dismiss, Escape closes, desktop resize closes menu');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).opacity), '1');
  report.checks.push('Reduced-motion preference: hero text visible');
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  report.checks.push('No browser script or console errors');
  fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  server.close();
})().catch(error => { console.error(error); server.close(); process.exit(1); });
