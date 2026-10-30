const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/community-superdesign-ghost-cursor/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const relative = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : '';
  const file = path.resolve('dist', relative || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => { if(error) {res.writeHead(404).end();return;} res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream'); res.end(data); });
});
(async () => {
 await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 const errors = [], checks = [];
 try {
  for (const mobile of [false,true]) {
   const name = mobile ? 'mobile' : 'desktop';
   const context = await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
   const page = await context.newPage();
   page.on('pageerror', error=>errors.push(`${name}: ${error.message}`));
   page.on('console', msg=>{ if(msg.type()==='error'){errors.push(`${name}: ${msg.text()}`);console.error(msg.text());} });
   page.on('response', response=>{if(response.status()>=400)errors.push(`${name}: HTTP ${response.status()} ${response.url()}`);});
   await page.goto(`http://127.0.0.1:4173${prefix}`,{waitUntil:'networkidle'});
   await page.waitForTimeout(2500);
   assert.equal(await page.title(),'Ghost Cursor');
   assert.equal(await page.locator('h1').innerText(),'Ghost Cursor');
   assert.equal(await page.locator('p').innerText(),'Move your cursor to see the effect');
   assert.equal(await page.locator('canvas').count(),1);
   const layout = await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,canvasWidth:document.querySelector('canvas').width,canvasHeight:document.querySelector('canvas').height,headingSize:getComputedStyle(document.querySelector('h1')).fontSize}));
   assert.equal(layout.scrollWidth,layout.width);
   assert.equal(layout.scrollHeight,layout.height);
   await page.screenshot({path:`screenshots/${name}-idle.png`});
   const cdp = mobile ? await context.newCDPSession(page) : null;
   if(mobile) {
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:80,y:530}]});
    for (let i=0;i<6;i++) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:80+i*40,y:530-i*20}]});
   } else {
    await page.mouse.move(380,640);
    for (let i=0;i<6;i++) await page.mouse.move(380+i*100,640-i*25);
   }
   // Keep input arriving while SwiftShader captures its comparatively slow frame.
   await page.evaluate(() => {
    let tick = 0;
    window.__pointerCheck = setInterval(() => {
     const x = innerWidth * (0.6 + Math.sin(tick++ * 0.15) * 0.08);
     document.querySelector('main').dispatchEvent(new PointerEvent('pointermove', { clientX:x, clientY:innerHeight*0.6, bubbles:true, pointerType:'mouse' }));
    }, 40);
   });
   await page.waitForTimeout(500);
   const active = await page.screenshot({path:`screenshots/${name}.png`});
   await page.evaluate(() => clearInterval(window.__pointerCheck));
   if(mobile) await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await page.waitForTimeout(2500);
   const faded = await page.screenshot({path:`screenshots/${name}-faded.png`});
   assert.notDeepEqual(active, faded, 'Active trail should visibly differ from faded state');
   if(!mobile) {
    await page.mouse.move(1060,690);
    await page.evaluate(() => { window.__pointerCheck = setInterval(() => document.querySelector('main').dispatchEvent(new PointerEvent('pointermove', {clientX:1060,clientY:690,bubbles:true})),40); });
    await page.waitForTimeout(300);
    const restarted = await page.screenshot({path:'screenshots/desktop-reactivated.png'});
    await page.evaluate(() => clearInterval(window.__pointerCheck));
    assert.notDeepEqual(restarted, faded);
    await page.mouse.move(-5,-5);
    await page.waitForTimeout(2000);
    await page.setViewportSize({width:1000,height:700});
    await page.waitForFunction(() => { const el = document.querySelector('canvas'); return el.width === 500 && el.height === 350; }, {timeout:30000});
    const resized = await page.locator('canvas').evaluate(el=>({width:el.width,height:el.height}));
    assert.deepEqual(resized,{width:500,height:350});
   }
   checks.push({name,layout,text:true,canvas:true,noOverflow:true,pointerOrTouch:true,idleFadeCaptured:true,...(!mobile?{resize:true,restartCaptured:true}:{})});
   await context.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify({checks,errors},null,2)+'\n');
  console.log(JSON.stringify({checks,errors},null,2));
 } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
