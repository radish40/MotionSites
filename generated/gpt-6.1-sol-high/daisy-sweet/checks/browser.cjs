const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');

const base = '/motionsites-results/daisy-sweet/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const file = path.resolve('dist', url.pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://localhost:4173${base}`, viewports: [], errors: [], assetIssues: [], mediaRequestAborts: [] };
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      const page = await context.newPage();
      page.on('pageerror', error => report.errors.push({ viewport: name, message: error.message }));
      page.on('console', message => { if (message.type() === 'error') report.errors.push({ viewport: name, message: message.text() }); });
      page.on('requestfailed', req => {
        const issue = { viewport: name, url: req.url(), error: req.failure()?.errorText };
        if (req.resourceType() === 'media' && issue.error === 'net::ERR_ABORTED') report.mediaRequestAborts.push(issue);
        else report.assetIssues.push(issue);
      });
      page.on('response', response => { if (response.status() >= 400) report.assetIssues.push({ viewport: name, url: response.url(), status: response.status() }); });
      await page.goto(report.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3200);
      const image = page.locator('img');
      await image.evaluate(img => img.complete ? undefined : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; setTimeout(resolve, 45000); }));
      const visibleVideo = page.locator('video:visible');
      await visibleVideo.evaluate(video => video.readyState >= 2 ? undefined : new Promise(resolve => { video.addEventListener('loadeddata', resolve, { once: true }); video.addEventListener('error', resolve, { once: true }); setTimeout(resolve, 45000); }));
      const state = await page.evaluate(() => {
        const section = document.querySelector('section');
        const layout = section.firstElementChild;
        const panel = layout.children[0];
        const videos = [...document.querySelectorAll('video')];
        const activeVideo = videos.find(video => video.parentElement.getBoundingClientRect().width > 0);
        const image = document.querySelector('img');
        const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          panel: rect(panel), video: rect(activeVideo.parentElement),
          background: getComputedStyle(panel).backgroundColor,
          image: { loaded: image.complete && image.naturalWidth > 0, ...rect(image) },
          videoState: { readyState: activeVideo.readyState, paused: activeVideo.paused, currentTime: activeVideo.currentTime, error: activeVideo.error?.message || null, loop: activeVideo.loop, muted: activeVideo.muted, playsInline: activeVideo.playsInline },
          animation: [...panel.querySelectorAll('[style]')].filter(el => el.style.transition).map(el => ({ opacity: getComputedStyle(el).opacity, transition: el.style.transition, transform: getComputedStyle(el).transform })),
          font: getComputedStyle(panel).fontFamily,
          svgCount: document.querySelectorAll('svg').length,
        };
      });
      assert.equal(state.documentWidth, width, 'No horizontal overflow');
      assert.equal(state.background, 'rgb(75, 179, 237)');
      assert.equal(state.svgCount, 0);
      assert(state.animation.every(item => item.opacity === '1'), 'Entrance animations finish');
      assert.equal(await page.getByText('Daisy love', { exact: true }).count(), 1);
      assert.equal(await page.getByText('Sweet', { exact: true }).count(), 1);
      if (name === 'desktop') {
        assert.equal(state.panel.width, 720);
        assert.equal(state.panel.height, 1000);
        assert.equal(state.video.x, 720);
        assert.equal(state.video.height, 1000);
        assert.equal(state.image.width, 220);
      } else {
        assert.equal(state.panel.width, 390);
        assert.equal(state.video.height, 292.5);
        assert.equal(state.video.y, state.panel.height);
        assert.equal(state.image.width, 140);
      }
      if (!state.image.loaded) report.assetIssues.push({ viewport: name, error: 'Product image failed to decode' });
      if (state.videoState.readyState < 2 || state.videoState.error) report.assetIssues.push({ viewport: name, error: 'Video failed to load', state: state.videoState });
      const startTime = await visibleVideo.evaluate(video => video.currentTime);
      await page.waitForTimeout(400);
      const advancedTime = await visibleVideo.evaluate(video => video.currentTime);
      state.videoPlaybackAdvances = advancedTime !== startTime;
      assert(state.videoPlaybackAdvances, 'Visible video playback advances');
      const button = page.getByRole('button', { name: 'SHOP NOW' });
      if (name === 'desktop') {
        await button.hover();
        await page.waitForTimeout(600);
        state.hover = await button.locator('span').nth(1).evaluate(el => ({ transform: getComputedStyle(el).transform, background: getComputedStyle(el).backgroundColor }));
        assert.equal(state.hover.transform, 'matrix(1, 0, 0, 1, 0, 0)');
        assert.equal(state.hover.background, 'rgb(255, 255, 255)');
        await page.mouse.move(1400, 20);
        await page.waitForTimeout(600);
      }
      await button.focus();
      assert(await button.evaluate(el => document.activeElement === el), 'Button keyboard focus');
      await button.press('Enter');
      await button.evaluate(el => el.blur());
      await page.mouse.move(width - 1, 0);
      await page.waitForTimeout(600);
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.equal(await button.evaluate(el => getComputedStyle(el).opacity), '1', 'One-shot visibility stays true');
      report.viewports.push({ name, width, height, passed: true, ...state });
      await context.close();
    }
    assert.equal(report.errors.length, 0, 'No browser script or console errors');
  } finally {
    fs.writeFileSync('checks/browser-report.json', JSON.stringify(report, null, 2) + '\n');
    await browser.close();
    server.close();
  }
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
