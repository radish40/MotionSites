const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/arceage-stats/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!req.url.startsWith(base) || !file.startsWith(path.resolve('dist') + '/')) { res.writeHead(404).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = [];
  fs.mkdirSync('screenshots', { recursive: true });
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [], failedRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure().errorText }));
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2800);
      const headingVisible = await page.locator('h2').evaluate(el => [...el.querySelectorAll('[aria-hidden]')].every(ch => getComputedStyle(ch).opacity === '1'));
      assert(headingVisible, 'Typewriter completes');
      const counters = page.locator('#stats .grid > div > div:first-child > span');
      for (let index = 0; index < 5; index++) await counters.nth(index).scrollIntoViewIfNeeded();
      await page.locator('video').scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      assert.deepEqual(await counters.allTextContents(), ['500K+', '99.8%', '50+', '15+', '24/7']);
      const video = await page.locator('video').evaluate(el => ({ readyState: el.readyState, paused: el.paused, currentTime: el.currentTime, width: el.videoWidth, muted: el.muted, loop: el.loop, playsInline: el.playsInline }));
      assert(video.readyState >= 2 && !video.paused && video.currentTime > 0, 'Video plays');
      const timeBefore = video.currentTime;
      await page.waitForTimeout(500);
      assert(await page.locator('video').evaluate(el => el.currentTime) !== timeBefore, 'Video advances');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      assert.deepEqual(await counters.allTextContents(), ['500K+', '99.8%', '50+', '15+', '24/7'], 'Counters retain values on repeat scroll');
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, sectionScrollLeft: document.querySelector('#stats').scrollLeft, flexDirection: getComputedStyle(document.querySelector('#stats > div > div')).flexDirection, fonts: [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family) }));
      assert.equal(layout.scrollWidth, width, 'No horizontal overflow');
      assert.equal(layout.sectionScrollLeft, 0, 'Scroll reveals do not shift section horizontally');
      assert.equal(layout.flexDirection, name === 'desktop' ? 'row' : 'column');
      assert.equal(errors.length, 0, 'No browser errors');
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      report.push({ viewport: { name, width, height }, headingVisible, counters: await counters.allTextContents(), video, layout, errors, failedRequests, screenshot: `screenshots/${name}.png` });
      await page.close();
    }
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
