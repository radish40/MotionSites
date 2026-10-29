const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const base='/motionsites-results/mythic-naturecore/';
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]);const file=path.join('/work/dist',name.startsWith(base)?name.slice(base.length):name);const target=name===base?'/work/dist/index.html':file;fs.readFile(target,(e,b)=>{if(e){res.writeHead(404);res.end('Not found');}else{res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(b);}});});
(async()=>{await new Promise(r=>server.listen(4173,'0.0.0.0',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const report={console_errors:[],page_errors:[],failed_requests:[],checks:[]};
const check=(name,pass,details)=>{report.checks.push({name,pass,details});if(!pass)console.error('FAIL',name,details)};
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',900,1000]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});const page=await context.newPage();page.on('pageerror',e=>report.page_errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.console_errors.push(m.text())});page.on('requestfailed',r=>report.failed_requests.push(r.url()));await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'domcontentloaded'});await page.waitForTimeout(70);const curtainBefore=await page.locator('.curtain-left').evaluate(el=>el.getBoundingClientRect().x);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2400);check(name+': entry curtains open',await page.locator('.curtain-left').evaluate((el,before)=>el.getBoundingClientRect().x<before-20,curtainBefore));check(name+': local raster images decode',await page.locator('img').evaluateAll(async imgs=>{try{await Promise.all(imgs.map(i=>i.decode()));return imgs.every(i=>i.currentSrc.includes('/assets/')&&!i.currentSrc.endsWith('.svg'))}catch{return false}}));
 check(name+': no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth})));
 check(name+': page is 480vh',await page.evaluate(()=>Math.abs(document.querySelector('main').getBoundingClientRect().height-innerHeight*4.8)<2));
 check(name+': fonts loaded',await page.evaluate(()=>document.fonts.check('16px "Viaoda Libre"')&&document.fonts.check('16px Imprima')));
 check(name+': images loaded',await page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)));
 check(name+': responsive cards',(await page.locator('.world-card').count())===(name==='mobile'?1:3));
 check(name+': correct navigation',name==='mobile'?await page.getByRole('link',{name:'Explore',exact:true}).isVisible():await page.getByRole('link',{name:'Worlds',exact:true}).isVisible());
 if(name!=='tablet')await page.screenshot({path:`/work/screenshots/${name}.png`});
 if(name==='desktop'){
  const before=await page.locator('.world').getAttribute('style');await page.mouse.move(1400,200);await page.waitForTimeout(600);check('mouse parallax updates world',before!==await page.locator('.world').getAttribute('style'));
  await page.getByRole('button',{name:'DESCEND',exact:true}).click();await page.waitForTimeout(1500);check('Descend scrolls into portal',await page.evaluate(()=>scrollY>innerHeight));await page.screenshot({path:'/work/screenshots/portal.png'});
 }
 await page.getByRole('link',{name:'Connect',exact:true}).click();await page.waitForTimeout(1600);
 check(name+': Connect reaches final scene',await page.locator('.finale').evaluate(el=>Number(getComputedStyle(el).opacity)>.99));
 check(name+': portal fades out after real zoom',await page.locator('.portal').evaluate(el=>Number(getComputedStyle(el).opacity)===0&&getComputedStyle(el).transform.startsWith('matrix(7.5')));
 check(name+': hero is inert after fade',await page.locator('.hero').evaluate(el=>el.inert));
 if(name!=='tablet')await page.screenshot({path:`/work/screenshots/${name}-final.png`});
 await page.getByRole('link',{name:'Reverie, return to entrance'}).click();await page.waitForTimeout(1600);check(name+': logo returns to entrance',await page.evaluate(()=>scrollY<2));
 await page.getByRole('button',{name:'View Reel one',exact:true}).click();await page.waitForTimeout(1600);check(name+': reel enters immersive scene',await page.locator('.finale').evaluate(el=>Number(getComputedStyle(el).opacity)>.9));
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(100);await page.getByRole('button',{name:'Go to journey stage 4'}).click();await page.waitForTimeout(1600);check(name+': stage indicator works',await page.locator('.finale').evaluate(el=>Number(getComputedStyle(el).opacity)>.99));
 if(name==='desktop'){await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);check('responsive hook updates on resize',await page.locator('.world-card').count()===1);}
 await context.close();
}
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();await page.goto('http://127.0.0.1:4173'+base);await page.waitForTimeout(2400);check('reduced motion disables bob animation',await page.locator('.descend-circle').evaluate(el=>getComputedStyle(el).animationName==='none'));await page.keyboard.press('Tab');check('navigation is keyboard accessible',await page.evaluate(()=>document.activeElement?.tagName==='A'));await context.close();
check('no JavaScript errors',report.page_errors.length===0,report.page_errors);check('no console errors',report.console_errors.length===0,report.console_errors);check('no failed requests',report.failed_requests.length===0,report.failed_requests);report.passed=report.checks.every(c=>c.pass);fs.writeFileSync('/work/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();if(!report.passed)process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exit(1)});
