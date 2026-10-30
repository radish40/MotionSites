const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/vertex-sci/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const filename = path.join(process.cwd(), 'dist', pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(filename) || fs.statSync(filename).isDirectory()) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(filename).size;
  const range = req.headers.range;
  const headers = { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (range) {
    const [from, to] = range.replace('bytes=', '').split('-');
    const start = Number(from), end = to ? Number(to) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(filename, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size }); fs.createReadStream(filename).pipe(res);
  }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const reports = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [], failedRequests = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('requestfailed', r => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2800);
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => {
        const video = document.querySelector('video');
        return { title: document.title, viewportWidth: innerWidth, pageWidth: document.documentElement.scrollWidth,
          font: getComputedStyle(document.body).fontFamily, loadedFont: [...document.fonts].some(f => f.family.includes('JetBrains Mono') && f.weight === '700' && f.status === 'loaded'),
          video: { readyState: video.readyState, currentTime: video.currentTime, paused: video.paused, width: video.videoWidth, height: video.videoHeight, filter: getComputedStyle(video).filter },
          headlineOpacity: getComputedStyle(document.querySelector('h1')).opacity,
          statOpacity: getComputedStyle(document.querySelector('.animate-hero-stat-3')).opacity };
      });
      assert.equal(metrics.title, 'Vertex Sci.');
      assert.equal(metrics.pageWidth, width, 'No horizontal overflow');
      assert(metrics.loadedFont, 'Font loaded');
      assert(metrics.video.readyState >= 3 && metrics.video.currentTime > 0 && !metrics.video.paused, 'Video plays');
      assert.equal(metrics.headlineOpacity, '1');
      assert.equal(metrics.statOpacity, '1');
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      const interactionChecks = [];
      if (name === 'mobile') {
        const button = page.locator('button[aria-controls="mobile-menu"]');
        await button.click();
        await page.waitForTimeout(1000);
        assert.equal(await button.getAttribute('aria-expanded'), 'true');
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
        assert(await page.getByRole('dialog').getByRole('link', { name: /^Projects/ }).isVisible());
        await page.screenshot({ path: 'screenshots/mobile-menu.png', fullPage: true });
        await page.keyboard.press('Escape');
        assert.equal(await button.getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => document.body.style.overflow), '');
        await button.click();
        await page.waitForTimeout(600);
        await page.getByRole('dialog').getByRole('link', { name: /^Discoveries/ }).click();
        assert.equal(await button.getAttribute('aria-expanded'), 'false');
        assert(page.url().endsWith('#discoveries'));
        interactionChecks.push('Menu open/close', 'Scroll lock/restore', 'Escape dismissal', 'Navigation closes menu and updates anchor');
      } else {
        assert.equal(await page.locator('nav a').count(), 7);
        await page.locator('nav').getByText('Discoveries', { exact: true }).click();
        assert(page.url().endsWith('#discoveries'));
        assert((await page.getByText('Inquire', { exact: true }).first().getAttribute('href')).startsWith('mailto:'));
        assert((await page.getByText('Join Study', { exact: true }).first().getAttribute('href')).startsWith('mailto:'));
        // A single-screen design has no natural desktop scroll. Exercise the specified scroll listener with temporary height.
        await page.evaluate(() => { document.body.style.minHeight = '1500px'; window.scrollTo(0, 80); });
        await page.waitForTimeout(400);
        assert((await page.locator('header').getAttribute('class')).includes('bg-black/60'));
        interactionChecks.push('Desktop navigation anchors', 'Contact link targets', 'Navbar background on scroll >20px');
      }
      assert.equal(errors.length, 0);
      reports.push({ name, viewport: { width, height }, metrics, interactionChecks, scriptErrors: errors, failedRequests });
      await page.close();
    }
    const page = await browser.newPage();
    const responsive = [];
    for (const width of [320, 640, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`http://localhost:4173${base}`);
      await page.waitForTimeout(100);
      const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.equal(pageWidth, width, `No overflow at ${width}`);
      responsive.push({ width, pageWidth });
    }
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify({ reports, responsive, passed: true }, null, 2));
    console.log(JSON.stringify({ reports, responsive, passed: true }, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
