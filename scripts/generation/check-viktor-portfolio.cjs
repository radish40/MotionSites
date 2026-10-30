// Verify both published hash-addressable pages and their real video playback.
const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');

async function until(page, predicate, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await page.evaluate(predicate)) return;
    await page.waitForTimeout(200);
  }
  throw new Error('Published page condition timed out');
}

(async () => {
  const [url, output] = process.argv.slice(2);
  assert(url && output, 'Usage: URL OUTPUT_JSON');
  const report = { url, checked_utc: new Date().toISOString(), passed: false, results: [] };
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      const errors = [];
      const failedRequests = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('requestfailed', r => failedRequests.push(r.url()));
      page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      assert.equal(response.status(), 200);
      const inspectVideo = async () => {
        await until(page, () => {
          const v = document.querySelector('video');
          return v && v.readyState >= 3 && !v.paused && v.videoWidth > 0 && v.currentTime > .2;
        }, 60000);
        const before = await page.locator('video').evaluate(v => v.currentTime);
        await page.waitForTimeout(500);
        return page.locator('video').evaluate((v, t) => {
          if (!(v.currentTime > t || (t > v.duration - 1 && v.currentTime < 1))) throw new Error('Video clock did not advance');
          return { width: v.videoWidth, height: v.videoHeight, currentTime: v.currentTime, muted: v.muted, loop: v.loop, paused: v.paused };
        }, before);
      };
      const homeVideo = await inspectVideo();
      await page.getByRole('button', { name: 'Next Project' }).click();
      await page.getByRole('heading', { name: 'PROJECTY ENGINE' }).waitFor();
      await until(page, () => document.querySelectorAll('video').length === 1);
      const projectVideo = await inspectVideo();
      assert(page.url().endsWith('#project'));
      await page.getByRole('button', { name: 'Read More' }).click();
      assert.equal(await page.getByRole('button', { name: 'Read Less' }).getAttribute('aria-expanded'), 'true');
      await page.locator('#project-more').waitFor();
      await page.getByRole('button', { name: 'Read Less' }).click();
      await page.getByRole('button', { name: 'Back Home' }).click();
      await page.getByRole('heading', { name: /Viktor-O/ }).waitFor();
      await page.getByRole('button', { name: /SELECTED WORK/ }).click();
      await page.getByRole('heading', { name: 'PROJECTY ENGINE' }).waitFor();
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { name: 'PROJECTY ENGINE' }).waitFor();
      const directProjectVideo = await inspectVideo();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false);
      assert.deepEqual(errors, []);
      assert.deepEqual(failedRequests, []);
      report.results.push({ viewport: name, homeVideo, projectVideo, directProjectVideo, nextProject: true, readMoreToggle: true, backHome: true, projectCard: true, directHashReload: true, overflow, errors, failedRequests });
      await page.close();
    }
    report.passed = true;
  } finally {
    await browser.close();
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify(report));
})().catch(e => { console.error(e); process.exitCode = 1; });
