const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/wanderful-hero/';
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff':'font/woff'};
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', name.slice(prefix.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--autoplay-policy=no-user-gesture-required','--disable-dev-shm-usage']});
  const results = { url: `http://localhost:4173${prefix}`, viewports: [], errors: [], failedRequests: [], httpErrors: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const context = await browser.newContext({ viewport:{width,height}, deviceScaleFactor:1, isMobile:name==='mobile', hasTouch:name==='mobile' });
      const page = await context.newPage();
      page.on('pageerror', e => results.errors.push(e.message));
      page.on('requestfailed', req => results.failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
      page.on('response', response => { if(response.status()>=400) results.httpErrors.push({url:response.url(),status:response.status()}); });
      await page.goto(results.url, {waitUntil:'networkidle',timeout:60000});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3, {timeout:45000});
      await page.waitForTimeout(1800);
      const layout = await page.evaluate(() => {
        const video = document.querySelector('video');
        const bounds = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
        return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,video:{readyState:video.readyState,paused:video.paused,currentTime:video.currentTime,rate:video.playbackRate,muted:video.muted,loop:video.loop,width:video.videoWidth,height:video.videoHeight},font:document.fonts.check('400 40px Inter'),headline:bounds('h1'),bottom:bounds('.bottom-block'),navigation:bounds('nav')};
      });
      assert.equal(layout.scrollWidth,width,'Horizontal overflow');
      assert.equal(layout.scrollHeight,height,'Vertical overflow');
      assert.equal(layout.video.paused,false,'Autoplay failed');
      assert.equal(layout.video.rate,1.25);
      assert.equal(layout.video.muted,true);
      assert.equal(layout.font,true);
      assert.ok(layout.headline.y+layout.headline.height < layout.bottom.y,'Hero overlaps bottom block');
      if(name==='desktop') {
        await page.mouse.move(1400,950);
        await page.waitForTimeout(800);
        const transform = await page.locator('video').evaluate(el=>getComputedStyle(el.parentElement).transform);
        assert.notEqual(transform,'none');
        layout.parallaxTransform = transform;
        await page.mouse.move(720,500);
        await page.waitForTimeout(800);
      }
      // Keep the live video at a repeatable frame for visual comparison only.
      await page.locator('video').evaluate(async video=>{video.pause();video.currentTime=1;await new Promise(resolve=>video.addEventListener('seeked',resolve,{once:true}));});
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      const button = page.getByRole('button',{name:'Plan my escape today'});
      await button.hover();
      await page.waitForTimeout(250);
      layout.buttonHover = await button.evaluate(el=>({transform:getComputedStyle(el).transform,shadow:getComputedStyle(el).boxShadow}));
      if(name==='desktop') assert.notEqual(layout.buttonHover.transform,'none');
      await button.click();
      await page.getByRole('link',{name:'GET ROAMING'}).click();
      assert.equal(new URL(page.url()).hash,'#escape');
      await page.getByRole('link',{name:'JOURNEY',exact:true}).click();
      assert.equal(new URL(page.url()).hash,'#journey');
      for (const label of ['BENEFITS','JOURNAL','GUIDEBOOK']) {
        await page.getByRole('link',{name:label,exact:true}).click();
        assert.equal(new URL(page.url()).hash,`#${label.toLowerCase()}`);
      }
      await page.keyboard.press('Tab');
      layout.keyboardFocus = await page.evaluate(()=>document.activeElement.tagName);
      results.viewports.push({name,...layout});
      await context.close();
    }
    assert.equal(results.errors.length,0,'Browser script errors');
    results.passed = true;
  } catch(error) { results.passed=false; results.failure=error.stack; process.exitCode=1; }
  fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();
  server.close();
})();
