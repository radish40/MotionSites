import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/ember-dsgn-hero/';
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const file = path.join(process.cwd(), 'dist', pathname.slice(base.length) || 'index.html');
  try {
    const data = await readFile(file);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(3000, '0.0.0.0', resolve));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const report = { url: base, desktop: {}, mobile: {}, errors: [], consoleErrors: [], failedRequests: [], httpErrors: [] };
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on('pageerror', e => report.errors.push(e.message));
page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
page.on('requestfailed', r => { if (r.failure()?.errorText !== 'net::ERR_ABORTED') report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }); });
page.on('response', r => { if (r.status() >= 400) report.httpErrors.push({ url: r.url(), status: r.status() }); });
try {
  await page.goto(`http://localhost:3000${base}`, { waitUntil: 'networkidle', timeout: 60000 }).catch(async () => page.waitForLoadState('domcontentloaded'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelector('video').readyState >= 3, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
  report.desktop = await page.evaluate(() => {
    const video = document.querySelector('video');
    const panel = document.querySelector('.left-panel').getBoundingClientRect();
    return { viewport: [innerWidth, innerHeight], documentWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth, video: { readyState: video.readyState, currentTime: video.currentTime, paused: video.paused, playbackRate: video.playbackRate, muted: video.muted, loop: video.loop, width: video.videoWidth, height: video.videoHeight, scale: getComputedStyle(video).scale }, interLoaded: document.fonts.check('900 24px Inter'), backdropFilter: getComputedStyle(document.querySelector('.ember-glass')).backdropFilter, mask: getComputedStyle(document.querySelector('.ember-glass')).maskImage, panelWidth: panel.width };
  });
  const before = await page.locator('video').evaluate(video => video.currentTime);
  await page.waitForTimeout(1000);
  report.desktop.videoAdvances = await page.locator('video').evaluate((video, time) => video.currentTime > time, before);
  await page.screenshot({ path: 'screenshots/desktop.png' });
  await page.getByRole('button', { name: 'RU', exact: true }).click();
  report.desktop.languageToggle = await page.getByRole('button', { name: 'RU', exact: true }).getAttribute('aria-pressed') === 'true';
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Explore Our Work' }).dblclick();
  report.desktop.exploreLink = await page.evaluate(() => location.hash === '#work');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`http://localhost:3000${base}`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelector('video').readyState >= 3, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);
  report.mobile = await page.evaluate(() => ({ viewport: [innerWidth, innerHeight], documentWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth, panelScrollWidth: document.querySelector('.panels').scrollWidth, panelScrollHeight: document.querySelector('.panels').scrollHeight }));
  await page.screenshot({ path: 'screenshots/mobile.png' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  await page.waitForTimeout(1000);
  report.mobile.menuOpens = await page.getByRole('dialog').isVisible();
  report.mobile.menuLinks = await page.getByRole('dialog').getByRole('link').allTextContents();
  await page.screenshot({ path: 'screenshots/mobile-menu.png' });
  await page.getByRole('dialog').getByRole('button', { name: 'RU', exact: true }).click();
  report.mobile.languageToggle = await page.getByRole('dialog').getByRole('button', { name: 'RU', exact: true }).getAttribute('aria-pressed') === 'true';
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  report.mobile.escapeCloses = await page.getByRole('dialog').count() === 0;
  report.mobile.focusRestored = await page.getByRole('button', { name: 'Open menu' }).evaluate(el => document.activeElement === el);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Close menu' }).click();
  await page.waitForTimeout(800);
  report.mobile.closeButton = await page.getByRole('dialog').count() === 0;
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(800);
  await page.getByRole('dialog').getByRole('link', { name: 'WORKS', exact: true }).click();
  await page.waitForTimeout(1000);
  report.mobile.linkClosesMenu = await page.getByRole('dialog').count() === 0;
  report.mobile.studioReachable = await page.locator('#work').evaluate(el => el.getBoundingClientRect().top < innerHeight);
  await page.screenshot({ path: 'screenshots/mobile-studio.png' });
} finally {
  await writeFile('screenshots/browser-checks.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  server.close();
}
