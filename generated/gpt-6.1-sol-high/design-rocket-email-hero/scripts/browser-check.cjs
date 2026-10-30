const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const base = '/motionsites-results/design-rocket-email-hero/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', url.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const range = req.headers.range;
  if (range) {
    const [startText, endText] = range.replace('bytes=', '').split('-');
    const start = Number(startText), end = endText ? Number(endText) : size - 1;
    res.writeHead(206, { 'Content-Type': types[path.extname(file)], 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end-start+1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': size }); fs.createReadStream(file).pipe(res); }
});
(async () => {
  server.listen(4173, '0.0.0.0');
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => { if (!r.failure()?.errorText.includes('ERR_ABORTED')) failed.push({ url: r.url(), error: r.failure()?.errorText }); });
    await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2));
    const media = [];
    for (const video of await page.locator('video').all()) {
      await video.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const before = await video.evaluate(v => v.currentTime);
      await page.waitForTimeout(700);
      media.push(await video.evaluate((v, before) => ({ readyState: v.readyState, paused: v.paused, currentTime: v.currentTime, advances: v.currentTime > before, width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop, playsInline: v.playsInline, error: v.error?.message || null }), before));
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, mainWidth: document.querySelector('main').getBoundingClientRect().width, heroHeight: document.querySelector('.hero').getBoundingClientRect().height, fontDisplay: document.fonts.check('58px "Instrument Serif"'), fontBody: document.fonts.check('18px Inter'), overflows: [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 || e.getBoundingClientRect().left < -1).map(e => e.tagName + '.' + e.className).slice(0,10) }));
    await page.locator('video').evaluateAll(vs => vs.forEach(v => { v.pause(); v.currentTime = 2; }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
    const heroButton = page.locator('a').filter({ hasText: /^Enroll Now$/ }).first();
    await heroButton.click();
    await page.waitForTimeout(800);
    const enrollNavigation = await page.evaluate(() => location.hash === '#enroll' && document.querySelector('#enroll').getBoundingClientRect().top >= 0 && document.querySelector('#enroll').getBoundingClientRect().top < innerHeight);
    await page.getByRole('link', { name: 'Get Started', exact: true }).click();
    await page.waitForTimeout(800);
    const courseNavigation = await page.evaluate(() => location.hash === '#course-content');
    const primary = page.getByRole('link', { name: 'Get Started', exact: true });
    await primary.hover(); await page.waitForTimeout(250);
    const hover = await primary.evaluate(e => ({ background: getComputedStyle(e).backgroundColor, transform: getComputedStyle(e).transform }));
    await page.locator('.group').first().hover(); await page.waitForTimeout(750);
    const videoHover = await page.locator('.card-video').first().evaluate(e => getComputedStyle(e).transform);
    await page.getByRole('link', { name: 'Design Rocket', exact: true }).click();
    await page.waitForTimeout(800);
    const topNavigation = await page.evaluate(() => location.hash === '#top');
    const checks = { name, viewport: {width,height}, errors, failed, layout, media, videosAdvance: media.every(v => v.advances), enrollNavigation, courseNavigation, topNavigation, hover, videoHover, socialCount: await page.locator('footer a[target="_blank"]').count(), stepCount: await page.locator('ol li').count() };
    results.push(checks);
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close(); server.close();
  if (results.some(r => r.errors.length || r.failed.length || r.layout.scrollWidth > r.viewport.width || r.media.some(v => v.error || v.paused) || !r.videosAdvance || !r.enrollNavigation || !r.courseNavigation || !r.topNavigation)) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
