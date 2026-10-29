const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/product-studio/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(req.url.split('?')[0]);
  if (!requestPath.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', requestPath.slice(base.length) || 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const report = { checks: [], scriptErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [], assets: [] };
  const check = (name, value) => { assert.ok(value, name); report.checks.push({ name, passed: true }); };
  async function pageFor(viewport) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on('pageerror', error => report.scriptErrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
    page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure().errorText }));
    page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ url: response.url(), status: response.status() }); });
    await page.goto('http://127.0.0.1:4173' + base, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(video => video.readyState >= 2), { timeout: 60000 });
    return page;
  }
  try {
    const desktop = await pageFor({ width: 1440, height: 1000 });
    check('Page title', await desktop.title() === 'Kinetic Forge');
    check('Exactly two sections', await desktop.locator('main > section').count() === 2);
    check('Desktop has no horizontal overflow', await desktop.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    check('Desktop navigation visible', await desktop.getByRole('navigation').isVisible());
    check('Hero video playing', await desktop.locator('video').first().evaluate(v => !v.paused && v.currentTime > 0));
    report.assets = await desktop.evaluate(() => ({ fonts: [...document.fonts].map(f => ({ family: f.family, status: f.status })), videos: [...document.querySelectorAll('video')].map(v => ({ url: v.currentSrc, readyState: v.readyState, width: v.videoWidth, height: v.videoHeight })) }));
    await desktop.locator('video').first().evaluate(v => { v.pause(); v.currentTime = 2; });
    await desktop.waitForTimeout(350);
    await desktop.screenshot({ path: '/work/screenshots/desktop.png' });
    await desktop.getByRole('navigation').getByText('our studio').click();
    await desktop.waitForTimeout(1500);
    check('Scroll crossfades to second video', await desktop.locator('video').nth(1).evaluate(v => getComputedStyle(v).opacity === '1' && !v.paused));
    await desktop.locator('video').nth(1).evaluate(v => { v.pause(); v.currentTime = 2; });
    await desktop.waitForTimeout(350);
    await desktop.screenshot({ path: '/work/screenshots/desktop-studio.png' });
    await desktop.getByRole('link', { name: 'Learn more here' }).click();
    await desktop.waitForTimeout(700);
    check('Learn more navigates to studio text', await desktop.evaluate(() => location.hash === '#contact'));
    await desktop.getByRole('link', { name: 'KineticForge home' }).click();
    await desktop.waitForTimeout(1500);
    check('Scrolling home restores hero video', await desktop.locator('video').first().evaluate(v => getComputedStyle(v).opacity === '1' && !v.paused));
    const mobile = await pageFor({ width: 390, height: 844 });
    check('Mobile has no horizontal overflow', await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    check('Desktop links hidden on mobile', !await mobile.getByRole('navigation').isVisible());
    await mobile.locator('video').first().evaluate(v => { v.pause(); v.currentTime = 2; });
    await mobile.waitForTimeout(350);
    await mobile.screenshot({ path: '/work/screenshots/mobile.png' });
    await mobile.getByRole('button', { name: 'Open menu' }).click();
    await mobile.waitForTimeout(850);
    check('Menu opens with scroll lock', await mobile.evaluate(() => document.body.style.overflow === 'hidden'));
    check('All four mobile links visible', await mobile.locator('#mobile-menu a:visible').count() === 4);
    await mobile.screenshot({ path: '/work/screenshots/mobile-menu.png' });
    await mobile.locator('#mobile-menu').getByText('projects').click();
    await mobile.waitForTimeout(1400);
    check('Menu link closes overlay and navigates', await mobile.evaluate(() => location.hash === '#partners' && document.body.style.overflow !== 'hidden'));
    check('Mobile menu reports closed', await mobile.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded') === 'false');
    check('Mobile second section video active', await mobile.locator('video').nth(1).evaluate(v => getComputedStyle(v).opacity === '1'));
    check('Mobile studio has no horizontal overflow', await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await mobile.locator('video').nth(1).evaluate(v => { v.pause(); v.currentTime = 2; });
    await mobile.waitForTimeout(350);
    await mobile.screenshot({ path: '/work/screenshots/mobile-studio.png' });
    await mobile.getByRole('button', { name: 'Open menu' }).click();
    await mobile.keyboard.press('Escape');
    check('Escape closes menu and restores scrolling', await mobile.evaluate(() => document.body.style.overflow !== 'hidden'));
    await mobile.getByRole('button', { name: 'Open menu' }).click();
    await mobile.setViewportSize({ width: 1024, height: 844 });
    await mobile.waitForTimeout(300);
    check('Resize to desktop clears mobile scroll lock', await mobile.evaluate(() => document.body.style.overflow !== 'hidden'));
    check('No uncaught script errors', report.scriptErrors.length === 0);
    check('No HTTP asset errors', report.httpErrors.length === 0);
    check('No browser console errors', report.consoleErrors.length === 0);
    check('Required font loaded', report.assets.fonts.some(f => f.family === 'Helvetica Now Var' && f.status === 'loaded'));
    check('Both supplied videos decoded', report.assets.videos.every(v => v.readyState >= 2 && v.width === 1920));
    report.status = 'passed';
  } catch (error) { report.status = 'failed'; report.error = error.stack; process.exitCode = 1; }
  finally {
    fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close(); server.close();
  }
})();
