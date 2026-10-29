const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const base = '/motionsites-results/editorial-collection-cta/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const clean = decodeURIComponent(req.url.split('?')[0]);
  if (!clean.startsWith(base)) { res.writeHead(404); return res.end(); }
  const relative = clean.slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { viewports: [], errors: [], failedRequests: [], assetResponses: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      page.on('pageerror', error => report.errors.push({ name, message: error.message }));
      page.on('console', message => { if (message.type() === 'error') report.errors.push({ name, message: message.text() }); });
      page.on('requestfailed', request => report.failedRequests.push({ name, url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (/cloudfront|googleapis|gstatic/.test(response.url())) report.assetResponses.push({ name, url: response.url(), status: response.status() }); });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.querySelectorAll('[style]')].filter(e => e.style.filter).every(e => getComputedStyle(e).opacity === '1'));
      await page.waitForTimeout(1000);
      const state = await page.evaluate(async () => {
        const video = document.querySelector('video');
        const input = document.querySelector('input');
        const button = document.querySelector('button');
        const motions = [...document.querySelectorAll('[style]')].filter(e => e.style.filter);
        return {
          viewport: { width: innerWidth, height: innerHeight },
          scrollWidth: document.documentElement.scrollWidth,
          sectionHeight: document.querySelector('section').getBoundingClientRect().height,
          fonts: { instrumentSerif: document.fonts.check('60px "Instrument Serif"'), manrope: document.fonts.check('15px Manrope') },
          video: { readyState: video.readyState, paused: video.paused, time: video.currentTime, width: video.videoWidth, height: video.videoHeight, error: video.error?.message || null, muted: video.muted, loop: video.loop },
          animations: motions.map(e => ({ opacity: getComputedStyle(e).opacity, filter: getComputedStyle(e).filter, transform: getComputedStyle(e).transform })),
          inputAndButtonFit: input.getBoundingClientRect().right <= button.getBoundingClientRect().left && button.getBoundingClientRect().right <= innerWidth,
        };
      });
      assert.equal(state.scrollWidth, width, `${name}: horizontal overflow`);
      assert.ok(state.sectionHeight >= height);
      assert.ok(state.inputAndButtonFit);
      assert.ok(state.animations.every(a => a.opacity === '1' && a.filter === 'blur(0px)'));
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      const input = page.getByRole('textbox', { name: 'Email address' });
      await input.fill('invalid-email');
      await page.getByRole('button', { name: 'Subscribe →' }).click();
      assert.equal(await input.evaluate(e => e.validity.typeMismatch), true);
      await input.fill('reader@example.com');
      await page.evaluate(() => {
        window.submitResult = null;
        document.addEventListener('submit', event => {
          window.submitResult = { prevented: event.defaultPrevented };
        });
      });
      const oldUrl = page.url();
      await page.getByRole('button', { name: 'Subscribe →' }).click();
      await page.waitForTimeout(100);
      assert.deepEqual(await page.evaluate(() => window.submitResult), { prevented: true });
      assert.equal(page.url(), oldUrl);
      assert.equal(await input.inputValue(), 'reader@example.com');
      await input.focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.getByRole('button').evaluate(e => e === document.activeElement), true);
      state.interactions = { invalidEmailRejected: true, validSubmitPrevented: true, noNavigation: true, keyboardTabToButton: true };
      report.viewports.push({ name, ...state });
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    assert.equal(report.errors.length, 0, 'Browser errors found');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
