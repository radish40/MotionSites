const {chromium}=require('/app/node_modules/playwright-core');
const http=require('http');
const fs=require('fs');
const path=require('path');
const assert=require('assert');
const base='/motionsites-results/nimbus-grid/';
const server=http.createServer((req,res)=>{
 const target=path.join('/work/dist',decodeURIComponent(req.url.split('?')[0]).replace(base,''));
 const file=req.url.split('?')[0].endsWith('/')?path.join(target,'index.html'):target;
 try{const data=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html');res.end(data);}catch{res.statusCode=404;res.end('Not found');}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const report={desktop:{},mobile:{},pageErrors:[],consoleErrors:[],failedRequests:[],responses:[]};
 for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  page.on('pageerror',e=>report.pageErrors.push({viewport:name,error:e.message}));
  page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({viewport:name,error:m.text()});});
  page.on('requestfailed',req=>report.failedRequests.push({viewport:name,url:req.url(),error:req.failure()?.errorText}));
  page.on('response',res=>{if(res.status() >= 400 || /fragcoord|fonts/.test(res.url()))report.responses.push({viewport:name,status:res.status(),url:res.url()});});
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(3500);
  const expectedShader=await page.locator('.shader-bg').getAttribute('src');
  for(let attempt=0; attempt<60 && !page.frames().some(f=>f.url()===expectedShader); attempt++) await page.waitForTimeout(250);
  const shaderFrame=page.frames().find(f=>f.url()===expectedShader);
  assert(shaderFrame,'shader must navigate to the computed viewport');
  const shaderSize=await page.locator('.shader-bg').evaluate(e=>({width:parseInt(e.style.width),height:parseInt(e.style.height)}));
  assert(shaderSize.width<=1422 && shaderSize.height<=800,'shader viewport stays within the required cap');
  await shaderFrame.waitForFunction(({width,height})=>[...document.querySelectorAll('canvas')].some(c=>c.width===width && c.height===height),shaderSize,{timeout:30000});
  report[name].fonts=await page.evaluate(()=>({sans:document.fonts.check('400 16px "IBM Plex Sans"'),mono:document.fonts.check('400 12px "IBM Plex Mono"')}));
  report[name].shaderFrames=page.frames().map(f=>f.url());
  report[name].shaderElement=await page.locator('.shader-bg').evaluate(e=>({src:e.src,width:e.style.width,height:e.style.height,scale:e.style.getPropertyValue('--shader-scale')}));
  console.log(name,'shader',report[name].shaderElement);
  for(const frame of page.frames().filter(f=>f.url().includes('fragcoord'))) console.log('shader canvases',await frame.evaluate(()=>[...document.querySelectorAll('canvas')].map(e=>({width:e.width,height:e.height,rect:e.getBoundingClientRect().toJSON()}))));
  for(const label of ['API','Console','CLI']){
   await page.getByRole('tab',{name:label,exact:true}).click();
   await page.waitForTimeout(1900);
   const pane=page.locator('.console-pane:not([hidden])');
   assert.equal(await pane.count(),1);
   assert.equal(await pane.locator('[data-typed]').textContent(),await pane.locator('[data-typed]').getAttribute('data-typed'));
  }
  report[name].consoleTabs='pass: all three panes and completed typing';
  await page.screenshot({path:`/work/screenshots/${name}.png`});
  // Shader rendering is already captured and checked; release software WebGL for the remaining interactions.
  await page.locator('.shader-bg').evaluate(e=>e.remove());
  const overflow=[];
  for(const id of ['home','platform','pricing','security','plans','operations']){
   await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(100);
   const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
   if(metrics.scrollWidth>metrics.width)overflow.push({id,...metrics});
  }
  assert.deepEqual(overflow,[]);report[name].overflow='pass: no horizontal overflow across all six sections';
  const platformMetrics=await page.locator('#platform').evaluate(e=>({top:scrollY+e.getBoundingClientRect().top,travel:e.offsetHeight-innerHeight}));
  for(let i=0;i<4;i++){
   await page.evaluate(({top,travel,i})=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo({top:top+travel*i/3,behavior:'instant'});},{...platformMetrics,i});
   await page.waitForTimeout(1000);
   console.log(name,i,await page.evaluate(()=>({y:scrollY,top:document.querySelector('#platform').getBoundingClientRect().top,active:document.querySelector('.accordion-tab.active').dataset.card})));
   assert.equal(await page.locator('.accordion-tab.active').getAttribute('data-card'),String(i));
   const info=await page.locator('.accordion-card').nth(i).evaluate(e=>({y:e.getBoundingClientRect().y,height:e.clientHeight,visualHeight:e.querySelector('.accordion-visual').clientHeight,copyHeight:e.querySelector('.accordion-copy').clientHeight}));
   report[name]['accordion'+i]=info;
   await page.screenshot({path:`/work/screenshots/${name}-platform-${i+1}.png`});
  }
  await page.locator('.accordion-tab[data-card="1"]').click();await page.waitForTimeout(1800);
  assert.equal(await page.locator('.accordion-tab.active').getAttribute('data-card'),'1');
  report[name].accordion='pass: all four scroll segments and tab navigation';
  await page.getByRole('button',{name:'Per month',exact:true}).click();
  assert.equal(await page.locator('[data-rate]').first().textContent(),'$21.50 / TiB / month');
  await page.getByRole('button',{name:'Per GiB',exact:true}).click();
  assert.equal(await page.locator('[data-rate]').first().textContent(),'$0.021 / GiB / month');
  report[name].billing='pass: month/GiB toggles';
  await page.locator('#pricing').scrollIntoViewIfNeeded();await page.screenshot({path:`/work/screenshots/${name}-pricing.png`});
  await page.locator('#security').scrollIntoViewIfNeeded();await page.screenshot({path:`/work/screenshots/${name}-security.png`});
  await page.locator('.new-pool').click();await page.waitForFunction(()=>document.querySelector('.dashboard-toast').classList.contains('flash'));
  report[name].dashboard='pass: pool toast interaction';
  await page.locator('#plans').scrollIntoViewIfNeeded();await page.screenshot({path:`/work/screenshots/${name}-console.png`});
  await page.locator('.modal-cube-shell').click();await page.waitForTimeout(1000);
  assert.equal(await page.locator('.modal-cube-shell').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.cube-particle').count(),14);
  await page.screenshot({path:`/work/screenshots/${name}-cube.png`});
  await page.locator('.modal-cube-shell').press('Enter');assert.equal(await page.locator('.modal-cube-shell').getAttribute('aria-pressed'),'false');
  await page.locator('.modal-cube-shell').press('Space');assert.equal(await page.locator('.modal-cube-shell').getAttribute('aria-pressed'),'true');
  report[name].cube='pass: mouse, Enter, Space and 14 shards';
  await page.close();
 }
 await browser.close();server.close();
 fs.writeFileSync('/work/checks/browser-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({desktop:report.desktop,mobile:report.mobile,pageErrors:report.pageErrors,consoleErrors:report.consoleErrors,failedRequests:report.failedRequests,httpErrors:report.responses.filter(r=>r.status>=400)},null,2));
})().catch(e=>{console.error(e);server.close();process.exit(1);});
