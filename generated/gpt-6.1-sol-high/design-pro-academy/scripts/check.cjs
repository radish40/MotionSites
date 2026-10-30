const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve('dist');
const base = '/motionsites-results/design-pro-academy/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.ttf':'font/ttf' };
const server = http.createServer((req,res) => {
 const pathname = decodeURIComponent(req.url.split('?')[0]);
 const file = path.join(root, pathname.slice(base.length) || 'index.html');
 if (!pathname.startsWith(base) || !file.startsWith(root) || !fs.existsSync(file)) {res.writeHead(404);res.end();return}
 const stat = fs.statSync(file); const range = req.headers.range;
 if(range){ const [a,b] = range.replace('bytes=','').split('-');const start=Number(a), end=b?Number(b):stat.size-1;res.writeHead(206,{'Content-Type':mime[path.extname(file)],'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res); }
 else{res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':stat.size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const results={};const errors=[];
 for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  page.on('pageerror',err=>errors.push(err.message));
  const failed=[];page.on('requestfailed',req=>failed.push({url:req.url(),error:req.failure()?.errorText}));
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2,{timeout:20000});
  await page.waitForTimeout(1500);
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth, video:{source:document.querySelector('video').currentSrc,readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,time:document.querySelector('video').currentTime,width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight},font:document.fonts.check('500 48px Inter'),heading:document.querySelector('h1').getBoundingClientRect().toJSON(),lineHeight:getComputedStyle(document.querySelector('h1')).lineHeight,fontSize:getComputedStyle(document.querySelector('h1')).fontSize}));
  assert.equal(state.overflow,false);assert.equal(state.video.paused,false);assert.ok(state.video.time>0);assert.equal(state.font,true);
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Apply for Next Enrollment'}).click();
  await assert.doesNotReject(()=>page.getByRole('dialog').waitFor({state:'visible'}));
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').isVisible(),false);
  if(name==='mobile') {await page.getByRole('button',{name:'Open menu',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Close menu',exact:true}).getAttribute('aria-expanded'),'true');await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('button',{name:'Courses',exact:true}).click();}
  else await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Courses',exact:true}).click();
  await page.getByRole('heading',{name:'Your next step starts here.'}).waitFor();
  await page.getByRole('button',{name:'Back to DesignPro'}).click();
  if(name==='desktop') {
   for(const label of ['About Us','Instructors','Testimonials','Blog','Contact us']) {
    await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:label,exact:true}).click();
    assert.equal(await page.getByRole('dialog').isVisible(),true);
    await page.getByRole('button',{name:'Close dialog',exact:true}).click();
   }
   const shine=page.locator('.shiny-text'); const before=await shine.evaluate(el=>el.style.backgroundPosition);
   await page.waitForTimeout(200); const after=await shine.evaluate(el=>el.style.backgroundPosition);assert.notEqual(before,after);
  }
  results[name]={...state,interactions:'enrollment dialog, Escape dismissal, course navigation, return button passed',failedRequests:failed};
  await page.close();
 }
 const fallback=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await fallback.route('https://d8j0ntlcm91z4.cloudfront.net/**',r=>r.abort());
 await fallback.goto(`http://127.0.0.1:4173${base}`);
 await fallback.waitForFunction(()=>document.querySelector('video').currentSrc.includes('/assets/designpro-background.mp4')&&document.querySelector('video').readyState>=2);
 results.fallback=await fallback.evaluate(()=>({source:document.querySelector('video').currentSrc,paused:document.querySelector('video').paused}));assert.equal(results.fallback.paused,true);
 results.errors=errors;assert.equal(errors.length,0);
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
