const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-webgpu','--use-angle=swiftshader','--enable-features=Vulkan','--disable-vulkan-surface']});
const results={};
for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
 const page=await browser.newPage({viewport,deviceScaleFactor:1});const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));
 await page.goto('http://localhost:4173/motionsites-results/modern-agency/',{waitUntil:'networkidle'});
 await page.waitForTimeout(8000);
 results[name]={errors,failed,shader:await page.locator('[data-shader-state]').getAttribute('data-shader-state'),overflow:await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth})),media:await page.evaluate(()=>({images:[...document.images].map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})),videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,readyState:v.readyState,paused:v.paused,width:v.videoWidth,time:v.currentTime,error:v.error?.message}))})),clock:await page.locator('nav').innerText()};
 if(name==='mobile'){
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.waitForTimeout(600);results[name].menuOpen=await page.getByRole('dialog',{name:'Navigation'}).isVisible();await page.screenshot({path:'screenshots/mobile-menu.png'});await page.keyboard.press('Escape');results[name].menuClosed=await page.getByRole('button',{name:'Menu',exact:true}).getAttribute('aria-expanded')==='false';
 }else{
 await page.getByRole('button',{name:'Book a strategy call'}).click();results[name].contactDialog=await page.locator('dialog').isVisible();await page.keyboard.press('Escape');
 }
 await page.getByRole('button',{name:'Start a project',exact:true}).first().click();results[name].projectDialog=await page.locator('dialog').isVisible();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'View Narrativ case study'}).click();results[name].caseDialog=await page.locator('dialog').isVisible();await page.keyboard.press('Escape');
 await page.locator('#projects').scrollIntoViewIfNeeded();await page.waitForTimeout(2000);results[name].media.videos=await page.locator('#projects video').evaluateAll(vs=>vs.map(v=>({readyState:v.readyState,paused:v.paused,width:v.videoWidth,time:v.currentTime,error:v.error?.message})));if(name==='desktop'){await page.getByRole('button',{name:'View Narrativ case study'}).hover();await page.waitForTimeout(400);results[name].hoverWidth=await page.locator('#journal button > span').evaluate(e=>e.getBoundingClientRect().width);await page.mouse.move(0,0);}
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.evaluate(()=>document.activeElement?.blur());if(name==='desktop'){await page.mouse.move(1100,180);await page.mouse.move(650,300,{steps:20});await page.mouse.move(1000,400,{steps:20});}await page.waitForTimeout(300);await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
 results[name].pass=errors.length===0&&failed.length===0&&results[name].overflow.scroll===viewport.width&&results[name].media.images.every(i=>i.loaded)&&results[name].media.videos.every(v=>v.readyState>=2&&!v.paused)&&results[name].caseDialog&&results[name].projectDialog;await page.close();
}
fs.writeFileSync('browser-report.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();if(!Object.values(results).every(r=>r.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
