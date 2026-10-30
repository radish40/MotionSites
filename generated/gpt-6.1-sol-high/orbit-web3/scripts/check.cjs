const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/orbit-web3/';
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.mp4':'video/mp4', '.ttf':'font/ttf' };
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', name.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes' };
  if (req.headers.range) {
    const [start, end] = req.headers.range.replace('bytes=', '').split('-');
    const a = Number(start), b = end ? Number(end) : size - 1;
    res.writeHead(206, {...headers, 'Content-Range':`bytes ${a}-${b}/${size}`, 'Content-Length':b-a+1});
    fs.createReadStream(file, {start:a,end:b}).pipe(res);
  } else { res.writeHead(200, {...headers, 'Content-Length':size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
    const page = await browser.newPage({ viewport: {width,height}, deviceScaleFactor: 1 });
    const errors = [], failedRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failedRequests.push({ url:r.url(), error:r.failure().errorText }));
    await page.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle'});
    await page.evaluate(async () => { await document.fonts.load('16px \"Instrument Serif\"'); await document.fonts.ready; });
    await page.waitForFunction(() => document.querySelector('video').readyState >= 3);
    const before = await page.locator('video').evaluate(v => v.currentTime);
    const marqueeBefore = await page.locator('.marquee-track').evaluate(e => getComputedStyle(e).transform);
    await page.waitForTimeout(500);
    const info = await page.evaluate(() => ({
      viewport: {width:innerWidth, height:innerHeight},
      scrollWidth:document.documentElement.scrollWidth,
      scrollHeight:document.documentElement.scrollHeight,
      heading:document.querySelector('h1').innerText.replace(/\nassets\.\nassets\.$/, ''),
      fontLoaded:document.fonts.check('16px "Instrument Serif"'),
      video:{time:document.querySelector('video').currentTime, muted:document.querySelector('video').muted, paused:document.querySelector('video').paused, width:document.querySelector('video').videoWidth, height:document.querySelector('video').videoHeight},
      marquee:getComputedStyle(document.querySelector('.marquee-track')).transform,
      icons:document.querySelectorAll('.builder svg').length,
      bodyFont:getComputedStyle(document.body).fontFamily,
      button:document.querySelector('.launch').getBoundingClientRect().toJSON()
    }));
    assert.equal(info.scrollWidth, width, 'horizontal overflow');
    assert.equal(info.scrollHeight, height, 'vertical overflow');
    assert.equal(info.fontLoaded,true);
    assert.equal(info.video.paused,false);
    assert.ok(info.video.time > before, 'video must play');
    assert.notEqual(info.marquee, marqueeBefore, 'marquee must move');
    assert.equal(info.icons,10);
    for (const label of ['Vault','Send','Receive','Trade']) {
      await page.getByRole('link', {name:label,exact:true}).click();
      assert.equal(new URL(page.url()).hash, '#'+label.toLowerCase());
    }
    await page.getByRole('link', {name:'Orbit home'}).click();
    const button = page.getByRole('button', {name:'Launch your orbit'});
    await button.hover();
    await page.waitForTimeout(300);
    const scale = await button.evaluate(e => getComputedStyle(e).transform);
    assert.ok(parseFloat(scale.match(/matrix\(([^,]+)/)[1]) > 1);
    await button.click();
    await button.focus();
    assert.equal(await button.evaluate(e => e === document.activeElement), true);
    await page.keyboard.press('Enter');
    await button.evaluate(e => e.blur());
    await page.mouse.move(width-1,0);
    await page.waitForTimeout(350);
    await page.evaluate(async () => { const v=document.querySelector('video'); v.pause(); v.currentTime=3; await new Promise(r=>v.addEventListener('seeked',r,{once:true})); });
    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    assert.deepEqual(errors, []);
    results.push({name, ...info, hoverScale:scale, navLinks:'passed', buttonClick:'passed; no destination specified by design', videoPlayback:'passed before pausing at 3s for repeatable screenshot', errors, failedRequests});
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
  const offlinePage = await browser.newPage();
  await offlinePage.route('https://**/*', route => route.abort());
  await offlinePage.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle'});
  await offlinePage.evaluate(async () => { await document.fonts.load('16px \"Instrument Serif\"'); await document.fonts.ready; });
  assert.equal(await offlinePage.evaluate(() => document.fonts.check('16px \"Instrument Serif\"')), true);
  await offlinePage.close();
  await browser.close(); server.close();
  console.log(JSON.stringify(results,null,2));
})().catch(e => {console.error(e);server.close();process.exit(1)});
