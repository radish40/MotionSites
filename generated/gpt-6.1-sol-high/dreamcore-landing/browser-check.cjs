const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async()=>{
 const server=spawn('node',['node_modules/vite/bin/vite.js','preview','--host','0.0.0.0','--port','4173'],{stdio:'ignore'});
 await new Promise(r=>setTimeout(r,1500));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={desktop:{},mobile:{},tablet:{},assetFailures:[],consoleErrors:[],pageErrors:[],imageRequests:[]};
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',834,1000]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('request',r=>{if(r.resourceType()==='image')report.imageRequests.push({name,url:r.url()})});
  page.on('pageerror',e=>report.pageErrors.push({name,message:e.message}));
  page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,message:m.text()})});
  page.on('requestfailed',r=>report.assetFailures.push({name,url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)report.assetFailures.push({name,url:r.url(),status:r.status()})});
  await page.goto('http://localhost:4173/motionsites-results/dreamcore-landing/',{waitUntil:'networkidle',timeout:90000});
  await page.waitForTimeout(3000);
  report[name].title=await page.title();
  report[name].fonts=await page.evaluate(()=>({viaoda:document.fonts.check('16px "Viaoda Libre"'),imprima:document.fonts.check('16px Imprima')}));
  report[name].images=await page.locator('img').evaluateAll(xs=>xs.map(x=>({src:x.src,loaded:x.complete&&x.naturalWidth>0})));
  report[name].cardBackgrounds=await page.locator('button').evaluateAll(async buttons=>{
   const urls=[...new Set(buttons.flatMap(b=>{const m=getComputedStyle(b).backgroundImage.match(/url\("?([^"\)]+)"?\)/);return m?[m[1]]:[]}))];
   return Promise.all(urls.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({src,loaded:true});img.onerror=()=>resolve({src,loaded:false});img.src=src})));
  });
  report[name].layers=await page.locator('[data-layer]').evaluateAll(xs=>xs.map(x=>({layer:x.dataset.layer,transform:getComputedStyle(x).transform})));
  report[name].cardCount=await page.locator('article').count();
  report[name].overflow=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  if(name!=='tablet')await page.screenshot({path:`screenshots/${name}.png`});
  await page.getByRole('link',{name:name==='mobile'?'Explore':'Worlds',exact:true}).click();
  await page.waitForTimeout(2000);
  report[name].exploreProgress=await page.evaluate(()=>scrollY/(document.querySelector('main').scrollHeight-innerHeight));
  report[name].scene2Opacity=await page.locator('#worlds').evaluate(e=>getComputedStyle(e).opacity);
  if(name!=='tablet')await page.screenshot({path:`screenshots/${name}-scene2.png`});
  const positions=[];
  for(const p of [.3,.7,1]){await page.evaluate(p=>window.scrollTo(0,(document.querySelector('main').scrollHeight-innerHeight)*p),p);await page.waitForTimeout(200);positions.push({progress:p,portal:await page.locator('[data-layer=portal]').evaluate(e=>({transform:e.style.transform,opacity:e.style.opacity})),arc:await page.locator('article').first().evaluate(e=>e.style.transform)});}
  report[name].scroll=positions;
  await page.getByRole('link',{name:'Return to Reverie',exact:true}).filter({visible:true}).click();
  await page.waitForTimeout(1600);
  report[name].returnToTop=await page.evaluate(()=>scrollY<2);
  await page.getByRole('button',{name:'View Reel — descend into wonder',exact:true}).filter({visible:true}).first().click();
  await page.waitForTimeout(1600);
  report[name].reelProgress=await page.evaluate(()=>scrollY/(document.querySelector('main').scrollHeight-innerHeight));
  if(name==='desktop'){
   await page.getByRole('link',{name:'Return to Reverie',exact:true}).filter({visible:true}).click();await page.waitForTimeout(1600);
   await page.getByRole('button',{name:'Descend into the world',exact:true}).click();await page.waitForTimeout(1600);
   report[name].descendProgress=await page.evaluate(()=>scrollY/(document.querySelector('main').scrollHeight-innerHeight));
   await page.mouse.move(100,100);await page.waitForTimeout(400);report[name].mouseTransform=await page.locator('img').first().evaluate(e=>e.parentElement.style.transform);
  }
  await page.close();
 }
 }finally{fs.writeFileSync('browser-checks.json',JSON.stringify(report,null,2));await browser.close();server.kill();}
 assert.equal(report.assetFailures.length,0,'All resources must load');
 assert.equal(report.pageErrors.length,0,'No script exceptions');
 assert.equal(report.consoleErrors.length,0,'No console errors');
 assert(report.imageRequests.every(r=>r.url.startsWith('http://localhost:4173/')),'Every image must be local');
 for(const name of ['desktop','mobile','tablet']){
  const r=report[name];
  assert(r.images.every(i=>i.loaded)&&r.cardBackgrounds.every(i=>i.loaded),`${name}: images decode`);
  assert.equal(r.cardCount,9);
  assert(r.overflow.document<=r.overflow.viewport,`${name}: no horizontal overflow`);
  assert(r.fonts.viaoda&&r.fonts.imprima,`${name}: fonts load`);
  assert.equal(r.scene2Opacity,'1');
  assert(r.returnToTop);
  assert(Math.abs(r.reelProgress-.84)<.001);
  assert.notEqual(r.scroll[0].portal.transform,r.scroll[2].portal.transform);
  assert.notEqual(r.scroll[0].arc,r.scroll[2].arc);
 }
 console.log(JSON.stringify({status:'passed',viewports:['1440x1000','390x844','834x1000'],assetFailures:report.assetFailures,pageErrors:report.pageErrors,consoleErrors:report.consoleErrors,localImageRequests:report.imageRequests.length},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
