const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const url = 'http://127.0.0.1:4173/motionsites-results/ai-driving-assistant/';
const server = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'pipe' });
const delay = ms => new Promise(r => setTimeout(r, ms));
(async () => {
 let browser;
 const report = { viewports: [], errors: [], failedRequests: [], externalRequests: [], checks: [] };
 try {
  await delay(600);
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
   const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
   page.on('pageerror', e => report.errors.push(e.message));
   page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
   page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure() }));
   page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:4173/')) report.externalRequests.push(r.url()); });
   await page.goto(url, { waitUntil: 'networkidle' });
   await page.evaluate(() => document.fonts.ready);
   await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
   await delay(300);
   const initial = await page.evaluate(() => {
    const v = document.querySelector('video');
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, duration: v.duration, videoWidth: v.videoWidth, videoHeight: v.videoHeight, time: v.currentTime, font: getComputedStyle(document.querySelector('h1')).fontFamily, triggers: ScrollTrigger.getAll().length, navVisible: getComputedStyle(document.querySelector('.header-nav')).display !== 'none' };
   });
   assert.equal(initial.scrollWidth, viewport.width);
   assert.ok(initial.duration > 0 && initial.videoWidth > 0);
   assert.equal(initial.triggers, 1);
   assert.equal(initial.navVisible, viewport.width > 640);
   const name = viewport.width > 640 ? 'desktop' : 'mobile';
   await page.screenshot({ path: `screenshots/${name}.png` });
   await page.locator('input[type=email]').fill('invalid');
   await page.locator('button[type=submit]').click();
   assert.equal(await page.locator('input').evaluate(el => el.validity.typeMismatch), true);
   await page.locator('input').fill('driver@example.com');
   await page.locator('button[type=submit]').click();
   assert.equal(page.url(), url);
   const states = [];
   for (const [state, progress, selector] of [['expanded', .134, '#mediaWrapper'], ['effortless', .2373, '[data-story="beat1-word"]'], ['voice', .3933, '#waveform'], ['anywhere', .6706, '[data-story="beat2-word"]'], ['route', 1, '#routeViz']]) {
    await page.evaluate(p => { const s = ScrollTrigger.getAll()[0]; window.scrollTo(0, s.start + (s.end - s.start) * p); }, progress);
    await delay(1200);
    const observed = await page.evaluate(selector => ({ opacity: Number(getComputedStyle(document.querySelector(selector)).opacity), time: document.querySelector('video').currentTime, scrollWidth: document.documentElement.scrollWidth, width: innerWidth, mediaWidth: document.querySelector('#mediaWrapper').getBoundingClientRect().width, checkpointOpacity: [...document.querySelectorAll('[data-checkpoint]')].map(e => Number(getComputedStyle(e).opacity)) }), selector);
    assert.ok(observed.opacity > .85, `${name} ${state} visible: ${observed.opacity}`);
    assert.equal(observed.scrollWidth, observed.width);
    if (state === 'expanded') assert.ok(Math.abs(observed.mediaWidth - viewport.width) < 2);
    if (state === 'route') assert.ok(observed.checkpointOpacity.every(x => x === 1));
    states.push({ state, ...observed });
    if (name === 'desktop' && ['voice', 'route'].includes(state)) await page.screenshot({ path: `screenshots/${state}.png` });
   }
   assert.ok(states.at(-1).time > states[1].time);
   await page.evaluate(() => window.scrollTo(0, 0));
   await delay(1000);
   assert.ok(await page.locator('#heroTitle').evaluate(el => Number(getComputedStyle(el).opacity) > .99));
   report.viewports.push({ viewport, initial, states });
   await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  reduced.on('pageerror', e => report.errors.push(e.message));
  await reduced.goto(url, { waitUntil: 'networkidle' });
  await reduced.evaluate(() => { const s = ScrollTrigger.getAll()[0]; window.scrollTo(0, s.end * .08); });
  await delay(1100);
  assert.equal(await reduced.locator('#heroTitle').evaluate(el => getComputedStyle(el).filter), 'blur(0px)');
  await reduced.close();
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failedRequests, []);
  assert.deepEqual(report.externalRequests, []);
  report.checks = ['Desktop 1440×1000 and mobile 390×844', 'Video decoded and scrubbed through timeline', 'Fullscreen media expansion', 'Effortless and Anywhere story transitions', 'Voice waveform and completed route checkpoints', 'Reverse scroll restores hero', 'Email type validation and no-navigation submit as supplied', 'Reduced motion removes blur', 'No horizontal overflow in all sampled states', 'No JavaScript errors, failed requests, or external runtime requests'];
  report.status = 'passed';
  fs.writeFileSync('browser-checks.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
 } catch(e) {
  report.status = 'failed'; report.failure = String(e.stack || e);
  fs.writeFileSync('browser-checks.json', JSON.stringify(report, null, 2));
  console.error(e); process.exitCode = 1;
 } finally { await browser?.close(); server.kill(); }
})();
