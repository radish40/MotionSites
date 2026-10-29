const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox'],headless:true});
 const report=[];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  const responses=[];page.on('response',r=>{if(r.status()>=400)responses.push({url:r.url(),status:r.status()})});
  await page.goto('http://localhost:4173/motionsites-results/golden-portal/',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await Promise.all([300,400,500,600].map(w=>document.fonts.load(`${w} 16px Inter`)));await document.fonts.ready;});await page.waitForTimeout(1600);
  const media=await page.evaluate(()=>{const v=document.querySelector('video');return {readyState:v.readyState,paused:v.paused,width:v.videoWidth,currentTime:v.currentTime,arsenica:document.fonts.check('16px "Arsenica Trial Light"'),inter:document.fonts.check('16px Inter')};});
  assert(media.readyState>=2,'video decodes');assert(!media.paused,'video autoplays');
  await page.screenshot({path:`screenshots/${name}.png`});
  await page.getByRole('link',{name:'Enter Gallery',exact:true}).click();await page.waitForTimeout(1800);assert.equal(new URL(page.url()).hash,'#gallery');assert(await page.getByRole('heading',{name:'Still Frame',exact:true}).isVisible());
  await page.getByRole('link',{name:'View Their Archive',exact:true}).click();await page.waitForTimeout(2000);assert.equal(new URL(page.url()).hash,'#journal');assert.equal(await page.locator('article').count(),6);
  for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=height*0.7){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(100);}
  await page.waitForTimeout(1300);
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,unrevealed:document.querySelectorAll('.reveal:not(.revealed),.reveal-scale:not(.revealed)').length,brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)}));
  assert(layout.scrollWidth<=width,'no horizontal overflow');assert.equal(layout.unrevealed,0,'all scroll reveals run');assert.equal(layout.brokenImages.length,0,'images decode');
  await page.screenshot({path:`screenshots/${name}-full.png`,fullPage:true});
  await page.getByRole('link',{name:'Story',exact:true}).click();await page.waitForTimeout(1300);assert.equal(new URL(page.url()).hash,'#story');
  await page.getByRole('link',{name:'Talents',exact:true}).click();await page.waitForTimeout(1300);assert.equal(new URL(page.url()).hash,'#talents');
  await page.getByRole('link',{name:'Journal',exact:true}).click();await page.waitForTimeout(1000);assert.equal(new URL(page.url()).hash,'#journal');
  if(name==='desktop'){await page.getByRole('button',{name:'Privacy Notice',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);await page.getByRole('button',{name:'Terms & Policies',exact:true}).click();await page.getByRole('button',{name:'Close notice'}).click();assert.equal(await page.getByRole('dialog').count(),0);}
  await page.getByRole('link',{name:'Digital Archive home',exact:true}).click();await page.waitForTimeout(1000);
  assert.equal(errors.length,0,'no JavaScript errors');
  report.push({viewport:name,width,height,media,layout,scriptErrors:errors,failedRequests:failed,httpErrors:responses,interactions:'passed: gallery CTA, archive CTA, all navigation anchors, home'+(name==='desktop'?', privacy and terms dialogs, Escape and close':''),screenshots:[`screenshots/${name}.png`,`screenshots/${name}-full.png`]});
  await page.close();
 }
 fs.writeFileSync('browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
