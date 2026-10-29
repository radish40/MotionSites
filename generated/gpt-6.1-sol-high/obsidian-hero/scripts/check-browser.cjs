const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const root = path.resolve('dist');
const base = '/motionsites-results/obsidian-hero/';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.mp4': 'video/mp4', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve(root, pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const range = req.headers.range;
  if (range) {
    const [startString, endString] = range.replace('bytes=', '').split('-');
    const start = Number(startString), end = endString ? Number(endString) : size - 1;
    res.writeHead(206, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': size, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(file).pipe(res);
  }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const report = { url: `http://localhost:4173${base}`, viewports: [], errors: [], requestFailures: [], mediaCancellations: [] };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('requestfailed', req => {
        const issue = { url: req.url(), error: req.failure()?.errorText };
        if (req.resourceType() === 'media' && issue.error === 'net::ERR_ABORTED') report.mediaCancellations.push(issue);
        else report.requestFailures.push(issue);
      });
      page.on('response', res => { if (res.status() >= 400) report.errors.push(`HTTP ${res.status()}: ${res.url()}`); });
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').currentTime > 0.1);
      const initial = await page.evaluate(() => {
        const video = document.querySelector('video');
        return {
          viewport: { width: innerWidth, height: innerHeight },
          document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
          images: [...document.images].map(img => ({ loaded: img.complete && img.naturalWidth > 0, source: img.getAttribute('src') })),
          video: { playing: !video.paused, readyState: video.readyState, currentTime: video.currentTime, loop: video.loop, muted: video.muted, playsInline: video.playsInline },
          fontLoaded: document.fonts.check('16px Lexend'),
          headingFont: getComputedStyle(document.querySelector('h1')).fontFamily,
          heading: document.querySelector('h1').getBoundingClientRect().toJSON(),
          cards: [...document.querySelectorAll('article')].map(el => el.getBoundingClientRect().toJSON()),
        };
      });
      if (initial.document.width !== width || initial.document.height !== height) throw new Error(`${name}: page overflow`);
      if (!initial.images.every(img => img.loaded)) throw new Error(`${name}: unloaded image`);
      if (!initial.fontLoaded) throw new Error(`${name}: font not loaded`);
      if (initial.heading.bottom >= initial.cards[0].top) throw new Error(`${name}: hero overlaps cards`);
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      await page.getByRole('button', { name: 'Our Projects' }).click();
      const projectsFocused = await page.locator('#work').evaluate(el => el === document.activeElement);
      if (!projectsFocused) throw new Error('Our Projects did not focus project group');
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.waitForTimeout(650);
      if (await page.getByRole('dialog').getAttribute('aria-hidden') !== 'false') throw new Error('Menu did not open');
      if (await page.getByRole('dialog').getByRole('link').count() !== 4) throw new Error('Missing menu links');
      await page.screenshot({ path: `screenshots/${name}-menu.png`, fullPage: true });
      await page.keyboard.press('Shift+Tab');
      const focusTrapped = await page.getByRole('dialog').getByRole('link', { name: 'Enter', exact: true }).evaluate(el => el === document.activeElement);
      if (!focusTrapped) throw new Error('Menu keyboard focus trap failed');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(550);
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.waitForTimeout(650);
      await page.getByRole('button', { name: 'Close menu' }).click();
      await page.waitForTimeout(550);
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.waitForTimeout(650);
      await page.getByRole('dialog').getByRole('link', { name: 'Work', exact: true }).click();
      await page.waitForTimeout(550);
      const menuClosedAfterLink = await page.locator('#navigation-menu').getAttribute('aria-hidden') === 'true';
      if (!menuClosedAfterLink) throw new Error('Menu link did not close menu');
      report.viewports.push({ name, ...initial, interactions: { projectsFocused, menuOpenClose: true, escapeCloses: true, focusTrapped, menuClosedAfterLink } });
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    if (report.errors.length || report.requestFailures.length) process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
