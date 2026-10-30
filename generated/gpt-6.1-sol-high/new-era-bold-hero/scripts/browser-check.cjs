const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/new-era-bold-hero/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const range = req.headers.range;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (range) {
    const [startText, endText] = range.replace('bytes=', '').split('-');
    const start = Number(startText), end = endText ? Number(endText) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  }
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['small-mobile', 320, 740], ['tablet', 768, 1024]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 3 && v.currentTime > 0.1 && !v.paused; });
      const metrics = await page.evaluate(() => {
        const h = document.querySelector('h1'), b = document.querySelector('button'), v = document.querySelector('video');
        return {
          viewport: { width: innerWidth, height: innerHeight },
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          heading: { text: h.innerText, top: h.getBoundingClientRect().top, font: getComputedStyle(h).fontFamily, size: getComputedStyle(h).fontSize },
          linesFit: [...h.children].every(s => { const r = document.createRange(); r.selectNodeContents(s); return r.getBoundingClientRect().right <= innerWidth; }),
          button: { width: b.offsetWidth, height: b.offsetHeight },
          fontLoaded: document.fonts.check('700 60px Rubik'),
          video: { playing: !v.paused, time: v.currentTime, width: v.videoWidth, height: v.videoHeight, autoplay: v.autoplay, muted: v.muted, loop: v.loop, playsInline: v.playsInline },
        };
      });
      assert.equal(metrics.scrollWidth, width, `${name}: horizontal overflow`);
      assert.equal(metrics.linesFit, true, `${name}: headline clipping`);
      assert.equal(metrics.fontLoaded, true);
      assert.deepEqual(metrics.button, { width: 184, height: 65 });
      assert.equal(metrics.heading.top, width >= 768 ? 192 : 128);
      assert.equal(metrics.video.autoplay && metrics.video.muted && metrics.video.loop && metrics.video.playsInline, true);
      const startTime = metrics.video.time;
      await page.waitForTimeout(350);
      assert.ok(await page.locator('video').evaluate((v, t) => v.currentTime > t, startTime), 'video advances');
      if (name === 'desktop') {
        const button = page.getByRole('button', { name: 'Get started' });
        await button.hover();
        await page.waitForTimeout(250);
        assert.ok((await button.boundingBox()).width > 192, 'hover scales up');
        await page.mouse.down();
        await page.waitForTimeout(250);
        assert.ok((await button.boundingBox()).width < 177, 'press scales down');
        await page.mouse.up();
        await page.mouse.move(1400, 900);
        await page.keyboard.press('Tab');
        await button.focus();
        assert.equal(await button.evaluate(b => b.matches(':focus-visible')), true);
        await page.keyboard.press('Enter');
        await page.keyboard.press('Tab');
      } else {
        const button = page.getByRole('button', { name: 'Get started' });
        if (width < 768) await button.tap();
        else await button.click();
        await page.locator('button').evaluate(b => b.blur());
      }
      await page.waitForTimeout(250);
      // Hold a real video frame for reproducible composition screenshots.
      await page.locator('video').evaluate(v => { v.pause(); v.currentTime = 1; });
      await page.waitForTimeout(300);
      if (name === 'desktop' || name === 'mobile') await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      assert.deepEqual(errors, [], `${name}: browser errors`);
      results.push({ name, ...metrics, interactions: 'passed', errors });
      await page.close();
    }
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
