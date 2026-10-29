const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [], failedRequests = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    page.on('response', res => { if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`); });
    await page.goto('http://127.0.0.1:4173/motionsites-results/ai-interface/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
    await page.waitForTimeout(1800);
    const initial = await page.evaluate(() => ({ title: document.title, overflow: document.documentElement.scrollWidth > innerWidth, font: document.fonts.check('400 16px "Inter Tight"'), video: { duration: document.querySelector('video').duration, width: document.querySelector('video').videoWidth, time: document.querySelector('video').currentTime }, image: { loaded: document.querySelector('img').complete, width: document.querySelector('img').naturalWidth }, header: document.querySelector('header').getBoundingClientRect().toJSON() }));
    assert.equal(initial.overflow, false); assert.equal(initial.font, true); assert.ok(initial.video.width > 0); assert.ok(initial.image.width > 0);
    await page.screenshot({ path: `screenshots/${name}.png` });
    await page.getByRole('link', { name: 'Discover Cortex', exact: true }).click();
    await page.waitForTimeout(1800);
    assert.equal(new URL(page.url()).hash, '#discover');
    const videoAfterScroll = await page.locator('video').evaluate(v => v.currentTime);
    assert.ok(videoAfterScroll > initial.video.time + 0.1);
    await page.screenshot({ path: `screenshots/${name}-about.png` });
    for (const label of ['Cortex', 'Interface', 'Developer', 'Support']) {
      await page.locator('nav').getByRole('link', { name: label, exact: true }).click();
      await page.waitForTimeout(1200);
      const valid = await page.evaluate(() => !!document.getElementById(location.hash.slice(1)));
      assert.equal(valid, true, `${label} resolves`);
      if (['Developer', 'Support'].includes(label)) {
        const visible = await page.evaluate(() => { let e = document.getElementById(location.hash.slice(1)); let opacity = 1; const rect = e.getBoundingClientRect(); while(e) { opacity *= +getComputedStyle(e).opacity; e = e.parentElement; } return { opacity, top: rect.top, bottom: rect.bottom }; });
        assert.ok(visible.opacity > .8 && visible.top >= 0 && visible.bottom <= height, `${label} target visible: ${JSON.stringify(visible)}`);
      }
    }
    await page.getByRole('link', { name: 'Instant Knowledge Retrieval' }).click();
    await page.waitForTimeout(1400);
    assert.equal(new URL(page.url()).hash, '#solutions');
    const stages = [];
    for (const [progress, heading] of [[0.13,'Silent thought.'], [0.48,'Cognitive flow.'], [0.82,'Instant recall.']]) {
      await page.evaluate(p => { const s = document.querySelector('#solutions'); window.scrollTo({ top: s.offsetTop + (s.offsetHeight - innerHeight) * p, behavior: 'instant' }); }, progress);
      await page.waitForTimeout(1000);
      const opacity = await page.getByRole('heading', { name: heading, exact: true }).evaluate(el => +getComputedStyle(el.parentElement.parentElement).opacity);
      assert.ok(opacity > .9, `${heading} revealed at ${progress}, got ${opacity}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      stages.push({ heading, opacity });
      await page.screenshot({ path: `screenshots/${name}-stage-${stages.length}.png` });
    }
    assert.deepEqual(errors, []); assert.deepEqual(failedRequests, []);
    results.push({ viewport: {width,height}, initial, videoAfterScroll, navigation: 'all 4 header links, Discover Cortex and capability link passed', stages, errors, failedRequests, horizontalOverflow: false });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('browser-checks.json', JSON.stringify({ passed: true, results }, null, 2));
  console.log(JSON.stringify({ passed: true, results }, null, 2));
})().catch(err => { console.error(err); process.exit(1); });
