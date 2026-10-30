const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('assert');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const report = {viewports:[],interactions:[],errors:[],failedRequests:[]};
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page = await context.newPage();
  page.on('pageerror',error => report.errors.push(error.message));
  page.on('response',response => {if(response.status()>=400)report.failedRequests.push({url:response.url(),status:response.status()});});
  await page.goto('http://localhost:4173/motionsites-results/transform-data/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=3 && v.currentTime>0 && Number(v.style.opacity)>.99});
  // Capture a consistent original-video frame, while leaving the live looping behavior intact.
  await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();v.currentTime=3;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  const geometry = await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,fonts:document.fonts.size,video:{width:document.querySelector('video').getBoundingClientRect().width,height:document.querySelector('video').getBoundingClientRect().height,duration:document.querySelector('video').duration},composer:JSON.parse(JSON.stringify(document.querySelector('.composer').getBoundingClientRect()))}));
  assert(geometry.scrollWidth<=width,`${name} horizontal overflow`);
  assert.equal(geometry.fonts,16);
  report.viewports.push({name,width,height,...geometry});
  await page.locator('.submit').click(); await page.getByRole('status').filter({hasText:'Start with'}).waitFor();
  await page.locator('#question').fill('Find trends in my data');
  assert.equal(await page.locator('#character-count').textContent(),'22');
  await page.locator('#prompts').click(); await page.getByRole('button',{name:'Summarize the key insights in my data',exact:true}).click();
  assert.equal(await page.locator('#question').inputValue(),'Summarize the key insights in my data');
  await page.locator('.submit').click(); assert((await page.locator('.feedback').textContent()).includes('not connected'));
  await page.locator('#file-upload').setInputFiles({name:'sample.csv',mimeType:'text/csv',buffer:Buffer.from('month,revenue\nJanuary,100')});
  assert((await page.locator('.feedback').textContent()).includes('sample.csv'));
  await page.locator('#question').fill('x'.repeat(3000));assert.equal(await page.locator('#character-count').textContent(),'3,000');
  if(name==='mobile')await page.locator('.mobile-toggle').click();
  await page.locator('.nav-feature').click(); assert(await page.locator('#features-menu').isVisible());
  await page.keyboard.press('Escape');assert(!(await page.locator('#features-menu').isVisible()));
  await page.getByRole('button',{name:'Log In',exact:true}).click();await page.locator('dialog[open]').waitFor();
  await page.getByRole('button',{name:'Got it'}).click();assert(!(await page.locator('dialog').isVisible()));
  await page.locator('.upgrade').click(); await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');
  // Use browser's unsupported voice branch to verify clear fallback without requiring hardware.
  await page.evaluate(()=>{window.SpeechRecognition=undefined;window.webkitSpeechRecognition=undefined;});
  await page.locator('#voice').click();assert((await page.locator('.feedback').textContent()).includes('not supported'));
  report.interactions.push({viewport:name,passed:['empty submission','character counter','prompt selection','submission feedback','file attachment','3000 character limit','Features dropdown','Escape dismissal','login dialog','upgrade dialog','voice fallback']});
  if(name==='desktop') {
   const fade = await page.evaluate(async()=>{
    const v=document.querySelector('video');
    v.currentTime=v.duration-.6;
    await new Promise(r=>v.addEventListener('seeked',r,{once:true}));
    const samples=[];const start=performance.now();
    await v.play();
    while(performance.now()-start<1800){samples.push({t:v.currentTime,opacity:Number(v.style.opacity)});await new Promise(r=>setTimeout(r,30));}
    return {duration:v.duration,samples};
   });
   assert(fade.samples.some(s=>s.opacity<.05),'fade out reached zero');
   assert(fade.samples.some(s=>s.t<1 && s.opacity>.95),'loop restarted and faded in');
   assert(fade.samples.some(s=>s.opacity>0 && s.opacity<1),'intermediate fade values');
   report.videoFade=fade;
  }
  await context.close();
 }
 assert.equal(report.errors.length,0);assert.equal(report.failedRequests.length,0);
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));
 await browser.close();console.log(JSON.stringify({status:'passed',viewports:report.viewports,interactions:report.interactions,errors:report.errors,failedRequests:report.failedRequests},null,2));
})().catch(error=>{console.error(error);process.exit(1)});
