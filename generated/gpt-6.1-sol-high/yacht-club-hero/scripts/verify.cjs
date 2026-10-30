const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
const crypto=require('crypto');
const base='http://localhost:5173/motionsites-results/yacht-club-hero/';
const original='https://player.vimeo.com/video/1184061018?background=1&autoplay=1&loop=1&byline=0&title=0';
const ships=['ocean-eclipse.mp4','black-sovereign.mp4','azure-horizon.mp4'];
const report={checks:[],defaultModes:[],originalModes:[],assetHashes:{}};
const save=()=>fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2)+'\n');
const check=(name,passed,data)=>{report.checks.push({name,passed:!!passed,...(data===undefined?{}:{data})});save();console.log(name,!!passed);if(!passed)throw Error(name+': '+JSON.stringify(data));};
async function clock(page,selector,label){
 const v=page.locator(selector);await v.waitFor();await page.waitForFunction(s=>{const v=document.querySelector(s);return v?.readyState>=2&&!v.paused&&!v.error;},selector);
 const before=await v.evaluate(v=>v.currentTime);await page.waitForTimeout(750);const after=await v.evaluate(v=>v.currentTime);
 check(label,Math.abs(after-before)>.05,{before,after,src:await v.getAttribute('src')});
}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 for(const mobile of [false,true]){
  const label=mobile?'mobile':'desktop';
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const evidence={mode:label,requests:[],thirdPartyRequests:[],pageErrors:[],consoleErrors:[],securityLog:[],cspViolations:[],failedRequests:[]};report.defaultModes.push(evidence);
  await page.addInitScript(()=>{window.__cspViolations=[];addEventListener('securitypolicyviolation',e=>window.__cspViolations.push({blockedURI:e.blockedURI,directive:e.violatedDirective}));});
  page.on('request',r=>{evidence.requests.push(r.url());if(/vimeo|cloudflare|challenges\./i.test(r.url()))evidence.thirdPartyRequests.push(r.url());});
  page.on('pageerror',e=>evidence.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')evidence.consoleErrors.push({text:m.text(),location:m.location()});});
  page.on('requestfailed',r=>evidence.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  const cdp=await page.context().newCDPSession(page);await cdp.send('Log.enable');cdp.on('Log.entryAdded',({entry})=>{if(entry.source==='security')evidence.securityLog.push(entry);});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.fonts.check('16px "Instrument Serif"')&&getComputedStyle(document.querySelector('h1>span:last-child')).opacity==='1');
  check(`${label}: default has no iframe`,await page.locator('iframe').count()===0);
  check(`${label}: no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  check(`${label}: 80 ripple nodes`,await page.locator('.ripple').count()===80);
  await clock(page,'.background-fallback',`${label}: fallback clock advances`);
  await page.screenshot({path:`screenshots/${label}.png`,fullPage:true});
  if(!mobile){await page.mouse.move(700,400);await page.mouse.move(900,500,{steps:6});check('desktop: cursor ripples activate',await page.locator('.ripple').evaluateAll(ns=>ns.some(n=>Number(n.style.opacity)>0)));}
  await page.locator('.join-button').click();await page.waitForTimeout(1600);
  check(`${label}: join opens GSAP menu`,await page.locator('.menu-toggle').getAttribute('aria-expanded')==='true');
  check(`${label}: menu six items`,await page.locator('.menu-item').count()===6);
  await page.screenshot({path:`screenshots/${label}-menu.png`});
  await page.getByRole('button',{name:'Our Fleet',exact:false}).click();await page.waitForTimeout(2200);
  check(`${label}: fleet opens`,await page.locator('.fleet-overlay').isVisible());
  if(mobile)check('mobile: fleet scrolls without horizontal overflow',await page.locator('.fleet-overlay').evaluate(e=>e.scrollHeight>e.clientHeight&&e.scrollWidth===e.clientWidth));
  for(let i=0;i<ships.length;i++){
   const card=page.locator('.fleet-video').nth(i);
   if(mobile){await card.locator('.mobile-view').scrollIntoViewIfNeeded();await card.locator('.mobile-view').tap();}
   else{
    await card.hover();await page.waitForTimeout(800);
    check(`desktop: ${ships[i]} hover specs`,await card.locator('.fleet-content').isVisible());
    await clock(page,`.fleet-video:nth-of-type(${i+1}) video`,`desktop: ${ships[i]} hover clock advances`);
    if(i===0)await page.screenshot({path:'screenshots/desktop-fleet.png'});
    await card.locator('.view-button').click();
   }
   await page.getByRole('dialog').waitFor();
   check(`${label}: ${ships[i]} detail exact asset`,await page.locator('.vessel-detail video').getAttribute('src')===`/motionsites-results/yacht-club-hero/assets/${ships[i]}`);
   await clock(page,'.vessel-detail video',`${label}: ${ships[i]} detail clock advances`);
   await page.screenshot({path:`screenshots/${label}-detail-${i+1}.png`});
   if(mobile)await page.locator('.vessel-detail .back-button').tap();else await page.keyboard.press('Escape');
   await page.getByRole('dialog').waitFor({state:'detached'});
   check(`${label}: ${ships[i]} detail closes`,await page.getByRole('dialog').count()===0);
  }
  if(mobile){await page.locator('.fleet-overlay').evaluate(e=>e.scrollTo(0,0));await page.waitForTimeout(400);await page.screenshot({path:'screenshots/mobile-fleet.png'});}
  await page.locator('.fleet-overlay>.back-button').click();await page.waitForTimeout(1700);
  check(`${label}: back returns hero`,await page.locator('h1').isVisible());
  await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(1200);await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false');check(`${label}: escape closes menu`,true);
  evidence.cspViolations=await page.evaluate(()=>window.__cspViolations);
  check(`${label}: zero Vimeo/Cloudflare requests`,evidence.thirdPartyRequests.length===0,evidence.thirdPartyRequests);
  check(`${label}: no CSP violations`,evidence.cspViolations.length===0&&evidence.securityLog.length===0,{events:evidence.cspViolations,securityLog:evidence.securityLog});
  check(`${label}: no page or console errors`,evidence.pageErrors.length===0&&evidence.consoleErrors.length===0,{pageErrors:evidence.pageErrors,consoleErrors:evidence.consoleErrors});
  await page.close();
 }
 for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});
  const evidence={mode:mobile?'mobile':'desktop',requests:[],pageErrors:[],consoleErrors:[],playbackClaimed:false};report.originalModes.push(evidence);
  page.on('request',r=>evidence.requests.push(r.url()));page.on('pageerror',e=>evidence.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')evidence.consoleErrors.push({text:m.text(),location:m.location()});});
  await page.goto(base+'?media=original',{waitUntil:'domcontentloaded'});await page.locator('.vimeo-background').waitFor({state:'attached'});
  evidence.iframeSrc=await page.locator('.vimeo-background').getAttribute('src');check(`${evidence.mode}: original opt-in preserves EXACT URL`,evidence.iframeSrc===original,evidence.iframeSrc);
  await page.waitForTimeout(1000);check(`${evidence.mode}: opt-in attempts original iframe request`,evidence.requests.includes(original));
  // Verify the retained event handler only with a synthetic message, not a claim of real video playback.
  await page.evaluate(()=>window.dispatchEvent(new MessageEvent('message',{origin:'https://player.vimeo.com',data:{event:'timeupdate'}})));
  await page.waitForFunction(()=>document.querySelector('.vimeo-background').style.visibility==='visible');check(`${evidence.mode}: retained Vimeo event behavior (synthetic)`,true);
  await page.close();
 }
 const before=JSON.parse(fs.readFileSync('diagnostics/fleet-sha256-before-repair.json','utf8'));
 for(const file of ships){const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');report.assetHashes[file]={before:before[file],source:hash('public/assets/'+file),built:hash('dist/assets/'+file)};check(`${file}: exact local asset unchanged`,report.assetHashes[file].source===before[file]&&report.assetHashes[file].built===before[file],report.assetHashes[file]);}
 report.completed=true;save();console.log('All checks passed:',report.checks.length);
 }finally{await browser.close();}
})().catch(e=>{report.failure=String(e);save();console.error(e);process.exit(1)});
