const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const base = '/motionsites-results/bio-digital/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join('/work/dist', url.slice(base.length) || 'index.html');
  if (!url.startsWith(base) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [], failedRequests = [], badResponses = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
    page.on('response', r => { if (r.status() >= 400) badResponses.push({ url: r.url(), status: r.status() }); });
    await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3000);
    const state = await page.evaluate(async () => {
      const v = document.querySelector('video');
      const before = v.currentTime;
      await new Promise(resolve => setTimeout(resolve, 350));
      return {
        title: document.title,
        overflowX: document.documentElement.scrollWidth > innerWidth,
        overflowY: document.documentElement.scrollHeight > innerHeight,
        fonts: { inter: document.fonts.check('400 16px Inter'), outfit: document.fonts.check('500 16px Outfit'), loaded: [...document.fonts].map(f => ({ family: f.family, status: f.status })) },
        video: { readyState: v.readyState, paused: v.paused, currentTime: v.currentTime, advances: v.currentTime > before, width: v.videoWidth, height: v.videoHeight, error: v.error?.message || null },
        headline: document.querySelector('h2').getBoundingClientRect().toJSON(),
        buttons: [...document.querySelectorAll('button')].map(b => ({ label: b.textContent || b.getAttribute('aria-label'), ...b.getBoundingClientRect().toJSON() }))
      };
    });
    const tag = page.getByRole('button', { name: 'Neuromorphic', exact: true });
    await tag.hover();
    await page.waitForTimeout(400);
    const hover = await tag.evaluate(el => ({ background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }));
    await tag.click();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('button', { name: 'Adaptive Systems', exact: true }).click();
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    const focusOutline = await page.evaluate(() => ({ label: document.activeElement.textContent, style: getComputedStyle(document.activeElement).outlineStyle }));
    await page.evaluate(() => document.activeElement.blur());
    await page.waitForTimeout(400);
    await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
    results.push({ viewport: { name, width, height }, state, hover, focusOutline, errors, failedRequests, badResponses });
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  server.close();
})().catch(error => { console.error(error); process.exit(1); });
