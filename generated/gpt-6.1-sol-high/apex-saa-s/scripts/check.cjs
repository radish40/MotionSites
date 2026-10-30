const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const base = '/motionsites-results/apex-saa-s/';
const server = http.createServer((req,res)=>{
 const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith(base)){res.writeHead(404);res.end();return;}
 const file=path.join('/work/dist',pathname.slice(base.length)||'index.html');
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 const size=fs.statSync(file).size;
 const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff':'font/woff','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream';
 const range=req.headers.range;
 if(range){const [start,end]=range.replace('bytes=','').split('-');const a=Number(start),b=end?Number(end):size-1;res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${a}-${b}/${size}`,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(file,{start:a,end:b}).pipe(res);}
 else {res.writeHead(200,{'Content-Type':type,'Content-Length':size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={url:`http://localhost:4173${base}`,errors:[],failedRequests:[],viewports:[],interactions:[]};
 try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  const page=await browser.newPage({viewport});
  page.on('pageerror',e=>results.errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')results.errors.push(msg.text())});
  page.on('requestfailed',r=>results.failedRequests.push({url:r.url(),failure:r.failure()}));
  await page.goto(results.url,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=3&&v.currentTime>0.1});
  await page.evaluate(()=>{const v=document.querySelector('video');v.currentTime=2.5});
  await page.waitForTimeout(1600);
  const data=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:document.querySelector('h1').textContent,font:getComputedStyle(document.body).fontFamily,video:{readyState:document.querySelector('video').readyState,time:document.querySelector('video').currentTime,opacity:getComputedStyle(document.querySelector('video')).opacity,width:document.querySelector('video').videoWidth},marqueeAnimation:getComputedStyle(document.querySelector('.animate-marquee')).animationName}));
  assert(data.scrollWidth<=viewport.width,`Horizontal overflow: ${data.scrollWidth}`);
  assert(data.video.width>0&&data.video.opacity==='1','Video not visible');
  assert(data.marqueeAnimation==='marquee');
  results.viewports.push({...viewport,...data});
  await page.screenshot({path:`/work/screenshots/${viewport.width===1440?'desktop':'mobile'}.png`,fullPage:true});
  if(viewport.width===390){await page.getByRole('button',{name:'Open menu',exact:true}).click();assert(await page.getByRole('button',{name:'Features',exact:true}).isVisible());}
  for(const name of ['Features','Solutions','Plans','Learning']){
   if(viewport.width===390&&name!=='Features')await page.getByRole('button',{name:'Open menu',exact:true}).click();
   await page.getByRole('button',{name,exact:true}).click();
   assert(await page.locator('dialog').isVisible());
   await page.keyboard.press('Escape');
  }
  await page.getByRole('button',{name:'Nova+ Launched! Explore'}).click();assert(await page.getByRole('heading',{name:'Meet Nova+.'}).isVisible());await page.keyboard.press('Escape');
  for(const name of ['Sign Up','Start Free Right Now','Schedule a Consult']){
   await page.getByRole('button',{name,exact:true}).first().click();
   await page.getByLabel('Your name').fill('Apex Test');await page.getByLabel('Work email').fill('test@example.com');
   await page.locator('dialog form button').click();
   assert((await page.getByRole('status').textContent()).includes('preview'));
   await page.getByRole('button',{name:'Close dialog'}).click();
  }
  results.interactions.push({viewport:viewport.width,navigation:'passed',nova:'passed',ctaForms:'passed',dialogCloseAndEscape:'passed',mobileMenu:viewport.width===390?'passed':'not applicable'});
  await page.close();
 }
 assert(results.errors.length===0,JSON.stringify(results.errors));
 assert(results.failedRequests.length===0,JSON.stringify(results.failedRequests));
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
