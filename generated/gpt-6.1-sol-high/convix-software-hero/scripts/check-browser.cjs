const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base='/motionsites-results/convix-software-hero/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(!url.pathname.startsWith(base)){res.writeHead(404);res.end();return;}
 const name=path.join('/work/dist',decodeURIComponent(url.pathname.slice(base.length))||'index.html');
 if(!fs.existsSync(name)){res.writeHead(404);res.end();return;}
 const size=fs.statSync(name).size;const headers={'Content-Type':types[path.extname(name)]||'application/octet-stream','Accept-Ranges':'bytes'};
 const range=req.headers.range;
 if(range){const [a,b]=range.replace('bytes=','').split('-');const start=Number(a);const end=b?Math.min(Number(b),size-1):size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(name,{start,end}).pipe(res);}
 else{res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(name).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const report={viewports:[],errors:[],failedRequests:[],checks:[]};
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),failure:r.failure()}));
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',768,1000]]){
  await page.setViewportSize({width,height});await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;await document.fonts.load('36px "Instrument Serif"');await document.fonts.load('italic 36px "Instrument Serif"');});
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2,{},{timeout:30000});
  await page.evaluate(async()=>{const v=document.querySelector('video');v.currentTime=1;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  const state=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,columns:getComputedStyle(document.querySelector('.dashboard-grid')).gridTemplateColumns.split(' ').length,video:{readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,muted:document.querySelector('video').muted,loop:document.querySelector('video').loop},fonts:{inter:document.fonts.check('14px Inter'),serif:document.fonts.check('36px "Instrument Serif"'),serifItalic:document.fonts.check('italic 36px "Instrument Serif"')},hero:{height:document.querySelector('.hero').getBoundingClientRect().height,overflow:getComputedStyle(document.querySelector('.hero')).overflow}}));
  if(!state.fonts.inter||!state.fonts.serif||!state.fonts.serifItalic)throw Error('Fonts failed to load');
  if(state.scrollWidth>width||state.scrollHeight>height)throw Error(`${name} layout overflow`);
  if(state.columns!==({desktop:3,mobile:1,tablet:2}[name]))throw Error('Wrong grid columns');
  if(name==='desktop'){
   await page.getByRole('button',{name:'Clicks',exact:true}).click();if(await page.getByRole('button',{name:'Clicks',exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Toggle failed');
   await page.getByRole('button',{name:'Impressions',exact:true}).click();
   await page.getByLabel('Ste targets (This month)',{exact:true}).fill('25');await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByRole('button',{name:'Saved',exact:true}).waitFor();
   await page.getByRole('button',{name:'Cancel',exact:true}).click();if(await page.getByLabel('Ste targets (This month)',{exact:true}).inputValue()!=='10')throw Error('Reset failed');
   await page.getByLabel('Show figures for').selectOption('Last month');await page.getByLabel('Compare period by').selectOption('Previous period');await page.getByRole('button',{name:'Reset targets'}).click();
   report.checks.push('Desktop metric tabs, editable targets, Save confirmation, Cancel/reset, period dropdowns pass');
  }
  if(name==='mobile'){
   await page.getByRole('button',{name:'Open menu'}).click();await page.locator('#mobile-navigation').waitFor({state:'visible'});if(await page.locator('#mobile-navigation a').count()!==4)throw Error('Menu links missing');
   await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
   await page.locator('#mobile-navigation').getByRole('link',{name:'Home',exact:true}).click();if(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')!=='false')throw Error('Menu did not close');
   report.checks.push('Mobile hamburger opens four navigation links and closes on selection');
  }
  if(name!=='tablet')await page.screenshot({path:`/work/screenshots/${name}.png`});
  report.viewports.push({name,...state});
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});await page.getByRole('link',{name:'Get Started',exact:true}).click();if(!page.url().endsWith('#dashboard'))throw Error('CTA link failed');report.checks.push('Get Started navigates to dashboard anchor');
 fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));
 await browser.close();server.close();if(report.errors.length||report.failedRequests.length)process.exitCode=1;
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);server.close();process.exit(1)});
