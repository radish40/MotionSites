const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const base = '/motionsites-results/speakup-venture-hero/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404);res.end();return; }
  const filename = path.join('/work/dist',url.slice(base.length) || 'index.html');
  if (!fs.existsSync(filename)) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',types[path.extname(filename)] || 'application/octet-stream');
  const size=fs.statSync(filename).size;
  if(req.headers.range){const [start,end]=req.headers.range.replace('bytes=','').split('-').map(Number);const last=end||size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${last}/${size}`,'Accept-Ranges':'bytes','Content-Length':last-start+1});fs.createReadStream(filename,{start,end:last}).pipe(res);}
  else {res.setHeader('Content-Length',size);fs.createReadStream(filename).pipe(res);}
});
(async () => {
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={errors:[],consoleErrors:[],httpErrors:[],failedRequests:[],checks:[]};
 const check=(name,pass,details)=>{results.checks.push({name,pass,details});if(!pass) throw new Error(name+': '+JSON.stringify(details));};
 try {
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('console',m=>{if(m.type()==='error')results.consoleErrors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)results.httpErrors.push({status:r.status(),url:r.url()});});
  page.on('pageerror',e=>results.errors.push(String(e)));
  page.on('requestfailed',r=>results.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.load('56px \"Recoleta Regular\"');await document.fonts.load('16px Inter');await document.fonts.ready;});
  await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=3 && v.currentTime>0;});
  const info=await page.evaluate(()=>{
   const v=document.querySelector('video'),h=document.querySelector('h1');
   return {overflow:document.documentElement.scrollWidth>innerWidth,heading:getComputedStyle(h).fontSize,font:getComputedStyle(h).fontFamily,green:getComputedStyle(h).color,video:{readyState:v.readyState,muted:v.muted,paused:v.paused,loop:v.loop,time:v.currentTime,width:v.videoWidth,height:v.videoHeight},recoleta:document.fonts.check('56px "Recoleta Regular"'),inter:document.fonts.check('16px Inter')};
  });
  check(name+' layout and media',!info.overflow&&info.video.muted&&!info.video.paused&&info.recoleta&&info.inter,info);
  await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();v.currentTime=1;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  await page.screenshot({path:'/work/screenshots/'+name+'.png',fullPage:true});
  if(name==='desktop') {
   check('desktop navigation',await page.getByRole('navigation',{name:'Main navigation',exact:true}).isVisible(),null);
   await page.getByRole('link',{name:'Projects',exact:true}).hover(); await page.waitForTimeout(200);
   check('link hover color',await page.getByRole('link',{name:'Projects',exact:true}).evaluate(el=>getComputedStyle(el).color)==='rgb(14, 120, 36)',null);
   await page.getByRole('link',{name:'Begin a venture',exact:true}).last().click();
   check('hero CTA anchor',page.url().endsWith('#begin-a-venture'),page.url());
  } else {
   await page.getByRole('button',{name:'Open menu'}).click();
   check('mobile overlay opens',await page.getByRole('dialog').isVisible(),null);
   await page.screenshot({path:'/work/screenshots/mobile-menu.png',fullPage:true});
   await page.keyboard.press('Shift+Tab');
   check('menu focus trap',await page.getByRole('dialog').getByRole('link',{name:'Begin a venture'}).evaluate(el=>el===document.activeElement),null);
   await page.keyboard.press('Escape');
   check('escape closes menu',await page.getByRole('dialog').count()===0,null);
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.getByRole('button',{name:'Close menu'}).click();
   check('close button closes menu',await page.getByRole('dialog').count()===0,null);
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.getByRole('dialog').getByRole('link',{name:'Projects',exact:true}).click();
   check('mobile navigation closes menu',await page.getByRole('dialog').count()===0&&page.url().endsWith('#projects'),null);
  }
  await page.close();
 }
 check('no runtime errors',results.errors.length===0,results.errors);
 await new Promise(r=>setTimeout(r,100));
 check('no console or network errors',results.consoleErrors.length===0&&results.httpErrors.length===0&&results.failedRequests.length===0,{consoleErrors:results.consoleErrors,httpErrors:results.httpErrors,failedRequests:results.failedRequests});
 } finally {fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
