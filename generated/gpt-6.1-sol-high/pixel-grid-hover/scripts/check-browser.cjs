const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve('dist');
const base = '/motionsites-results/pixel-grid-hover/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpeg':'image/jpeg','.ttf':'font/ttf'};
const server = http.createServer((req,res)=>{
  const url = decodeURIComponent(req.url.split('?')[0]);
  if(!url.startsWith(base)){res.writeHead(404);res.end();return;}
  const file = path.join(root,url.slice(base.length)||'index.html');
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);});
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={};
 try {
 for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
  const page=await browser.newPage({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const errors=[]; const failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('requestfailed',r=>failed.push(r.url()));
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('h1').innerText(),'Insights from Our\nCase Studies');
  assert.equal(await page.locator('[data-card]').count(),4);
  assert.equal(await page.locator('[data-pixels] > span').count(),384);
  assert(await page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)));
  assert(await page.evaluate(()=>document.fonts.check('400 14px "DM Sans"')&&document.fonts.check('500 14px "DM Sans"')));
  for(const card of await page.locator('[data-card]').all()){await card.scrollIntoViewIfNeeded();await page.waitForTimeout(850);}
  const boxes=await page.locator('[data-card]').evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y})));
  if(name==='desktop')assert.equal(boxes[0].y,boxes[1].y);else assert(boxes[1].y>boxes[0].y);
  await page.getByRole('button',{name:"Let's work together"}).scrollIntoViewIfNeeded();
  const track=page.locator('.marquee-projects');
  const before=await track.evaluate(n=>getComputedStyle(n).transform);await page.waitForTimeout(150);const after=await track.evaluate(n=>getComputedStyle(n).transform);assert.notEqual(before,after);
  if(name==='desktop'){
   const marqueeBox=await track.locator('..').boundingBox();await page.mouse.move(marqueeBox.x+30,marqueeBox.y+marqueeBox.height/2);assert.equal(await track.evaluate(n=>getComputedStyle(n).animationPlayState),'paused');
   const cta=page.getByRole('button',{name:"Let's work together"});await cta.hover();await page.waitForTimeout(350);assert.equal(await cta.locator('>span').nth(1).evaluate(n=>getComputedStyle(n).marginBottom),'36px');
   const card=page.locator('[data-card="heartx"]');await card.scrollIntoViewIfNeeded();await card.hover({position:{x:380,y:100}});await page.waitForTimeout(900);
   assert(await card.locator('[data-pixels] > span').evaluateAll(nodes=>nodes.every(n=>Number(getComputedStyle(n).opacity)>.99)));
   const magnetic=card.locator('> div').nth(1).locator('span').first();
   const shift=await magnetic.evaluate(n=>getComputedStyle(n).transform);assert.notEqual(shift,'none');assert.notEqual(shift,'matrix(1, 0, 0, 1, 0, 0)');
   await page.screenshot({path:'screenshots/desktop-hover.png'});
   await page.mouse.move(1,1);await page.waitForTimeout(850);assert(await card.locator('[data-pixels] > span').evaluateAll(nodes=>nodes.every(n=>Number(getComputedStyle(n).opacity)<.01)));
   const reset=await magnetic.evaluate(n=>new DOMMatrix(getComputedStyle(n).transform).m41);assert(Math.abs(reset)<.1);
   await card.focus();await page.waitForTimeout(800);assert.equal(await card.locator('[data-pixels] > span').first().evaluate(n=>getComputedStyle(n).opacity),'1');await card.evaluate(n=>n.blur());await page.waitForTimeout(850);
  }
  await page.mouse.move(0,0);await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(900);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  results[name]={viewport,case_studies:4,pixel_blocks:384,images_loaded:true,font_loaded:true,responsive_grid:true,horizontal_overflow:false,marquee_moves:true,script_errors:errors,failed_requests:failed,screenshot:`screenshots/${name}.png`,...(name==='desktop'?{hover_reveal_and_reset:true,magnetic_pointer_and_reset:true,keyboard_reveal:true,marquee_hover_pause:true,cta_arrow_hover:true}:{})};
  await page.close();
 }
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
