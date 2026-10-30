const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader']});
 const results = [];
 const errors = [];
 const base = 'http://localhost:4173/motionsites-results/community-superdesign-light-rays-background/';
 for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`);});
  await page.addInitScript(() => {
   window.__mouseUniform = null;
   for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
    const names = new WeakMap();
    const get = type.prototype.getUniformLocation;
    const set = type.prototype.uniform2fv;
    type.prototype.getUniformLocation = function(program,name) {
     const location = get.call(this,program,name);
     if (location) names.set(location,name);
     return location;
    };
    type.prototype.uniform2fv = function(location,value,...rest) {
     if (names.get(location) === 'mousePos') window.__mouseUniform = Array.from(value);
     return set.call(this,location,value,...rest);
    };
   }
  });
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForSelector('canvas');
  await page.waitForTimeout(1600);
  assert.equal(await page.locator('h1').textContent(),'LightRays');
  assert.equal(await page.locator('canvas').count(),1);
  const layout = await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,canvasWidth:document.querySelector('canvas').width,canvasHeight:document.querySelector('canvas').height}));
  assert.equal(layout.scrollWidth,width);
  assert.equal(layout.scrollHeight,height);
  assert.equal(layout.canvasWidth,width);
  assert.equal(layout.canvasHeight,height);
  const mouseBefore = await page.evaluate(()=>window.__mouseUniform);
  const before = await page.locator('canvas').screenshot();
  await page.mouse.move(width*.85,height*.25);
  await page.waitForTimeout(500);
  const after = await page.locator('canvas').screenshot();
  const mouseAfter = await page.evaluate(()=>window.__mouseUniform);
  assert(mouseAfter && mouseBefore && mouseAfter[0] > mouseBefore[0], 'Mouse must update WebGL uniforms');
  assert(!before.equals(after),'WebGL scene must animate');
  await page.mouse.move(width/2,height/2);
  await page.waitForTimeout(400);
  await page.screenshot({path:`screenshots/${name}.png`});
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('button').evaluate(el=>el===document.activeElement),true);
  await page.goto(base+'?reply-test=previous');
  await page.goto(base);
  await page.getByRole('button',{name:'Reply'}).click();
  await page.waitForURL('**/?reply-test=previous');
  results.push({viewport:name,dimensions:`${width}x${height}`,layout,animation:true,mouseTracking:true,keyboardFocus:true,replyHistoryBack:true});
  await page.close();
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync('screenshots/checks.json',JSON.stringify({results,errors},null,2)+'\n');
 await browser.close();
 console.log(JSON.stringify({results,errors},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
