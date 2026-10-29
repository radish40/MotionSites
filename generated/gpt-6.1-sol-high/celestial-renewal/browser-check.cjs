const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: 'http://localhost:4173/motionsites-results/celestial-renewal/', desktop: {}, mobile: {}, errors: [], failedRequests: [] };
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on('pageerror', error => report.errors.push(`${name}: ${error.message}`));
    page.on('console', msg => { if (msg.type() === 'error') report.errors.push(`${name}: ${msg.text()}`); });
    page.on('requestfailed', req => report.failedRequests.push({ viewport: name, url: req.url(), error: req.failure()?.errorText }));
    await page.goto(report.url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 3);
    const initial = await page.evaluate(() => {
      const video = document.querySelector('video');
      return { viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth, sections: document.querySelectorAll('main > section').length, fonts: ['Dancing Script', 'Instrument Serif', 'Inter'].map(font => ({ font, loaded: document.fonts.check(`16px "${font}"`) })), video: { readyState: video.readyState, playing: !video.paused, muted: video.muted, width: video.videoWidth, height: video.videoHeight }, images: [...document.images].map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0 })) };
    });
    assert.equal(initial.scrollWidth, viewport.width);
    assert.equal(initial.sections, 2);
    assert(initial.video.playing && initial.video.muted && initial.video.width > 0);
    assert(initial.images.every(image => image.loaded));
    report[name] = initial;
    if (name === 'desktop') {
      const sound = page.getByRole('button', { name: 'Unmute background video' });
      await sound.click();
      assert.equal(await page.locator('video').evaluate(video => video.muted), false);
      await page.getByRole('button', { name: 'Mute background video' }).click();
      report[name].soundToggle = 'passed';
    } else {
      const toggle = page.locator('button[aria-controls="mobile-menu"]');
      await toggle.click();
      await page.waitForTimeout(850);
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.screenshot({ path: 'screenshots/mobile-menu.png' });
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
      await page.locator('#mobile-menu a').first().click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      report[name].menu = 'open, Escape close, link close passed';
      await page.waitForTimeout(900);
      assert(Math.abs(await page.evaluate(() => scrollY) - viewport.height) < 2);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(700);
    const before = await page.locator('#about > img').first().evaluate(img => img.style.transform);
    await page.getByRole('link', { name: 'Begin your renewal', exact: true }).click();
    await page.waitForTimeout(1300);
    assert(Math.abs(await page.evaluate(() => scrollY) - viewport.height) < 2);
    const after = await page.locator('#about > img').first().evaluate(img => img.style.transform);
    assert.notEqual(before, after);
    report[name].ctaScroll = 'passed';
    report[name].parallax = { before, after };
    if (name === 'desktop') {
      await page.waitForFunction(() => [...document.querySelectorAll('.cloud')].every(img => Number(img.style.opacity) > 0.95));
      report[name].clouds = await page.locator('.cloud').evaluateAll(images => images.map(img => ({ opacity: Number(img.style.opacity), left: img.getBoundingClientRect().left, right: img.getBoundingClientRect().right })));
      assert(report[name].clouds.every(cloud => cloud.opacity > 0.9 && cloud.right > 0 && cloud.left < viewport.width));
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), viewport.width);
    await page.screenshot({ path: `screenshots/${name}-quote.png` });
    await page.evaluate(async () => { window.scrollTo({ top: 0, behavior: 'instant' }); const video = document.querySelector('video'); video.pause(); video.currentTime = 3; await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true })); });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  assert.equal(report.errors.length, 0, 'Browser errors detected');
})().catch(error => { console.error(error); process.exit(1); });
