const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const prefix='/motionsites-results/movie-premiere/';
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{
 if(!req.url.startsWith(prefix)){res.writeHead(404);return res.end();}
 const file=path.join('/work/dist',decodeURIComponent(req.url.slice(prefix.length).split('?')[0]||'index.html'));
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();}else{res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);}});
});
(async()=>{
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const errors=[],checks=[];
 try {
  for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
   const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
   const page=await context.newPage();
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure().errorText));
   page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
   await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(1200);
   const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,phoneWidth:document.querySelector('.phone-frame').offsetWidth,phoneHeight:document.querySelector('.phone-frame').offsetHeight,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),font:document.fonts.check('800 58px Inter')}));
   assert.equal(layout.scrollWidth,viewport.width);assert.equal(layout.scrollHeight,viewport.height);assert.equal(layout.phoneWidth,375);assert.equal(layout.phoneHeight,780);assert(layout.images);assert(layout.font);
   await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
   await page.getByRole('button',{name:'Upcoming',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Upcoming',exact:true}).getAttribute('aria-pressed'),'true');
   await page.getByRole('button',{name:'Premieres',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Premieres',exact:true}).getAttribute('aria-pressed'),'true');
   await page.getByRole('button',{name:'In Theaters',exact:true}).click();
   for(const label of ['Explore','Queue','Account','Flicks']){await page.getByRole('button',{name:label,exact:true}).click();assert.equal(await page.getByRole('button',{name:label,exact:true}).getAttribute('aria-pressed'),'true');}
   const front=()=>page.locator('.front-card');
   async function drag(delta){const b=await front().boundingBox();await page.mouse.move(b.x+b.width/2,b.y+130);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+130+delta,{steps:10});await page.mouse.up();await page.waitForTimeout(600);}
   await drag(40);assert.equal(await front().getAttribute('data-poster'),'0');
   await drag(-100);assert.equal(await front().getAttribute('data-poster'),'0');
   await drag(125);assert.equal(await front().getAttribute('data-poster'),'1');
   for(let i=2;i<=6;i++){await front().focus();await page.keyboard.press('Enter');await page.waitForTimeout(520);assert.equal(await front().getAttribute('data-poster'),String(i%6));}
   assert.equal(await page.locator('.phone-background img').getAttribute('src'),prefix+'assets/poster-1.webp');
   if(name==='mobile'){
    const cdp=await context.newCDPSession(page),b=await front().boundingBox(),x=b.x+b.width/2,y=b.y+120;
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let i=1;i<=10;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+i*13}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(600);
    assert.equal(await front().getAttribute('data-poster'),'1');
   }
   checks.push({viewport:name,size:viewport,layout,tabs:'pass',navigation:'pass',short_swipe:'pass',upward_swipe:'pass',downward_swipe:'pass',six_card_rotation:'pass',keyboard:'pass',...(name==='mobile'?{touch_swipe:'pass'}:{})});
   await context.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify({status:'passed',checks,errors},null,2));
  console.log(JSON.stringify({status:'passed',checks,errors},null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
