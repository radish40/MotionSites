const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'], {stdio:'ignore'});
const url='http://127.0.0.1:4173/motionsites-results/cargox-mobile/';
(async()=>{
 let browser;
 try {
  for(let i=0;i<60;i++){try{if((await fetch(url)).ok)break}catch{} await new Promise(r=>setTimeout(r,250))}
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const errors=[],failedRequests=[];
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto(url,{waitUntil:'networkidle'});
  await page.locator('.hero-content').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(2200);
  const desktop=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,phones:[...document.querySelectorAll('.iphone-frame')].map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),video:{ready:document.querySelector('video').readyState,paused:document.querySelector('video').paused},images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),font:[...document.fonts].some(f=>f.family.replaceAll('"','')==='Barlow Condensed' && f.status==='loaded')}));
  console.log(JSON.stringify({desktop,fontFaces:await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status}))),failedRequests}));await page.screenshot({path:"screenshots/desktop.png",fullPage:true});assert.equal(desktop.width,desktop.scrollWidth);assert(desktop.images);assert(desktop.font);assert(desktop.video.ready>=3);assert(!desktop.video.paused);
  await page.screenshot({path:'screenshots/desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  await page.getByRole('button',{name:'Services',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Close menu',exact:true}).getAttribute('aria-expanded'),'true');
  await page.getByRole('button',{name:'Close menu',exact:true}).click();
  await page.waitForTimeout(350);assert.equal(await page.locator('#mobile-menu').count(),0);
  await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('button',{name:'Company',exact:true}).click();await page.waitForTimeout(400);assert.equal(await page.locator('#mobile-menu').count(),0);
  await page.getByRole('button',{name:'Get in touch',exact:true}).click();await page.waitForTimeout(800);assert.equal(await page.getByRole('textbox',{name:'First Name',exact:true}).evaluate(e=>e===document.activeElement),true);
  await page.getByRole('button',{name:'Send',exact:true}).click();assert.equal(await page.getByRole('status').count(),0);
  await page.getByRole('textbox',{name:'First Name',exact:true}).fill('Alex');await page.getByRole('textbox',{name:'Last Name',exact:true}).fill('Morgan');await page.getByRole('textbox',{name:'E-mail',exact:true}).fill('alex@example.com');await page.getByRole('button',{name:'Send',exact:true}).click();await page.getByRole('status').waitFor();
  await page.locator('[data-screen="Contact"]').evaluate(e=>e.scrollTop=100);await page.getByRole('button',{name:'Scroll to top'}).click();await page.waitForTimeout(600);assert.equal(await page.locator('[data-screen="Contact"]').evaluate(e=>e.scrollTop),0);
  await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});await page.locator('.hero-content').waitFor();
  for(const phone of await page.locator('.phone-mockup').all()){await phone.scrollIntoViewIfNeeded();await page.waitForTimeout(1400)}
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);
  const mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,zoom:document.querySelector('.phone-mockup').style.zoom,phones:[...document.querySelectorAll('.iphone-frame')].map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))}));
  assert.equal(mobile.width,mobile.scrollWidth);assert(mobile.phones[1].y>mobile.phones[0].y+mobile.phones[0].height);assert(mobile.phones.every(p=>p.x>=19&&p.x+p.width<=371));
  await page.screenshot({path:'screenshots/mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Get in touch',exact:true}).click();await page.waitForTimeout(1000);assert(await page.getByRole('textbox',{name:'First Name',exact:true}).isVisible());
  await page.setViewportSize({width:1024,height:900});await page.waitForTimeout(400);const medium=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));assert.equal(medium.width,medium.scrollWidth);
  assert.equal(errors.length,0);
  fs.writeFileSync('screenshots/checks.json',JSON.stringify({desktop,mobile,medium,interactions:['menu open/close','menu navigation','CTA focus and navigation','required form validation','local form confirmation','scroll to top','mobile CTA navigation'],scriptErrors:errors,failedRequests},null,2));
  console.log(JSON.stringify({status:'passed',desktop,mobile,medium,errors,failedRequests},null,2));
 }finally{await browser?.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
