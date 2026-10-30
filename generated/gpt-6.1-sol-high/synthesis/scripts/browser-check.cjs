const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/synthesis/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const filename = path.join(process.cwd(), 'dist', pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
  const data = fs.readFileSync(filename);
  if (req.headers.range) {
    const match = /bytes=(\d+)-(\d*)/.exec(req.headers.range);
    const start = Number(match[1]), end = match[2] ? Number(match[2]) : data.length - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${data.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    res.end(data.subarray(start, end + 1));
  } else { res.writeHead(200, { 'Content-Length': data.length }); res.end(data); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { base, cases: [], pageErrors: [], failedRequests: [], warnings: [] };
  try {
    for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.pageErrors.push({ viewport: name, message: error.message }));
      page.on('requestfailed', req => report.failedRequests.push({ viewport: name, url: req.url(), error: req.failure()?.errorText }));
      page.on('console', message => { if (message.type() === 'warning') { report.warnings.push(message.text()); console.log('browser warning:', message.text()); } });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
      console.log(name, 'loaded');
      await page.waitForFunction(() => document.querySelector('section').dataset.renderer === 'canvas', null, { timeout: 90000 }).catch(async error => { console.log(await page.evaluate(() => ({ data: {...document.querySelector('section').dataset}, video: { ready: document.querySelector('video').readyState, error: document.querySelector('video').error?.message } }))); throw error; });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `screenshots/${name}.png` });
      const initial = await page.evaluate(() => ({
        title: document.title,
        overflow: document.documentElement.scrollWidth > innerWidth,
        frameCount: Number(document.querySelector('section').dataset.frames),
        firstFrame: Number(document.querySelector('section').dataset.frame),
        font: [...document.fonts].some(f => f.family === 'Roobert TRIAL' && f.status === 'loaded'),
        serif: [...document.fonts].some(f => f.family === 'Instrument Serif' && f.style === 'italic' && f.status === 'loaded'),
        nav: [...document.querySelectorAll('nav a')].map(a => ({ text: a.textContent, bounds: a.getBoundingClientRect().toJSON() }))
      }));
      assert.equal(initial.title, 'Elias Norden — Health Capital');
      assert.equal(initial.overflow, false);
      assert(initial.frameCount >= 30 && initial.frameCount <= 110);
      assert(initial.font && initial.serif);
      for (const link of initial.nav) { assert(link.bounds.x >= 0 && link.bounds.right <= viewport.width); }
      const progress = async value => {
        await page.evaluate(value => window.scrollTo({ top: (document.querySelector('section').offsetHeight - innerHeight) * value, behavior: 'instant' }), value);
        await page.waitForTimeout(1100);
      };
      await progress(0.3);
      const middleFrame = await page.locator('section').getAttribute('data-frame');
      assert(Number(middleFrame) > initial.firstFrame);
      await page.screenshot({ path: `screenshots/${name}-scrub.png` });
      await progress(0.6);
      const fade = await page.evaluate(() => Number(document.querySelector('canvas').parentElement.style.opacity));
      assert(fade > 0.4 && fade < 0.6);
      const counts = [];
      for (const [value, expected] of [[0.7, 1], [0.81, 2], [0.98, 3]]) {
        await progress(value);
        const count = Number(await page.locator('section').getAttribute('data-visible-paragraphs'));
        counts.push(count); assert.equal(count, expected);
      }
      await page.screenshot({ path: `screenshots/${name}-reveal.png` });
      const revealBounds = await page.locator('#allocations').evaluate(p => p.getBoundingClientRect().toJSON());
      assert(revealBounds.bottom < viewport.height && revealBounds.top >= 0);
      await page.getByRole('link', { name: 'Elias Norden' }).click();
      await page.waitForTimeout(1800);
      assert(await page.evaluate(() => scrollY < 2));
      await page.getByRole('link', { name: 'Allocations', exact: true }).click();
      await page.waitForTimeout(1900);
      assert.equal(await page.locator('section').getAttribute('data-visible-paragraphs'), '3');
      await page.getByRole('link', { name: 'Articles', exact: true }).click();
      await page.waitForTimeout(1900);
      assert.equal(await page.locator('section').getAttribute('data-visible-paragraphs'), '0');
      assert((await page.getByRole('link', { name: 'Inquire' }).getAttribute('href')).startsWith('mailto:'));
      report.cases.push({ viewport: name, ...initial, middleFrame: Number(middleFrame), midpointHeroOpacity: fade, paragraphCounts: counts, navigation: 'passed', revealFits: true });
      await page.close();
    }
    const fallbackPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await fallbackPage.addInitScript(() => { window.createImageBitmap = () => Promise.reject(new Error('Test: frame extraction unavailable')); });
    await fallbackPage.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
    await fallbackPage.waitForFunction(() => document.querySelector('section').dataset.renderer === 'video-fallback', null, { timeout: 90000 });
    await fallbackPage.evaluate(() => scrollTo({ top: (document.querySelector('section').offsetHeight - innerHeight) * 0.25, behavior: 'instant' }));
    await fallbackPage.waitForTimeout(1500);
    report.videoFallback = await fallbackPage.locator('video').evaluate(v => ({ time: v.currentTime, duration: v.duration, ready: v.readyState }));
    assert(report.videoFallback.time > 0 && report.videoFallback.ready >= 2);
    await fallbackPage.close();
    assert.equal(report.pageErrors.length, 0);
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
