const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const report = { checks: [], errors: [], failedRequests: [] };
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
    page.on('requestfailed', req => report.failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    await page.goto('http://127.0.0.1:5173/motionsites-results/intelligentx/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3000);
    const metrics = await page.evaluate(() => {
      const v = document.querySelector('video');
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, background: getComputedStyle(document.body).backgroundColor, edgeLabel: { position: getComputedStyle(document.querySelector('section > a')).position, bottom: getComputedStyle(document.querySelector('section > a')).bottom }, fonts: { inter: document.fonts.check('12px Inter'), outfit: document.fonts.check('12px Outfit') }, video: { readyState: v.readyState, playing: !v.paused, currentTime: v.currentTime, width: v.videoWidth, error: v.error?.message || null } };
    });
    if (metrics.edgeLabel.position !== 'absolute') throw new Error(name + ' edge label positioning');
    if (metrics.scrollWidth > width) throw new Error(name + ' horizontal overflow');
    await page.screenshot({ path: 'screenshots/' + name + '.png' });
    await page.screenshot({ path: 'screenshots/' + name + '-full.png', fullPage: true });
    await page.getByLabel('Polski', { exact: true }).click();
    await page.getByRole('heading').filter({ hasText: 'oferuje' }).waitFor();
    await page.getByLabel('English', { exact: true }).click();
    if (name === 'mobile') {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.locator('#mobile-menu').waitFor();
      await page.screenshot({ path: 'screenshots/mobile-menu.png' });
      await page.locator('#mobile-menu').getByRole('link', { name: 'patient resources' }).click();
      await page.waitForTimeout(400);
      if (await page.locator('#mobile-menu').count()) throw new Error('Mobile menu did not close');
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      if (await page.locator('#mobile-menu').count()) throw new Error('Escape did not close menu');
    } else {
      await page.getByRole('button', { name: 'get started' }).click();
    }
    await page.locator('#ask').fill('How can I improve my wellbeing?');
    await page.getByRole('button', { name: 'Submit question' }).click();
    await page.getByRole('status').filter({ hasText: 'not connected' }).waitFor();
    report.checks.push({ name, viewport: { width, height }, metrics, interactions: ['language toggle', 'search submit', name === 'mobile' ? 'drawer open, link close, Escape close' : 'get started focus'] });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
