const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve('dist');
const base = '/motionsites-results/duolingo-styleguide-hero/';
const types = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.ttf':'font/ttf','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(root,name.startsWith(base) ? name.slice(base.length) || 'index.html' : 'missing');
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={url:`http://127.0.0.1:4173${base}`,viewports:[],errors:[],failedRequests:[]};
 try {
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('requestfailed',r=>report.failedRequests.push(r.url()));
  page.on('response',r=>{if(r.status()>=400)report.failedRequests.push(`${r.status()} ${r.url()}`);});
  await page.goto(report.url,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{
    await Promise.all([document.fonts.load('400 18px "Noto Color Emoji"'),document.fonts.load('700 48px "Feather Bold"'), ...[400,500,600,700,800,900].map(w=>document.fonts.load(`${w} 17px Nunito`))]);
    await document.fonts.ready;
  });
  assert.equal(await page.locator('.panel').count(),8);
  assert.equal(await page.locator('.swatch').count(),12);
  const visual=await page.evaluate(()=>({
    viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
    gridColumns:getComputedStyle(document.querySelector('.main-grid')).gridTemplateColumns,
    fonts:[document.fonts.check('700 48px "Feather Bold"'),document.fonts.check('400 17px Nunito'),document.fonts.check('900 15px Nunito')],
    images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),
    navVisible:getComputedStyle(document.querySelector('nav')).display!=='none'
  }));
  assert.ok(visual.scrollWidth<=width,`${name} horizontal overflow`);
  assert.ok(visual.fonts.every(Boolean),'fonts loaded');
  assert.ok(visual.images.every(i=>i.loaded),'images loaded');
  assert.equal(visual.navVisible,name==='desktop');
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  const sound=page.getByRole('switch',{name:'Sound effects'});
  const animations=page.getByRole('switch',{name:'Animations'});
  assert.ok(await sound.isChecked());assert.ok(!(await animations.isChecked()));
  await sound.uncheck();await animations.check();
  assert.ok(!(await sound.isChecked()));assert.ok(await animations.isChecked());
  await page.getByRole('button',{name:'French',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'French',exact:true}).getAttribute('aria-pressed'),'true');
  assert.equal(await page.getByRole('button',{name:'Spanish',exact:true}).getAttribute('aria-pressed'),'false');
  await page.getByRole('button',{name:'Hover me'}).hover();
  await page.waitForTimeout(200);
  assert.equal(await page.locator('[role=tooltip]').evaluate(e=>getComputedStyle(e).visibility),'visible');
  await page.locator('#email').fill('learner@example.com');
  await page.getByRole('button',{name:'Subscribe',exact:true}).click();
  assert.match(await page.getByRole('status').textContent(),/subscription demo is complete/);
  assert.equal(await page.locator('button:disabled').count(),2);
  if(name==='desktop') {
    await page.getByRole('link',{name:'Colors',exact:true}).click();
    await page.waitForTimeout(700);
    assert.equal(new URL(page.url()).hash,'#colors');
    const colorTop=await page.locator('#colors').evaluate(e=>e.getBoundingClientRect().top);
    assert.ok(colorTop>=64 && colorTop<100,'section anchor clear of fixed header');
    const btn=page.locator('#buttons .primary').first();
    await btn.scrollIntoViewIfNeeded();
    const before=await btn.boundingBox();await btn.hover();await page.mouse.down();await page.waitForTimeout(120);
    const pressed=await btn.evaluate(e=>({transform:getComputedStyle(e).transform,shadow:getComputedStyle(e).boxShadow}));
    assert.equal(pressed.shadow,'none');assert.match(pressed.transform,/, 4\)/);
    await page.mouse.up();
  }
  report.viewports.push({name,width,height,...visual,interactions:'passed',screenshot:`screenshots/${name}.png`});
  await page.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);
 report.status='passed';
 }catch(e){report.status='failed';report.failure=e.stack;process.exitCode=1;}
 finally{fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();}
})();
