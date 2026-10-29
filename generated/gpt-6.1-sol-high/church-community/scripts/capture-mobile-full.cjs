const { chromium } = require('/app/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 2365 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:4173/motionsites-results/church-community/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/mobile-full.png', fullPage: true });
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.waitForTimeout(300);
  const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, phones: document.querySelectorAll('[data-testid^="phone-"]').length }));
  if (layout.width !== layout.scrollWidth || layout.phones !== 3) throw new Error(JSON.stringify(layout));
  console.log('Additional 1024px overflow check passed', layout);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
