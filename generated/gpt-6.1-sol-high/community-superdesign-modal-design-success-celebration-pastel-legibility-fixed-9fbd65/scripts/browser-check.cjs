const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const prefix='/motionsites-results/community-superdesign-modal-design-success-celebration-pastel-legibility-fixed-9fbd65/';
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(!url.pathname.startsWith(prefix)){res.writeHead(404);return res.end('Not found');}
 const rel=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html';
 const file=path.resolve('dist',rel);
 if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403);return res.end();}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);});
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={url:prefix,viewports:[],interactions:[],errors:[],failedRequests:[]};
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400)report.failedRequests.push({url:r.url(),status:r.status()});});
 page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()}));
 await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(1100);
 assert(await page.evaluate(()=>document.fonts.check('800 30px Poppins')));
 const layout=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,fonts:document.fonts.size,sections:document.querySelectorAll('main>section').length,card:document.querySelector('.success-card').getBoundingClientRect().toJSON(),badElements:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width && (r.right>innerWidth+1 || r.left< -1)&&!el.closest('.confetti,.scatter,.glow,.skip-link');}).map(el=>el.tagName+'.'+el.className)}));
 assert(layout.document<=width,JSON.stringify(layout));assert.equal(layout.sections,4);assert.equal(layout.fonts,5);assert.equal(layout.badElements.length,0,JSON.stringify(layout.badElements));
 await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
 report.viewports.push({name,width,height,...layout,screenshot:`screenshots/${name}.png`});
 await page.getByRole('button',{name:'Dismiss success message'}).click();assert(await page.locator('.success-card').isHidden());
 await page.getByRole('button',{name:'Replay the celebration'}).click();assert(await page.locator('.success-card').isVisible());
 await page.getByRole('button',{name:'Share the win with your team'}).click();await page.waitForTimeout(100);assert(await page.locator('.toast').isVisible());
 const copied=await page.evaluate(()=>navigator.clipboard.readText());assert(copied.includes('my design system is live'));
 await page.getByRole('button',{name:'Continue to dashboard'}).click();await page.waitForTimeout(800);assert(await page.evaluate(()=>Math.abs(document.querySelector('#patterns').getBoundingClientRect().top)<150));
 await page.getByRole('button',{name:'Explore Pro',exact:true}).click();assert((await page.locator('.toast').textContent()).includes('Welcome to Pro'));
 await page.getByRole('button',{name:'Later',exact:true}).click();assert((await page.locator('.toast').textContent()).includes('when you’re ready'));
 await page.getByRole('button',{name:'Get Modal.Design $49',exact:true}).click();assert(await page.locator('dialog').isVisible());
 await page.keyboard.press('Tab');await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));
 await page.keyboard.press('Escape');assert(await page.locator('dialog').isHidden());assert.equal(await page.evaluate(()=>document.activeElement.dataset.action),'purchase');
 await page.locator('[data-action="demo"]').click();await page.waitForTimeout(800);assert(await page.locator('.success-card').isVisible());
 if(name==='desktop'){await page.getByRole('button',{name:'Sign in',exact:true}).click();assert(await page.locator('dialog').isVisible());await page.getByRole('button',{name:'Got it'}).click();assert(await page.locator('dialog').isHidden());}
 else {assert(await page.locator('.sign-in').isHidden());assert(await page.locator('.nav-links').isHidden());}
 report.interactions.push({viewport:name,dismissReplay:true,clipboardShare:true,continueScroll:true,explorePro:true,later:true,purchasePreview:true,dialogFocusTrap:true,escapeAndFocusReturn:true,liveDemo:true,navResponsive:true});
 await context.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:4173'+prefix);assert.equal(await reduced.locator('.badge-pop').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await reduced.locator('.check-path').evaluate(e=>getComputedStyle(e).strokeDashoffset),'0px');report.reducedMotion=true;
 console.log('Browser errors:',JSON.stringify(report.errors),'Failed requests:',JSON.stringify(report.failedRequests));
 assert.equal(report.errors.length,0);assert.equal(report.failedRequests.length,0);
 report.status='passed';fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
