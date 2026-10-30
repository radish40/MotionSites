const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
 const report = {desktop:{},mobile:{},errors:[],consoleErrors:[],failedRequests:[]};
 const base = 'http://127.0.0.1:4173/motionsites-results/veloce-finance-landing/';
 for (const [name, viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
  const context = await browser.newContext({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const page = await context.newPage();
  page.on('console', msg => { if(msg.type()==='error') report.consoleErrors.push({viewport:name,message:msg.text()}); });
  page.on('pageerror', e => report.errors.push({viewport:name,message:e.message}));
  page.on('requestfailed', req=> report.failedRequests.push({viewport:name,url:req.url(),error:req.failure()?.errorText}));
  await page.goto(base,{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(2000);
  report[name].hero = await page.locator('video').first().evaluate(v => ({readyState:v.readyState,paused:v.paused,time:v.currentTime,width:v.videoWidth,source:v.currentSrc}));
  report[name].fonts = await page.evaluate(()=>({manrope:document.fonts.check('600 30px Manrope'),inter:document.fonts.check('500 16px Inter')}));
  report[name].images= await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({loaded:i.complete&&i.naturalWidth>0,source:i.currentSrc})));
  if(name==='mobile') {
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.waitForTimeout(500);
   await page.evaluate(()=>document.fonts.ready);
   report.mobile.fontsAfterMenu=await page.evaluate(()=>({inter:document.fonts.check('500 16px Inter')}));
   report.mobile.menuOpens=await page.locator('#mobile-navigation').isVisible();
   await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
   await page.keyboard.press('Escape');
   await page.waitForTimeout(400);
   report.mobile.escapeCloses=await page.locator('#mobile-navigation').count()===0;
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.locator('#mobile-navigation').getByRole('link',{name:'About us'}).click();
   await page.waitForTimeout(1200);
   report.mobile.navigationCloses=await page.locator('#mobile-navigation').count()===0;
   report.mobile.aboutNavigates=await page.evaluate(()=>Math.abs(document.querySelector('#insights').getBoundingClientRect().top-32)<5);
  } else {
   await page.getByRole('link',{name:'About us',exact:true}).click();
   await page.waitForTimeout(1200);
   report.desktop.aboutNavigates=await page.evaluate(()=>Math.abs(document.querySelector('#insights').getBoundingClientRect().top-32)<5);
  }
  const height = await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<height;y+=400){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(150);}
  await page.waitForTimeout(1600);
  await page.screenshot({path:`/work/screenshots/${name}-text-fill.png`});
  report[name].fillAtBottom=await page.locator('[data-fill]').getAttribute('data-fill');
  report[name].videos=await page.locator('video').evaluateAll(vs=>vs.map(v=>({ready:v.readyState,playing:!v.paused,width:v.videoWidth})));
  report[name].overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(500);
  report[name].fillAtTop=await page.locator('[data-fill]').getAttribute('data-fill');
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  await page.screenshot({path:`/work/screenshots/${name}-hero.png`});
  if(name==='desktop') {
    await page.locator('a').filter({hasText:'Sign up'}).first().click();
    await page.waitForTimeout(700);
    report.desktop.signupNavigates=await page.evaluate(()=>location.hash==='#get-app');
  }
  await context.close();
 }
 fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 const assert = require('node:assert/strict');
 assert.equal(report.errors.length,0);
 assert.equal(report.consoleErrors.length,0);
 assert.equal(report.failedRequests.length,0);
 for(const name of ['desktop','mobile']) { const r=report[name]; assert.equal(r.overflow.page,r.overflow.viewport); assert.equal(r.fillAtBottom,'100'); assert.equal(r.fillAtTop,'0'); assert.ok(r.hero.readyState>=2 && !r.hero.paused); assert.ok(r.images.every(i=>i.loaded)); assert.ok(r.videos.every(v=>v.ready>=2)); assert.ok(r.aboutNavigates); }
 assert.ok(report.mobile.menuOpens && report.mobile.escapeCloses && report.mobile.navigationCloses && report.desktop.signupNavigates);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
