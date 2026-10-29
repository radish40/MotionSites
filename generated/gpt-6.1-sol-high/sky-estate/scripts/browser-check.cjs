const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/sky-estate/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf'};
const server = http.createServer((req,res)=>{
 const name = decodeURIComponent(req.url.split('?')[0]);
 if(!name.startsWith(base)){res.writeHead(404);res.end();return;}
 const file = path.join('/work/dist',name.slice(base.length)||'index.html');
 fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(err?'Not found':data);});
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = {url:base,viewports:[],errors:[],failedRequests:[],interactions:[]};
 try {
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
 const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 page.on('requestfailed',r=>report.failedRequests.push(r.url()));
 page.on('response',r=>{if(r.status()>=400)report.failedRequests.push(`${r.status()} ${r.url()}`);});
 await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
 const assets = await page.locator('main img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})));
 assert(assets.every(i=>i.loaded),'All images must load');
 assert(await page.evaluate(()=>document.fonts.check('500 18px "Inter Tight"')),'Inter Tight must load');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 assert(!overflow,'No horizontal overflow');
 const before=await page.locator('#home img').first().evaluate(e=>getComputedStyle(e).transform);
 await page.evaluate(()=>window.scrollTo({top:400,behavior:'instant'}));await page.waitForTimeout(250);
 const after=await page.locator('#home img').first().evaluate(e=>getComputedStyle(e).transform);
 assert.notEqual(before,after,'Hero parallax responds to scroll');
 await page.locator('#estates').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
 const opacityBefore=await page.locator('#estates p span span').last().evaluate(e=>getComputedStyle(e).opacity);
 await page.evaluate(()=>window.scrollTo({top:document.querySelector('#estates').offsetHeight+document.querySelector('#estates').getBoundingClientRect().top+window.scrollY-window.innerHeight*.2+20,behavior:'instant'}));await page.waitForTimeout(300);
 const opacityAfter=await page.locator('#estates p span span').last().evaluate(e=>getComputedStyle(e).opacity);
 assert(+opacityAfter>+opacityBefore,'Character reveal progresses');
 assert.equal(opacityAfter,'1','Final character fully reveals');
 await page.locator('#projects').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
 assert.equal(await page.getByText('99%',{exact:true}).evaluate(e=>getComputedStyle(e.parentElement).opacity),'1');
 await page.screenshot({path:`/work/screenshots/${name}-stats.png`});
 if(name==='mobile'){
 await page.getByRole('button',{name:'Open menu'}).click();await page.waitForTimeout(600);
 assert(await page.getByRole('dialog').isVisible());
 await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
 await page.keyboard.press('Escape');await page.waitForTimeout(300);
 assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
 await page.getByRole('button',{name:'Open menu'}).click();await page.waitForTimeout(400);
 await page.getByRole('dialog').getByRole('link',{name:'About',exact:true}).click();await page.waitForTimeout(1100);
 assert.equal(new URL(page.url()).hash,'#about');
 assert.equal(await page.getByRole('dialog').count(),0);
 report.interactions.push('Mobile menu opens, Escape closes, About link navigates and closes overlay');
 } else {
 await page.getByRole('navigation').getByRole('link',{name:'Projects',exact:true}).click();await page.waitForTimeout(600);
 assert.equal(new URL(page.url()).hash,'#projects');
 report.interactions.push('Desktop Projects link navigates to statistics');
 }
 const ctas=await page.getByRole('link',{name:'Get in touch',exact:true}).evaluateAll(els=>els.map(e=>e.getAttribute('href')));
 assert(ctas.every(h=>h.startsWith('mailto:?subject=')));
 report.viewports.push({name,width,height,overflow,assets,fontLoaded:true,parallax:true,characterReveal:{before:opacityBefore,after:opacityAfter},statsVisible:true});
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForTimeout(400);
 await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
 await page.close();
 }
 assert.equal(report.errors.length,0);assert.equal(report.failedRequests.length,0);
 report.interactions.push('Contact CTAs open an email draft; recipient intentionally unset because no contact address was supplied');
 report.status='passed';
 } finally {fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
