const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');

const base = '/motionsites-results/arceage-contact-us/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!req.url.startsWith(base) || !file.startsWith(path.resolve('dist') + '/')) { res.writeHead(404); return res.end(); }
  fs.readFile(file, (error, data) => {
    res.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(error ? 'Not found' : data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const errors = [], failedRequests = [], assetResponses = [], checks = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on('response', response => {
      if (/fonts\.(googleapis|gstatic)|raw\.githubusercontent|\/icons\//.test(response.url())) assetResponses.push({ url: response.url(), status: response.status() });
    });
    await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);
    assert.equal(await page.locator('input').count(), 5);
    assert.equal(await page.locator('[role="img"]').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const fontCheck = await page.evaluate(() => ({ barlow: document.fonts.check('500 20px Barlow'), instrumentSerif: document.fonts.check('italic 20px "Instrument Serif"') }));
    checks.push({ name: 'desktop layout and initial state (1440x1000)', passed: true, fonts: fontCheck });
    await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
    const name = page.locator('#name'), email = page.locator('#email'), phone = page.locator('#phone'), farm = page.locator('#farm');
    await name.focus(); await name.blur();
    assert.equal(await page.locator('[aria-label="Invalid"]').count(), 1);
    await name.fill('Alex Green'); await name.blur();
    assert.equal(await page.locator('[aria-label="Valid"]').count(), 1);
    await email.fill('invalid'); await email.blur();
    assert.equal(await email.getAttribute('aria-invalid'), 'true');
    await email.fill('alex@example.com'); await email.blur();
    assert.equal(await email.getAttribute('aria-invalid'), 'false');
    await phone.fill('123456789'); await phone.blur();
    assert.equal(await phone.getAttribute('aria-invalid'), 'true');
    await phone.fill('+1 (555) 123-4567'); await phone.blur();
    assert.equal(await phone.getAttribute('aria-invalid'), 'false');
    await farm.focus(); await farm.blur();
    assert.equal(await farm.locator('..').locator('[role="img"]').count(), 0);
    await farm.fill('Green Acres'); await farm.blur();
    assert.equal(await farm.locator('..').locator('[aria-label="Valid"]').count(), 1);
    await page.locator('#message').fill('Let’s discuss our wheat acreage.');
    await page.locator('#message').blur();
    assert.equal(await page.locator('[aria-label="Valid"]').count(), 5);
    checks.push({ name: 'blur validation, invalid/valid name, email, international phone and optional fields', passed: true });
    const button = page.getByRole('button', { name: 'Send Message' });
    await button.hover(); await page.waitForTimeout(400);
    assert.equal(await button.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(39, 189, 9)');
    const currentUrl = page.url();
    await button.click();
    assert.equal(page.url(), currentUrl);
    assert.equal(await name.inputValue(), 'Alex Green');
    checks.push({ name: 'green button hover and prevented form submission', passed: true });
    await page.mouse.move(0, 0); await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/desktop-validation.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(2000);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
    await page.locator('#name').fill('Alex'); await page.locator('#name').blur();
    const iconBox = await page.locator('[aria-label="Valid"]').boundingBox();
    assert.ok(iconBox.x >= 0 && iconBox.x + iconBox.width <= 390);
    await button.click();
    assert.equal(await page.locator('#email').evaluate(el => el.validity.valueMissing), true);
    checks.push({ name: 'mobile layout (390x844), visible validation icon and required fields', passed: true });
    assert.equal(errors.length, 0);
    checks.push({ name: 'no browser script errors', passed: true });
    assert.ok(assetResponses.some(asset => asset.url.endsWith('/icons/tick-circle.svg') && asset.status === 200));
    assert.ok(assetResponses.some(asset => asset.url.endsWith('/icons/close-circle.svg') && asset.status === 200));
    checks.push({ name: 'local SVG mask fallbacks loaded successfully', passed: true });
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify({ checks, errors, failedRequests, assetResponses }, null, 2) + '\n');
    console.log(JSON.stringify({ checks, errors, failedRequests, assetResponses }, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
