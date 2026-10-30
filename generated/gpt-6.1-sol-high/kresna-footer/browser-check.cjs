const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('assert');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const results = { url: 'http://127.0.0.1:4173/motionsites-results/kresna-footer/', viewports: {}, errors: [], failedRequests: [] };
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    page.on('pageerror', e => results.errors.push(String(e)));
    page.on('requestfailed', r => results.failedRequests.push({ url:r.url(), error:r.failure()?.errorText }));
    await page.goto(results.url, { waitUntil:'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const state = await page.evaluate(() => {
      const v = document.querySelector('video');
      const box = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
      return {
        scrollWidth:document.documentElement.scrollWidth, viewport:innerWidth,
        fonts: { dmSans:document.fonts.check('400 19px "DM Sans"'), caveat:document.fonts.check('600 24px Caveat') },
        video:{source:v.currentSrc,readyState:v.readyState,paused:v.paused,currentTime:v.currentTime,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop},
        left:box(document.querySelector('.footer-left')),right:box(document.querySelector('.footer-right')),
        watermarkViewBox:document.getElementById('watermarkSvg').getAttribute('viewBox'),
        navLinks:document.querySelectorAll('.footer-col a').length,socialLinks:document.querySelectorAll('.social-icon a').length
      };
    });
    assert(state.scrollWidth <= width, `${name}: horizontal overflow`);
    assert(state.fonts.dmSans && state.fonts.caveat, `${name}: missing fonts`);
    assert(state.video.readyState >= 2 && !state.video.paused && state.video.currentTime > 0, `${name}: video not playing`);
    assert(state.navLinks === 9 && state.socialLinks === 4);
    await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
    const button=page.getByRole('button',{name:'Subscribe'});
    await button.click();
    assert(await page.locator('input').evaluate(el=>!el.validity.valid));
    await page.getByRole('textbox',{name:'Email address'}).fill('invalid-email');
    await button.click();
    assert(await page.locator('input').evaluate(el=>el.validity.typeMismatch));
    await page.getByRole('textbox',{name:'Email address'}).fill('hello@example.com');
    await page.getByRole('textbox',{name:'Email address'}).press('Enter');
    assert((await page.getByRole('status').textContent()).includes('not connected'));
    if(name==='desktop') {
      await page.getByRole('link',{name:'Features',exact:true}).hover();
      await page.waitForTimeout(250);
      assert(await page.getByRole('link',{name:'Features',exact:true}).evaluate(el=>getComputedStyle(el).color==='rgb(31, 101, 214)'));
      await page.locator('.social-icon').first().hover();
      await page.waitForTimeout(200);
      assert(await page.locator('.social-icon').first().evaluate(el=>getComputedStyle(el).transform==='matrix(1, 0, 0, 1, 0, -2)'));
      await button.hover();
      await page.waitForTimeout(200);
      assert(await button.evaluate(el=>getComputedStyle(el).transform==='matrix(1, 0, 0, 1, 0, -1)'));
    }
    await page.getByRole('link',{name:'Features',exact:true}).click();
    assert(page.url().endsWith('#features'));
    results.viewports[name]={...state,interactions:'passed: required email, invalid email, valid email disclosure, Enter key, navigation hash; desktop hover checks'};
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.route('https://d8j0ntlcm91z4.cloudfront.net/**',route=>route.abort());
  await page.goto(results.url,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  results.localVideoFallback=await page.locator('video').evaluate(v=>({source:v.currentSrc,playing:!v.paused}));
  assert(results.localVideoFallback.source.endsWith('/assets/kresna-background.mp4'));
  for(const width of [320,560,768,860,861,1024,1920]) {
    await page.setViewportSize({width,height:1000});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
  }
  results.extraWidths=[320,560,768,860,861,1024,1920];
  results.requestNotes='ERR_ABORTED media requests can occur when Chromium closes a page with an ongoing video download. Both main checks verify decoded frames and advancing playback; the fallback check deliberately blocks the CDN.';
  fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(results,null,2));
  await browser.close();
  console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
