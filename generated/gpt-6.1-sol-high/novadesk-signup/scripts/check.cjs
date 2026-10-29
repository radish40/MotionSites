const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/novadesk-signup/';
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(prefix, '');
  const file = path.join('/work/dist', relative || 'index.html');
  if (!file.startsWith('/work/dist/')) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' })[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const errors = [], failedRequests = [], checks = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
      await page.goto(`http://127.0.0.1:4173${prefix}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3, { timeout: 60000 });
      await page.waitForTimeout(2000);
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: innerHeight, scrollHeight: document.documentElement.scrollHeight, card: document.querySelector('section').getBoundingClientRect().toJSON(), video: { width: document.querySelector('video').videoWidth, height: document.querySelector('video').videoHeight, playing: !document.querySelector('video').paused, time: document.querySelector('video').currentTime, muted: document.querySelector('video').muted } }));
      assert(layout.scrollWidth <= width, `${name}: horizontal overflow`);
      assert(layout.video.playing && layout.video.muted && layout.video.width > 0, `${name}: video playback`);
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      await page.getByRole('button', { name: 'Launch Account' }).click();
      assert(await page.locator('#email').evaluate(el => !el.validity.valid));
      await page.getByRole('textbox', { name: 'Email', exact: true }).fill('nova@example.com');
      await page.locator('#password').fill('NovaDesk-example-42');
      await page.getByRole('button', { name: 'Show password' }).click();
      assert.equal(await page.locator('#password').getAttribute('type'), 'text');
      await page.getByRole('button', { name: 'Hide password' }).click();
      assert.equal(await page.locator('#password').getAttribute('type'), 'password');
      await page.locator('label').filter({ has: page.getByRole('checkbox') }).click();
      assert(await page.getByRole('checkbox').isChecked());
      await page.getByRole('button', { name: 'Launch Account' }).click();
      await page.getByRole('status').filter({ hasText: 'Account creation is not connected' }).waitFor();
      await page.getByRole('button', { name: 'Dismiss notification' }).click();
      for (const provider of ['Google', 'Apple', 'Twitter']) {
        await page.getByRole('button', { name: provider, exact: true }).click();
        await page.getByRole('status').filter({ hasText: `${provider} sign-in` }).waitFor();
        await page.getByRole('button', { name: 'Dismiss notification' }).click();
      }
      for (const link of ['Rules', 'Privacy Notice', 'Enter']) {
        await page.getByRole('link', { name: link, exact: true }).click();
        await page.getByRole('status').waitFor();
        await page.getByRole('button', { name: 'Dismiss notification' }).click();
      }
      checks.push({ viewport: name, dimensions: `${width}x${height}`, layout, screenshot: `screenshots/${name}.png`, interactions: 'passed: required email, password visibility, agreement, submit, three social buttons, three links, dismiss notices' });
      await context.close();
    }
    assert.deepEqual(errors, [], 'No browser script errors');
    fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify({ checks, scriptErrors: errors, failedRequests }, null, 2));
    console.log(JSON.stringify({ checks, scriptErrors: errors, failedRequests }, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
