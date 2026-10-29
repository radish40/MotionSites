const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const server = spawn(process.execPath, ['scripts/serve.mjs']);
  let browser;
  const report = { basePath:'/motionsites-results/features/', viewports:[], errors:[], failedRequests:[], interactions:{} };
  try {
    await new Promise(resolve => server.stdout.once('data', resolve));
    browser = await chromium.launch({ executablePath:'/usr/bin/chromium', args:['--no-sandbox','--autoplay-policy=no-user-gesture-required'] });
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844],['tablet',900,1000]]) {
      const context = await browser.newContext({ viewport:{width,height}, deviceScaleFactor:1 });
      const page = await context.newPage();
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('requestfailed', req => report.failedRequests.push({url:req.url(),error:req.failure().errorText}));
      page.on('response', res => { if(res.status() >= 400) report.errors.push(`${res.status()} ${res.url()}`); });
      await page.goto('http://localhost:4173/motionsites-results/features/', {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2 && !v.paused));
      const layout = await page.evaluate(() => ({
        width:innerWidth,height:innerHeight,documentWidth:document.documentElement.scrollWidth,
        columns:getComputedStyle(document.querySelector('.capabilities__grid')).gridTemplateColumns,
        fontLoaded:document.fonts.check('300 16px Geist'),iconsLoaded:document.fonts.check('16px Phosphor'),
        cards:document.querySelectorAll('.cap-card').length,
        videos:[...document.querySelectorAll('video')].map(v => ({loaded:v.readyState>=2,playing:!v.paused,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,inline:v.playsInline})),
        contactVisible:document.querySelector('.cap-card__email').getBoundingClientRect().width > 0
      }));
      assert.equal(layout.documentWidth,width,`${name} overflow`);
      assert.equal(layout.cards,5);
      assert(layout.fontLoaded && layout.iconsLoaded);
      assert(layout.videos.every(v=>v.loaded&&v.playing&&v.muted&&v.loop&&v.inline));
      assert.equal(layout.columns.split(' ').length, name==='desktop'?3:name==='tablet'?2:1);
      if(name !== 'tablet') {
        // Capture an actual rendered frame from each video, fixed at 2s for repeatable evidence.
        await page.evaluate(async () => { for(const v of document.querySelectorAll('video')) { v.pause(); v.currentTime=2; await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true})); } });
        await page.screenshot({path:`screenshots/${name}.png`, fullPage:true});
      }
      if(name === 'desktop') {
        await page.keyboard.press('Tab');
        assert(await page.locator('.capabilities__button').evaluate(el=>el===document.activeElement));
        const before = await page.locator('.tool-marquee__row--left').evaluate(el=>getComputedStyle(el).transform);
        await page.waitForTimeout(200);
        const after = await page.locator('.tool-marquee__row--left').evaluate(el=>getComputedStyle(el).transform);
        assert.notEqual(before,after);
        report.interactions.marqueeMoves=true;
        const targets = ['.capabilities__button','.cap-card__email','.cap-card__phone','.cap-card__icon-button'];
        await page.evaluate(() => {
          window.activatedLinks=[];
          document.addEventListener('click', event => {
            const anchor=event.target.closest('a');
            if(anchor) { event.preventDefault(); window.activatedLinks.push(anchor.getAttribute('href')); }
          });
        });
        for(const target of targets) await page.locator(target).click();
        const links = await page.evaluate(()=>window.activatedLinks);
        assert.deepEqual(links,['mailto:programs@enginetech.com?subject=Start%20a%20Program','mailto:programs@enginetech.com','tel:+14150184270','mailto:programs@enginetech.com']);
        report.interactions.contactLinks=links;
        report.interactions.keyboardFocus=true;
      }
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.paused));
      const reduced = await page.locator('.tool-marquee__row--left').evaluate(el=>getComputedStyle(el).animationName);
      assert.equal(reduced,'none');
      report.interactions.reducedMotion=true;
      report.viewports.push({name,...layout});
      await context.close();
    }
    assert.deepEqual(report.errors,[]);
    assert.deepEqual(report.failedRequests,[]);
    report.passed=true;
    writeFileSync('screenshots/checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally { if(browser) await browser.close(); server.kill(); }
})().catch(error=>{ console.error(error); process.exitCode=1; });
