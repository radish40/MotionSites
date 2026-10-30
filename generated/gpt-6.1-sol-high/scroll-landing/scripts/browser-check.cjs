const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { errors: [], failedRequests: [], responses: [], viewports: {} };
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on('pageerror', e => report.errors.push({ viewport: name, message: e.message }));
    page.on('requestfailed', r => { if (!r.failure()?.errorText.includes('ERR_ABORTED')) report.failedRequests.push({ url: r.url(), error: r.failure() }); });
    page.on('response', r => { if (r.status() >= 400) report.responses.push({ url: r.url(), status: r.status() }); });
    await page.goto('http://localhost:5173/motionsites-results/scroll-landing/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() => { const v = document.querySelector('video'); return v && v.readyState >= 3 && v.duration > 0; }, { timeout: 60000 });
    await page.waitForFunction(() => !document.querySelector('[role="status"]'));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const initial = await page.evaluate(() => {
      const v = document.querySelector('video');
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, duration: v.duration, videoWidth: v.videoWidth, videoHeight: v.videoHeight, videoTime: v.currentTime, fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => ({ family: f.family, status: f.status })), h1: document.querySelector('h1').getBoundingClientRect().toJSON() };
    });
    assert.equal(initial.scrollWidth, viewport.width, `${name}: initial overflow`);
    assert(initial.videoWidth > 0);
    await page.screenshot({ path: `screenshots/${name}.png` });
    if (name === 'desktop') {
      await page.getByRole('link', { name: 'LEAGUES', exact: true }).hover();
      assert.equal(await page.locator('nav .animate-fly-in-up').count(), 1);
    }
    await page.getByRole('link', { name: 'EXPLORE OUR STADIUMS' }).hover();
    assert.equal(await page.locator('.hero-cta .animate-fly-in').count(), 1);
    await page.getByRole('link', { name: 'EXPLORE OUR STADIUMS' }).click();
    await page.waitForTimeout(2500);
    assert.equal(new URL(page.url()).hash, '#facilities');
    const middle = await page.evaluate(() => ({ scrollY, videoTime: document.querySelector('video').currentTime, headerY: document.querySelector('header').getBoundingClientRect().bottom, opacity: getComputedStyle(document.querySelector('.word')).opacity, scrollWidth: document.documentElement.scrollWidth }));
    assert(middle.videoTime > 0, `${name}: video scrub`);
    assert(middle.headerY < 0, `${name}: header hides`);
    assert.equal(middle.scrollWidth, viewport.width, `${name}: middle overflow`);
    await page.screenshot({ path: `screenshots/${name}-programs.png` });
    await page.evaluate(() => document.getElementById('contact').scrollIntoView());
    await page.waitForTimeout(2500);
    const footer = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, videoTime: document.querySelector('video').currentTime, duration: document.querySelector('video').duration, scrollY, footerTop: document.querySelector('footer').getBoundingClientRect().top, links: [...document.querySelectorAll('a')].map(a => ({ label: a.textContent.trim() || a.getAttribute('aria-label'), href: a.getAttribute('href') })) }));
    assert.equal(footer.scrollWidth, viewport.width, `${name}: footer overflow`);
    assert(footer.videoTime > middle.videoTime, `${name}: video advances to footer`);
    await page.screenshot({ path: `screenshots/${name}-footer.png` });
    // All internal section links must resolve; external/mail links are intentionally not submitted.
    for (const link of footer.links.filter(l => l.href.startsWith('#'))) assert(await page.locator(link.href).count(), `${name}: missing ${link.href}`);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(500);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), viewport.width, `${name}: bottom overflow`);
    if (name === 'mobile') await page.screenshot({ path: 'screenshots/mobile-footer-bottom.png' });
    await page.getByRole('link', { name: 'About', exact: true }).click();
    await page.waitForTimeout(1500);
    assert.equal(new URL(page.url()).hash, '#about');
    await page.screenshot({ path: `screenshots/${name}-programs.png` });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1500);
    assert((await page.locator('video').evaluate(v => v.currentTime)) < 0.1, `${name}: reverse scrub`);
    report.viewports[name] = { initial, middle, footer, passed: ['video loads', 'no horizontal overflow', 'arrow hover animation', 'CTA navigates to facilities', 'video advances on scroll', 'header slides out', 'internal links resolve', 'footer navigation works', 'reverse video scrub'] };
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ errors: report.errors, failedRequests: report.failedRequests, responses: report.responses, viewports: Object.fromEntries(Object.entries(report.viewports).map(([name, value]) => [name, { passed: value.passed, videoDimensions: [value.initial.videoWidth, value.initial.videoHeight], scrubTimes: [value.initial.videoTime, value.middle.videoTime, value.footer.videoTime] }])) }, null, 2));
  assert.equal(report.errors.length, 0, 'No page script errors');
})().catch(e => { console.error(e); process.exit(1); });
