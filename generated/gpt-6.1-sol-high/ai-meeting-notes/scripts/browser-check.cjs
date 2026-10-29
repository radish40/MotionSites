const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const base = '/motionsites-results/ai-meeting-notes/';
const mime = {'.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.css':'text/css','.ttf':'font/ttf'};
const server = http.createServer((req,res)=>{
 const url = new URL(req.url,'http://localhost');
 if (!url.pathname.startsWith(base)) {res.writeHead(404);return res.end();}
 const relative = url.pathname.slice(base.length) || 'index.html';
 const file = path.resolve('dist',relative);
 if (!file.startsWith(path.resolve('dist')+path.sep)) {res.writeHead(403);return res.end();}
 fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Not found':data);});
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={url:base,viewports:[],errors:[],failedRequests:[]};
 try {
 for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
 const page=await browser.newPage({viewport});
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure().errorText}));
 await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(1800);
 assert.match(await page.title(),/Livo AI/);
 assert.ok(await page.locator('.scenarios-image-container').evaluate(el=>el.getBoundingClientRect().height>=320),'Scenario image must have a visible layout area');
 assert.equal(await page.locator('.pricing-card').count(),3);
 const overflow=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
 assert.ok(overflow.scrollWidth<=overflow.width,'Document horizontal overflow: '+JSON.stringify(overflow));
 await page.screenshot({path:viewport.width===1440?'screenshots/desktop.png':'screenshots/mobile.png',fullPage:true});
 for(let i=0;i<4;i++) {
 await page.locator('.pagination-btn').nth(i).click();
 await page.waitForTimeout(850);
 const expected=['Talent & Hiring','Commercial Teams','Management & Teams','Remote Team Members'][i];
 assert.equal(await page.locator('#scenariosHeading').textContent(),expected);
 assert.equal(await page.locator('.scenarios-image.active img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
 }
 await page.locator('#billingToggle').click();
 await page.waitForTimeout(750);
 assert.equal(await page.locator('.pricing-price-current').nth(1).textContent(),'165€');
 assert.equal(await page.locator('.pricing-price-old').count(),0);
 assert.equal(await page.locator('#billingToggle').getAttribute('aria-checked'),'true');
 await page.locator('#billingToggle').focus();
 await page.keyboard.press('Space');
 await page.waitForTimeout(750);
 assert.equal(await page.locator('.pricing-price-current').nth(1).textContent(),'132€');
 const previous=await page.locator('#scenariosHeading').textContent();
 await page.waitForFunction(previous=>document.getElementById('scenariosHeading').textContent!==previous,previous,{timeout:6500});
 const appPrevious=await page.locator('#appAdvertHeading').textContent();
 await page.waitForFunction(previous=>document.getElementById('appAdvertHeading').textContent!==previous,appPrevious,{timeout:8500});
 const images=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
 assert.deepEqual(images,[]);
 report.viewports.push({viewport,overflow,images:'loaded',scenarioPagination:'passed (4 slides)',scenarioAutoplay:'passed',advertAutoplay:'passed',billingMouseAndKeyboard:'passed',screenshot:viewport.width===1440?'screenshots/desktop.png':'screenshots/mobile.png'});
 await page.close();
 }
 assert.deepEqual(report.errors,[]);
 assert.deepEqual(report.failedRequests,[]);
 report.status='passed';
 }catch(e){report.status='failed';report.failure=e.stack;process.exitCode=1;}
 finally{fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await browser.close();server.close();}
})();
