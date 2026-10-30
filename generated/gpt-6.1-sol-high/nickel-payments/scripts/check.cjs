const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const report={};
for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
 const page=await browser.newPage({viewport,deviceScaleFactor:1});const errors=[];const failures=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()})});
 await page.goto('http://localhost:4173/motionsites-results/nickel-payments/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(2000);
 report[name]=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:document.querySelector('h1').textContent,font:document.fonts.check('500 20px Inter'),video:{readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,time:document.querySelector('video').currentTime,visible:getComputedStyle(document.querySelector('video').parentElement).display!=='none'}}));
 if(report[name].scrollWidth>viewport.width)throw new Error(name+' horizontal overflow');
 await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Get started',exact:true}).first().click();await page.getByLabel('Work email').fill('review@example.com');await page.getByRole('button',{name:'Continue with email'}).click();await page.getByRole('status').waitFor();await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'Talk to a human',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
 if(name==='desktop'){
 await page.getByRole('button',{name:'Products',exact:true}).click();await page.getByRole('menuitem',{name:'Extend net terms'}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Company',exact:true}).click();await page.getByRole('menuitem',{name:'Talk to a human'}).click();await page.keyboard.press('Escape');
 for(const title of ['Pricing','For Accountants','Log in']){await page.getByRole('link',{name:title,exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');}
 }else{
 await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Pricing',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Close menu'}).click();
 }
 report[name].interactions='passed';report[name].errors=errors;report[name].failedResponses=failures;
 if(errors.length||failures.length)throw new Error(JSON.stringify(report[name]));await page.close();
}
fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
