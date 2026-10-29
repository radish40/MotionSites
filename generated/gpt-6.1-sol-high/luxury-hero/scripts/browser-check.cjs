const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/luxury-hero/';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join(root, name.slice(base.length) || 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'], headless: true });
  const errors = [], failedRequests = [], responses = [], checks = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('requestfailed', req => { if (req.failure()?.errorText !== 'net::ERR_ABORTED') failedRequests.push({ url: req.url(), error: req.failure()?.errorText }); });
  page.on('response', res => { if (res.status() >= 400) responses.push({ url: res.url(), status: res.status() }); });
  const check = (label, condition) => { assert.ok(condition, label); checks.push(label); };
  await page.goto('http://localhost:4173' + base, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2), { timeout: 60000 });
  await page.waitForTimeout(2300);
  const desktop = await page.evaluate(() => {
    const nav = getComputedStyle(document.querySelector('nav'));
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
      navPadding: [nav.paddingTop, nav.paddingRight], gap: getComputedStyle(document.querySelector('nav > div')).gap,
      headingFont: document.fonts.check('60px "Magical Source Demo"'), geist: document.fonts.check('300 16px Geist'),
      videos: [...document.querySelectorAll('video')].map(v => ({ ready: v.readyState, paused: v.paused, error: v.error?.message || null, time: v.currentTime })),
      heading: document.querySelector('h1').innerText };
  });
  check('Desktop 1440x1000 has no horizontal overflow', desktop.scrollWidth === 1440);
  check('Desktop navbar preserves 48px horizontal and 20px vertical padding', desktop.navPadding.join() === '20px,48px');
  check('Desktop links preserve 32px gap', desktop.gap === '32px');
  check('Hero creates two viewport heights', desktop.height === 2000);
  console.log(JSON.stringify({desktop, errors, failedRequests, responses}, null, 2));
  check('Both required fonts load', desktop.headingFont && desktop.geist);
  check('Video 1 autoplays and Video 2 initially pauses', !desktop.videos[1].paused && desktop.videos[0].paused);
  await page.locator('video').nth(1).evaluate(v => { v.pause(); v.currentTime = 2; });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/desktop.png' });
  await page.evaluate(() => scrollTo(0, 450));
  await page.waitForTimeout(1100);
  check('Scrolling fades Video 1 and plays Video 2', await page.evaluate(() => getComputedStyle(document.querySelectorAll('video')[1]).opacity === '0' && !document.querySelector('video').paused));
  await page.screenshot({ path: 'screenshots/desktop-scrolled.png' });
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(900);
  check('Returning to top restores Video 1 and pauses Video 2', await page.evaluate(() => getComputedStyle(document.querySelectorAll('video')[1]).opacity === '1' && document.querySelector('video').paused));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(2300);
  const mobile = await page.evaluate(() => {
    const nav = getComputedStyle(document.querySelector('nav'));
    return { width: document.documentElement.scrollWidth, padding: [nav.paddingTop, nav.paddingRight], heading: document.querySelector('h1').getBoundingClientRect().toJSON() };
  });
  check('Mobile 390x844 has no horizontal overflow', mobile.width === 390);
  check('Mobile heading settles at the specified 24px size', await page.locator('h1').evaluate(el => getComputedStyle(el).fontSize === '24px'));
  check('Mobile navbar preserves 20px horizontal and 16px vertical padding', mobile.padding.join() === '16px,20px');
  await page.screenshot({ path: 'screenshots/mobile.png' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(1050);
  check('Mobile menu opens and locks scrolling', await page.evaluate(() => document.body.style.overflow === 'hidden' && document.querySelector('#mobile-menu').getAttribute('aria-hidden') === 'false'));
  check('All five mobile links are visible', await page.locator('#mobile-menu a').count() === 6);
  await page.screenshot({ path: 'screenshots/mobile-menu.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  check('Escape closes menu and restores scrolling', await page.evaluate(() => document.body.style.overflow !== 'hidden' && document.querySelector('#mobile-menu').inert));
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(1050);
  await page.locator('#mobile-menu').getByRole('link', { name: 'Views', exact: true }).click();
  await page.waitForTimeout(600);
  check('Mobile navigation follows fragment and closes menu', await page.evaluate(() => location.hash === '#views' && document.querySelector('#mobile-menu').inert));
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(600);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(600);
  check('Resizing to desktop closes mobile menu and releases scroll lock', await page.evaluate(() => document.body.style.overflow !== 'hidden'));
  check('No browser script errors', errors.length === 0);
  fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify({ checks, desktop, mobile, errors, failedRequests, responses }, null, 2));
  console.log(JSON.stringify({ checks, errors, failedRequests, responses }, null, 2));
  await browser.close(); server.close();
})().catch(error => { console.error(error); server.close(); process.exit(1); });
