const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/daisy-wild/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(process.cwd(), 'dist', url.pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      const failedRequests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('img').complete && document.querySelector('img').naturalWidth > 0);
      await page.waitForFunction(() => [...document.querySelectorAll('video')].some(v => getComputedStyle(v.parentElement).display !== 'none' && v.readyState >= 2 && !v.paused), { timeout: 30000 });
      await page.waitForTimeout(2800);
      const measurements = await page.evaluate(() => {
        const layout = document.querySelector('section > div');
        const panel = layout.lastElementChild;
        const videos = [...document.querySelectorAll('video')];
        const video = videos.find(v => getComputedStyle(v.parentElement).display !== 'none');
        const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
        const button = document.querySelector('button');
        return {
          viewport: { width: innerWidth, height: innerHeight },
          documentWidth: document.documentElement.scrollWidth,
          layoutDisplay: getComputedStyle(layout).display,
          flexDirection: getComputedStyle(layout).flexDirection,
          panel: rect(panel), video: rect(video.parentElement),
          panelColor: getComputedStyle(panel).backgroundColor,
          image: { ...rect(document.querySelector('img')), loaded: document.querySelector('img').naturalWidth > 0 },
          noteWeights: [...panel.querySelectorAll('p')].slice(2).map(p => getComputedStyle(p).fontWeight),
          button: { opacity: getComputedStyle(button).opacity, transition: getComputedStyle(button).transition, border: getComputedStyle(button).borderWidth },
          videoPlayback: { currentTime: video.currentTime, paused: video.paused, muted: video.muted, loop: video.loop, playsInline: video.playsInline, videoWidth: video.videoWidth },
        };
      });
      assert.equal(measurements.documentWidth, viewport.width, 'No horizontal overflow');
      assert.equal(measurements.panelColor, 'rgb(189, 232, 79)');
      assert.equal(measurements.button.opacity, '1');
      assert.equal(measurements.button.border, '1px');
      assert(measurements.noteWeights.every(w => w === '700'));
      assert(measurements.videoPlayback.currentTime > 0 && measurements.videoPlayback.muted && measurements.videoPlayback.loop && measurements.videoPlayback.playsInline);
      if (name === 'desktop') {
        assert.equal(measurements.layoutDisplay, 'grid');
        assert.equal(measurements.video.width, 720);
        assert.equal(measurements.panel.x, 720);
        assert.equal(measurements.panel.height, 1000);
      } else {
        assert.equal(measurements.flexDirection, 'column-reverse');
        assert.equal(measurements.panel.y, 0);
        assert.equal(measurements.panel.width, 390);
        assert.equal(measurements.video.y, measurements.panel.height);
        assert.equal(measurements.video.height, 292.5);
      }
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      const button = page.getByRole('button', { name: 'SHOP NOW' });
      await button.hover();
      await page.waitForTimeout(550);
      const hover = await button.locator('span').last().evaluate(el => ({ transform: getComputedStyle(el).transform, background: getComputedStyle(el).backgroundColor }));
      assert.equal(hover.transform, 'matrix(1, 0, 0, 1, 0, 0)');
      assert.equal(hover.background, 'rgb(255, 255, 255)');
      await button.click();
      await page.mouse.move(0, 0);
      await button.focus();
      assert(await button.evaluate(el => el === document.activeElement));
      await page.keyboard.press('Enter');
      assert.equal(page.url(), `http://localhost:4173${base}`);
      assert.deepEqual(errors, []);
      // Chromium may cancel a redundant media range request when two responsive
      // video elements share a source. Playback is verified above independently.
      assert.deepEqual(failedRequests.filter(request => !(request.error === 'net::ERR_ABORTED' && request.url.endsWith('.mp4'))), []);
      results.push({ name, status: 'passed', measurements, hover, errors, failedRequests, screenshot: `screenshots/${name}.png` });
      await page.close();
    }
    // Check Tailwind's exact md boundary as well as the requested screen sizes.
    for (const width of [767, 768]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await page.goto(`http://localhost:4173${base}`);
      const display = await page.locator('section > div').evaluate(el => getComputedStyle(el).display);
      assert.equal(display, width < 768 ? 'flex' : 'grid');
      results.push({ name: `breakpoint-${width}`, status: 'passed', display });
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify({ status: 'passed', results }, null, 2) + '\n');
    console.log(JSON.stringify({ status: 'passed', results }, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
