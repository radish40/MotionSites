const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/cognitra-feature/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!req.url.startsWith(base) || !file.startsWith(path.resolve('dist') + '/')) {
    res.writeHead(404).end(); return;
  }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      const errors = [], failedRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure().errorText }));
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3, { timeout: 30000 });
      await page.waitForTimeout(1800);
      const data = await page.evaluate(() => {
        const video = document.querySelector('video');
        const section = document.querySelector('section');
        const heading = document.querySelector('h2');
        return {
          viewport: { width: innerWidth, height: innerHeight },
          overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
          video: { playing: !video.paused, time: video.currentTime, muted: video.muted, loop: video.loop, inline: video.playsInline, width: video.videoWidth, height: video.videoHeight, position: getComputedStyle(video).position },
          section: { height: section.getBoundingClientRect().height, background: getComputedStyle(section).backgroundColor, padding: getComputedStyle(section).padding },
          heading: { text: heading.innerText.replace(/\s+/g, ' '), fontSize: getComputedStyle(heading).fontSize, words: [...heading.children].map(word => ({ opacity: getComputedStyle(word).opacity, transform: getComputedStyle(word).transform })) },
          fontLoaded: document.fonts.check('14px "Helvetica Now Var"'),
          paragraphOpacity: getComputedStyle(document.querySelector('p')).opacity,
        };
      });
      assert.equal(data.overflow, false);
      assert.equal(data.section.height, height);
      assert.equal(data.section.background, 'rgba(0, 0, 0, 0)');
      assert.equal(data.video.playing, true);
      assert.equal(data.video.muted && data.video.loop && data.video.inline, true);
      assert.equal(data.heading.words.length, 6);
      assert.ok(data.heading.words.every(word => word.opacity === '1' && word.transform === 'none'));
      assert.equal(data.paragraphOpacity, '1');
      assert.equal(errors.length, 0);
      const before = data.video.time;
      await page.waitForTimeout(300);
      assert.notEqual(await page.$eval('video', video => video.currentTime), before);
      // Hold a consistent frame only for the screenshots, after verifying playback.
      await page.$eval('video', video => { video.pause(); video.currentTime = 2; });
      await page.waitForTimeout(400);
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      results.push({ name, ...data, errors, failedRequests, screenshot: `screenshots/${name}.png` });
      await page.close();
    }
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
