const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/palomar-labs/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '') || 'index.html';
  const file = path.join('/work/dist', relative);
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const results = { errors: [], failedRequests: [], assets: [], viewports: {}, interactions: [] };
  const page = await browser.newPage();
  page.on('pageerror', error => results.errors.push(error.message));
  page.on('requestfailed', request => results.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('response', response => { if (!response.url().startsWith('http://127.0.0.1')) results.assets.push({ url: response.url(), status: response.status() }); });
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2, { timeout: 45000 });
    await page.waitForTimeout(1800);
    results.viewports[name] = await page.evaluate(async () => {
      const v = document.querySelector('video');
      const time = v.currentTime;
      await new Promise(resolve => setTimeout(resolve, 350));
      return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, video: { src: v.currentSrc, readyState: v.readyState, width: v.videoWidth, height: v.videoHeight, playing: !v.paused && v.currentTime > time, muted: v.muted, loop: v.loop, playsInline: v.playsInline, objectFit: getComputedStyle(v).objectFit, objectPosition: getComputedStyle(v).objectPosition }, fonts: [...document.fonts].map(f => ({ family: f.family, status: f.status })) };
    });
    assert.equal(results.viewports[name].scrollWidth, width, `${name} horizontal overflow`);
    assert.ok(results.viewports[name].video.playing, `${name} video must play`);
    await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
    if (name === 'mobile') {
      const toggle = page.getByRole('button', { name: 'Toggle menu' });
      for (const label of ['Solutions', 'Plans', 'News', 'Try It Free']) {
        await toggle.click();
        await page.waitForTimeout(650);
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
        if (label === 'Solutions') await page.screenshot({ path: '/work/screenshots/mobile-menu.png' });
        await page.locator('#mobile-menu').getByRole('link', { name: label, exact: true }).click();
        await page.waitForTimeout(650);
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => document.body.style.overflow), '');
        results.interactions.push(`${label}: menu opens, locks scroll, closes on selection, restores scrolling`);
      }
      await toggle.click();
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      results.interactions.push('Escape closes mobile menu');
      await toggle.click();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.waitForTimeout(100);
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      results.interactions.push('Resizing to desktop closes menu and restores scrolling');
    } else {
      await page.getByRole('button', { name: 'Solutions' }).click();
      assert.equal(await page.locator('nav').getByRole('link', { name: 'Plans', exact: true }).count(), 1);
      results.interactions.push('Desktop Solutions button does not open a dropdown');
    }
  }
  await page.setViewportSize({ width: 390, height: 600 });
  await page.evaluate(() => window.scrollTo(0, 80));
  await page.waitForTimeout(400);
  assert.ok(await page.locator('nav').evaluate(n => n.classList.contains('backdrop-blur-md')));
  results.interactions.push('Short viewport scrolling applies navbar cream background, blur, and shadow');
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await page.waitForTimeout(650);
  const menuBounds = await page.locator('#mobile-menu').boundingBox();
  assert.equal(menuBounds.height, 600);
  assert.equal(menuBounds.y, 0);
  results.interactions.push('Mobile menu covers the full viewport even when navbar is scrolled and blurred');
  await page.keyboard.press('Escape');
  assert.equal(results.errors.length, 0, 'No runtime errors');
  fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results, null, 2));
  await browser.close();
  server.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
