const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const prefix = '/motionsites-results/rocket-faq/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const file = path.join(process.cwd(), 'dist', pathname.slice(prefix.length) || 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: prefix, viewports: [], interactions: [], errors: [], failedRequests: [] };
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
      page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      await page.goto('http://localhost:4173' + prefix, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      assert.equal(await page.locator('h1').innerText(), viewport.width > 640 ? 'Answers to the questions\nthat come up most.' : 'Answers to the questions that come up most.');
      assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(0, 0, 0)');
      assert(await page.evaluate(() => document.fonts.check('400 16px Inter')));
      assert(await page.evaluate(() => document.fonts.check('400 16px "Material Symbols Outlined Local"')));
      const categories = ['General', 'AI & Capabilities', 'Integrations & Security'];
      for (const category of categories) {
        await page.getByRole('button', { name: category, exact: true }).click();
        await page.waitForTimeout(1300);
        assert.equal(await page.locator('[data-state=open][data-orientation]').count(), 0);
        const triggers = page.locator('h3 > button');
        assert.equal(await triggers.count(), 5);
        for (let index = 0; index < 5; index++) {
          await triggers.nth(index).click();
          await page.waitForTimeout(400);
          assert.equal(await triggers.nth(index).getAttribute('aria-expanded'), 'true');
          await page.waitForFunction(() => [...document.querySelectorAll('[role=region]')].filter(el => el.getBoundingClientRect().height > 0).length === 1);
          assert.equal(await page.locator('[role=region]:visible').count(), 1);
          assert((await page.locator('[role=region]:visible').innerText()).length > 30);
          assert.equal(await page.locator('h3 > button[aria-expanded=true]').count(), 1);
        }
        await triggers.nth(4).click();
        assert.equal(await triggers.nth(4).getAttribute('aria-expanded'), 'false');
        await triggers.nth(0).click();
        // The next category switch must close this answer.
      }
      await page.getByRole('button', { name: 'General', exact: true }).click();
      await page.waitForTimeout(1300);
      assert.equal(await page.locator('h3 > button[aria-expanded=true]').count(), 0);
      const first = page.locator('h3 > button').first();
      await first.focus();
      await page.keyboard.press('Enter');
      assert.equal(await first.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('ArrowDown');
      assert(await page.locator('h3 > button').nth(1).evaluate(el => el === document.activeElement));
      await first.click();
      assert.equal(await page.getByRole('link', { name: 'Email us' }).getAttribute('href'), 'mailto:hello@uirocket.com');
      const firstItem = page.locator('[data-state][data-orientation].rounded-2xl').first();
      await firstItem.scrollIntoViewIfNeeded();
      const box = await firstItem.boundingBox();
      await page.mouse.move(box.x + 30, box.y + 30);
      const spotlight = await firstItem.evaluate(el => ({ x: el.style.getPropertyValue('--spot-x'), y: el.style.getPropertyValue('--spot-y'), ring: getComputedStyle(el.firstElementChild).maskComposite }));
      assert(Math.abs(parseFloat(spotlight.x) - 30) < 2);
      assert(spotlight.ring.split(',').every(value => value.trim() === 'exclude'));
      // Reveal every row before capturing the complete mobile page.
      for (const row of await page.locator('h3 > button').all()) { await row.scrollIntoViewIfNeeded(); await page.waitForTimeout(250); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.mouse.move(0, 0);
      await page.waitForTimeout(800);
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
      assert(dimensions.document <= dimensions.viewport, 'Horizontal layout overflow');
      await page.screenshot({ path: `screenshots/${viewport.width === 1440 ? 'desktop' : 'mobile'}.png`, fullPage: true });
      report.viewports.push({ ...viewport, dimensions, fontsLoaded: true, noHorizontalOverflow: true });
      report.interactions.push(`${viewport.width}px: all 15 answers, category reset, single-open, collapse, keyboard Enter/ArrowDown, email href, cursor spotlight`);
      await page.close();
    }
    const reduced = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    // Verify the bundled fonts work even without Google Fonts connectivity.
    await reduced.route('https://fonts.googleapis.com/**', route => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await reduced.goto('http://localhost:4173' + prefix, { waitUntil: 'networkidle' });
    assert.equal(await reduced.locator('h1').evaluate(el => getComputedStyle(el.parentElement).transform), 'none');
    await reduced.evaluate(() => document.fonts.ready);
    assert(await reduced.evaluate(() => document.fonts.check('400 16px Inter') && document.fonts.check('400 16px "Material Symbols Outlined Local"')));
    report.interactions.push('Reduced motion removes translation; bundled fonts load without external stylesheet');
    assert.deepEqual(report.errors, []);
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
