const { chromium } = require('/app/node_modules/playwright-core');
const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/botanical-shadow-about/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webm': 'video/webm' };
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', url.pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const scriptErrors = [], consoleErrors = [], failedRequests = [], assetResponses = [];
      page.on('pageerror', error => scriptErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (!response.url().startsWith('http://localhost')) assetResponses.push({ url: response.url(), status: response.status() }); });
      await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2);
      await page.evaluate(async () => {
        await Promise.all(['Zimula Trial Med', 'Zimula Trial Bd', 'Zimula Trial Reg'].map(family => document.fonts.load(`16px "${family}"`)));
        await document.fonts.ready;
      });
      const playback = await page.evaluate(async () => {
        const video = document.querySelector('video');
        const sample = () => {
          const canvas = document.createElement('canvas'); canvas.width = 160; canvas.height = 120;
          const ctx = canvas.getContext('2d'); ctx.drawImage(video, 0, 0, 160, 120);
          return [...ctx.getImageData(0, 0, 160, 120).data];
        };
        video.currentTime = 0;
        await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
        const before = video.currentTime, frameBefore = sample();
        await new Promise(resolve => setTimeout(resolve, 700));
        const after = video.currentTime, frameAfter = sample();
        return { before, after, duration: video.duration, width: video.videoWidth, height: video.videoHeight,
          paused: video.paused, frameDifference: frameAfter.reduce((sum, value, index) => sum + Math.abs(value - frameBefore[index]), 0) / frameAfter.length };
      });
      assert(playback.after > playback.before, 'Video time advances');
      assert(playback.frameDifference > 0.05, 'Real botanical frames change');
      assert.equal(playback.paused, false);
      const loopPlayback = await page.evaluate(async () => {
        const video = document.querySelector('video');
        video.currentTime = video.duration - .15;
        await new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
        await new Promise(resolve => setTimeout(resolve, 500));
        return { timeAfterLoop: video.currentTime, paused: video.paused, ended: video.ended };
      });
      assert(loopPlayback.timeAfterLoop < 1, 'Video loops back to beginning');
      assert(!loopPlayback.paused && !loopPlayback.ended, 'Playback continues after loop');
      const layout = await page.evaluate(() => {
        const section = document.querySelector('section');
        const paragraphs = [...document.querySelectorAll('p')];
        const video = document.querySelector('video');
        const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom }; };
        return {
          viewport: { width: innerWidth, height: innerHeight },
          documentWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          section: rect(section), headline: rect(paragraphs[0]), subtext: rect(paragraphs[1]),
          headlineText: paragraphs[0].innerText,
          headlineFontSize: getComputedStyle(paragraphs[0]).fontSize,
          fonts: [...document.fonts].map(f => ({ family: f.family, status: f.status })),
          fontLoaded: document.fonts.check('32px "Zimula Trial Med"'),
          componentClassCount: section.querySelectorAll('[class]').length,
          video: { autoplay: video.autoplay, muted: video.muted, loop: video.loop, playsInline: video.playsInline, readyState: video.readyState, error: video.error ? { code: video.error.code, message: video.error.message } : null },
          animationCount: document.getAnimations().length,
          interactiveElements: document.querySelectorAll('a, button, input, select, textarea').length,
        };
      });
      assert.equal(layout.documentWidth, width, 'No horizontal overflow');
      assert.equal(layout.documentHeight, height, 'One viewport with no vertical overflow');
      assert.equal(layout.headlineText, 'What stands the\ntest of time is all\nthat guides the\nwork.');
      assert.equal(layout.componentClassCount, 0);
      assert.equal(layout.animationCount, 0);
      assert.equal(scriptErrors.length, 0);
      assert.equal(consoleErrors.length, 0, 'No console errors');
      assert.equal(layout.video.error, null);
      assert(layout.video.readyState >= 2);
      assert(layout.headline.bottom < layout.subtext.y, 'Headline and bottom text do not overlap');
      await page.mouse.wheel(0, 500);
      assert.equal(await page.evaluate(() => scrollY), 0);
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
      results.push({ name, playback, loopPlayback, layout, scriptErrors, consoleErrors, failedRequests, assetResponses, checks: 'Layout, exact text, inline styles, static composition, video decoding and moving frames, no console errors, scroll and screenshots passed. No controls are specified.' });
      await page.close();
    }
    fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
