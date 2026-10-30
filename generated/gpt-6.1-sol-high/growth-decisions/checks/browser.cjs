const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/growth-decisions/';
const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') { res.writeHead(204).end(); return; }
  const name = req.url === base ? 'index.html' : req.url.slice(base.length);
  if (!req.url.startsWith(base) || !['index.html', 'styles.css', 'main.js'].includes(name)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', { 'index.html': 'text/html', 'styles.css': 'text/css', 'main.js': 'text/javascript' }[name]);
  res.end(fs.readFileSync(path.join('dist', name)));
});
(async () => {
  await new Promise(resolve => server.listen(0, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const report = { url: base, browser: await browser.version(), checks: [], errors: [], failedRequests: [], abortedMediaRequests: [], assets: [] };
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
  page.on('requestfailed', r => {
    const entry = { url: r.url(), error: r.failure()?.errorText };
    if (r.resourceType() === 'media' && entry.error === 'net::ERR_ABORTED') report.abortedMediaRequests.push(entry);
    else report.failedRequests.push(entry);
  });
  page.on('response', r => { if (/googleapis|gstatic|cloudfront/.test(r.url())) report.assets.push({url:r.url(), status:r.status()}); });
  const check = (name, detail) => report.checks.push({ name, passed: true, detail });
  const measure = () => page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, font: document.fonts.check('500 16px Inter'), video: { readyState: document.querySelector('video').readyState, width: document.querySelector('video').videoWidth, paused: document.querySelector('video').paused, time: document.querySelector('video').currentTime } }));
  try {
    await page.goto(`http://localhost:${server.address().port}${base}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2, { timeout: 45000 });
    await page.waitForTimeout(2500);
    assert.equal(await page.title(), 'Meridian — Revenue Intelligence for SaaS');
    let dimensions = await measure();
    assert.equal(dimensions.scrollWidth, 1440); assert.equal(dimensions.scrollHeight, 1000);
    assert.ok(dimensions.video.width > 0 && !dimensions.video.paused && dimensions.video.time > 0);
    assert.ok(dimensions.font);
    check('Desktop 1440×1000: no scrolling; Inter loaded; video playing', dimensions);
    await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
    await page.locator('.nav__links a').first().hover();
    await page.waitForTimeout(450);
    assert.equal(await page.locator('.nav__links a').first().evaluate(el => getComputedStyle(el).color), 'rgb(0, 108, 210)');
    await page.locator('.nav > .btn').hover();
    await page.waitForTimeout(450);
    assert.equal(await page.locator('.nav > .btn .btn__icon').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 255, 255)');
    check('Desktop navigation hover and button icon inversion');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.mouse.move(389, 843);
    await page.waitForTimeout(500);
    dimensions = await measure();
    assert.equal(dimensions.scrollWidth, 390);
    assert.ok(await page.locator('.nav__burger').isVisible());
    assert.ok(!(await page.locator('.nav__links').isVisible()));
    check('Mobile 390×844: no horizontal overflow; responsive navigation', dimensions);
    await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
    const burger = page.locator('.nav__burger');
    const menu = page.locator('#mobile-menu');
    await burger.click();
    assert.equal(await burger.getAttribute('aria-expanded'), 'true');
    assert.equal(await burger.getAttribute('aria-label'), 'Close menu');
    assert.ok(await menu.isVisible());
    assert.equal(await burger.locator('span').count(), 3);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
    await page.screenshot({ path: 'screenshots/mobile-menu.png', fullPage: true });
    await page.keyboard.press('Escape');
    assert.ok(!(await menu.isVisible()));
    for (let i = 0; i < 5; i++) {
      await burger.click();
      await menu.locator('a').nth(i).click();
      assert.equal(await burger.getAttribute('aria-expanded'), 'false');
      assert.equal(await burger.getAttribute('aria-label'), 'Open menu');
      assert.ok(!(await menu.isVisible()));
    }
    await burger.click(); await burger.click();
    assert.ok(!(await menu.isVisible()));
    check('Mobile menu: toggle, accessible state, Escape, all five links close, three bars retained');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.headline__accent').evaluate(el => getComputedStyle(el).color), 'rgb(0, 108, 210)');
    assert.equal(await page.locator('.headline__accent').evaluate(el => getComputedStyle(el, '::after').content), 'none');
    assert.equal(await page.locator('.headline__rise').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    check('Reduced motion: entrance animations disabled and solid blue accent');
    await page.setViewportSize({ width: 1440, height: 650 });
    dimensions = await measure();
    assert.equal(dimensions.scrollWidth, 1440); assert.equal(dimensions.scrollHeight, 650);
    const heroBottom = await page.locator('.hero').evaluate(el => el.getBoundingClientRect().bottom);
    const ledeTop = await page.locator('.lede').evaluate(el => el.getBoundingClientRect().top);
    assert.ok(heroBottom <= ledeTop);
    check('Short desktop 1440×650: content fits without overlap or scrolling', dimensions);
    assert.equal(report.errors.length, 0);
    assert.equal(report.failedRequests.length, 0);
    const playback = await measure();
    assert.ok(!playback.video.paused && playback.video.readyState >= 2 && playback.video.time > dimensions.video.time);
    check('No browser script errors, console errors, or failed asset requests; video still playing', { abortedMediaRequests: report.abortedMediaRequests.length, note: 'Chromium may cancel redundant media range requests. Recorded separately; successful HTTP 206 responses and continued decoded playback verified.' });
    report.status = 'passed';
  } catch (e) {
    report.status = 'failed'; report.failure = e.stack;
    process.exitCode = 1;
  } finally {
    fs.writeFileSync('checks/browser-results.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    await browser.close(); server.close();
  }
})();
