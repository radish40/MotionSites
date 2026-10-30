const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require('/app/node_modules/playwright-core');
const base='/motionsites-results/ai-runtime/';
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(req.url.split('?')[0]);
  if(!name.startsWith(base)){res.writeHead(404).end();return;}
  const file=path.resolve('dist',name.slice(base.length)||'index.html');
  if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403).end();return;}
  fs.stat(file,(err,stat)=>{
    if(err){res.writeHead(404).end();return;}
    const range=req.headers.range;
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
    res.setHeader('Accept-Ranges','bytes');
    if(range){const [start,end]=range.replace('bytes=','').split('-').map(Number);const last=end||stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${last}/${stat.size}`,'Content-Length':last-start+1});fs.createReadStream(file,{start,end:last}).pipe(res);}
    else {res.setHeader('Content-Length',stat.size);fs.createReadStream(file).pipe(res);}
  });
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={errors:[],requestsFailed:[],responses:[],viewports:{},interactions:{}};
 try{
 const page=await browser.newPage();
 page.on('pageerror',error=>report.errors.push(error.message));
 page.on('requestfailed',req=>report.requestsFailed.push({url:req.url(),error:req.failure().errorText}));
 page.on('response',res=>{if(res.status()>=400)report.responses.push({url:res.url(),status:res.status()});});
 async function layout(label,width,height){
   await page.setViewportSize({width,height});
   await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
   await page.waitForTimeout(3200);await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
     const video=document.querySelector('video');const h=document.querySelector('.headline');
     return {title:document.title,scrollWidth:document.documentElement.scrollWidth,width:innerWidth,scrollHeight:document.documentElement.scrollHeight,height:innerHeight,
       fonts:{display:document.fonts.check('80px "BubbledotICG-FinePos"'),inter:document.fonts.check('16px Inter'),geist:document.fonts.check('16px "Geist Pixel Circle"'),icons:document.fonts.check('14px "Font Awesome 6 Brands"')},
       headline:{width:h.clientWidth,scrollWidth:h.scrollWidth},values:[...document.querySelectorAll('.stat-value')].map(x=>x.textContent),
       video:{readyState:video.readyState,currentTime:video.currentTime,paused:video.paused,width:video.videoWidth,height:video.videoHeight,source:video.currentSrc},
       elements:[...document.querySelectorAll('.header,.trust,.headline,.subhead,.cta,.stats')].map(x=>({class:x.className,rect:JSON.parse(JSON.stringify(x.getBoundingClientRect()))}))};
   });
   report.viewports[label]=state;
   assert.equal(state.width,state.scrollWidth);assert.equal(state.height,state.scrollHeight);
   assert(state.headline.scrollWidth<=state.headline.width,'Headline must fit');
   assert.deepEqual(state.values,['120ms','99.99%','24/7','2.4M']);
   assert(state.video.readyState>=2,'Video must load');assert(!state.video.paused,'Video must autoplay');
   await page.screenshot({path:`screenshots/${label}.png`});
 }
 await layout('desktop',1440,1000);
 await page.locator('.desktop-nav a[href="#product"]').click();
 assert.equal(await page.locator('.desktop-nav a.active').textContent(),'Product');report.interactions.desktopNav=true;
 await page.locator('.cta').hover();await page.waitForTimeout(350);report.interactions.ctaHover=await page.locator('.cta').evaluate(x=>getComputedStyle(x).transform);
 assert.notEqual(report.interactions.ctaHover,'matrix(1, 0, 0, 1, 0, 0)');
 await page.locator('.cta').click();assert.equal(new URL(page.url()).hash,'#contact');report.interactions.ctaAnchor=true;
 await layout('mobile',390,844);
 const burger=page.locator('.burger');
 async function open(){await burger.click();assert.equal(await burger.getAttribute('aria-expanded'),'true');assert.equal(await page.locator('.mobile-menu').isVisible(),true);await page.waitForTimeout(450);}
 await open();await page.screenshot({path:'screenshots/mobile-menu.png'});
 await page.keyboard.press('Escape');assert.equal(await burger.getAttribute('aria-expanded'),'false');report.interactions.escape=true;
 await open();await page.mouse.click(10,600);assert.equal(await burger.getAttribute('aria-expanded'),'false');report.interactions.overlayClose=true;
 await open();await page.locator('.mobile-menu a[href="#product"]').click();assert.equal(await burger.getAttribute('aria-expanded'),'false');report.interactions.linkClose=true;
 await open();await page.setViewportSize({width:1000,height:844});await page.waitForTimeout(100);assert.equal(await burger.getAttribute('aria-expanded'),'false');report.interactions.resizeClose=true;
 await page.setViewportSize({width:390,height:650});await page.goto(`http://127.0.0.1:4173${base}`);await page.waitForTimeout(3000);
 report.viewports.shortMobile=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,statsBottom:document.querySelector('.stats').getBoundingClientRect().bottom}));
 assert(report.viewports.shortMobile.statsBottom<=650);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
 report.reducedMotion=await page.locator('.headline span').first().evaluate(x=>({opacity:getComputedStyle(x).opacity,animation:getComputedStyle(x).animationName}));
 assert.equal(report.reducedMotion.opacity,'1');assert.equal(report.reducedMotion.animation,'none');
 await page.evaluate(()=>document.fonts.load('16px \"Geist Pixel Circle\"'));
 report.localFallbackFont=await page.evaluate(()=>document.fonts.check('16px \"Geist Pixel Circle\"'));
 assert(report.localFallbackFont);
 await page.route('https://d8j0ntlcm91z4.cloudfront.net/**',route=>route.abort('failed'));
 await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('video').readyState>=2,{timeout:15000});
 report.localVideoFallback=await page.locator('video').evaluate(x=>({source:x.currentSrc,readyState:x.readyState,paused:x.paused}));
 assert(report.localVideoFallback.source.endsWith('/assets/background.mp4'));assert(report.localVideoFallback.readyState>=2);assert(!report.localVideoFallback.paused);
 assert.deepEqual(report.errors,[]);
 report.passed=true;
 }catch(error){report.passed=false;report.failure=error.stack;process.exitCode=1;}
 finally{fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));await browser.close();server.close();console.log(JSON.stringify(report,null,2));}
})();
