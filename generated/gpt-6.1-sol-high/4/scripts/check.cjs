const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [], failedRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => failedRequests.push({ url: request.url(), failure: request.failure()?.errorText }));
  const base = 'http://localhost:4173/motionsites-results/4/';
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v.currentTime > 2 && !v.paused; }, { timeout: 30000 });
  const desktop = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, videoTime: document.querySelector('video').currentTime, videoWidth: document.querySelector('video').videoWidth, posterHidden: getComputedStyle(document.querySelector('.video-poster')).opacity, fonts: [['Inter','500'],['Manrope','400'],['Cabin','500'],['Instrument Serif','italic']].map(([font, style]) => ({font, loaded: document.fonts.check(`${style} 16px "${font}"`)})) }));
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.video-poster')).opacity === '0');
  await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Services', exact: true }).click();
  await page.getByRole('button', { name: /Access control Give/ }).click();
  await page.getByRole('heading', { name: 'Access control' }).waitFor();
  await page.keyboard.press('Escape');
  for (const name of ['Book a Free Demo', 'Get Started Now', 'Sign In', 'Get Started', 'Reviews', 'Contact us']) {
    await page.getByRole('button', { name, exact: true }).click();
    await page.locator('dialog[open]').waitFor();
    await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(700);
  const mobile = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight }));
  await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('dialog', { name: 'Navigation', exact: true }).waitFor();
  await page.screenshot({ path: 'screenshots/mobile-menu.png', fullPage: true });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('button', { name: 'Contact us' }).click();
  await page.getByRole('heading', { name: 'Contact us' }).waitFor();
  await page.keyboard.press('Escape');
  const sizes = [];
  for (const width of [320, 375, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    sizes.push(await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth })));
  }
  const fallbackPage = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await fallbackPage.goto(base, {waitUntil:'networkidle'});
  const reducedMotion = await fallbackPage.evaluate(() => ({ posterLoaded: document.querySelector('.video-poster').naturalWidth > 0, posterOpacity: getComputedStyle(document.querySelector('.video-poster')).opacity, videoPaused: document.querySelector('video').paused }));
  const offlineVideo = await browser.newPage();
  await offlineVideo.route('**/*.m3u8*', route => route.abort());
  await offlineVideo.goto(base, {waitUntil:'networkidle'});
  const unavailableStream = await offlineVideo.evaluate(() => ({ posterLoaded: document.querySelector('.video-poster').naturalWidth > 0, posterOpacity: getComputedStyle(document.querySelector('.video-poster')).opacity }));
  const results = { desktop, mobile, sizes, reducedMotion, unavailableStream, errors, failedRequests, interactions: 'Desktop services, service details, all six CTA/navigation dialogs, dialog Escape and close, mobile open/close/Escape and contact navigation passed.' };
  fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(results, null, 2));
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  if(errors.length || desktop.scrollWidth > desktop.width || mobile.scrollWidth > mobile.width || sizes.some(s => s.scrollWidth > s.width)) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
