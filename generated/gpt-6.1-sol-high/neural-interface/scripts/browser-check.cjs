const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors=[], failed=[], requests=[];
    page.on('pageerror', e=>errors.push(e.message));
    page.on('console', m=>{ if(m.type()==='error') errors.push(m.text()); });
    page.on('requestfailed', r=>failed.push(r.url()));
    page.on('request', r=>requests.push(r.url()));
    await page.goto('http://127.0.0.1:4173/motionsites-results/neural-interface/', {waitUntil:'networkidle'});
    await page.waitForFunction(()=>document.querySelector('#main-content').classList.contains('visible'));
    await page.waitForTimeout(1800);
    await page.evaluate(()=>document.fonts.ready);
    const initial=await page.evaluate(()=>({
      title:document.title,
      font:document.fonts.check('16px "Space Mono"'),
      video:{readyState:document.querySelector('video').readyState,duration:document.querySelector('video').duration,error:document.querySelector('video').error},
      overflow:document.documentElement.scrollWidth>innerWidth,
      hero:Array.from(document.querySelectorAll('[data-scramble-in]')).map(el=>el.textContent),
      cards:document.querySelectorAll('.swiper-slide').length,
    }));
    assert.equal(initial.title,'SynapseX'); assert(initial.font); assert(initial.video.readyState>=3); assert(!initial.video.error); assert(!initial.overflow); assert.equal(initial.cards,6);
    assert.deepEqual(initial.hero,['Brain','And Body','One','Network']);
    await page.screenshot({path:`screenshots/${name}.png`});
    const menu=name==='desktop'?'#hamburger-btn':'#hamburger-btn-m';
    const pill=name==='desktop'?'#menu-pill':'#menu-pill-m';
    await page.click(menu); await page.waitForTimeout(400);
    assert.equal(await page.locator(menu).getAttribute('aria-expanded'),'true');
    assert(await page.locator(pill).evaluate(el=>el.classList.contains('open')));
    await page.screenshot({path:`screenshots/${name}-menu.png`});
    await page.locator(pill).getByRole('button',{name:'About',exact:true}).click();
    await page.waitForTimeout(1500);
    assert(await page.evaluate(()=>scrollY>0));
    assert.equal(await page.locator(menu).getAttribute('aria-expanded'),'false');
    await page.screenshot({path:`screenshots/${name}-about.png`});
    const seekTime=await page.locator('video').evaluate(v=>v.currentTime); assert(seekTime>0);
    await page.click(menu); await page.waitForTimeout(400);
    await page.locator(pill).getByRole('button',{name:'Metrics',exact:true}).click();
    await page.waitForTimeout(1600);
    await page.locator('#stats-section').scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
    assert(await page.locator('#stats-section').evaluate(el=>el.classList.contains('revealed')));
    const before=await page.locator('#stats-swiper').evaluate(el=>el.swiper.realIndex);
    const box=await page.locator('#stats-swiper').boundingBox();
    await page.mouse.move(box.x+box.width*.7,box.y+200);
    await page.mouse.down(); await page.mouse.move(box.x+box.width*.2,box.y+200,{steps:18}); await page.mouse.up();
    await page.waitForTimeout(700);
    const after=await page.locator('#stats-swiper').evaluate(el=>el.swiper.realIndex);
    assert.notEqual(before,after);
    await page.screenshot({path:`screenshots/${name}-metrics.png`});
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
    const download=await page.locator(name==='desktop'?'.download-btn':'.download-btn-m').getAttribute('href'); assert.equal(download,'https://www.instagram.com/dmitriyinin');
    await page.locator(name==='desktop'?'#logo-pill':'#logo-pill-m').click(); await page.waitForTimeout(1800);
    assert(await page.evaluate(()=>scrollY<2));
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert(requests.every(u=>u.startsWith('http://127.0.0.1:4173/')));
    results.push({name,viewport:{width,height},initial,menu:true,aboutNavigation:true,metricsNavigation:true,scrollVideoSeeking:true,carouselDrag:{before,after},homeNavigation:true,downloadHref:download,scriptErrors:errors,failedRequests:failed,allAssetsLocal:true});
    await context.close();
  }
  fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
