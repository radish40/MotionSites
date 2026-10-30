const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { consoleErrors: [], pageErrors: [], failedRequests: [], viewports: {}, interactions: {}, intentionalFallbackErrors: [] };
  const page = await browser.newPage();
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') (report.fallbackTest ? report.intentionalFallbackErrors : report.consoleErrors).push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure() }));
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    await page.setViewportSize(viewport);
    await page.goto('http://localhost:4173/motionsites-results/velorah-focus-hero/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2), { timeout: 30000 });
    await page.waitForTimeout(1500);
    report.viewports[name] = await page.evaluate(() => ({
      width: innerWidth, documentWidth: document.documentElement.scrollWidth,
      frames: [...document.querySelectorAll('article')].map(el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; }),
      fonts: { serif: document.fonts.check('64px "Instrument Serif"'), sans: document.fonts.check('17px Inter') },
      videos: [...document.querySelectorAll('video')].map(v => ({ readyState:v.readyState, paused:v.paused, time:v.currentTime, width:v.videoWidth, height:v.videoHeight, src:v.currentSrc })),
      headingAnimation: getComputedStyle(document.querySelector('h1')).animationName,
    }));
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }
  await page.setViewportSize({width:1440,height:1000});
  const button = page.getByRole('button', {name:'Begin Journey'}).first();
  await button.focus();
  report.interactions.keyboardFocus = await button.evaluate(el => el === document.activeElement && getComputedStyle(el).outlineStyle !== 'none');
  await button.hover();
  await page.waitForTimeout(300);
  report.interactions.hoverScale = await button.evaluate(el => getComputedStyle(el).scale);
  if (report.interactions.hoverScale !== '1.03') throw new Error('Hover scale failed');
  await button.click();
  report.interactions.click = 'Button accepts clicks. Prompt defines no destination or additional flow.';
  report.fallbackTest = true;
  await page.route('https://d8j0ntlcm91z4.cloudfront.net/**', route => route.abort());
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2 && v.currentSrc.includes('/assets/')), {timeout:30000});
  report.interactions.localFallback = await page.locator('video').evaluateAll(vs => vs.every(v => !v.paused && v.readyState >= 2));
  fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report,null,2));
  await browser.close();
  if (report.pageErrors.length || Object.values(report.viewports).some(v => v.documentWidth > v.width || v.videos.some(x => x.paused))) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
