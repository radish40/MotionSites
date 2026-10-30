const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');
const http = require('http');
const base='/motionsites-results/community-superdesign-exploded-view-assembly/';
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(req.url.split('?')[0]);
 if(!pathname.startsWith(base)){res.writeHead(404);return res.end();}
 const local=pathname.slice(base.length)||'index.html';
 const file=path.join('/work/dist',local);
 if(!fs.existsSync(file)){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={errors:[],failedRequests:[],checks:[]};
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 page.on('pageerror',e=>results.errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)results.failedRequests.push(`${r.status()} ${r.url()}`)});
 await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'/work/screenshots/desktop.png'});
 const check=async(name,fn)=>{try{await fn();results.checks.push({name,passed:true});}catch(e){results.checks.push({name,passed:false,error:e.message});}};
 const assert=(condition,msg)=>{if(!condition)throw Error(msg)};
 await check('Desktop viewport and no horizontal overflow',async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Horizontal overflow'));
 await check('Local fonts loaded',async()=>assert(await page.evaluate(()=>document.fonts.check('500 16px "Space Grotesk"')&&document.fonts.check('400 16px "DM Sans"')),'Fonts not loaded'));
 await check('Preset pads update sound display',async()=>{await page.getByRole('button',{name:'Select Soft Focus preset'}).click();assert(await page.locator('.preset-name').textContent()==='SOFT FOCUS','Preset did not change');});
 await check('Texture dial updates value',async()=>{await page.getByRole('button',{name:'Adjust texture',exact:true}).click();assert(await page.locator('.texture-value').textContent()==='76%','Texture unchanged')});
 await check('Power disables and restores pads',async()=>{await page.getByRole('button',{name:'Turn sound engine off'}).click();assert(await page.locator('.pad').first().isDisabled(),'Pad not disabled');await page.getByRole('button',{name:'Turn sound engine on'}).click();assert(await page.locator('.pad').first().isEnabled(),'Pad not restored');});
 await check('Chapter navigation explodes components',async()=>{await page.locator('[data-chapter="1"]').click();await page.waitForTimeout(1400);assert(await page.locator('.chapter').nth(1).getAttribute('aria-current')==='step','Chapter not active');assert(Number(await page.locator('.exploded-copy').evaluate(el=>getComputedStyle(el).opacity))>.9,'Exploded heading hidden');await page.screenshot({path:'/work/screenshots/desktop-exploded.png'});});
 await check('Final layout reassembles in a different configuration',async()=>{await page.locator('[data-chapter="2"]').click();await page.waitForTimeout(1400);assert(Number(await page.locator('.chassis').evaluate(el=>parseFloat(el.style.width)))>895,'Chassis not expanded');assert(Number(await page.locator('.final-copy').evaluate(el=>getComputedStyle(el).opacity))>.9,'Final heading hidden');await page.screenshot({path:'/work/screenshots/desktop-assembled.png'});});
 await page.locator('#possibilities').scrollIntoViewIfNeeded();await page.screenshot({path:'/work/screenshots/desktop-possibilities.png'});
 await check('Details accordion opens',async()=>{await page.locator('#details').scrollIntoViewIfNeeded();await page.locator('.spec-list details').nth(1).locator('summary').click();assert(await page.locator('.spec-list details').nth(1).getAttribute('open')!==null,'Accordion did not open');await page.screenshot({path:'/work/screenshots/desktop-details.png'});});
 await check('Replay returns to first chapter',async()=>{await page.locator('.replay').click();await page.waitForTimeout(1500);assert(await page.evaluate(()=>scrollY)<5,'Replay did not return to start')});
 await page.getByRole('button',{name:'Select Mellow Waves preset'}).click();await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(400);await page.screenshot({path:'/work/screenshots/mobile.png'});
 await check('Mobile viewport and no horizontal overflow',async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Mobile overflow'));
 await check('Mobile navigation opens and follows link',async()=>{await page.getByRole('button',{name:'Open navigation'}).click();assert(await page.locator('.navigation').isVisible(),'Nav not visible');await page.locator('.navigation').getByText('Inside MONO',{exact:true}).click();await page.waitForTimeout(1200);assert(await page.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded')==='false','Menu not closed');assert(await page.locator('.chapter').nth(1).getAttribute('aria-current')==='step','Nav did not reach inside');assert(await page.locator('.screen-module').evaluate(el=>el.getBoundingClientRect().left>=0),'Exploded mobile screen cropped');assert(await page.locator('.pad-module').evaluate(el=>el.getBoundingClientRect().right<=innerWidth),'Exploded mobile pads cropped');await page.screenshot({path:'/work/screenshots/mobile-exploded.png'});});
 await check('Mobile final assembly stays in viewport',async()=>{await page.locator('[data-chapter="2"]').click();await page.waitForTimeout(1200);assert(await page.locator('.chassis').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}),'Final mobile chassis cropped');await page.screenshot({path:'/work/screenshots/mobile-assembled.png'});});
 await page.locator('#possibilities').scrollIntoViewIfNeeded();await page.screenshot({path:'/work/screenshots/mobile-possibilities.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
 await check('Reduced motion preference loads without errors',async()=>assert(await page.locator('h1').isVisible(),'Missing headline'));
 await browser.close();server.close();fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 if(results.errors.length||results.failedRequests.length||results.checks.some(c=>!c.passed))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
