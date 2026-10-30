const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const base='/motionsites-results/guardnet-landing/';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
  const file=path.join('/work/dist',decodeURIComponent(req.url.split('?')[0]).replace(base,''));
  const target=req.url.split('?')[0].endsWith('/')?path.join(file,'index.html'):file;
  fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});res.end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],consoleErrors=[],requestFailures=[],badResponses=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  page.on('requestfailed',r=>requestFailures.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()});});
  await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2));
  await page.waitForTimeout(1200);
  const videos=await page.locator('video').evaluateAll(videos=>videos.map(v=>({src:v.currentSrc,readyState:v.readyState,playing:!v.paused,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop})));
  const overflow=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
  const visiblePlayback=[];
  for(const video of await page.locator('video').all()){await video.scrollIntoViewIfNeeded();await page.waitForTimeout(450);visiblePlayback.push(await video.evaluate(v=>({playing:!v.paused,time:v.currentTime})));}
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:'/work/screenshots/'+name+'.png',fullPage:true});
  await page.getByRole('link',{name:'start today',exact:true}).click();
  await page.waitForTimeout(150);
  const startNavigates=await page.evaluate(()=>location.hash==='#mission');
  await page.getByRole('button',{name:'confirm real person',exact:true}).click();
  const confirmation=await page.getByRole('button',{name:'person confirmed ✓'}).getAttribute('aria-pressed');
  await page.getByRole('button',{name:'run demo',exact:true}).click();
  await page.getByRole('button',{name:'replay demo'}).waitFor();
  const demoRestarts=await page.locator('#mission video').evaluate(v=>v.currentTime<2&&!v.paused);
  await page.getByRole('link',{name:'Run Demo',exact:true}).click();
  const lowerDemoNavigates=await page.evaluate(()=>location.hash==='#mission');
  const nav={};
  if(name==='desktop') for(const label of ['products','offerings','mission','contact']) {await page.getByRole('link',{name:label,exact:true}).click();nav[label]=await page.evaluate(()=>location.hash);}
  report[name]={viewport:{width,height},errors,consoleErrors,requestFailures,badResponses,overflow,videos,visiblePlayback,interactions:{startNavigates,confirmation,demoRestarts,lowerDemoNavigates,nav},font:await page.evaluate(()=>document.fonts.check('16px "Futura Md BT Medium"'))};
  await page.close();
 }
 fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));
 await browser.close();server.close();
 const pass=Object.values(report).every(r=>!r.errors.length&&!r.consoleErrors.length&&!r.requestFailures.length&&!r.badResponses.length&&r.overflow.document===r.overflow.viewport&&r.font&&r.visiblePlayback.every(v=>v.playing)&&r.interactions.startNavigates&&r.interactions.confirmation==='true'&&r.interactions.demoRestarts&&r.interactions.lowerDemoNavigates);
 if(!pass)throw new Error('Browser checks failed; inspect browser-report.json');
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);server.close();process.exit(1);});
