const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/cinematic-brand/';
const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', url.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(4173, '0.0.0.0', r));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--disable-dev-shm-usage'] });
  const report = { checks: [], errors: [], consoleErrors: [], httpErrors: [], requestFailures: [], assets: {} };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', e => report.errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
      page.on('response', r => { if (r.status() >= 400) report.httpErrors.push({ url: r.url(), status: r.status() }); });
      page.on('requestfailed', r => { if (!r.failure()?.errorText.includes('ERR_ABORTED')) report.requestFailures.push({ url: r.url(), error: r.failure()?.errorText }); });
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle', timeout: 90000 });
      await page.waitForTimeout(4500);
      assert.equal(await page.title(), 'Nexora — Beyond the Interface');
      assert.equal((await page.locator('h1').innerText()).replace(/\u00a0/g, ' '), 'Innovation that reshapes the fabric of experience');
      const layout = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth, scrollHeight: document.documentElement.scrollHeight, height: innerHeight, font: document.fonts.check('16px "Quire Sans Pro"'), video: (() => { const v = document.querySelector('video'); return { readyState: v.readyState, paused: v.paused, currentTime: v.currentTime, width: v.videoWidth, error: v.error?.message || null }; })() }));
      assert(layout.scrollWidth <= width, `${name}: horizontal overflow`);
      assert(layout.scrollHeight <= height, `${name}: vertical overflow`);
      report.assets[name] = layout;
      const playingTime = layout.video.currentTime;
      await page.waitForTimeout(600);
      assert(await page.locator('section video').evaluate(v => v.currentTime) > playingTime, `${name}: video plays`);
      await page.locator('section video').evaluate(v => { v.pause(); v.currentTime = 5; });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      await page.getByRole('button', { name: 'Contact', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'visible' });
      await page.getByLabel('Email address').fill('review@example.com');
      await page.getByRole('button', { name: 'Get in touch', exact: true }).click();
      await page.getByRole('status').waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      for (const label of ['Sign Up', 'Begin Now']) {
        await page.getByRole('button', { name: label, exact: true }).click();
        await page.getByRole('dialog').waitFor({ state: 'visible' });
        assert.equal(await page.locator('#dialog-title').textContent(), 'Your next chapter.');
        await page.getByRole('button', { name: 'Close dialog' }).click();
      }
      await page.getByRole('button', { name: 'Watch the story' }).click();
      await page.getByRole('dialog').waitFor({ state: 'visible' });
      await page.waitForFunction(() => document.querySelector('dialog video')?.readyState >= 2, { timeout: 60000 });
      assert.equal(await page.locator('dialog video').evaluate(v => v.controls), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('section video').evaluate(v => v.paused), false);
      report.checks.push(`${name} ${width}x${height}: title, copy, viewport fit, autoplay, screenshot, Contact submission, Sign Up, Begin Now, story playback controls, Escape and close passed`);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(`http://localhost:4173${base}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    assert.equal(await page.getByRole('button', { name: 'Begin Now' }).isVisible(), true);
    report.checks.push('Reduced-motion preference: hero and actions visible without delayed reveals');
    await page.close();
    assert.equal(report.errors.length, 0, 'No JavaScript errors');
    assert.equal(report.consoleErrors.length, 0, 'No browser console errors');
    assert.equal(report.httpErrors.length, 0, 'No failed HTTP responses');
  } finally {
    fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify(report, null, 2));
    await browser.close(); server.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; server.close(); });
