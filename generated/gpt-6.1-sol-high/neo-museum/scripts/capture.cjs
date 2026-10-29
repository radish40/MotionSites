const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const review=[];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto('http://localhost:4173/motionsites-results/neo-museum/',{waitUntil:'networkidle'});
  await page.waitForTimeout(4800);
  await page.screenshot({path:`screenshots/${name}-hero.png`});
  await page.locator('#explore').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
  await page.locator('.collection-heading').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);
  await page.screenshot({path:`screenshots/${name}-overlap.png`});
  await page.locator('.collection-panel').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  review.push(await page.evaluate(()=>({width:innerWidth,height:innerHeight,noOverflow:document.documentElement.scrollWidth===innerWidth,imagesLoaded:[...document.images].every(i=>i.complete&&i.naturalWidth>0)})));
  await page.close();
 }
 fs.writeFileSync('screenshots/final-asset-check.json',JSON.stringify(review,null,2));console.log(review);await browser.close();
 if(!review.every(r=>r.noOverflow&&r.imagesLoaded))process.exit(1);
})();
