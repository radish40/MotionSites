const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/cleantech/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.mp4':'video/mp4' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(process.cwd(), 'dist', pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes' };
  if (req.headers.range) {
    const [a,b] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(a), end = b ? Math.min(Number(b), size-1) : size-1;
    res.writeHead(206, { ...headers, 'Content-Range':`bytes ${start}-${end}/${size}`, 'Content-Length':end-start+1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.writeHead(200, { ...headers, 'Content-Length':size }); fs.createReadStream(file).pipe(res); }
});

(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const results = [];
  try {
    if (!process.argv.includes('--fallback-only')) for (const viewport of [{ width:1440, height:1000 }, { width:390, height:844 }]) {
      const label = viewport.width === 1440 ? 'desktop' : 'mobile';
      const context = await browser.newContext({ viewport, deviceScaleFactor:1, isMobile:label === 'mobile', hasTouch:label === 'mobile' });
      const page = await context.newPage();
      const errors = [], failed = [], warnings = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); if (msg.type() === 'warning') { warnings.push(msg.text()); console.log('Browser warning:', msg.text()); } });
      page.on('response', response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil:'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('.hero video').readyState >= 2);
      await page.waitForTimeout(1600);
      const heroVideo = await page.locator('.hero video').evaluate(video => ({ width:video.videoWidth, height:video.videoHeight, playing:!video.paused, time:video.currentTime }));
      assert(heroVideo.width > 0 && heroVideo.playing, 'Hero video must load and autoplay');
      await page.screenshot({ path:`screenshots/${label}.png` });
      const overflow = async () => page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(await overflow(), false, 'Hero overflow');
      await page.getByRole('link', { name:'Start Here' }).click();
      await page.waitForTimeout(1800);
      assert.equal(new URL(page.url()).hash, '#about');
      const aboutTop = await page.locator('#about').evaluate(el => el.getBoundingClientRect().top);
      assert(Math.abs(aboutTop) < 3, 'Start Here scrolls to about');
      assert.equal(await page.locator('.hero').evaluate(el => getComputedStyle(el).opacity), '0');
      assert.equal(await overflow(), false, 'About overflow');
      await page.screenshot({ path:`screenshots/${label}-about.png` });
      const charOpacity = await page.locator('#about p span.absolute').evaluateAll(elements => [getComputedStyle(elements[0]).opacity, getComputedStyle(elements[elements.length-1]).opacity]);
      assert(Number(charOpacity[0]) > Number(charOpacity[1]), 'Characters reveal progressively');
      const frameStatus = setInterval(async () => console.log(label, 'frame extraction:', await page.locator('canvas').getAttribute('data-extracted')), 15000);
      try { await page.waitForFunction(() => Number(document.querySelector('[data-frames]').dataset.frames) > 0, null, { timeout:120000 }); }
      finally { clearInterval(frameStatus); }
      const frames = await page.locator('[data-frames]').getAttribute('data-frames');
      assert(Number(frames) <= 120 && Number(frames) > 0);
      const start = await page.locator('#impact').evaluate(el => el.getBoundingClientRect().top + scrollY);
      for (const [name, progress] of [['first',0.3], ['second',0.7]]) {
        await page.evaluate(y => window.scrollTo({ top:y, behavior:'instant' }), start + viewport.height * 3 * progress);
        await page.waitForTimeout(1400);
        const section = page.getByRole('region', { name:name === 'first' ? 'Annual refuse' : 'Refuse reclaimed' });
        assert.equal(await section.locator('h2').evaluate(el => getComputedStyle(el).opacity), '1');
        assert.equal(await overflow(), false, `${name} overflow`);
        await page.screenshot({ path:`screenshots/${label}-${name}.png` });
      }
      const canvas = await page.locator('canvas').evaluate(el => ({ width:el.width, height:el.height, pixels:[...el.getContext('2d').getImageData(20,20,1,1).data] }));
      assert.equal(canvas.width, viewport.width);
      assert.equal(canvas.pixels[3], 255, 'Canvas contains video pixels');
      await page.getByRole('link', { name:'Terova home' }).click();
      await page.waitForTimeout(1800);
      assert.equal(await page.evaluate(() => Math.round(scrollY)), 0, 'Brand returns home');
      assert.deepEqual(errors, []); assert.deepEqual(failed, []);
      results.push({ viewport, heroVideo, frames:Number(frames), canvas, charOpacity, errors, failed, warnings, interactions:['Start Here anchor', 'hero fade', 'character reveal', '120-frame canvas extraction', 'first stat', 'second stat', 'brand home'], horizontalOverflow:false });
      await context.close();
    }
    const fallbackPage = await browser.newPage({ viewport:{ width:390, height:844 } });
    await fallbackPage.addInitScript(() => { window.createImageBitmap = undefined; });
    await fallbackPage.goto(`http://127.0.0.1:4173${base}`, { waitUntil:'networkidle' });
    await fallbackPage.evaluate(() => window.scrollTo({ top:document.getElementById('about').offsetTop, behavior:'instant' }));
    await fallbackPage.waitForTimeout(300);
    const characterOpacities = await fallbackPage.locator('#about p span.absolute').evaluateAll(elements => [getComputedStyle(elements[0]).opacity, getComputedStyle(elements[elements.length-1]).opacity]);
    assert(Number(characterOpacities[0]) > Number(characterOpacities[1]), 'Characters reveal progressively');
    await fallbackPage.evaluate(() => { const el = document.getElementById('impact'); window.scrollTo({ top:el.offsetTop + innerHeight * 3 * 0.65, behavior:'instant' }); });
    await fallbackPage.waitForTimeout(2500);
    const fallback = await fallbackPage.locator('#impact video').evaluate(el => ({ time:el.currentTime, duration:el.duration, visible:getComputedStyle(el).visibility !== 'hidden', frames:document.querySelector('[data-frames]').dataset.frames }));
    assert(fallback.visible && fallback.time > fallback.duration * 0.5 && fallback.frames === '0', 'Seek-based fallback scrubs without ImageBitmap');
    if (process.argv.includes('--fallback-only')) results.push(...JSON.parse(fs.readFileSync('screenshots/checks.json','utf8')));
    results.push({ forcedFallback:fallback, characterOpacities });
    await fallbackPage.close();
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
