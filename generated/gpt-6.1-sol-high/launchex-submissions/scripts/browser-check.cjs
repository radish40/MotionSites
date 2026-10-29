const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:4173/motionsites-results/launchex-submissions/';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173'], {stdio: 'pipe'});
const report = { errors: [], failedRequests: [], mediaAborts: [], checks: [] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let browser;
  try {
    for (let i=0; i<100; i++) { try { if ((await fetch(base)).ok) break; } catch {} await sleep(100); }
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844],['breakpoint',1024,1000],['tablet',768,1000]]) {
      const page = await browser.newPage({ viewport: {width,height}, deviceScaleFactor: 1 });
      page.on('pageerror', e => report.errors.push({ viewport:name, error:e.message }));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push({ viewport:name, error:msg.text() }); });
      page.on('requestfailed', req => {
        const item = { viewport:name, url:req.url(), error:req.failure()?.errorText };
        // Chromium cancels/restarts MP4 range requests when seeking or closing a page.
        if (req.resourceType() === 'media' && item.error === 'net::ERR_ABORTED') report.mediaAborts.push(item);
        else report.failedRequests.push(item);
      });
      await page.goto(base, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => { const v=document.querySelector('video'); return v.readyState >= 2 && !v.paused && v.currentTime > 0; }, {timeout:30000});
      const firstTime = await page.locator('video').evaluate(v=>v.currentTime);
      await page.waitForTimeout(250);
      assert(await page.locator('video').evaluate(v=>v.currentTime) > firstTime, 'video plays');
      const state = await page.evaluate(() => {
        const box = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
        const v=document.querySelector('video');
        return {
          overflow:document.documentElement.scrollWidth > innerWidth,
          background:getComputedStyle(document.querySelector('section')).backgroundColor,
          sectionHeight:document.querySelector('section').getBoundingClientRect().height,
          columns:Object.fromEntries([...document.querySelectorAll('[data-column]')].map(el=>[el.dataset.column,box(el)])),
          video:{...box(v),muted:v.muted,loop:v.loop,autoplay:v.autoplay,playsInline:v.playsInline,controls:v.controls,readyState:v.readyState,source:v.currentSrc,fallback:v.dataset.fallback || false},
          links:[...document.querySelectorAll('a')].map(a=>({text:a.textContent,href:a.getAttribute('href')})),
          polygons:document.querySelectorAll('polygon').length,
          fontLoaded:document.fonts.check('13px Inter'),
          outside:[...document.querySelectorAll('a,video,h2')].filter(el=>{const r=el.getBoundingClientRect();return r.left < 0 || r.right > innerWidth;}).map(el=>el.tagName)
        };
      });
      assert.equal(state.overflow,false,'no horizontal overflow');
      assert.deepEqual(state.outside,[],'content fits viewport');
      assert.equal(state.links.length,6);
      assert.equal(state.polygons,6);
      assert(state.links.every(a=>a.href==='#'));
      assert.equal(state.video.controls,false);
      assert(state.video.muted && state.video.loop && state.video.autoplay && state.video.playsInline);
      assert(state.fontLoaded);
      if (width>=1024) {
        assert(state.columns.left.x < state.columns.center.x && state.columns.center.x < state.columns.right.x);
        assert.equal(state.video.width,460);
      } else {
        assert(state.columns.center.y < state.columns.left.y && state.columns.left.y < state.columns.right.y);
        assert.equal(state.video.width,width<640?220:380);
      }
      if(name==='desktop') {
        const card=page.locator('a').first();
        const y=(await card.boundingBox()).y;
        await card.hover();
        await page.waitForTimeout(220);
        assert.equal((await card.boundingBox()).y,y-2,'hover lifts 2px');
        await page.mouse.move(0,0);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('a').first().evaluate(a=>a===document.activeElement),true,'keyboard focus');
        await page.keyboard.press('Enter');
        assert.equal(new URL(page.url()).pathname,new URL(base).pathname,'placeholder anchor stays in section page');
        await page.locator('a').first().evaluate(a=>a.blur());
        await page.waitForTimeout(220);
      }
      if(name==='mobile') {
        await page.locator('a').last().click();
        await page.evaluate(()=>window.scrollTo(0,0));
      }
      if(['desktop','mobile'].includes(name)) {
        await page.locator('video').evaluate(v=>{v.pause();v.currentTime=1;});
        await page.waitForTimeout(200);
        await page.screenshot({path:`screenshots/${name}.png`});
        if(name==='mobile') await page.screenshot({path:'screenshots/mobile-full.png',fullPage:true});
      }
      report.checks.push({viewport:name,width,height,...state,status:'passed'});
      await page.close();
    }
    // Prove that the bundled exact video works when its remote source fails.
    const fallbackPage = await browser.newPage();
    await fallbackPage.route('https://d8j0ntlcm91z4.cloudfront.net/**',route=>route.abort());
    await fallbackPage.goto(base);
    await fallbackPage.waitForFunction(()=>{const v=document.querySelector('video');return v.dataset.fallback==='true' && v.readyState>=2 && v.currentTime>0;});
    report.localVideoFallback='passed';
    await fallbackPage.close();
    assert.equal(report.errors.length,0,'no browser console or script errors');
    assert.equal(report.failedRequests.length,0,'no failed requests in normal browsing');
    report.status='passed';
  } catch(e) {report.status='failed';report.failure=e.stack;process.exitCode=1;}
  finally { if(browser) await browser.close();server.kill();fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2)); }
})();
