const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const server = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'pipe' });
const report = { url: 'http://127.0.0.1:4173/motionsites-results/remit-race/', viewports: [], errors: [], failedRequests: [], mediaRequestCancellations: [], httpErrors: [] };
(async () => {
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox','--disable-dev-shm-usage'] });
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport: { width,height }, deviceScaleFactor:1 });
      page.on('pageerror', e => report.errors.push({viewport:name,message:e.message}));
      page.on('console', m => { if (m.type()==='error') report.errors.push({viewport:name,message:m.text()}); });
      page.on('requestfailed', r => {
        const event = {viewport:name,url:r.url(),failure:r.failure()};
        if (r.url().endsWith('/globe.mp4') && r.failure()?.errorText === 'net::ERR_ABORTED') report.mediaRequestCancellations.push(event);
        else report.failedRequests.push(event);
      });
      page.on('response', r => { if (r.status() >= 400) report.httpErrors.push({viewport:name,url:r.url(),status:r.status()}); });
      await page.goto(report.url, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3);
      await page.waitForTimeout(1200);
      const state = await page.evaluate(() => ({
        title:document.title,
        bodyWidth:document.documentElement.scrollWidth,
        viewportWidth:innerWidth,
        fonts:[['Qanelas-Heavy',900],['Quicksand',600],['Inter',400]].map(([name,weight]) => ({name,weight,loaded:document.fonts.check(`${weight} 18px "${name}"`)})),
        imageLoaded:document.querySelector('.world-globe-img').naturalWidth > 0,
        video:{readyState:document.querySelector('video').readyState,playing:!document.querySelector('video').paused,time:document.querySelector('video').currentTime,muted:document.querySelector('video').muted,loop:document.querySelector('video').loop},
        phones:[...document.querySelectorAll('.phone')].map(el => { const r=el.getBoundingClientRect();return {screen:el.dataset.screen,x:r.x,y:r.y,width:r.width,height:r.height}; })
      }));
      assert.equal(state.bodyWidth,width,'No horizontal page overflow');
      assert.equal(state.phones.length,3);
      assert.ok(state.fonts.every(f=>f.loaded));
      assert.ok(state.imageLoaded);
      assert.ok(state.video.playing && state.video.time>0);
      if(name==='desktop') assert.ok(state.phones.every(p=>p.y===state.phones[0].y),'Desktop three panels in a row');
      else assert.ok(state.phones[0].y<state.phones[1].y && state.phones[1].y<state.phones[2].y,'Mobile panels wrap vertically');
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      const front = async id => { await page.waitForTimeout(700); assert.ok(await page.locator(`#card-${id}`).evaluate(el=>el.classList.contains('deck-slot-0'))); };
      await page.locator('#next-card').click(); await front(1);
      await page.locator('#next-card').click(); await front(2);
      await page.locator('#next-card').click(); await front(0);
      await page.locator('#prev-card').click(); await front(2);
      await page.locator('#prev-card').click(); await front(1);
      await page.locator('#prev-card').click(); await front(0);
      await page.locator('#next-card').focus(); await page.keyboard.press('Enter'); await front(1);
      await page.locator('#prev-card').focus(); await page.keyboard.press('Space'); await front(0);
      await page.locator('#next-card').evaluate(el=>{el.click();el.click();el.click();}); await front(1);
      await page.locator('#prev-card').click(); await front(0);
      report.viewports.push({name,width,height,...state,interactions:'Passed next/previous, forward/backward wrap, Enter/Space activation, rapid-click animation guard'});
      await page.close();
    }
    assert.equal(report.errors.length,0,'Browser script/console errors');
    assert.equal(report.failedRequests.length,0,'Failed asset requests');
    assert.equal(report.httpErrors.length,0,'HTTP errors');
    report.status='passed';
  } finally { await browser.close(); }
})().catch(e=>{report.status='failed';report.failure=e.stack;process.exitCode=1;}).finally(()=>{fs.writeFileSync('screenshots/checks.json',JSON.stringify(report,null,2));server.kill();console.log(JSON.stringify(report,null,2));});
