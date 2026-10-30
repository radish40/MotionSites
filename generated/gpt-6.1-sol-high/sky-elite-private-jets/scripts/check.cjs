const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/sky-elite-private-jets/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const relative = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : '';
  const file = path.join('/work/dist', relative || 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const report = { viewports: [], scriptErrors: [], consoleErrors: [], requestFailures: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport: {width,height}, deviceScaleFactor: 1 });
      page.on('pageerror', err => report.scriptErrors.push(err.message));
      page.on('console', msg => { if (msg.type() === 'error') report.consoleErrors.push(msg.text()); });
      page.on('requestfailed', req => report.requestFailures.push({url:req.url(),failure:req.failure()}));
      await page.goto('http://localhost:4173' + base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2, {timeout:25000}).catch(() => {});
      await page.waitForTimeout(1500);
      const metrics = await page.evaluate(() => {
        const v = document.querySelector('video');
        const h = document.querySelector('h1').getBoundingClientRect();
        return { horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, heading: {x:h.x,y:h.y,width:h.width,height:h.height}, font: getComputedStyle(document.body).fontFamily, interLoaded: document.fonts.check('400 16px Inter'), video: {readyState:v.readyState, currentTime:v.currentTime, paused:v.paused, muted:v.muted, loop:v.loop, playsInline:v.playsInline, videoWidth:v.videoWidth,videoHeight:v.videoHeight,error:v.error?.message || null} };
      });
      assert.equal(metrics.horizontalOverflow, false);
      assert.equal(metrics.verticalOverflow, false);
      assert.ok(metrics.heading.y > 65);
      assert.equal(await page.getByRole('heading',{name:'Premium. Accessible.'}).count(),1);
      await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage:true });
      const interactions = {};
      if (name === 'mobile') {
        const toggle = page.getByRole('button', {name:'Open menu'});
        await toggle.click();
        await assert.doesNotReject(() => page.getByRole('navigation', {name:'Mobile navigation',exact:true}).waitFor({state:'visible'}));
        interactions.open = await page.getByRole('button', {name:'Close menu'}).getAttribute('aria-expanded');
        await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
        await page.getByRole('navigation', {name:'Mobile navigation',exact:true}).getByRole('link',{name:'Story',exact:true}).click();
        assert.equal(await page.locator('#mobile-menu').count(),0);
        interactions.linkClosesMenu = true;
        await page.getByRole('button',{name:'Open menu'}).click();
        await page.getByRole('button',{name:'Close menu'}).click();
        interactions.toggleClosesMenu = await page.locator('#mobile-menu').count() === 0;
      } else {
        assert.equal(await page.getByRole('button',{name:'Open menu'}).isVisible(),false);
        const discover = page.getByRole('button',{name:'Discover',exact:true});
        await discover.hover(); await page.waitForTimeout(200);
        interactions.discoverHover = await discover.evaluate(el => getComputedStyle(el).backgroundColor);
        await page.getByRole('button',{name:'Book Now'}).hover(); await page.waitForTimeout(200);
        interactions.bookHover = await page.getByRole('button',{name:'Book Now'}).evaluate(el => getComputedStyle(el).backgroundColor);
      }
      report.viewports.push({name,width,height,...metrics,interactions});
      await page.close();
    }
    assert.equal(report.scriptErrors.length,0);
    fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode=1; server.close(); });
