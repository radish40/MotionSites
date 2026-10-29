const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const server = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'inherit' });
 let browser;
 const report = { url: 'http://localhost:4173/motionsites-results/book-hero/', errors: [], failedRequests: [], viewports: {}, assets: [] };
 try {
  for (let i=0; i<50; i++) { try { await fetch(report.url); break; } catch { await new Promise(r=>setTimeout(r,100)); } }
  browser = await chromium.launch({ executablePath:'/usr/bin/chromium', args:['--no-sandbox','--disable-dev-shm-usage'] });
  for (const [name, size] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
   const page = await browser.newPage({ viewport:size, deviceScaleFactor:1, isMobile:name==='mobile', hasTouch:name==='mobile' });
   page.on('pageerror',e=>report.errors.push(e.message));
   page.on('console',m=>{ if(m.type()==='error')report.errors.push(m.text()); });
   page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()}));
   page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
   await page.goto(report.url, {waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   const assets = await page.evaluate(async()=> {
    const paths = [...new Set([...document.querySelectorAll('.book-front-cover')].map(e=>e.style.backgroundImage.slice(5,-2)))];
    return Promise.all(paths.map(async path=>{ const im=new Image(); im.src=path; try{await im.decode();return {path,width:im.naturalWidth,height:im.naturalHeight,ok:true};}catch{return {path,ok:false};} }));
   });
   assert(assets.every(a=>a.ok), 'all 24 covers decode');
   report.assets = assets;
   const layout = await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,books:document.querySelectorAll('.book').length,font:document.fonts.check('30px "Lawrence W00 Regular"')}));
   assert.equal(layout.width,layout.scrollWidth,'no horizontal overflow');
   assert.equal(layout.height,layout.scrollHeight,'no vertical overflow');
   assert.equal(layout.books,48);
   assert.equal(layout.font,true);
   const before=await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).transform);
   await page.waitForTimeout(150);
   const after=await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).transform);
   assert.notEqual(before,after,'marquee moves');
   const track=page.locator('.marquee-track');
   // Deterministic frame of the real animation for screenshots and hit tests.
   await track.evaluate(e=>e.getAnimations()[0].currentTime=1000);
   if(name==='desktop') {
    const point=await page.evaluate(()=>{
     for(let y=350;y<850;y+=10) for(let x=100;x<1300;x+=10) {const e=document.elementFromPoint(x,y); if(e?.closest('.book'))return {x,y};}
    });
    assert(point,'book is visible');
    await page.mouse.move(point.x+70,point.y+60); await page.waitForTimeout(550);
    if(await track.evaluate(e=>getComputedStyle(e).animationPlayState)!=='paused') {
      await page.mouse.move(point.x+110,point.y+80); await page.waitForTimeout(550);
    }
    await page.screenshot({path:'screenshots/desktop-hover.png'});
    assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
    await page.screenshot({path:'screenshots/desktop-hover.png'});
    await page.mouse.move(10,100);
    await page.locator('.book').nth(8).focus();
    assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
    await page.locator('.book').nth(8).evaluate(e=>e.blur());
   } else {
    const toggle=page.getByRole('button',{name:'Toggle menu'});
    await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    assert(await page.getByRole('link',{name:'Catalogs',exact:true}).isVisible());
    await page.screenshot({path:'screenshots/mobile-menu.png'});
    await page.keyboard.press('Escape'); assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    await toggle.click(); await page.getByRole('link',{name:'Catalogs',exact:true}).click();
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   }
   await track.evaluate(e=> {const a=e.getAnimations()[0];a.currentTime=1000;a.pause();});
   await page.waitForTimeout(600);
   await page.screenshot({path:`screenshots/${name}.png`});
   report.viewports[name]={...layout,animation:true,hover:name==='desktop'?'passed':'touch device',menu:name==='mobile'?'passed':'desktop navigation',screenshot:`screenshots/${name}.png`};
   await page.close();
  }
  const reduced=await browser.newPage({reducedMotion:'reduce',viewport:{width:390,height:844}});
  await reduced.goto(report.url);
  assert.equal(await reduced.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');
  report.reducedMotion='passed';
  await reduced.close();
  assert.equal(report.errors.length,0,'no script/console/HTTP errors');
  assert.equal(report.failedRequests.length,0,'no failed requests');
  report.status='passed';
 } catch(e) {report.status='failed';report.failure=e.stack;process.exitCode=1;}
 finally { if(browser) await browser.close();server.kill();fs.writeFileSync('screenshots/checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2)); }
})();
