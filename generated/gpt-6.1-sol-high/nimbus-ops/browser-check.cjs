const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/nimbus-ops/';
const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(req.url.split('?')[0]);
  if (!requestPath.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(__dirname, 'dist', requestPath.slice(base.length) || 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: 'http://localhost:4173' + base, viewports: [], errors: [], failedRequests: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure().errorText }));
      page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
      await page.goto(report.url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const shell = page.locator('.modal-cube-shell');
      const measurements = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth,
        title: document.querySelector('h2').textContent,
        particles: document.querySelectorAll('.cube-particle').length,
        faces: document.querySelectorAll('.cube-face').length,
        fonts: [...document.fonts].map(f => ({family:f.family,status:f.status})),
        cubeAnimation: getComputedStyle(document.querySelector('.operations-core-cube')).animationName,
      }));
      assert.equal(measurements.scrollWidth, width);
      assert.equal(measurements.particles, 14);
      assert.equal(measurements.faces, 6);
      assert.equal(measurements.cubeAnimation, 'core-cube-float');
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      await shell.click();
      await page.waitForTimeout(1100);
      assert.equal(await shell.evaluate(el => el.classList.contains('is-exploded')), true);
      assert.equal(await page.locator('.cube-particle').first().evaluate(el => getComputedStyle(el).opacity), '1');
      await page.screenshot({ path: `screenshots/${name}-exploded.png`, fullPage: true });
      await shell.click();
      assert.equal(await shell.evaluate(el => el.classList.contains('is-exploded')), false);
      await shell.focus();
      await page.keyboard.press('Enter');
      assert.equal(await shell.evaluate(el => el.classList.contains('is-exploded')), true);
      await page.keyboard.press('Space');
      assert.equal(await shell.evaluate(el => el.classList.contains('is-exploded')), false);
      const cta = page.getByRole('link', {name:'Plan operations'});
      await cta.hover();
      await page.waitForTimeout(500);
      assert.equal(await cta.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 216, 121)');
      await cta.click();
      assert.ok(page.url().endsWith('#plans'));
      report.viewports.push({name,width,height,...measurements,clickToggle:'passed',keyboardToggle:'passed',ctaHoverAndHash:'passed',horizontalOverflow:false});
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
    assert.equal(report.errors.length,0);
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode=1; server.close(); });
