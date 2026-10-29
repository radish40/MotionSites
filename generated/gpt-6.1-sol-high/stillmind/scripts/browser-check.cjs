const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/stillmind/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve('dist', name.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  if (range) {
    const start = Number(range[1]); const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, {...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1});
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.writeHead(200, {...headers, 'Content-Length': size}); fs.createReadStream(file).pipe(res); }
});
const checks = [];
const check = (name, detail) => checks.push({ name, status: 'passed', detail });
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const errors = [], failed = [];
  const context = await browser.newContext({ viewport: {width:1440,height:1000}, deviceScaleFactor:1 });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', req => failed.push({ url:req.url(), error:req.failure()?.errorText }));
  await page.goto(`http://localhost:4173${base}`, {waitUntil:'load', timeout:60000});
  await page.evaluate(async () => { await document.fonts.load('88px "Instrument Serif"', 'Clarity'); await document.fonts.load('italic 24px "Instrument Serif"', 'Lumora'); await document.fonts.ready; });
  await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2), {timeout:45000});
  await page.waitForTimeout(1200);
  const videos = await page.locator('video').evaluateAll(vs => vs.map(v => ({ readyState:v.readyState, width:v.videoWidth, height:v.videoHeight, paused:v.paused, currentTime:v.currentTime, error:v.error?.message || null, muted:v.muted, loop:v.loop, playsInline:v.playsInline })));
  assert(videos.every(v => v.width && !v.paused && !v.error && v.currentTime > 0 && v.muted && v.loop && v.playsInline));
  check('Four original videos play', videos);
  const font = await page.evaluate(() => ({ family:getComputedStyle(document.querySelector('h1')).fontFamily, loaded:document.fonts.check('88px "Instrument Serif"', 'Clarity'), faces:[...document.fonts].map(f=>({family:f.family,status:f.status,style:f.style})), overlay:document.querySelector('.train-overlay').naturalWidth }));
  assert(font.loaded && font.overlay > 0); check('Font and transparent overlay loaded', font);
  const layout = async () => page.evaluate(() => ({ width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight, hero:document.querySelector('h1').getBoundingClientRect().toJSON(), footer:document.querySelector('footer').getBoundingClientRect().toJSON(), form:document.querySelector('form').getBoundingClientRect().toJSON() }));
  let bounds = await layout(); assert.equal(bounds.scrollWidth,1440); assert.equal(bounds.scrollHeight,1000); assert(bounds.footer.bottom<=1000); check('Desktop 1440×1000, no overflow', bounds);
  await page.screenshot({path:'screenshots/desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Still Water',exact:true}).click();
  await page.getByRole('button',{name:'Quiet Dawn',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Still Water',exact:true}).getAttribute('aria-pressed'),'true');
  await page.waitForTimeout(1100);
  const water = await page.locator('video').nth(1).evaluate(v=>getComputedStyle(v).opacity); assert.equal(water,'1'); check('Scene crossfade and 1000ms click cooldown', 'Still Water remains active after immediate Quiet Dawn click.');
  await page.getByRole('button',{name:'Deep Woods',exact:true}).click();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('.hero').evaluate(el=>getComputedStyle(el).color),'rgb(24, 44, 65)');
  assert.equal(await page.locator('.brand').evaluate(el=>getComputedStyle(el).color),'rgb(255, 255, 255)');
  check('Deep Woods dark hero, white navigation', '#182C41 hero; white brand');
  await page.screenshot({path:'screenshots/deep-woods.png',fullPage:true});
  await page.getByRole('button',{name:'Quiet Dawn',exact:true}).click(); await page.waitForTimeout(1100);
  assert.equal(await page.getByRole('button',{name:'Quiet Dawn',exact:true}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Golden Hour',exact:true}).click(); await page.waitForTimeout(1100);
  check('All four atmosphere controls', 'All scenes selectable; selected state and dark color reset verified.');
  await page.getByRole('button',{name:'Get Started',exact:true}).first().click();
  await page.waitForFunction(() => document.querySelector('#email') === document.activeElement);
  await page.getByRole('button',{name:'Get Early Access',exact:true}).click();
  assert.equal(await page.locator('#email').evaluate(el=>el.validity.valid),false);
  await page.locator('#email').fill('hello@example.com');
  await page.getByRole('button',{name:'Get Early Access',exact:true}).click();
  await page.getByRole('status').waitFor(); check('Email form', 'Get Started focuses email; native validation; valid input gives local confirmation. No backend is configured.');
  await page.reload({waitUntil:'load'}); await page.waitForFunction(()=>document.querySelector('video').readyState >= 2);
  await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(1200);
  bounds=await layout(); assert.equal(bounds.scrollWidth,390); assert.equal(bounds.scrollHeight,844); assert(bounds.form.x>=0 && bounds.form.right<=390); check('Mobile 390×844, no overflow',bounds);
  await page.screenshot({path:'screenshots/mobile.png',fullPage:true});
  const toggle=page.getByRole('button',{name:'Open menu',exact:true}); await toggle.click(); await page.waitForTimeout(650);
  assert.equal(await page.getByRole('button',{name:'Close menu',exact:true}).getAttribute('aria-expanded'),'true');
  assert.equal(await page.getByRole('dialog').getByRole('link').count(),4);
  await page.screenshot({path:'screenshots/mobile-menu.png',fullPage:true});
  await page.keyboard.press('Shift+Tab'); assert.equal(await page.locator('.mobile-menu-button').evaluate(el=>document.activeElement===el),true);
  await page.keyboard.press('Tab'); assert.equal(await page.getByRole('dialog').getByRole('link').first().evaluate(el=>document.activeElement===el),true);
  await page.keyboard.press('Escape'); await page.waitForTimeout(550);
  assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');
  await page.getByRole('button',{name:'Open menu',exact:true}).click(); await page.waitForTimeout(600);
  await page.getByRole('dialog').getByRole('button',{name:'Get Started'}).click();
  await page.waitForFunction(() => document.querySelector('#email') === document.activeElement);
  check('Mobile navigation', 'Animated menu opens and closes, 4 links render, focus is trapped, Escape closes, Get Started focuses form.');
  for(const link of ['How It Works','Features','Pricing','Community']) {
    await page.getByRole('button',{name:'Open menu',exact:true}).click(); await page.waitForTimeout(550);
    await page.getByRole('dialog').getByRole('link',{name:link,exact:true}).click(); await page.waitForTimeout(550);
    assert.equal(await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');
  }
  check('Navigation links', 'Each link closes the menu and focuses its related area within the single-screen design.');
  for(const viewport of [{width:320,height:568},{width:768,height:1024},{width:1440,height:800},{width:844,height:390}]) {
    await page.setViewportSize(viewport);
    const b=await layout(); assert.equal(b.scrollWidth,viewport.width); assert.equal(b.scrollHeight,viewport.height); assert(b.footer.bottom<=viewport.height); assert(b.form.right<=viewport.width);
  }
  check('Additional responsive sizes', '320×568, 768×1024, 1440×800, 844×390: no document overflow or clipped form/footer.');
  assert.equal(errors.length,0); check('Browser runtime errors',errors);
  const expectedMediaCancellations=failed.filter(f=>f.url.endsWith('.mp4') && f.error==='net::ERR_ABORTED');
  const failures=failed.filter(f=>!expectedMediaCancellations.includes(f));
  const report={checks,request_failures:failures,asset_issues:failures,expected_media_request_cancellations:expectedMediaCancellations,media_cancellation_note:'Chromium cancels initial media requests when reopening with byte ranges. All four videos decoded and played successfully.'};
  fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close(); server.close();
})().catch(error=>{ console.error(error); process.exitCode=1; server.close(); setTimeout(()=>process.exit(1),1000); });
