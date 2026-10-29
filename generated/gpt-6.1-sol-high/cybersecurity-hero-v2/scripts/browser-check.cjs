const {chromium} = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async()=>{
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const report={url:'http://localhost:4173/motionsites-results/cybersecurity-hero-v2/',errors:[],failedRequests:[],checks:[]};
 const page=await browser.newPage();
 page.on('pageerror', e=>report.errors.push(e.message));
 page.on('requestfailed', r=>report.failedRequests.push({url:r.url(),error:r.failure().errorText}));
 page.on('console', m=>{if(m.type()==='error') report.errors.push(m.text());});
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(report.url,{waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1700);
 report.checks.push({name:'Desktop heading',passed:await page.locator('h1').innerText()==='The simple way\nencryption your data'});
 report.checks.push({name:'Desktop overflow',passed:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)});
 report.checks.push({name:'Shader canvas',passed:await page.locator('.shader-bg canvas').count()===1});
 report.checks.push({name:'Inter font loaded',passed:await page.evaluate(()=>document.fonts.check('400 16px Inter'))});
 const beam1=await page.locator('#beam-gradient').getAttribute('x1');
 let beamMoves=false;
 for(let i=0;i<12;i++){await page.waitForTimeout(300);if(await page.locator('#beam-gradient').getAttribute('x1')!==beam1){beamMoves=true;break;}}
 report.checks.push({name:'Beam animates',passed:beamMoves});
 await page.screenshot({path:'screenshots/desktop.png',fullPage:true});
 for(const name of ['Method','Pricing','Docs']){
   await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('button',{name,exact:true}).click();
   report.checks.push({name:name+' opens preview',passed:await page.locator('dialog').isVisible()});
   await page.keyboard.press('Escape');
 }
 for(const name of ['Login','Sign Up','Get Started']){
   await page.getByRole('button',{name,exact:true}).first().click();
   report.checks.push({name:name+' opens preview',passed:await page.locator('dialog').isVisible()});
   await page.getByRole('button',{name:'Back to Xero',exact:true}).click();
 }
 await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(500);
 report.checks.push({name:'Mobile overflow',passed:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)});
 await page.screenshot({path:'screenshots/mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Open menu',exact:true}).click(); await page.waitForTimeout(450);
 report.checks.push({name:'Mobile menu opens',passed:await page.getByRole('button',{name:'Close menu',exact:true}).getAttribute('aria-expanded')==='true'});
 await page.screenshot({path:'screenshots/mobile-menu.png',fullPage:true});
 await page.getByRole('navigation',{name:'Mobile navigation',exact:true}).getByRole('button',{name:'Method',exact:true}).click();
 report.checks.push({name:'Mobile navigation closes menu and opens content',passed:await page.locator('dialog').isVisible() && await page.getByRole('button',{name:'Open menu',exact:true}).count()===1});
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Open menu',exact:true}).click(); await page.keyboard.press('Escape');
 report.checks.push({name:'Escape closes menu',passed:await page.getByRole('button',{name:'Open menu',exact:true}).count()===1});
 await page.emulateMedia({reducedMotion:'reduce'}); await page.reload({waitUntil:'networkidle'});
 report.checks.push({name:'Reduced motion hides animated shader',passed:await page.locator('.shader-bg canvas').evaluate(el=>getComputedStyle(el).visibility==='hidden')});
 for(const width of [320,768,860,1920]){await page.setViewportSize({width,height:1000});report.checks.push({name:'Overflow at '+width,passed:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)});}
 fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));
 await browser.close();
 console.log(JSON.stringify(report,null,2));
 if(report.errors.length || report.checks.some(c=>!c.passed))process.exitCode=1;
})();
