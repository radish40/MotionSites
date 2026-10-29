const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const prefix = '/motionsites-results/luxury-escapes/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0]).replace(prefix, '') || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [start, end] = req.headers.range.replace('bytes=', '').split('-').map(Number);
    const last = end || size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${last}/${size}`, 'Content-Length': last - start + 1 });
    fs.createReadStream(file, { start, end: last }).pipe(res);
  } else { res.writeHead(200, { ...headers, 'Content-Length': size }); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const report = { consoleErrors: [], pageErrors: [], requestFailures: [], expectedMediaCancellations: [], responsesFailed: [], viewports: [] };
  const page = await browser.newPage();
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error') report.consoleErrors.push(msg.text()); });
  page.on('requestfailed', request => {
    const failure = { url: request.url(), error: request.failure()?.errorText };
    const expected = failure.url.endsWith('.mp4') && failure.error === 'net::ERR_ABORTED';
    (expected ? report.expectedMediaCancellations : report.requestFailures).push(failure);
  });
  page.on('response', response => { if (response.status() >= 400) report.responsesFailed.push({ url: response.url(), status: response.status() }); });
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`http://localhost:4173${prefix}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2));
    await page.waitForTimeout(2200);
    const layout = await page.evaluate(() => {
      const stage = document.querySelector('[data-testid="stage"]').getBoundingClientRect();
      return { viewport: [innerWidth, innerHeight], scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], stage: { x: stage.x, y: stage.y, width: stage.width, height: stage.height }, antonLoaded: document.fonts.check('52px Anton'), videos: [...document.querySelectorAll('video')].map(v => ({ src: v.currentSrc, readyState: v.readyState, paused: v.paused, width: v.videoWidth, height: v.videoHeight, error: v.error?.message || null })) };
    });
    if (layout.scroll[0] > width || layout.scroll[1] > height) throw new Error(`${name} overflow`);
    if (!layout.antonLoaded || layout.videos.some(v => v.paused || v.error)) throw new Error(`${name} asset failure`);
    await page.screenshot({ path: `/work/screenshots/${name}.png` });
    await page.getByRole('button', { name: 'VIEW OFFER', exact: true }).click();
    await page.waitForTimeout(1600);
    const offerFocus = await page.evaluate(() => document.activeElement?.tagName === 'H2');
    await page.getByRole('button', { name: 'Getaway menu', exact: true }).click();
    const menuOpened = await page.getByRole('button', { name: 'Getaway menu', exact: true }).getAttribute('aria-expanded') === 'true';
    await page.getByRole('button', { name: 'Bali Exclusive · 8 guests · 12 days', exact: true }).click();
    const menuClosed = await page.getByRole('button', { name: 'Getaway menu', exact: true }).getAttribute('aria-expanded') === 'false';
    await page.getByRole('button', { name: 'Read getaway description' }).click();
    const descriptionFocused = await page.evaluate(() => document.activeElement?.id === 'getaway-description');
    await page.getByRole('button', { name: 'Back to offer' }).click();
    await page.waitForTimeout(100);
    const backFocused = await page.getByRole('button', { name: 'VIEW OFFER', exact: true }).evaluate(el => document.activeElement === el);
    if (![offerFocus, menuOpened, menuClosed, descriptionFocused, backFocused].every(Boolean)) throw new Error(`${name} interaction failure: ${JSON.stringify({offerFocus, menuOpened, menuClosed, descriptionFocused, backFocused})}`);
    report.viewports.push({ name, ...layout, interactions: { offerFocus, menuOpened, menuClosed, descriptionFocused, backFocused } });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  report.reducedMotion = await page.evaluate(() => [...document.querySelectorAll('video')].every(v => v.paused));
  if (report.consoleErrors.length || report.pageErrors.length || report.requestFailures.length || report.responsesFailed.length || !report.reducedMotion) throw new Error(`Browser errors: ${JSON.stringify(report)}`);
  fs.writeFileSync('/work/screenshots/browser-report.json', JSON.stringify(report, null, 2));
  await browser.close(); server.close();
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
