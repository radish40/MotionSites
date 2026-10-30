const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve('dist');
const prefix = '/motionsites-results/18/';
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.ttf': 'font/ttf', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(prefix)) { res.writeHead(404).end(); return; }
  let file = path.join(root, url.slice(prefix.length));
  if (url.endsWith('/')) file = path.join(file, 'index.html');
  fs.readFile(file, (error, bytes) => {
    if (error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(bytes);
  });
});
(async () => {
  await new Promise(resolve => server.listen(3000, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('response', res => { if (res.status() >= 400) failed.push({ url: res.url(), status: res.status() }); });
    page.on('requestfailed', req => failed.push({ url: req.url(), error: req.failure() }));
    await page.addInitScript(() => {
      window.observed = { words: [], samples: [] };
      let lastWord = '', lastCounter = '', sawLoader = false;
      const observer = new MutationObserver(() => {
        const loader = document.querySelector('[data-testid="loader"]');
        const word = document.querySelector('.loading-word');
        const counter = document.querySelector('.counter');
        const now = performance.now();
        if (loader) sawLoader = true;
        if (word && word.textContent !== lastWord) {
          lastWord = word.textContent;
          window.observed.words.push({ text: lastWord, time: now });
        }
        if (counter && counter.textContent !== lastCounter) {
          lastCounter = counter.textContent;
          window.observed.samples.push({ text: lastCounter, time: now });
        }
        const main = document.querySelector('main');
        if (sawLoader && !loader && !window.observed.removedAt) window.observed.removedAt = now;
        if (main && main.style.opacity === '1' && !window.observed.revealedAt) window.observed.revealedAt = now;
      });
      observer.observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    });
    await page.goto('http://127.0.0.1:3000' + prefix, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => Number(document.querySelector('.counter')?.textContent) >= 60);
    const midway = await page.evaluate(() => ({ word: document.querySelector('.loading-word')?.textContent, counter: document.querySelector('.counter')?.textContent, overflow: document.documentElement.scrollWidth > innerWidth, font: document.fonts.check('italic 72px "Instrument Serif"'), background: getComputedStyle(document.querySelector('.loading-screen')).backgroundColor, barHeight: document.querySelector('.progress-track').getBoundingClientRect().height }));
    await page.screenshot({ path: `screenshots/${name}.png` });
    await page.waitForFunction(() => document.querySelector('.counter')?.textContent === '100');
    const fullProgress = await page.locator('.progress-track').getAttribute('aria-valuenow');
    await page.waitForSelector('[data-testid="loader"]', { state: 'detached' });
    await page.waitForTimeout(600);
    const observed = await page.evaluate(() => window.observed);
    const final = await page.evaluate(() => ({ opacity: getComputedStyle(document.querySelector('main')).opacity, overflow: document.documentElement.scrollWidth > innerWidth, loaderPresent: !!document.querySelector('[data-testid="loader"]') }));
    const first = observed.samples.find(s => Number(s.text) > 0);
    const estimatedStart = first.time - Number(first.text) * 27;
    const hundred = observed.samples.find(s => s.text === '100');
    const checks = {
      wordsInOrder: observed.words.map(w => w.text).join(',') === 'Design,Create,Inspire',
      zeroPadded: observed.samples.every(s => /^\d{3}$/.test(s.text)),
      counterDuration: hundred.time - estimatedStart >= 2670 && hundred.time - estimatedStart <= 2740,
      completeProgress: fullProgress === '100',
      exitTiming: observed.removedAt - hundred.time >= 900 && observed.removedAt - hundred.time <= 1150,
      fontLoaded: midway.font,
      noOverflow: !midway.overflow && !final.overflow,
      revealComplete: final.opacity === '1' && !final.loaderPresent,
      noErrors: errors.length === 0 && failed.length === 0,
    };
    // Reload is the native way to replay the requested sequence.
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="loader"]');
    checks.reloadRestarts = await page.locator('.loading-word').textContent() === 'Design';
    results.push({ viewport: { width, height }, screenshot: `screenshots/${name}.png`, checks, midway, final, words: observed.words, counterDurationMs: hundred.time - estimatedStart, exitAfter100Ms: observed.removedAt - hundred.time, errors, failedRequests: failed });
    await page.close();
  }
  await browser.close(); server.close();
  fs.writeFileSync('browser-checks.json', JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => Object.values(r.checks).some(v => !v))) process.exitCode = 1;
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
