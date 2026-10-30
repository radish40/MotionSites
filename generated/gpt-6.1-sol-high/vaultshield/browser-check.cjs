const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const base = '/motionsites-results/vaultshield/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
 const pathname = decodeURIComponent(req.url.split('?')[0]);
 const file = path.join('/work/dist', pathname.startsWith(base) ? pathname.slice(base.length) || 'index.html' : 'index.html');
 if (!fs.existsSync(file)) {res.writeHead(404);return res.end();}
 const size = fs.statSync(file).size;
 const range = req.headers.range;
 if (range) {const [a,b] = range.replace('bytes=','').split('-');const start=+a,end=b?+b:size-1;res.writeHead(206,{'Content-Type':mime[path.extname(file)],'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
 else {res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const errors=[], failures=[];const report={};
 try {
  for (const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
   const page=await browser.newPage({viewport,deviceScaleFactor:1});
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure().errorText}));
   await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(1200);
   const state=await page.evaluate(()=>{const v=document.querySelector('video');return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,video:{readyState:v.readyState,paused:v.paused,time:v.currentTime,width:v.videoWidth,height:v.videoHeight},headingFont:document.fonts.check('700 48px "Helvetica Now Display Bold"'),bodyFont:Array.from(document.fonts).some(f=>f.family==='Inter'&&f.weight==='400'&&f.status==='loaded')};});
   assert(state.scrollWidth<=viewport.width,`${name} overflows`);assert(state.video.readyState>=2, 'Video failed');assert(!state.video.paused, 'Video not playing');assert(state.headingFont&&state.bodyFont,'Font load failed');
   const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const doc=await cdp.send('DOM.getDocument');state.renderedFonts={};for(const selector of ['h1','p']){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector});state.renderedFonts[selector]=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;}assert(state.renderedFonts.p.some(f=>f.familyName==='Inter'&&f.isCustomFont),'Inter not rendered');assert(state.renderedFonts.h1.some(f=>f.familyName.includes('Helvetica')&&f.isCustomFont),'Helvetica not rendered');
   await page.locator('video').evaluate(v=>{v.pause();v.currentTime=2;});
   await page.waitForTimeout(200);
   await page.screenshot({path:`/work/screenshots/${name}.png`});
   if(name==='desktop') {
    assert(await page.getByRole('navigation',{name:'Main navigation',exact:true}).isVisible());
    const cta=page.getByRole('button',{name:'Get It Free',exact:true});await cta.hover();await page.waitForTimeout(250);report.ctaHoverTransform=await cta.evaluate(e=>getComputedStyle(e).transform);await cta.click();
   } else {
    const opener=page.getByRole('button',{name:'Open menu'});
    await opener.click();const dialog=page.getByRole('dialog');await dialog.waitFor();await page.waitForTimeout(650);
    assert(await dialog.getByRole('link').count()===5);await page.keyboard.press('Shift+Tab');assert(await dialog.getByRole('button',{name:'Sign In',exact:true}).evaluate(e=>e===document.activeElement));await page.keyboard.press('Tab');assert(await page.getByRole('button',{name:'Close menu'}).evaluate(e=>e===document.activeElement));
    await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
    await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert(await opener.evaluate(e=>e===document.activeElement));
    await opener.click();await page.waitForTimeout(500);await page.mouse.click(10,400);await dialog.waitFor({state:'detached'});
    await opener.click();await page.waitForTimeout(500);await page.getByRole('button',{name:'Close menu'}).click();await dialog.waitFor({state:'detached'});
    await opener.click();await page.waitForTimeout(500);await dialog.getByRole('link',{name:'Vault',exact:true}).click();await dialog.waitFor({state:'detached'});
    report.mobileMenu='Opened; five links; Escape, backdrop, close button, and link dismiss; focus restored';
   }
   report[name]=state;await page.close();
  }
  assert(errors.length===0,'Browser script errors');report.scriptErrors=errors;report.failedRequests=failures;report.mediaRangeCancellationNote='Chromium cancels its initial MP4 range request while seeking/buffering; video decode and autoplay verified separately.';assert(failures.every(f=>f.url.endsWith('.mp4')&&f.error==='net::ERR_ABORTED'),'Unexpected failed request');
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
