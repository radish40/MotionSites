import { chromium } from '/app/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const report = { viewports: [], errors: [], consoleErrors: [], httpErrors: [], failedRequests: [], interactions: [] };
try {
 for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror',error=>report.errors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error') report.consoleErrors.push({text:message.text(),location:message.location()});});
  page.on('response',response=>{if(response.status()>=400) report.httpErrors.push({url:response.url(),status:response.status()});});
  page.on('requestfailed',request=>report.failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
  await page.goto('http://localhost:4173/motionsites-results/conversion/', {waitUntil:'networkidle',timeout:60000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(2000);
  const metrics = await page.evaluate(async()=>{
   const video=document.querySelector('video');
   const time=video.currentTime; await new Promise(resolve=>setTimeout(resolve,400));
   const h=document.querySelector('h1'); const r=h.getBoundingClientRect();
   return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,headingBounds:{left:r.left,right:r.right},headingFont:getComputedStyle(h).fontFamily,fontsLoaded:[['Qanelas-Heavy','900'],['Inter','400'],['Inter','500'],['Inter','600'],['Inter','700']].every(([family,weight])=>[...document.fonts].some(f=>f.family===family&&f.weight===weight&&f.status==='loaded')),loadedFonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,weight:f.weight})),video:{readyState:video.readyState,playing:!video.paused&&video.currentTime>time,width:video.videoWidth,height:video.videoHeight,muted:video.muted,loop:video.loop},qrLoaded:document.querySelector('img').naturalWidth>0};
  });
  report.viewports.push({name,...metrics});
  if(metrics.scrollWidth>width||metrics.scrollHeight>height||metrics.headingBounds.left<0||metrics.headingBounds.right>width) throw new Error(name+' layout overflow');
  if(!metrics.video.playing||!metrics.qrLoaded||!metrics.fontsLoaded) throw new Error(name+' asset not ready');
  // Pin the video to the same real frame for reproducible screenshots.
  await page.evaluate(async()=>{const v=document.querySelector('video'); v.pause(); v.currentTime=2; await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));});
  await page.screenshot({path:`screenshots/${name}.png`});
  if(name==='mobile') {
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.waitForTimeout(600);
   await page.getByRole('navigation',{name:'Mobile navigation'}).waitFor({state:'visible'});
   await page.screenshot({path:'screenshots/mobile-menu.png'});
   await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Docs',exact:true}).click();
   await page.waitForTimeout(350);
   if(await page.locator('#mobile-menu').count()) throw new Error('Menu did not unmount');
   if(!page.url().endsWith('#docs')) throw new Error('Docs anchor failed');
   await page.getByRole('button',{name:'Open menu'}).click(); await page.waitForTimeout(400);
   await page.keyboard.press('Escape'); await page.waitForTimeout(350);
   if(await page.locator('#mobile-menu').count()) throw new Error('Escape did not close menu');
   await page.getByRole('button',{name:'Open menu'}).click(); await page.waitForTimeout(400);
   await page.getByRole('button',{name:'Close menu'}).click(); await page.waitForTimeout(350);
   if(await page.locator('#mobile-menu').count()) throw new Error('Toggle did not close menu');
   report.interactions.push('Mobile toggle, link navigation, animated unmount, Escape and focus return passed');
  } else {
   for(const [label,hash] of [['Overview','#overview'],['Docs','#docs'],['Our Team','#team'],['Upgrade','#upgrade']]) {await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:label,exact:true}).click(); if(!page.url().endsWith(hash)) throw new Error(label+' anchor failed');}
   await page.getByRole('link',{name:'Get It Today'}).click();
   if(!page.url().endsWith('#try-now')) throw new Error('CTA failed');
   report.interactions.push('Desktop navigation anchors and Get It Today QR anchor passed');
  }
  await page.close();
 }
 if(report.errors.length||report.consoleErrors.length||report.httpErrors.length) throw new Error('Browser errors');
 report.status='passed';
} catch(error) { report.status='failed'; report.failure=String(error); process.exitCode=1; }
finally {fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2)+'\n'); console.log(JSON.stringify(report,null,2)); await browser.close();}
