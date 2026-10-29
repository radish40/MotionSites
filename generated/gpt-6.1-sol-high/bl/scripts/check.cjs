const {chromium}=require('/app/node_modules/playwright-core');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'pipe'});
 await new Promise(r=>server.stdout.once('data',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const results=[];
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failed=[],canceledMediaRequests=[];
  page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+': HTTP '+r.status());});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('requestfailed',r=>{const issue=r.url()+': '+r.failure().errorText; if(r.failure().errorText==='net::ERR_ABORTED' && r.url().endsWith('.mp4'))canceledMediaRequests.push(issue);else failed.push(issue);});
  await page.goto('http://localhost:4173/motionsites-results/bl/',{waitUntil:'networkidle'});
  await page.waitForSelector('#loadingScreen.hidden');
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1200);
  const media=await page.locator('video').evaluateAll(v=>v.map(x=>({id:x.id,readyState:x.readyState,width:x.videoWidth,height:x.videoHeight,duration:x.duration})));
  assert(media.every(v=>v.readyState>=2 && v.width>0));
  const initialPixels=await page.locator('canvas').evaluate(c=>{const d=c.getContext('2d').getImageData(c.width/2,c.height/2,1,1).data;return Array.from(d);});
  assert(initialPixels[3]>0,'initial video canvas is drawn');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:`screenshots/${name}.png`});
  if(name==='mobile'){
   await page.click('#hamburgerBtn');
   await page.waitForTimeout(350);
   assert.equal(await page.locator('#hamburgerBtn').getAttribute('aria-expanded'),'true');
   await page.screenshot({path:'screenshots/mobile-menu.png'});
   await page.click('#hamburgerBtn');
   await page.click('#hamburgerBtn');
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#hamburgerBtn').getAttribute('aria-expanded'),'false');
  }
  await page.click('#ctaBtn');await page.waitForTimeout(1800);
  assert(Math.abs(await page.evaluate(()=>scrollY)-height*.9)<3);
  async function stage(progress){await page.evaluate(p=>scrollTo(0,p*(document.documentElement.scrollHeight-innerHeight)),progress);await page.waitForTimeout(1800);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
  await stage(.325);
  for(const id of ['fCard1','fCard2','fCard3'])await page.waitForFunction(id=>Number(getComputedStyle(document.getElementById(id)).opacity)>.98,id,{timeout:20000});
  if(name==='mobile'){
   await page.locator('#featuresContainer').evaluate(e=>e.scrollTop=e.scrollHeight);
   assert(await page.locator('#fCard3').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight));
  }
  await page.screenshot({path:`screenshots/${name}-features.png`});
  for(const [progress,id] of [[.53,'mPara1'],[.70,'mPara2'],[.87,'mPara3']]){
   await stage(progress);await page.waitForFunction(id=>Number(getComputedStyle(document.getElementById(id)).opacity)>.98,id,{timeout:20000});
  }
  await page.screenshot({path:`screenshots/${name}-mission.png`});
  await stage(0);
  if(name==='mobile'){await page.click('#hamburgerBtn');await page.locator('.mobile-link[href="#contact"]').click();}
  else await page.locator('.premium-nav-link[href="#contact"]').click();
  await page.waitForTimeout(2200);
  await page.waitForFunction(()=>Number(getComputedStyle(document.getElementById('feedbackForm')).opacity)>.98,null,{timeout:20000});
  await page.locator('#fbBtn').click();assert.equal(await page.locator('#fbBtn').textContent(),'CONNECT');
  await page.locator('#fbEmail').fill('bloom@example.com');await page.locator('#fbBtn').click();
  assert.equal(await page.locator('#fbBtn').textContent(),'SUBMITTED');assert(await page.locator('#fbBtn').isDisabled());
  assert(await page.locator('#fbSuccess').isVisible());
  await page.screenshot({path:`screenshots/${name}-contact.png`});
  await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(1800);
  await page.waitForFunction(()=>Number(getComputedStyle(document.getElementById('feedbackForm')).opacity)>.98,null,{timeout:20000});
  assert.deepEqual(await page.locator('video').evaluateAll(v=>v.map(x=>x.error)),[null,null,null]);
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  results.push({viewport:`${width}x${height}`,status:'passed',media,initialPixels,script_errors:errors,request_failures:failed,canceled_media_requests:canceledMediaRequests,checks:['initial canvas frame','fonts loaded','no horizontal overflow at all stages','CTA scroll','all feature cards','three mission stages','contact navigation','required email validation','successful form state','contact deep link',...(name==='mobile'?['menu open/close','Escape dismissal','last feature card reachable']:[])]});
  console.log(name+' checks passed');
  fs.writeFileSync('browser-checks.json',JSON.stringify(results,null,2));
  await page.close();
 }
 fs.writeFileSync('browser-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
