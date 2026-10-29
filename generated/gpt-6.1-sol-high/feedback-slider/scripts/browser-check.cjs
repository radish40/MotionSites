const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const server = spawn('node', ['node_modules/vite/bin/vite.js', 'preview', '--host', '0.0.0.0', '--port', '4173'], { stdio: 'pipe' });
  const base = 'http://127.0.0.1:4173/motionsites-results/feedback-slider/';
  let browser;
  const report = { viewports: [], interactions: [], scriptErrors: [], consoleErrors: [], failedRequests: [], badResponses: [] };
  try {
    for (let i = 0; i < 50; i++) {
      try { if ((await fetch(base)).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.scriptErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
      page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) report.badResponses.push({ url: response.url(), status: response.status() }); });
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      // The wrapper uses carousel semantics on a div, so select its explicit label.
      const carousel = page.locator('[aria-roledescription="carousel"]');
      await carousel.hover();
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1300);
      const track = page.getByTestId('testimonial-track');
      const offset = () => track.getAttribute('data-offset').then(Number);
      assert.equal(await offset(), 0);
      assert.equal(await page.locator('article').count(), 15);
      const expectedWidth = viewport.width < 768 ? viewport.width - 48 : 427.5;
      assert.equal(await page.locator('article').first().evaluate(el => el.getBoundingClientRect().width), expectedWidth);
      const metrics = await page.evaluate(() => ({
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        heading: document.querySelector('h1').textContent,
        fonts: [...document.fonts].map(font => ({ family: font.family, weight: font.weight, status: font.status })),
        images: [...document.images].map(img => ({ url: img.src, loaded: img.complete && img.naturalWidth > 0 })),
      }));
      assert.equal(metrics.scrollWidth, viewport.width, 'No page-level horizontal overflow');
      assert(metrics.images.every(img => img.loaded), 'Every Pexels avatar loads');
      assert(metrics.fonts.every(font => font.status === 'loaded'), 'All font faces load');
      await page.screenshot({ path: `screenshots/${viewport.width > 768 ? 'desktop' : 'mobile'}.png`, fullPage: true });
      await page.waitForTimeout(3200);
      assert.equal(await offset(), 0, 'Hover pauses auto advance');
      const click = label => page.getByRole('button', { name: label }).evaluate(button => button.click());
      await click('Next testimonial');
      await page.waitForTimeout(850);
      assert.equal(await offset(), expectedWidth + 24, 'Next advances exactly one card');
      await click('Previous testimonial');
      assert.equal(await offset(), 0);
      await click('Previous testimonial');
      assert.equal(await offset(), (expectedWidth + 24) * 4, 'Previous wraps to the final testimonial');
      await click('Next testimonial');
      assert.equal(await offset(), 0, 'Next wraps to the first testimonial');
      await page.mouse.move(2, 2);
      await page.waitForTimeout(3900);
      assert.equal(await offset(), expectedWidth + 24, 'Mouse leave resumes the 3000ms timer');
      // Verify keyboard activation uses the same accessible navigation.
      await carousel.hover();
      await page.getByRole('button', { name: 'Next testimonial' }).focus();
      await page.keyboard.press('Enter');
      assert.equal(await offset(), (expectedWidth + 24) * 2, 'Keyboard navigation works');
      report.viewports.push({ ...viewport, ...metrics, expectedCardWidth: expectedWidth, screenshot: `screenshots/${viewport.width > 768 ? 'desktop' : 'mobile'}.png` });
      report.interactions.push({ viewport: viewport.width, hoverPause: true, previous: true, next: true, wrapBothDirections: true, autoAdvanceAndResume: true, keyboard: true });
      await page.close();
    }
    assert.equal(report.scriptErrors.length, 0, 'No uncaught JavaScript errors');
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.error = error.stack;
    process.exitCode = 1;
  } finally {
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(report, null, 2) + '\n');
    if (browser) await browser.close();
    server.kill();
  }
  console.log(JSON.stringify(report, null, 2));
})();
