import { chromium } from '/app/node_modules/playwright-core/index.mjs';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const base = '/motionsites-results/agency-services/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
    const relative = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
    const file = path.resolve('dist', relative);
    if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const results = [];
try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    const failedRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
    assert.equal(await page.locator('h1').innerText(), 'SERVICES');
    assert.equal(await page.locator('ol > li').count(), 5);
    const initialLastOpacity = await page.locator('ol > li').last().evaluate(el => getComputedStyle(el).opacity);
    for (const row of await page.locator('ol > li').all()) {
      await row.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      assert.equal(await row.evaluate(el => getComputedStyle(el).opacity), '1');
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const layout = await page.evaluate(() => ({
      viewportWidth: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      fontLoaded: document.fonts.check('900 48px Kanit'),
      fontFamily: getComputedStyle(document.body).fontFamily,
      headingSize: getComputedStyle(document.querySelector('h1')).fontSize,
      sectionPadding: getComputedStyle(document.querySelector('section')).padding,
      sectionRadius: getComputedStyle(document.querySelector('section')).borderTopLeftRadius,
      dividerCount: [...document.querySelectorAll('ol > li')].filter(el => getComputedStyle(el).borderTopWidth === '1px').length,
    }));
    assert.equal(layout.documentWidth, width, 'No horizontal overflow');
    assert.equal(layout.dividerCount, 4);
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    assert.deepEqual(errors, [], 'No browser errors');
    results.push({ name, viewport: { width, height }, layout, initialLastOpacity, scrollRevealPassed: true, errors, failedRequests });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('ol > li').last().evaluate(el => getComputedStyle(el).opacity), '1');
  results.push({ name: 'reduced-motion', passed: true });
  await writeFile('screenshots/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
  server.close();
}
