const {chromium}=require('/app/node_modules/playwright-core');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base='/motionsites-results/cyberpunk-reveal/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{
 const url=decodeURIComponent(req.url.split('?')[0]);
 if(!url.startsWith(base)){res.writeHead(404);res.end();return;}
 const file=path.join('/work/dist',url.slice(base.length)||'index.html');
 try{res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const errors=[],failed=[],checks=[];
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
 page.on('console',msg=>{if(msg.type()==='error') errors.push(msg.text());});
 await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(3000);
 const layout=()=>page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,font:[...document.fonts].some(f=>f.family==='JetBrains Mono'&&f.weight==='400'&&f.status==='loaded')}));
 let dimensions=await layout();assert.equal(dimensions.scrollWidth,1440);assert.equal(dimensions.scrollHeight,1000);assert(dimensions.font);checks.push({name:'desktop layout and font',pass:true,dimensions});
 await page.screenshot({path:'/work/screenshots/desktop.png'});
 const before=await page.locator('.reveal-image').evaluate(e=>e.style.maskImage);
 await page.mouse.move(920,430);await page.waitForTimeout(650);
 const after=await page.locator('.reveal-image').evaluate(e=>e.style.maskImage);assert(after.startsWith('url("data:image/png'));assert.notEqual(before,after);
 await page.screenshot({path:'/work/screenshots/desktop-reveal.png'});checks.push({name:'cursor canvas mask follows pointer',pass:true});
 await page.getByRole('button',{name:'Reserve Now'}).hover();await page.waitForTimeout(250);
 const scale=await page.getByRole('button',{name:'Reserve Now'}).evaluate(e=>getComputedStyle(e).transform);assert.notEqual(scale,'none');checks.push({name:'reserve CTA hover transform',pass:true});
 await page.setViewportSize({width:390,height:844});await page.mouse.move(0,0);await page.waitForTimeout(1100);
 dimensions=await layout();assert.equal(dimensions.scrollWidth,390);assert.equal(dimensions.scrollHeight,844);assert.equal(await page.locator('svg[viewBox="0 0 380 700"]').isVisible(),false);checks.push({name:'mobile layout and hidden stats',pass:true,dimensions});
 await page.screenshot({path:'/work/screenshots/mobile.png'});
 await page.getByRole('button',{name:'Open menu'}).click();await page.waitForTimeout(200);assert(await page.locator('#mobile-menu').isVisible());assert.equal(await page.locator('#mobile-menu a').count(),5);
 await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
 await page.locator('#mobile-menu').getByRole('link',{name:'Case Records'}).click();assert.equal(await page.locator('#mobile-menu').count(),0);
 await page.getByRole('button',{name:'Open menu'}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-menu').count(),0);
 await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Close menu'}).click();assert.equal(await page.locator('#mobile-menu').count(),0);checks.push({name:'mobile open, link closes, Escape, toggle closes',pass:true});
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('h1').evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await page.locator('.base-image').evaluate(e=>getComputedStyle(e).animationName),'none');checks.push({name:'reduced motion',pass:true});
 checks.push({name:'runtime JavaScript errors',pass:errors.length===0,errors});
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify({checks,failedRequests:failed},null,2));
 console.log(JSON.stringify({checks,failedRequests:failed},null,2));await browser.close();server.close();if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exit(1)});
