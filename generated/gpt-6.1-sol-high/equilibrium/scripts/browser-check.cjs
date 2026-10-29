const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');

const base = '/motionsites-results/equilibrium/';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', decodeURIComponent(req.url.slice(base.length).split('?')[0]) || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'], headless: true });
  const results = { url: `http://localhost:4173${base}`, errors: [], consoleErrors: [], failedRequests: [], responses: [], viewports: {} };
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => results.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') results.consoleErrors.push(message.text()); });
    page.on('requestfailed', req => results.failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    page.on('response', res => { if (res.status() >= 400) results.responses.push({ url: res.url(), status: res.status() }); });
    for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
      await page.setViewportSize(viewport);
      await page.goto(results.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && v.currentTime > 0; }, { timeout: 30000 });
      const videoStart = await page.locator('video').evaluate(v => v.currentTime);
      await page.waitForTimeout(600);
      const state = await page.evaluate(() => {
        const v = document.querySelector('video');
        return {
          width: innerWidth, height: innerHeight,
          documentWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
          fontLoaded: document.fonts.check('500 16px Geist'),
          video: { readyState: v.readyState, currentTime: v.currentTime, paused: v.paused, muted: v.muted, loop: v.loop, width: v.videoWidth, height: v.videoHeight, error: v.error?.message || null },
          glassBlur: getComputedStyle(document.querySelector('.liquid-glass')).backdropFilter,
        };
      });
      state.video.advancing = state.video.currentTime > videoStart;
      if (state.overflow || !state.fontLoaded || !state.video.advancing || state.video.error) throw new Error(`${name} validation failed: ${JSON.stringify(state)}`);
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      if (name === 'mobile') {
        const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
        await toggle.click();
        await page.locator('#mobile-menu').waitFor({ state: 'visible' });
        if (await page.locator('#mobile-menu button').count() !== 6) throw new Error('Mobile menu missing items');
        const box = await page.locator('#mobile-menu').boundingBox();
        if (box.x < 0 || box.x + box.width > viewport.width || box.y !== 72) throw new Error('Mobile menu position is incorrect');
        await page.screenshot({ path: '/work/screenshots/mobile-menu.png', fullPage: true });
        await page.getByRole('button', { name: 'Close menu', exact: true }).click();
        if (await page.locator('#mobile-menu').count()) throw new Error('Mobile menu did not close');
        await page.getByRole('button', { name: 'Open menu', exact: true }).focus();
        await page.keyboard.press('Enter');
        await page.locator('#mobile-menu').waitFor({ state: 'visible' });
        await page.getByRole('button', { name: 'Close menu', exact: true }).click();
        state.mobileMenu = 'Opens, closes, and supports keyboard activation; all six buttons present; correct overlay bounds.';
      } else {
        state.desktopNavigation = await page.getByRole('navigation', { name: 'Main navigation', exact: true }).isVisible();
        state.mobileToggleHidden = !(await page.getByRole('button', { name: 'Open menu', exact: true }).isVisible());
        const cta = page.getByRole('button', { name: 'Start Today', exact: true });
        await cta.hover();
        await page.waitForTimeout(200);
        state.ctaHoverBackground = await cta.evaluate(el => getComputedStyle(el).backgroundColor);
      }
      results.viewports[name] = state;
    }
    fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
    if (results.errors.length || results.consoleErrors.length || results.responses.length || results.failedRequests.some(r => !r.error.includes('ERR_ABORTED'))) process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
