const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/finflow/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(process.cwd(), 'dist', pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { pageErrors: [], consoleErrors: [], failedRequests: [], responses: [], viewports: {}, interactions: {} };
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => report.pageErrors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') report.consoleErrors.push(e.text()); });
  page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure().errorText }));
  page.on('response', res => { if (!res.url().includes('127.0.0.1')) report.responses.push({url: res.url(), status: res.status()}); });
  await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  const inspect = () => page.evaluate(() => {
    const video = document.querySelector('video');
    return {
      width: innerWidth, height: innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      heading: document.querySelector('h1').textContent,
      headingBounds: document.querySelector('h1').getBoundingClientRect().toJSON(),
      logos: [...document.images].map(img => ({ alt: img.alt, loaded: img.complete && img.naturalWidth > 0 })),
      video: { readyState: video.readyState, error: video.error?.message || null, paused: video.paused, currentTime: video.currentTime, width: video.videoWidth, filter: getComputedStyle(video).filter },
      declaredFont: getComputedStyle(document.querySelector('h1')).fontFamily,
      loadedFontFaces: document.fonts.size
    };
  });
  report.viewports.desktop = await inspect();
  await page.evaluate(() => { const v = document.querySelector('video'); v.pause(); v.currentTime = 2; });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Start building' }).click();
  await page.getByRole('button', { name: 'Reach our team' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  report.interactions.desktopButtons = 'All four buttons accept clicks. No destinations or further actions were specified; buttons are presentation-only.';
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
  report.viewports.mobile = await inspect();
  await page.getByRole('button', { name: 'Open menu' }).click();
  report.interactions.mobileMenuOpens = await page.locator('#mobile-navigation').isVisible();
  report.interactions.mobileLinkCount = await page.locator('#mobile-navigation a').count();
  report.interactions.mobileAuthCount = await page.locator('#mobile-navigation button').count();
  await page.screenshot({ path: 'screenshots/mobile-menu.png', fullPage: true });
  await page.getByRole('button', { name: 'Close menu' }).click();
  report.interactions.mobileMenuCloses = await page.locator('#mobile-navigation').count() === 0;
  for (const width of [320, 640, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    report.viewports[width] = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  }
  fs.writeFileSync('screenshots/checks.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  await new Promise(resolve => server.close(resolve));
})().catch(error => { console.error(error); server.close(); process.exit(1); });
