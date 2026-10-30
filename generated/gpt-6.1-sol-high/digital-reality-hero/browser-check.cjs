const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const prefix = '/motionsites-results/digital-reality-hero/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(prefix, '');
  const file = path.join('/work/dist', relative || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required']});
  const results = { pages: [], errors: [], consoleErrors: [], httpErrors: [], failedRequests: [] };
  for (const [name, viewport] of [['desktop', {width:1440,height:1000}], ['mobile', {width:390,height:844}]]) {
    const page = await browser.newPage({viewport, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile'});
    page.on('console', m => { if (m.type() === 'error') results.consoleErrors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) results.httpErrors.push({url:r.url(),status:r.status()}); });
    page.on('pageerror', e => results.errors.push(e.message));
    page.on('requestfailed', r => results.failedRequests.push({url:r.url(),error:r.failure().errorText}));
    await page.goto('http://localhost:4173' + prefix, {waitUntil:'networkidle',timeout:60000});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 3, {timeout:30000});
    const start = await page.locator('video').evaluate(v => v.currentTime);
    await page.waitForTimeout(500);
    const checks = await page.evaluate(start => {
      const v = document.querySelector('video'), card = document.querySelector('article');
      return {
        title: document.title,
        viewport: {width:innerWidth,height:innerHeight},
        overflow: document.documentElement.scrollWidth > innerWidth,
        card: {inlineWidth:card.style.width,inlineHeight:card.style.height,rect:card.getBoundingClientRect().toJSON()},
        video: {src:v.currentSrc,readyState:v.readyState,playing:!v.paused && v.currentTime > start,muted:v.muted,loop:v.loop,autoplay:v.autoplay,playsInline:v.playsInline,error:v.error?.message || null},
        fonts: {didot:document.fonts.check('38px Didot'),inter:document.fonts.check('300 15px Inter'),heading:getComputedStyle(document.querySelector('h1')).fontFamily},
        heading: document.querySelector('h1').textContent,
      };
    }, start);
    const button = page.getByRole('button', {name:'Send a message'});
    await button.hover();
    await page.waitForTimeout(350);
    checks.hoverGlowOpacity = await button.locator('div').nth(1).evaluate(e => getComputedStyle(e).opacity);
    await page.mouse.move(0,0);
    await button.focus();
    checks.keyboardFocusVisible = await button.evaluate(e => e.matches(':focus-visible'));
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Page.enable');
    const navigations = [];
    cdp.on('Page.frameRequestedNavigation', e => navigations.push(e.url));
    await button.click();
    await page.waitForTimeout(300);
    checks.contactNavigation = navigations;
    await page.locator('button').evaluate(e => e.blur());
    await page.locator('video').evaluate(v => { v.pause(); v.currentTime = 3; });
    await page.waitForTimeout(300);
    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    results.pages.push({name,...checks});
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
  const assert = require('assert/strict');
  assert.equal(results.errors.length, 0);
  assert.equal(results.consoleErrors.length, 0);
  assert.equal(results.httpErrors.length, 0);
  for (const p of results.pages) {
    assert.equal(p.overflow, false);
    assert.equal(p.video.playing, true);
    assert.equal(p.video.error, null);
    assert.equal(p.fonts.didot && p.fonts.inter, true);
    assert.equal(p.keyboardFocusVisible, true);
    assert.ok(p.contactNavigation.includes('mailto:hello@your.name'));
  }
  assert.equal(results.pages[0].hoverGlowOpacity, '1');
  await browser.close(); server.close();
})().catch(e => { console.error(e); server.close(); process.exit(1); });
