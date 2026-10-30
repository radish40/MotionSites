const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const prefix = '/motionsites-results/lumina-footer/';
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
 const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0]).replace(prefix, '') || 'index.html');
 if (!file.startsWith('/work/dist/')) {res.writeHead(403).end();return;}
 fs.readFile(file,(err,data) => {if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');res.end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
 const results = [];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failedRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=3,{timeout:30000});
  await page.waitForTimeout(1600);
  const initialTime=await page.locator('video').evaluate(v=>v.currentTime);
  await page.waitForTimeout(500);
  const data=await page.evaluate(()=>{
   const v=document.querySelector('video');const footer=document.querySelector('footer');
   return {title:document.title,viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,footerColumns:getComputedStyle(footer.firstElementChild).gridTemplateColumns,video:{src:v.currentSrc,readyState:v.readyState,paused:v.paused,currentTime:v.currentTime,muted:v.muted,loop:v.loop,dimensions:[v.videoWidth,v.videoHeight]},fontLoaded:document.fonts.check('14px "Helvetica Regular"'),footerLinks:footer.querySelectorAll('nav a').length,socialLinks:footer.querySelectorAll('a[target="_blank"]').length};
  });
  data.video.playing=data.video.currentTime>initialTime;
  await page.getByRole('link',{name:'Explore with Lumina'}).click();
  await page.waitForTimeout(800);
  data.ctaNavigatesToFooter=await page.evaluate(()=>location.hash==='#journey' && document.querySelector('footer').getBoundingClientRect().top<innerHeight);
  await page.screenshot({path:`/work/screenshots/${name}.png`});
  const firstLink=page.getByRole('link',{name:'Labs & Workshops'});
  await firstLink.hover();
  await page.waitForTimeout(250);
  await firstLink.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  data.keyboardFocusVisible=await firstLink.evaluate(el=>el===document.activeElement && getComputedStyle(el).outlineStyle!=='none');
  data.hoverColor=await firstLink.evaluate(el=>getComputedStyle(el).color);
  await page.getByRole('link',{name:'Lumina home'}).click();
  await page.waitForTimeout(800);
  data.homeNavigatesToIntro=await page.evaluate(()=>location.hash==='#intro-title');
  data.errors=errors;data.failedRequests=failedRequests;data.noHorizontalOverflow=data.scrollWidth===width;
  results.push({name,...data});await page.close();
 }
 await browser.close();server.close();
 fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>r.errors.length || !r.noHorizontalOverflow || !r.video.playing || !r.fontLoaded || !r.ctaNavigatesToFooter || !r.keyboardFocusVisible))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
