const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const report={};
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
 const page=await context.newPage();const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
 await page.goto('http://localhost:4173/motionsites-results/3d-jack-portfolio-hero/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1600);
 await page.screenshot({path:`/work/screenshots/${name}.png`});console.log(name+' hero captured');
 const hero=await page.locator('h1').textContent(); const font=await page.evaluate(()=>document.fonts.check('900 24px Kanit'));
 const magnetBefore=await page.locator('[data-magnet]').getAttribute('style');
 if(name==='desktop'){await page.mouse.move(800,650);await page.waitForTimeout(400)}
 const magnetAfter=await page.locator('[data-magnet]').getAttribute('style');
 const scrollChecks=[]; const navChecks=[];
 await page.getByRole('link',{name:'About',exact:true}).click();await page.waitForTimeout(1400);
 const aboutNavigation=await page.evaluate(()=>({hash:location.hash,top:document.querySelector('#about').getBoundingClientRect().top}));
 await page.screenshot({path:`/work/screenshots/${name}-about.png`});
 for(const [label,hash] of [['Price','#services'],['Projects','#projects']]){await page.getByRole('link',{name:label,exact:true}).click();await page.waitForTimeout(1100);navChecks.push({label,expected:hash,actual:await page.evaluate(()=>location.hash)})}
 await page.locator('.marquee').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
 const rowBefore=await page.locator('.marquee-row').evaluateAll(els=>els.map(el=>getComputedStyle(el).transform));
 await page.evaluate(()=>window.scrollBy(0,100));await page.waitForTimeout(400);
 const rowAfter=await page.locator('.marquee-row').evaluateAll(els=>els.map(el=>getComputedStyle(el).transform));
 for(const section of ['.marquee','#about','#services','#projects']){
  await page.locator(section).scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
  scrollChecks.push(await page.evaluate((section)=>({section,scrollY,overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.querySelectorAll(`${section} img`)].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}),section));
  if(section==='#services'||section==='#projects')await page.screenshot({path:`/work/screenshots/${name}-${section.slice(1)}.png`});
 }
 const before=await page.locator('.project-card').first().evaluate(el=>({top:el.getBoundingClientRect().top,transform:getComputedStyle(el).transform}));
 await page.evaluate(()=>window.scrollBy(0,550));await page.waitForTimeout(700);
 const after=await page.locator('.project-card').first().evaluate(el=>({top:el.getBoundingClientRect().top,transform:getComputedStyle(el).transform}));
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.querySelector('.project-slot').getBoundingClientRect().top+scrollY-160)});await page.waitForTimeout(600);
 const firstLink=page.getByRole('link',{name:'Live Project — Nextlevel Studio artwork preview'});
 const [popup]=await Promise.all([page.waitForEvent('popup'),firstLink.click()]);await popup.waitForLoadState();const previewStatus=await popup.locator('img').count();await popup.close();
 const previewResponses=await Promise.all([28,31,34].map(async i=>{const assets=JSON.parse(fs.readFileSync('/work/src/assets.json'));const r=await page.request.get('http://localhost:4173/motionsites-results/3d-jack-portfolio-hero/'+assets[i]);return {asset:i,status:r.status()}}));
 const contact=await page.locator('.contact-button').first().getAttribute('href');
 report[name]={viewport:{width,height},title:await page.title(),hero,font,aboutNavigation,navChecks,marquee:{before:rowBefore,after:rowAfter},magnetMoved:name==='desktop'?magnetBefore!==magnetAfter:'touch disabled',contact,liveProjectPreviewOpened:previewStatus>0,previewResponses,scrollChecks,stacking:{before,after},errors,failedRequests:failed};
 await context.close();
}
fs.writeFileSync('/work/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
