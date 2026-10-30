const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('assert');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={desktop:{},mobile:{},errors:[],failedRequests:[]};
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('requestfailed',r=>report.failedRequests.push({viewport:name,url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://127.0.0.1:4173/motionsites-results/orbis-nft/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(18000);
  report[name].fonts=await page.evaluate(()=>({anton:document.fonts.check('16px Anton'),condiment:document.fonts.check('16px Condiment')}));
  report[name].videos=await page.locator('main video').evaluateAll(vs=>vs.map(v=>({src:v.src,readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,paused:v.paused,currentTime:v.currentTime,error:v.error?.message||null})));
  report[name].overflow=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
  assert(report[name].overflow.document<=width,`${name} overflow`);
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  if(name==='desktop'){
   await page.getByRole('button',{name:'FAQ',exact:true}).click();
   await page.getByRole('dialog').waitFor({state:'visible'});
   await page.keyboard.press('Escape');
   await page.getByRole('dialog').waitFor({state:'hidden'});
   await page.getByRole('link',{name:'Gallery',exact:true}).click();
   await page.waitForTimeout(1000);
   assert.equal(new URL(page.url()).hash,'#gallery');
   report[name].navigation='Homepage, Gallery, Buy NFT, Contact anchors verified';
   for(const [link,id] of [['Homepage','#home'],['Buy NFT','#gallery'],['Contact','#contact']]){
    await page.getByRole('link',{name:link,exact:true}).click();
    await page.waitForTimeout(650);
    assert.equal(new URL(page.url()).hash,id);
   }
   report[name].faq='opens and closes using Escape';
  }
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'View space object 1, rarity 8.7/10',exact:true}).click();
  await page.getByRole('dialog').waitFor({state:'visible'});
  assert(await page.getByRole('dialog').getByText('Space object 01').isVisible());
  await page.getByRole('button',{name:'Close dialog',exact:true}).click();
  await page.getByRole('dialog').waitFor({state:'hidden'});
  report[name].cardInteraction='opens object details and closes';
  await page.getByRole('link',{name:'See all creators',exact:true}).click();
  assert.equal(new URL(page.url()).hash,'#about');
  report[name].creators='links to Orbis introduction';
  report[name].socialLinks=await page.locator('.footer-socials a').evaluateAll(as=>as.map(a=>({label:a.getAttribute('aria-label'),href:a.getAttribute('href')})));
  report[name].visiblePlayback=[];
  for(const selector of ['#about video', ...[1,2,3].map(i=>`#gallery article:nth-child(${i}) video`), '#contact video']){
   const video=page.locator(selector);
   await video.scrollIntoViewIfNeeded();
   await page.waitForTimeout(1200);
   const playback=await video.evaluate(v=>({paused:v.paused,time:v.currentTime,error:v.error?.message||null}));
   report[name].visiblePlayback.push({selector,...playback});
   assert(!playback.paused && playback.time>0,`${name} ${selector} should play when visible`);
  }
  await context.close();
 }
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
