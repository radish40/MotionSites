const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const results={};
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',820,1180]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));
 await page.goto('http://127.0.0.1:4173/motionsites-results/wellness-balance/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2300);
 const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),fonts:document.fonts.check('400 16px "DM Sans"')&&document.fonts.check('400 16px Inter')}));
 if(name!=='tablet')await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
 let initial=await page.locator('.dots button[aria-pressed="true"]').getAttribute('aria-label');await page.waitForTimeout(3600);let rotated=await page.locator('.dots button[aria-pressed="true"]').getAttribute('aria-label');
 await page.getByRole('button',{name:'Show benefit 3',exact:true}).click();const manual=await page.getByRole('button',{name:'Show benefit 3',exact:true}).getAttribute('aria-pressed');
 let menuCheck=null;if(name==='mobile'){await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('dialog').waitFor();await page.getByRole('dialog').getByText('About',{exact:true}).click();menuCheck=await page.getByRole('dialog').count()===0;}
 await page.getByRole('link',{name:'Explore Now',exact:true}).click();await page.waitForTimeout(700);
 results[name]={layout,errors,failed,carouselRotates:initial!==rotated,manualCarousel:manual==='true',mobileMenu:menuCheck,exploreTargetVisible:await page.locator(width>=1024?'#formula':'#products').evaluate(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0}), menuToggleVisible:await page.getByRole('button',{name:'Open menu',exact:true}).isVisible()};await page.close();
}
fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();if(Object.values(results).some(r=>r.errors.length||r.failed.length||r.layout.width!==r.layout.scrollWidth||!r.layout.fonts||r.layout.images.some(i=>!i.loaded)||!r.carouselRotates||!r.manualCarousel||r.mobileMenu===false||!r.exploreTargetVisible))process.exitCode=1;})();
