const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/community-superdesign-parallax-stars-background/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const relative = pathname.slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + '/') || !fs.existsSync(file)) {
    res.writeHead(404).end(); return;
  }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const errors = [];
  const failedRequests = [];
  const checks = {};
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('requestfailed', req => failedRequests.push(req.url()));
      page.on('response', response => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`); });
      await page.goto(`http://127.0.0.1:${server.address().port}${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => ({
        title: document.querySelector('h1').innerText,
        overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
        fontLoaded: document.fonts.check('300 50px Lato'),
        fontSize: getComputedStyle(document.querySelector('h1')).fontSize,
        fieldHeight: document.querySelector('.star-field').getBoundingClientRect().height,
        layers: [...document.querySelectorAll('.stars')].map(el => ({
          size: getComputedStyle(el).width,
          duration: getComputedStyle(el).animationDuration,
          count: el.style.boxShadow.split('rgb').length - 1,
          repeatMatches: el.style.boxShadow === el.firstElementChild.style.boxShadow,
          transform: getComputedStyle(el).transform,
        })),
        controls: document.querySelectorAll('button, a, input').length,
      }));
      assert.equal(state.title, 'PURE CSS\nPARALLAX PIXEL STARS');
      assert.equal(state.overflow, false);
      assert.equal(state.fontLoaded, true);
      assert.equal(state.fieldHeight, height);
      assert.deepEqual(state.layers.map(x => x.duration), ['50s', '100s', '150s']);
      assert.deepEqual(state.layers.map(x => x.count), [700, 200, 100]);
      assert(state.layers.every(x => x.repeatMatches));
      assert.equal(state.controls, 0);
      await page.waitForTimeout(350);
      const after = await page.locator('.stars').evaluateAll(els => els.map(el => getComputedStyle(el).transform));
      assert(after.every((transform, i) => transform !== state.layers[i].transform));
      // Freeze animations at a consistent point for reviewable screenshots.
      await page.evaluate(() => document.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 1000; }));
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.stars').first().evaluate(el => getComputedStyle(el).animationName), 'none');
      checks[name] = { ...state, animationMoves: true, reducedMotion: true, screenshot: `screenshots/${name}.png` };
      await context.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(failedRequests, []);
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify({ checks, errors, failedRequests }, null, 2) + '\n');
    console.log(JSON.stringify({ checks, errors, failedRequests }, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
