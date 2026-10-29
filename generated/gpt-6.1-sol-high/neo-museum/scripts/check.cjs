const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('assert');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const report={viewports:[],pageErrors:[],failedRequests:[],assetResponses:[],checks:{}};
 for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(/assets\/|googleapis|gstatic/.test(r.url()))report.assetResponses.push({url:r.url(),status:r.status()});});
  const checks={};
  await page.goto('http://localhost:4173/motionsites-results/neo-museum/',{waitUntil:'domcontentloaded'});
  checks.hiddenBeforeReveal=await page.locator('.hero-skeleton').count()===0;
  await page.locator('.hero-skeleton').waitFor(); await page.waitForTimeout(1900);
  checks.specimenReveals=await page.locator('.hero-skeleton').evaluate(e=>e.complete&&e.naturalWidth>0&&Number(getComputedStyle(e.parentElement).opacity)>.99);
  const transform=await page.locator('.hero-skeleton').evaluate(e=>getComputedStyle(e).transform);
  await page.screenshot({path:`screenshots/${label}-hero.png`});
  await page.waitForTimeout(1000);
  checks.specimenActuallyMoves=transform!==await page.locator('.hero-skeleton').evaluate(e=>getComputedStyle(e).transform);
  if(label==='desktop'){
   await page.getByRole('button',{name:'Pause specimen motion'}).click();
   const paused=await page.locator('.hero-skeleton').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(500);
   checks.pauseStopsMotion=paused===await page.locator('.hero-skeleton').evaluate(e=>getComputedStyle(e).transform);
   await page.getByRole('button',{name:'Play specimen motion'}).click();
   await page.getByRole('button',{name:'View Details'}).click();checks.dialogOpens=await page.getByRole('dialog').isVisible();
   checks.dialogSpecimenLoads=await page.locator('.details-modal img').evaluate(e=>e.complete&&e.naturalWidth>0);
   await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});checks.dialogCloses=true;
   await page.getByRole('button',{name:'Explore Now'}).click();await page.waitForTimeout(1100);
   checks.exploreScrolls=await page.evaluate(()=>Math.abs(document.getElementById('explore').getBoundingClientRect().top)<5);
  } else {
   await page.getByRole('button',{name:'Open menu',exact:true}).click();checks.menuOpens=await page.locator('#museum-menu').isVisible();
   await page.locator('#museum-menu').getByRole('link',{name:'Exhibitions'}).click();await page.waitForTimeout(1100);
   checks.menuCloses=await page.locator('#museum-menu').count()===0;
   checks.navigationScrolls=await page.evaluate(()=>Math.abs(document.getElementById('collection').getBoundingClientRect().top)<5);
  }
  await page.locator('.collection-panel').scrollIntoViewIfNeeded();await page.waitForTimeout(2000);
  checks.pterodactylLoads=await page.locator('.pterodactyl').evaluate(e=>e.complete&&e.naturalWidth>0);
  const manual=[];
  for(let i=0;i<5;i++){
   const button=page.locator('.chapter-list button').nth(i);await button.click();
   await page.waitForTimeout(650);
   const scale=await page.locator('.specimen-panel feDisplacementMap').first().getAttribute('scale');
   await page.screenshot({path:`screenshots/${label}-dissolve-${i+1}.png`});
   await page.waitForTimeout(1450);
   const result=await page.locator('.chapter-image').evaluate(e=>({loaded:e.complete&&e.naturalWidth>0,src:e.getAttribute('src')}));
   manual.push({chapter:i+1,selected:await button.getAttribute('aria-pressed')==='true',loaded:result.loaded,correctSource:result.src.endsWith(`chapter-${i+1}.png`),dissolveScale:Number(scale),settledScale:Number(await page.locator('.specimen-panel feDisplacementMap').first().getAttribute('scale'))});
  }
  checks.allManualSwitches=manual.every(x=>x.selected&&x.loaded&&x.correctSource&&x.dissolveScale>0&&x.settledScale===0);
  await page.screenshot({path:`screenshots/${label}-collection.png`});
  const auto=new Set();
  for(let i=0;i<12;i++){auto.add(await page.locator('.chapter-list button.active').innerText());await page.waitForTimeout(1600);}
  checks.allAutoSwitches=auto.size===5;
  await page.locator('.collection footer').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
  checks.fontsLoad=await page.evaluate(()=>document.fonts.check('400 14px Inter')&&document.fonts.check('400 11px "JetBrains Mono"'));
  const viewport=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,noOverflow:document.documentElement.scrollWidth<=innerWidth}));
  checks.noOverflow=viewport.noOverflow;
  checks.noBrokenImages=await page.locator('img').evaluateAll(images=>images.every(e=>e.complete&&e.naturalWidth>0));
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(400);
  await page.screenshot({path:`screenshots/${label}.png`,fullPage:true});
  report.viewports.push({...viewport,manual,autoChapters:[...auto],checks});
  console.log(label,JSON.stringify(checks));await page.close();
 }
 fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));await browser.close();
 assert(!report.pageErrors.length,'JavaScript errors');assert(!report.failedRequests.length,'Failed requests');
 for(const viewport of report.viewports)assert(Object.values(viewport.checks).every(Boolean),'Browser check failed');
})();
