const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const base = '/motionsites-results/community-superdesign-hyperspeed-background/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404); return res.end(); }
  const target = path.join('/work/dist', url.slice(base.length) || 'index.html');
  if (!target.startsWith('/work/dist/') || !fs.existsSync(target)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
  res.end(fs.readFileSync(target));
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const results = { url: base, desktop: {}, mobile: {}, errors: [], consoleWarnings: [], failedRequests: [] };
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
    const page = await context.newPage();
    page.on('pageerror', err => results.errors.push(String(err)));
    page.on('console', msg => { if (msg.type() === 'error') results.errors.push(msg.text()); if (msg.type() === 'warning') results.consoleWarnings.push(msg.text()); });
    page.on('requestfailed', req => results.failedRequests.push(req.url()));
    await page.goto('http://127.0.0.1:4173' + base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    assert.equal(await page.title(), 'Hyperspeed Background');
    assert.equal(await page.locator('canvas').count(), 1);
    const first = await page.locator('canvas').screenshot();
    await page.waitForTimeout(150);
    const second = await page.locator('canvas').screenshot();
    assert(!first.equals(second), 'WebGL frames should animate');
    results[name].animation = 'passed: rendered canvas changes between frames';
    for (const preset of ['one', 'two', 'three', 'four', 'five', 'six']) {
      await page.getByRole('button', { name: preset, exact: true }).click();
      assert.equal(await page.getByRole('button', { name: preset, exact: true }).getAttribute('aria-pressed'), 'true');
      assert((await page.locator('header p').innerText()).includes(preset.toUpperCase()));
      await page.waitForTimeout(100);
    }
    results[name].presets = 'passed: all six change selection and simulation label';
    await page.getByRole('button', { name: 'one', exact: true }).click();
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.hyperspeed').getAttribute('data-speeding'), 'true');
    await page.locator('.hint').waitFor({ state: 'detached', timeout: 5000 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    assert.equal(await page.locator('.hyperspeed').getAttribute('data-speeding'), 'false');
    assert.equal(await page.locator('.hint').count(), 1);
    results[name].hold = 'passed: hold accelerates, release slows and restores hint';
    await page.getByRole('button', { name: 'Restart simulation' }).click();
    assert.equal(await page.locator('canvas').count(), 1);
    results[name].restart = 'passed';
    await page.getByRole('button', { name: 'Simulation information' }).click();
    assert(await page.locator('dialog').isVisible());
    await page.keyboard.press('Escape');
    assert(!await page.locator('dialog').isVisible());
    await page.getByRole('button', { name: 'Reply', exact: true }).click();
    await page.getByLabel('Your message').fill('A beautiful warp-speed ride.');
    await page.getByRole('button', { name: 'Save reply' }).click();
    assert.equal(await page.evaluate(() => localStorage.getItem('hyperspeed-reply')), 'A beautiful warp-speed ride.');
    await page.getByRole('button', { name: 'Close dialog' }).click();
    results[name].dialogs = 'passed: info, Escape, reply local save, close';
    await page.locator('canvas').click();
    await page.keyboard.down('Space');
    assert.equal(await page.locator('.hyperspeed').getAttribute('data-speeding'), 'true');
    await page.keyboard.up('Space');
    assert.equal(await page.locator('.hyperspeed').getAttribute('data-speeding'), 'false');
    results[name].keyboard = 'passed';
    if (name === 'mobile') {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 422 }] });
      assert.equal(await page.locator('.hyperspeed').getAttribute('data-speeding'), 'true');
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
      assert.equal(await page.locator('.hyperspeed').getAttribute('data-speeding'), 'false');
      results[name].touch = 'passed: touch pointer and cancellation';
    }
    const layout = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, canvasWidth: document.querySelector('canvas').clientWidth, canvasHeight: document.querySelector('canvas').clientHeight }));
    assert.equal(layout.scrollWidth, viewport.width);
    assert.equal(layout.scrollHeight, viewport.height);
    results[name].layout = layout;
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/work/screenshots/' + name + '.png' });
    await context.close();
  }
  await browser.close();
  server.close();
  fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
  assert.equal(results.errors.length, 0, JSON.stringify(results.errors));
  assert.equal(results.failedRequests.length, 0, JSON.stringify(results.failedRequests));
  console.log(JSON.stringify(results, null, 2));
})().catch(err => { console.error(err); process.exit(1); });
