const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/app/node_modules/playwright-core');

const base = '/motionsites-results/beauty-categories/';
const root = path.resolve(__dirname, '../dist');
const output = path.resolve(__dirname, '../screenshots');
fs.mkdirSync(output, { recursive: true });
const report = { checks: [], scriptErrors: [], failedRequests: [], media: {} };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length);
  if (!req.url.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.resolve(root, relative || 'index.html');
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'], headless: true });
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: name === 'mobile', deviceScaleFactor: 1, hasTouch: name === 'mobile' });
      const page = await context.newPage();
      page.on('pageerror', error => report.scriptErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') report.scriptErrors.push(message.text()); });
      page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }); });
      await page.addInitScript(() => {
        const Observer = window.IntersectionObserver;
        window.__observerChecks = { thresholds: [], unobserved: 0 };
        window.IntersectionObserver = class extends Observer {
          constructor(callback, options) { super(callback, options); window.__observerChecks.thresholds.push(options.threshold); }
          unobserve(element) { window.__observerChecks.unobserved++; super.unobserve(element); }
        };
      });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle', timeout: 90000 });
      await page.waitForFunction(() => [...document.querySelectorAll('video')].every(video => video.readyState >= 2 && video.currentTime > 0 && !video.paused), { timeout: 60000 });
      await page.waitForTimeout(1200);
      const layout = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        cards: [...document.querySelectorAll('article')].map(card => { const { x, y, width, height } = card.getBoundingClientRect(); return { x, y, width, height, delay: card.style.transitionDelay }; }),
        headings: [...document.querySelectorAll('h2')].map(el => el.textContent),
        buttons: [...document.querySelectorAll('button')].map(el => el.textContent),
        opacity: getComputedStyle(document.querySelector('section > div')).opacity,
        observer: window.__observerChecks,
        videos: [...document.querySelectorAll('video')].map(v => ({ src: v.src, readyState: v.readyState, time: v.currentTime, paused: v.paused, muted: v.muted, loop: v.loop, autoplay: v.autoplay, playsInline: v.playsInline, error: v.error?.message || null, width: v.videoWidth, height: v.videoHeight })),
      }));
      assert.equal(layout.scrollWidth, width, 'No horizontal overflow');
      assert.deepEqual(layout.headings, ['face', 'beauty tools', 'body']);
      assert.deepEqual(layout.buttons, ['shop face', 'shop beauty tools', 'shop body']);
      assert.deepEqual(layout.cards.map(c => c.delay), ['0ms', '150ms', '300ms']);
      assert.equal(layout.opacity, '1');
      assert.deepEqual(layout.observer.thresholds, [0.1]);
      assert.equal(layout.observer.unobserved, 1, 'Reveal unobserves once');
      assert.ok(layout.videos.every(v => v.muted && v.loop && v.autoplay && v.playsInline && !v.error));
      if (name === 'desktop') {
        assert.ok(layout.cards.every(c => c.width === 480 && c.height === 750 && c.y === 125));
        const heading = page.locator('h2').first();
        const initial = await heading.boundingBox();
        await page.locator('article').first().hover();
        await page.waitForTimeout(800);
        const after = await heading.boundingBox();
        assert.ok(Math.abs(after.y - initial.y + 8) < 0.5, 'Heading moves upward eight pixels');
        assert.equal(await page.locator('video').first().evaluate(el => getComputedStyle(el).transform), 'matrix(1.05, 0, 0, 1.05, 0, 0)');
        assert.equal(await page.locator('article > div').first().evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0.2)');
        const button = page.getByRole('button', { name: 'shop face', exact: true });
        await button.hover();
        await page.waitForTimeout(600);
        assert.equal(await button.evaluate(el => getComputedStyle(el).transform), 'matrix(1, 0, 0, 1, 0, -2)');
        await page.mouse.down();
        await page.waitForTimeout(350);
        assert.equal(await button.evaluate(el => getComputedStyle(el).transform), 'matrix(1, 0, 0, 1, 0, 0)');
        await page.mouse.up();
        await page.mouse.move(5, 5);
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.textContent), 'shop beauty tools');
        assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'solid');
        await page.keyboard.press('Enter');
        await page.evaluate(() => document.activeElement.blur());
        report.checks.push('Desktop: three 480 × 750 cards centered at y=125; video scale, overlay, label hover, button hover/press and keyboard focus pass.');
      } else {
        assert.ok(layout.cards.every((c, i) => c.width === 390 && c.height === 400 && c.x === 0 && c.y === i * 400));
        for (const text of layout.buttons) await page.getByRole('button', { name: text, exact: true }).tap();
        await page.mouse.move(0, 0);
        await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, 0); });
        report.checks.push('Mobile: three stacked 390 × 400 cards; all category buttons accept taps; no horizontal overflow.');
      }
      // Freeze a reproducible frame only after verifying real autoplay playback.
      await page.evaluate(async () => {
        await Promise.all([...document.querySelectorAll('video')].map(video => new Promise(resolve => {
          video.pause();
          video.addEventListener('seeked', resolve, { once: true });
          video.currentTime = 1;
        })));
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
      report.media[name] = layout.videos;
      report.checks.push(`${name}: supplied media decoded and autoplayed; one-shot reveal at threshold 0.1 and card transition delays pass.`);
      if (name === 'desktop') {
        for (const viewport of [{ width: 640, height: 900 }, { width: 768, height: 1000 }, { width: 1024, height: 1000 }]) {
          await page.setViewportSize(viewport);
          await page.waitForTimeout(1200);
          const sizing = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, cards: [...document.querySelectorAll('article')].map(el => ({ h: el.offsetHeight, w: el.offsetWidth })) }));
          assert.equal(sizing.overflow, false);
          assert.ok(sizing.cards.every(c => c.h === (viewport.width < 768 ? 500 : 750)), JSON.stringify({ viewport, sizing }));
        }
        report.checks.push('Responsive breakpoints: 640, 768, and 1024 px have expected card heights and no horizontal overflow.');
      }
      await context.close();
    }
    assert.deepEqual(report.scriptErrors, []);
    assert.deepEqual(report.failedRequests, []);
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.error = error.stack;
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(output, 'browser-checks.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
