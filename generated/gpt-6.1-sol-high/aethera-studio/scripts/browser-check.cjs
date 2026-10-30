const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/aethera-studio/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.ttf':'font/ttf', '.svg':'image/svg+xml' };
const server = http.createServer((req, res) => {
  const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0]).replace(base, '') || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(file);
  const range = req.headers.range;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (range) {
    const [start, end] = range.replace('bytes=', '').split('-');
    const from = Number(start); const to = end ? Number(end) : stat.size - 1;
    res.writeHead(206, {...headers, 'Content-Range': `bytes ${from}-${to}/${stat.size}`, 'Content-Length': to-from+1});
    fs.createReadStream(file, { start: from, end: to }).pipe(res);
  } else { res.writeHead(200, {...headers, 'Content-Length':stat.size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(r => server.listen(4173, '0.0.0.0', r));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const errors = [], failed = [];
  const results = {};
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport:{width,height}, deviceScaleFactor:1 });
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if(m.type()==='error') errors.push(m.text()); });
      page.on('response', r => { if(r.status() >= 400) failed.push({url:r.url(),status:r.status()}); });
      await page.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => {const v = document.querySelector('video'); return v.readyState >= 2 && v.currentTime > .6;});
      await page.waitForTimeout(1000);
      const metrics = await page.evaluate(() => ({ width:innerWidth, scrollWidth:document.documentElement.scrollWidth, headline:document.querySelector('h1').textContent, fonts:document.fonts.check('48px "Instrument Serif"') && document.fonts.check('16px Inter'), video: { duration:document.querySelector('video').duration, currentTime:document.querySelector('video').currentTime, paused:document.querySelector('video').paused, opacity:document.querySelector('video').style.opacity }, nav:document.querySelector('header').getBoundingClientRect().toJSON() }));
      assert.equal(metrics.scrollWidth, width, `${name}: no horizontal overflow`);
      assert(metrics.fonts, 'fonts loaded');
      assert(!metrics.video.paused, 'video playing');
      assert(metrics.headline.replace(/\s+/g,' ').includes('Beyond silence, we build the eternal.'));
      if (name === 'mobile') {
        await page.getByRole('button', {name:'Open menu'}).click();
        assert(await page.getByRole('navigation', {name:'Mobile navigation'}).isVisible());
        await page.getByRole('navigation', {name:'Mobile navigation'}).getByRole('link', {name:'About',exact:true}).click();
        assert.equal(await page.getByRole('button', {name:'Open menu'}).getAttribute('aria-expanded'), 'false');
        await page.evaluate(() => { location.hash = ''; window.scrollTo(0,0); });
        await page.waitForTimeout(600);
      } else {
        const cta = page.locator('#reach-us');
        await cta.hover(); await page.waitForTimeout(200);
        assert((await cta.evaluate(el=>getComputedStyle(el).transform)) !== 'none');
        await page.mouse.move(0,0); await page.waitForTimeout(200);
        assert.equal(await cta.getAttribute('href'),'mailto:?subject=Begin%20Journey%20with%20Aethera');
      }
      await page.screenshot({path:`screenshots/${name}.png`, fullPage:true});
      if(name === 'desktop') {
        await page.evaluate(() => {const v=document.querySelector('video'); v.currentTime = v.duration - .25;});
        await page.waitForTimeout(50);
        const fading = await page.locator('video').evaluate(v => Number(v.style.opacity));
        assert(fading < .7, 'fades before ending');
        await page.waitForTimeout(950);
        const restarted = await page.locator('video').evaluate(v => ({time:v.currentTime,paused:v.paused,opacity:Number(v.style.opacity)}));
        assert(restarted.time < 2 && !restarted.paused, 'manual video loop restarts');
        metrics.loop = { fading, restarted };
        await page.evaluate(() => { const v=document.querySelector('video'); v.currentTime=.1; });
        await page.waitForTimeout(40);
        const fadeIn=await page.locator('video').evaluate(v=>Number(v.style.opacity));
        assert(fadeIn>0 && fadeIn<.8,'fades at start'); metrics.fadeIn=fadeIn;
      }
      results[name]=metrics;
      await page.close();
    }
    const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.waitForTimeout(500);
    results.reducedMotion=await page.locator('video').evaluate(v=>({paused:v.paused,opacity:v.style.opacity}));
    assert(results.reducedMotion.paused); assert.equal(results.reducedMotion.opacity,'1');
    assert.equal(errors.length,0,`browser errors: ${errors}`); assert.equal(failed.length,0,`failed assets: ${JSON.stringify(failed)}`);
    fs.writeFileSync('screenshots/checks.json',JSON.stringify({passed:true,results,errors,failed},null,2));
    console.log(JSON.stringify({passed:true,results,errors,failed},null,2));
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
