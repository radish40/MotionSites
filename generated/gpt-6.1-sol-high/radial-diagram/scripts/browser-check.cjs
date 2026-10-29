const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/radial-diagram/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpeg':'image/jpeg','.ttf':'font/ttf'};
const server = http.createServer((req,res)=>{
  const uri = decodeURIComponent(req.url.split('?')[0]);
  if(!uri.startsWith(base)){res.writeHead(404).end();return;}
  const file = path.join('/work/dist', uri.slice(base.length) || 'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={};
 for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const page=await context.newPage();
  const errors=[],failedRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1800);
  const initial=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,imageLoaded:document.querySelector('img').complete&&document.querySelector('img').naturalWidth>0,fontLoaded:Array.from(document.fonts).some(f=>f.family==='DM Sans' && f.weight==='400' && f.status==='loaded'),heading:getComputedStyle(document.querySelector('h1 span')).opacity,glitches:document.querySelectorAll('span.absolute.bg-white').length}));
  assert.equal(initial.scrollWidth,viewport.width,'horizontal overflow');assert(initial.imageLoaded);assert(initial.fontLoaded);assert.equal(initial.heading,'1');assert.equal(initial.glitches,10);
  const websites=page.getByRole('button',{name:'websites',exact:true});
  if(name==='desktop')await websites.hover();else await websites.tap();
  await page.waitForTimeout(400);
  assert.equal(await websites.getAttribute('data-active'),'true');
  assert.equal(await websites.evaluate(e=>getComputedStyle(e).fontWeight),'700');
  const line=page.locator('line[data-service="websites"]');
  assert.equal(await line.getAttribute('opacity'),'1');assert.equal(await line.getAttribute('stroke-width'),'0.6');
  if(name==='desktop'){
   await page.mouse.move(10,10);await page.waitForTimeout(400);assert.equal(await websites.getAttribute('data-active'),'false');
   await page.getByRole('button',{name:'brands',exact:true}).focus();await page.waitForTimeout(400);assert.equal(await page.locator('line[data-service="brands"]').getAttribute('opacity'),'1');
  }
  await page.getByRole('button',{name:'Replay entrance animation'}).click();
  await page.waitForTimeout(1800);
  await page.mouse.move(0,0);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  assert.deepEqual(errors,[],`browser errors: ${errors}`);
  results[name]={...initial,viewport,hoverOrTouchHighlight:true,keyboardFocus:name==='desktop'?'passed':'not applicable',replay:true,errors,failedRequests};
  await context.close();
 }
 // Additional breakpoint overflow checks, beyond required screenshots.
 const page=await browser.newPage();
 results.responsive=[];
 for(const width of [320,640,768,1024,1280,1920]){
  await page.setViewportSize({width,height:1000});await page.goto(`http://127.0.0.1:4173${base}`);await page.waitForTimeout(1800);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow,`overflow at ${width}`);results.responsive.push({width,noHorizontalOverflow:!overflow});
 }
 fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
