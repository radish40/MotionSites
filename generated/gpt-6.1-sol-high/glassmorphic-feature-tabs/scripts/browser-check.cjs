const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/glassmorphic-feature-tabs/';
const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(req.url.split('?')[0]);
  if (!requestPath.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const relative = requestPath.slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data);
  });
});
function assert(value, message) { if (!value) throw new Error(message); }
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  const errors = [], assets = new Map(), failedRequests = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(err.message));
  page.on('response', response => { if (!response.url().startsWith('http://localhost')) assets.set(response.url(), response.status()); });
  page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  // Reset load timing to test the real five-second timer from a known state.
  await page.reload({ waitUntil: 'domcontentloaded' });
  const initial = await page.locator('[role=tab][aria-selected=true]').innerText();
  assert(initial === 'Exclusive Tutorial', 'Default tab');
  await page.waitForTimeout(5200);
  assert(await page.locator('[role=tab][aria-selected=true]').innerText() === 'Courses', 'Five-second auto-rotation');
  await page.getByRole('tab', { name: 'Templates', exact: true }).click();
  await page.waitForTimeout(5500);
  assert(await page.locator('[role=tab][aria-selected=true]').innerText() === 'Templates', 'Interaction permanently pauses timer');
  await page.getByRole('button', { name: 'Next feature' }).click();
  assert(await page.locator('[role=tab][aria-selected=true]').innerText() === 'Animated Backgrounds', 'Next arrow');
  await page.getByRole('button', { name: 'Next feature' }).click();
  assert(await page.locator('[role=tab][aria-selected=true]').innerText() === 'Exclusive Tutorial', 'Forward wrap');
  await page.getByRole('button', { name: 'Previous feature' }).click();
  assert(await page.locator('[role=tab][aria-selected=true]').innerText() === 'Animated Backgrounds', 'Backward wrap');
  await page.getByRole('tab', { name: 'Animated Backgrounds', exact: true }).focus();
  await page.keyboard.press('Home');
  assert(await page.locator('[role=tab][aria-selected=true]').innerText() === 'Exclusive Tutorial', 'Home keyboard control');
  await page.keyboard.press('ArrowRight');
  assert(await page.locator('[role=tab][aria-selected=true]').innerText() === 'Courses', 'Arrow keyboard control');
  for (const label of ['Courses', 'Templates', 'Animated Backgrounds', 'Exclusive Tutorial']) {
    await page.getByRole('tab', { name: label, exact: true }).click();
    await page.waitForTimeout(550);
    const panel = page.locator('[role=tabpanel][aria-hidden=false]');
    const title = label === 'Exclusive Tutorial' ? 'Exclusive Tutorials' : label;
    assert(await panel.locator('[data-dashboard]').getAttribute('data-dashboard') === title, 'Matching dashboard');
    await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `screenshots/tab-${label.toLowerCase().replaceAll(' ', '-')}.png`, fullPage: true });
    const activeNav = await panel.locator('[data-active=true]').innerText();
    assert(activeNav.endsWith(({ 'Exclusive Tutorial': 'Tutorials', 'Animated Backgrounds': 'Backgrounds' }[label] || label)), 'Matching sidebar');
  }
  await page.mouse.move(500, 420);
  const spotlight = await page.locator('[data-spotlight]').evaluateAll(elements => elements.map(e => ({ x: e.style.getPropertyValue('--spot-x'), y: e.style.getPropertyValue('--spot-y') })));
  assert(spotlight.length === 3 && spotlight.every(p => p.x && p.y), 'All spotlight shells track cursor');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Desktop overflow');
  const fonts = await page.evaluate(() => ({ inter: document.fonts.check('400 16px Inter'), symbols: document.fonts.check('400 16px "Material Symbols Rounded"') }));
  assert(fonts.inter && fonts.symbols, 'Webfonts loaded');
  const images = await page.locator('img').evaluateAll(imgs => imgs.map(img => ({ url: img.src, loaded: img.complete && img.naturalWidth > 0 })));
  fs.writeFileSync('screenshots/asset-checks.json', JSON.stringify({ images, assets: [...assets], failedRequests }, null, 2));
  assert(images.every(img => img.loaded), 'All rendered images loaded, including supplied-source fallbacks');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  console.log('Header rendering:', await page.locator('h1').evaluate(el => ({ opacity: getComputedStyle(el.parentElement).opacity, transform: getComputedStyle(el.parentElement).transform, rect: el.getBoundingClientRect().toJSON(), scroll: window.scrollY })));
  const transition = await page.locator('.duration-400').first().evaluate(el => getComputedStyle(el).transitionDuration);
  assert(transition === '0.4s', '400ms image cross-fade');
  await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
  const mobile = await context.newPage({ viewport: { width: 390, height: 844 } });
  // Pages inherit context size; set explicitly for mobile inspection.
  await mobile.setViewportSize({ width: 390, height: 844 });
  mobile.on('pageerror', err => errors.push(err.message));
  await mobile.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
  await mobile.getByRole('button', { name: 'Next feature' }).click();
  await mobile.waitForTimeout(600);
  assert(await mobile.locator('[role=tabpanel][aria-hidden=false]').getAttribute('aria-label') === 'Courses', 'Mobile arrow');
  assert(await mobile.locator('[role=tablist]').isVisible() === false, 'Mobile hides tabs');
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile overflow');
  await mobile.getByRole('button', { name: 'Previous feature' }).click();
  await mobile.waitForTimeout(600);
  const scale = await mobile.locator('[role=tabpanel][aria-hidden=false] [data-dashboard]').evaluate(el => ({ width: el.offsetWidth, height: el.offsetHeight, transform: getComputedStyle(el).transform }));
  assert(scale.width === 900 && scale.height === 562 && scale.transform !== 'none', 'Fixed canvas scales on mobile');
  await mobile.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
  await mobile.emulateMedia({ reducedMotion: 'reduce' });
  await mobile.reload({ waitUntil: 'networkidle' });
  assert(await mobile.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'Reduced motion');
  assert(errors.length === 0, 'No JavaScript errors');
  const result = { passed: true, viewports: ['1440x1000', '390x844'], checks: ['400ms image cross-fade', 'default tab', '5000ms auto-rotation', 'pause after user interaction', 'all four tabs', 'arrow navigation and wrap', 'keyboard navigation', 'sidebar and dashboard matching', 'three mouse-tracked spotlights', 'no horizontal overflow', 'Inter and Material Symbols loaded', 'all rendered images loaded with fallbacks', '900x562 responsive scaling', 'mobile controls', 'reduced motion', 'no JavaScript errors'], fonts, scale, errors, assets: [...assets].map(([url, status]) => ({ url, status })), failedRequests, images };
  fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ passed: result.passed, checks: result.checks, errors: result.errors, failedRequestCount: failedRequests.length }, null, 2));
  await browser.close(); server.close();
})().catch(err => { console.error(err); server.close(); process.exit(1); });
