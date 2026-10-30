const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('/app/node_modules/playwright-core');
const base='/motionsites-results/cyber-layer/';
const report={checkedAt:new Date().toISOString(),base,errors:[],networkFailures:[],cancelledVideoRequests:[],checks:[]};
const server=http.createServer((req,res)=>{if(req.url===base||req.url===base+'index.html'){res.setHeader('Content-Type','text/html');res.end(fs.readFileSync('dist/index.html'))}else if(req.url==='/favicon.ico'){res.writeHead(204).end()}else res.writeHead(404).end()});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 try{
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();
   page.on('pageerror',e=>report.errors.push({viewport:name,error:e.message}));
   page.on('console',m=>{if(m.type()==='error')report.errors.push({viewport:name,error:m.text()})});
   page.on('requestfailed',r=>{const item={viewport:name,url:r.url(),error:r.failure()?.errorText};if(item.error==='net::ERR_ABORTED'&&r.url().endsWith('.mp4'))report.cancelledVideoRequests.push(item);else report.networkFailures.push(item)});
   await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'load'});
   await page.waitForFunction(()=>!document.documentElement.classList.contains('intro'));
   await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2&&!v.paused),{timeout:45000});
   await page.waitForTimeout(1000);
   const layout=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,animations:document.getAnimations().length,fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),videos:[...document.querySelectorAll('video')].map(v=>({readyState:v.readyState,paused:v.paused,time:v.currentTime,error:v.error?.message||null,src:v.currentSrc})),h1:document.querySelector('h1').getBoundingClientRect().toJSON(),stats:document.querySelector('.stats').getBoundingClientRect().toJSON(),offscreen:[...document.querySelectorAll('.frame a,.frame h1,.frame p,.stat span')].filter(e=>e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth+.5||r.bottom>innerHeight+.5}).map(e=>e.textContent)}));
   report.checks.push({name:name+' captured state',layout});
   assert.equal(layout.scrollWidth,width);assert.equal(layout.scrollHeight,height);assert.equal(layout.animations,0);assert.deepEqual(layout.offscreen,[]);assert(layout.fonts.every(f=>f.status==='loaded'));assert(layout.videos.every(v=>v.readyState>=2&&!v.error&&!v.paused));
   await page.screenshot({path:`screenshots/${name}.png`});
   if(name==='mobile'){
    const burger=page.locator('.burger');await burger.click();await page.waitForTimeout(600);assert.equal(await burger.getAttribute('aria-label'),'Close menu');assert(await page.locator('#menu').isVisible());
    await page.getByRole('button',{name:'Resources',exact:true}).click();assert(await page.getByRole('link',{name:'Documentation',exact:true}).isVisible());
    await page.getByRole('button',{name:'Benefits',exact:true}).click();assert(!(await page.getByRole('link',{name:'Documentation',exact:true}).isVisible()));assert(await page.getByRole('link',{name:'Access control',exact:true}).isVisible());
    await page.screenshot({path:'screenshots/mobile-menu.png'});
    await page.keyboard.press('Escape');assert(!(await page.locator('#menu').isVisible()));assert.equal(await burger.getAttribute('aria-label'),'Open menu');
    await burger.click();await page.getByRole('link',{name:'Home',exact:true}).click();assert(!(await page.locator('#menu').isVisible()));
    await burger.click();await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'btn btn-menu');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'burger');
    await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(100);assert(!(await page.locator('#menu').isVisible()));
    report.checks.push({name:'mobile menu',passed:true,details:'Burger, exclusive accordions, Escape, link dismissal, focus trap, desktop resize dismissal'});
   }
   report.checks.push({name,passed:true});await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();await page.goto('http://127.0.0.1:4173'+base);await page.waitForTimeout(800);
  const reduced=await page.evaluate(()=>({intro:document.documentElement.classList.contains('intro'),animations:document.getAnimations().length,videos:[...document.querySelectorAll('video')].map(v=>({paused:v.paused,autoplay:v.hasAttribute('autoplay')})),h1Opacity:getComputedStyle(document.querySelector('h1')).opacity}));assert(!reduced.intro);assert.equal(reduced.animations,0);assert(reduced.videos.every(v=>v.paused&&!v.autoplay));assert.equal(reduced.h1Opacity,'1');report.checks.push({name:'reduced motion',passed:true,details:reduced});await context.close();
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.networkFailures,[]);report.passed=true;
 }finally{await browser.close();server.close();fs.writeFileSync('browser-checks.json',JSON.stringify(report,null,2));}
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{report.passed=false;report.failure=e.stack;fs.writeFileSync('browser-checks.json',JSON.stringify(report,null,2));console.error(e);server.close();process.exitCode=1});
