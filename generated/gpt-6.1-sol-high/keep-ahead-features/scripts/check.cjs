const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = '/motionsites-results/keep-ahead-features/';
const server = http.createServer((req, res) => {
  if (req.url.split('?')[0] === path || req.url.split('?')[0] === path + 'index.html') {
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end(fs.readFileSync('dist/index.html'));
  } else if (req.url === '/favicon.ico') { res.writeHead(204); res.end(); }
  else { res.writeHead(404); res.end('Not found'); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = {url: 'http://localhost:4173' + path, viewports: [], interactions: [], errors: [], assetFailures: [], fontLoaded: false};
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
    page.on('requestfailed', req => report.assetFailures.push({url: req.url(), error: req.failure().errorText}));
    page.on('response', res => { if (res.status() >= 400) report.assetFailures.push({url: res.url(), status: res.status()}); });
    await page.setViewportSize({width:1440, height:1000});
    await page.goto(report.url, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    report.fontLoaded = await page.evaluate(() => [...document.fonts].some(f => f.family === 'DM Sans' && f.status === 'loaded'));
    assert.equal(await page.title(), 'Community Page — Test 3');
    assert.equal(await page.locator('.feat-card').count(), 3);
    assert.equal(await page.locator('.feat-tag').count(), 3);
    for (const [name, width, height, columns] of [['desktop',1440,1000,3], ['mobile',390,844,1]]) {
      await page.setViewportSize({width,height});
      await page.mouse.move(0, 0);
      await page.evaluate(() => window.scrollTo(0,0));
      const layout = await page.evaluate(() => ({
        viewport:innerWidth, document:document.documentElement.scrollWidth,
        columns:getComputedStyle(document.querySelector('.features-cards')).gridTemplateColumns.split(' ').length,
        headingSize:getComputedStyle(document.querySelector('h2')).fontSize,
        cards:[...document.querySelectorAll('.feat-card')].map(el => { const b=el.getBoundingClientRect(); return {x:b.x,y:b.y,width:b.width,height:b.height}; }),
        overflowing:[...document.querySelectorAll('body *')].filter(el=>{const b=el.getBoundingClientRect();return b.width && (b.right>innerWidth+1 || b.left < -1)}).map(el=>el.className)
      }));
      assert.equal(layout.document,width);
      assert.equal(layout.columns,columns);
      assert.equal(layout.overflowing.length,0);
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      report.viewports.push({name,width,height,...layout,passed:true});
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.evaluate(() => window.scrollTo(0,0));
    for (let i=0; i<3; i++) {
      const card = page.locator('.feat-card').nth(i);
      await card.hover();
      await page.waitForTimeout(400);
      const transform = await card.evaluate(el=>getComputedStyle(el).transform);
      assert.equal(transform,'matrix(1, 0, 0, 1, 0, -4)');
      const link = card.locator('.feat-link');
      await link.hover();
      await page.waitForTimeout(300);
      const style = await link.evaluate(el=>({gap:getComputedStyle(el).gap, opacity:getComputedStyle(el).opacity}));
      assert.equal(style.gap,'10px'); assert.equal(style.opacity,'0.85');
      const [popup] = await Promise.all([page.waitForEvent('popup'),link.click()]);
      await popup.waitForLoadState();
      assert.equal(new URL(popup.url()).hash, ['#daily-newsletter','#curated-tools','#expert-insights'][i]);
      await popup.close();
      report.interactions.push({card:i+1, lift:transform,linkHover:style,newTab:true,passed:true});
    }
    await page.mouse.move(0,0);
    await page.waitForTimeout(400);
    await page.goto(report.url, {waitUntil:'networkidle'});
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.feat-link').first().evaluate(el=>el === document.activeElement),true);
    report.keyboardNavigation = 'passed';
    assert.equal(report.errors.length,0,JSON.stringify(report.errors));
    report.passed = true;
  } finally {
    fs.writeFileSync('screenshots/checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
    await browser.close(); server.close();
  }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
