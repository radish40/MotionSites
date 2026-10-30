const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', args:['--no-sandbox','--disable-dev-shm-usage'] });
  const report = { url:'http://localhost:4173/motionsites-results/scaling-platform/', checks:[], errors:[] };
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport:{width,height}, deviceScaleFactor:1 });
      page.on('pageerror',e=>report.errors.push(`${name}: ${e.message}`));
      page.on('console',m=>{if(m.type()==='error')report.errors.push(`${name}: ${m.text()}`)});
      page.on('response',r=>{if(r.status()>=400)report.errors.push(`${name}: HTTP ${r.status()} ${r.url()}`)});
      await page.goto(report.url,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=3 && !v.paused));
      const initial = await page.locator('video').evaluateAll(v=>v.map(x=>x.currentTime));
      await page.waitForTimeout(1200);
      const media = await page.locator('video').evaluateAll(v=>v.map(x=>({currentTime:x.currentTime,muted:x.muted,paused:x.paused,width:x.videoWidth,height:x.videoHeight,source:x.currentSrc})));
      assert(media.every((v,i)=>v.muted&&!v.paused&&v.width>0&&v.currentTime!==initial[i]),'Videos must play');
      assert.equal(await page.locator('main > section').count(),2);
      assert.equal(await page.locator('footer').count(),0);
      assert(await page.evaluate(()=>document.fonts.check('700 80px Quantico')));
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
      if(name==='mobile') {
        await page.getByRole('button',{name:'Open navigation'}).click();
        await page.locator('#mobile-navigation').waitFor({state:'visible'});
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
        await page.getByRole('button',{name:'Open navigation'}).click();
        await page.locator('#mobile-navigation').getByRole('link',{name:'ABOUT',exact:true}).click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
      } else {
        await page.locator('.desktop-nav').getByRole('link',{name:'ABOUT',exact:true}).click();
      }
      await page.waitForTimeout(800);
      assert.equal(new URL(page.url()).hash,'#about');
      await page.locator('.learn-more').click();
      assert.equal(new URL(page.url()).hash,'#about-details');
      await page.evaluate(()=>{history.replaceState(null,'',location.pathname);window.scrollTo({top:0,behavior:'instant'})});
      await page.locator('.hero-action .cta').click();
      assert.equal(new URL(page.url()).hash,'#about');
      await page.waitForTimeout(800);
      await page.evaluate(()=>{history.replaceState(null,'',location.pathname);window.scrollTo({top:0,behavior:'instant'})});
      await page.mouse.move(0,0);
      await page.waitForTimeout(250);
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      report.checks.push({name,viewport:{width,height},sections:2,overflow:false,fontLoaded:true,media,interactionChecks:'navigation, get started, learn more'+(name==='mobile'?', menu toggle, Escape, menu closes on selection':''),screenshot:`screenshots/${name}.png`});
      await page.close();
    }
    const page=await browser.newPage();
    for(const width of [320,700,701,1024,1920]) {
      await page.setViewportSize({width,height:800});
      await page.goto(report.url,{waitUntil:'networkidle'});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No horizontal overflow at ${width}`);
    }
    report.checks.push({name:'additional responsive widths',widths:[320,700,701,1024,1920],overflow:false});
    assert.deepEqual(report.errors,[]);
    report.status='passed';
  } catch(error) {report.status='failed';report.failure=error.stack;process.exitCode=1;}
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})();
