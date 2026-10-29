const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'ignore' });
  let browser;
  try {
    for (let i = 0; i < 80; i++) {
      try { if ((await fetch('http://127.0.0.1:4173/motionsites-results/max-reed-portfolio/')).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const errors = [], failedRequests = [], badResponses = [], checks = [];
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['tablet', 768, 1024]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(`${name}: ${msg.text()}`); });
      page.on('requestfailed', req => failedRequests.push(`${name}: ${req.url()} ${req.failure()?.errorText}`));
      page.on('response', res => { if (res.status() >= 400) badResponses.push(`${name}: ${res.status()} ${res.url()}`); });
      await page.goto('http://127.0.0.1:4173/motionsites-results/max-reed-portfolio/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 3 && v.videoWidth > 0));
      await page.waitForTimeout(1200);
      assert.equal(await page.locator('h1').textContent(), "Hi, I'm Max Reed!");
      assert.equal(await page.locator('video').count(), 3);
      assert.equal(await page.getByRole('link', { name: "Let's Team Up Today" }).getAttribute('href'), 'mailto:hi@maxreed.com');
      assert.equal(await page.getByRole('link', { name: 'Email Max Reed' }).getAttribute('href'), 'mailto:hi@maxreed.com');
      assert.equal(await page.getByRole('link', { name: 'hi@maxreed.com', exact: true }).getAttribute('href'), 'mailto:hi@maxreed.com');
      assert.equal(await page.getByRole('link', { name: '+44 207 81 63', exact: true }).getAttribute('href'), 'tel:+442078163');
      const layout = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        height: innerHeight, scrollHeight: document.documentElement.scrollHeight,
        gridColumns: getComputedStyle(document.querySelector('.portfolio-grid')).gridTemplateColumns,
        fontLoaded: document.fonts.check('400 15px Inter'),
        videos: [...document.querySelectorAll('video')].map(v => ({ readyState: v.readyState, width: v.videoWidth, height: v.videoHeight, playing: !v.paused, muted: v.muted, loop: v.loop })),
      }));
      assert.ok(layout.scrollWidth <= width, `${name} horizontal overflow`);
      if (name === 'desktop') assert.equal(layout.scrollHeight, height);
      assert.ok(layout.fontLoaded);
      assert.ok(layout.videos.every(v => v.playing && v.muted && v.loop));
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), "Let's Team Up Today");
      assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
      await page.keyboard.press('Tab');
      await page.mouse.move(0, 0);
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
      if (name !== 'tablet') await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      if (name === 'desktop') {
        await page.locator('.software-card').hover();
        assert.equal(await page.locator('.marquee-track').first().evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
        await page.mouse.move(0, 0);
        assert.equal(await page.locator('.marquee-track').first().evaluate(el => getComputedStyle(el).animationPlayState), 'running');
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(100);
      assert.ok(await page.locator('video').evaluateAll(videos => videos.every(v => v.paused)));
      assert.equal(await page.locator('.marquee-track').first().evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
      checks.push({ viewport: name, ...layout, keyboardFocus: 'passed', contactLinks: 'passed', reducedMotion: 'passed' });
      await page.close();
    }
    const report = { checks, errors, failedRequests, badResponses };
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2));
    assert.deepEqual(errors, []);
    assert.deepEqual(badResponses, []);
    // A browser may cancel a completed video range when leaving a page.
    assert.ok(failedRequests.every(r => r.includes('ERR_ABORTED')));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
