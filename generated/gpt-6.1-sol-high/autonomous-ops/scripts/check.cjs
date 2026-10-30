const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
(async()=>{
 const server=http.createServer((req,res)=>{if(req.url==='/motionsites-results/autonomous-ops/'||req.url==='/motionsites-results/autonomous-ops/index.html'){res.setHeader('Content-Type','text/html');res.end(fs.readFileSync(path.resolve('dist/index.html')));}else{res.writeHead(404);res.end();}});
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const reports=[];
 try {
 for(const spec of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844,isMobile:true,hasTouch:true},{name:'tablet',width:768,height:1024},{name:'short-desktop',width:1440,height:500}]){
 const context=await browser.newContext({viewport:{width:spec.width,height:spec.height},deviceScaleFactor:1,isMobile:!!spec.isMobile,hasTouch:!!spec.hasTouch});const page=await context.newPage();const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>requests.push(r.url()));
 await page.goto('http://127.0.0.1:4173/motionsites-results/autonomous-ops/');
 await page.waitForFunction(()=>window.__entranceStarted);
 const animation=await page.evaluate(()=>[...document.querySelectorAll('.card')].map(c=>c.getAnimations().map(a=>({delay:a.effect.getTiming().delay,duration:a.effect.getTiming().duration}))));
 await page.waitForFunction(()=>!document.documentElement.classList.contains('entrance-active')&&!document.documentElement.classList.contains('entrance-pending'));
 const layout=await page.evaluate(()=>{const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right};};return {cards:[...document.querySelectorAll('.card')].map(rect),overflow:document.documentElement.scrollWidth>innerWidth,canvas:[...document.querySelectorAll('canvas')].map(c=>({width:c.width,height:c.height,painted:c.getContext('2d').getImageData(0,0,c.width,c.height).data.some(v=>v!==0)})),opacity:[...document.querySelectorAll('.card')].map(c=>getComputedStyle(c).opacity),promptOverflow:document.querySelector('.prompt').scrollWidth>document.querySelector('.prompt').clientWidth,titleOverflow:[...document.querySelectorAll('h2')].some(el=>el.scrollWidth>el.clientWidth),bars:document.querySelectorAll('.bar').length,scale:getComputedStyle(document.querySelector('.cards')).scale};});
 assert.equal(errors.length,0,JSON.stringify(errors));assert.equal(layout.overflow,false);assert.equal(layout.promptOverflow,false);assert.equal(layout.titleOverflow,false);assert.equal(layout.bars,24);assert(layout.canvas.every(c=>c.painted&&c.width>0&&c.height>0));assert(layout.opacity.every(x=>x==='1'));assert.equal(requests.length,1,'Page must load no external resources');
 if(spec.name==='desktop'){assert.equal(animation[1][0].delay,60);assert(animation[0][0].delay>=245);assert(animation[2][0].delay>=245);assert(Math.abs(layout.cards[0].y-layout.cards[1].y)<4);}
 if(spec.name==='mobile'){assert(layout.cards[1].y>=layout.cards[0].bottom);await page.locator('.automate').scrollIntoViewIfNeeded();assert(await page.locator('.automate').isVisible());await page.locator('.card').last().scrollIntoViewIfNeeded();assert(await page.getByText('Path Optimized: +14.2%').isVisible());await page.evaluate(()=>scrollTo(0,0));}
 if(spec.name==='tablet')assert(layout.cards[2].y>=layout.cards[0].bottom);
 if(spec.name==='short-desktop')assert(layout.cards.every(r=>r.y>=0&&r.bottom<=spec.height));
 if(['desktop','mobile'].includes(spec.name))await page.screenshot({path:`screenshots/${spec.name}.png`});
 if(spec.name==='mobile')await page.screenshot({path:'screenshots/mobile-full.png',fullPage:true});
 reports.push({name:spec.name,viewport:[spec.width,spec.height],errors,requests,animation,layout});await context.close();
 }
 for(const mode of ['reduced-motion','no-animate','animation-error','no-javascript']){
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:mode==='reduced-motion'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-javascript'});
 if(mode==='no-animate')await context.addInitScript(()=>{Element.prototype.animate=undefined;});
 if(mode==='animation-error')await context.addInitScript(()=>{Element.prototype.animate=function(){throw new Error('Test animation failure');};});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4173/motionsites-results/autonomous-ops/');await page.waitForFunction(()=>!document.documentElement.classList.contains('entrance-pending')&&!document.documentElement.classList.contains('entrance-active'));
 const opacity=await page.locator('.card').evaluateAll(cards=>cards.map(c=>getComputedStyle(c).opacity));assert(opacity.every(x=>x==='1'));reports.push({name:mode,visible:true});await context.close();
 }
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports,null,2));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exit(1);});
