const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const base = 'http://localhost:4173/motionsites-results/cosmic/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const report = { desktop: {}, mobile: {}, scriptErrors: [], failedRequests: [], httpErrors: [] };
  for (const [label, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    const context = await browser.newContext({ viewport, permissions: ['clipboard-read', 'clipboard-write'], isMobile: label === 'mobile', hasTouch: label === 'mobile' });
    const page = await context.newPage();
    page.on('pageerror', error => report.scriptErrors.push({ viewport: label, message: error.message }));
    page.on('requestfailed', req => report.failedRequests.push({ viewport: label, url: req.url(), error: req.failure() }));
    page.on('response', response => { if (response.status() >= 400) report.httpErrors.push({ viewport: label, url: response.url(), status: response.status() }); });
    await page.addInitScript(() => {
      window.__sequence = [];
      document.addEventListener('loadedmetadata', event => { if (event.target.tagName === 'VIDEO') window.__sequence.push('metadata'); }, true);
      document.addEventListener('ended', event => { if (event.target.tagName === 'VIDEO') window.__sequence.push('ended'); }, true);
    });
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('video').ended, { timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    const layout = await page.evaluate(() => {
      const v = document.querySelector('video'), img = document.querySelector('img');
      const letters = Array.from(document.querySelectorAll('h1 span'));
      return {
        width: innerWidth, height: innerHeight, documentWidth: document.documentElement.scrollWidth, documentHeight: document.documentElement.scrollHeight,
        video: { ended: v.ended, playbackRate: v.playbackRate, loop: v.loop, muted: v.muted, duration: v.duration },
        sequence: window.__sequence, starCount: document.querySelector('main > div').children.length,
        rockLoaded: img.complete && img.naturalWidth > 0,
        fonts: ['Black Mustang', 'Anton', 'Inter'].map(name => ({ name, loaded: Array.from(document.fonts).some(face => face.family.replaceAll('"', '') === name && face.status === 'loaded') })),
        headlineRevealed: letters.every(l => getComputedStyle(l).opacity === '1' && getComputedStyle(l).transform === 'matrix(1, 0, 0, 1, 0, 0)'),
        circles: document.querySelectorAll('.orbit').length
      };
    });
    assert.equal(layout.documentWidth, viewport.width); assert.equal(layout.documentHeight, viewport.height);
    assert.equal(layout.video.playbackRate, 1.56); assert.equal(layout.video.loop, false); assert.equal(layout.video.muted, true);
    assert.equal(layout.rockLoaded, true); assert.equal(layout.headlineRevealed, true); assert.equal(layout.starCount, 40); assert.equal(layout.circles, 2);
    await page.screenshot({ path: `screenshots/${label}.png` });
    console.log(label, JSON.stringify(layout));
    assert.ok(layout.fonts.filter(font => label === 'desktop' || font.name !== 'Inter').every(font => font.loaded));
    report[label].layout = layout;
    if (label === 'desktop') {
      assert.equal(await page.getByRole('button', { name: 'Open menu' }).isVisible(), false);
      await page.getByRole('button', { name: 'Share', exact: true }).click();
      await page.getByRole('status').filter({ hasText: 'Link copied' }).waitFor();
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), base);
      for (const name of ['Discover', 'Story', 'Connect']) { await page.getByRole('link', { name, exact: true }).click(); assert.ok(page.url().endsWith('#' + name.toLowerCase())); }
      report.desktop.interactions = ['Share copies current URL', 'All three navigation anchors work'];
    } else {
      const open = page.getByRole('button', { name: 'Open menu' });
      await open.click();
      const menu = page.getByRole('dialog');
      await menu.waitFor(); await page.waitForTimeout(1500);
      report.mobile.menuInterLoaded = await page.evaluate(() => Array.from(document.fonts).some(face => face.family === 'Inter' && face.status === 'loaded'));
      assert.equal(report.mobile.menuInterLoaded, true);
      assert.equal(await open.getAttribute('aria-expanded'), 'true');
      await page.screenshot({ path: 'screenshots/mobile-menu.png' });
      await page.getByRole('button', { name: 'Close menu' }).click();
      await menu.waitFor({ state: 'detached' });
      await open.click(); await page.waitForTimeout(1000);
      await menu.getByRole('link', { name: 'Story', exact: true }).click();
      await menu.waitFor({ state: 'detached' }); assert.ok(page.url().endsWith('#story'));
      await open.click(); await page.waitForTimeout(1000); await page.keyboard.press('Escape');
      await menu.waitFor({ state: 'detached' }); assert.equal(await open.evaluate(el => el === document.activeElement), true);
      await open.click(); await page.waitForTimeout(1500);
      await menu.getByRole('button', { name: 'Share', exact: true }).click();
      await menu.getByRole('status').filter({ hasText: 'Link copied' }).waitFor();
      report.mobile.interactions = ['Menu entrance', 'Close button exit', 'Navigation closes menu', 'Escape closes and returns focus', 'Mobile Share copies URL'];
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2));
  assert.equal(report.scriptErrors.length, 0); assert.equal(report.httpErrors.length, 0);
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
