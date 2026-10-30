const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/hr-saa-s-hero/';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.mp4':'video/mp4','.ttf':'font/ttf'};
const server = http.createServer((req,res)=>{
  const name = decodeURIComponent(req.url.split('?')[0]);
  if(!name.startsWith(base)){res.writeHead(404).end();return;}
  const file = path.join('/work/dist',name.slice(base.length)||'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  const size=fs.statSync(file).size;
  res.setHeader('Accept-Ranges','bytes');
  if(req.headers.range){
   const [startText,endText]=req.headers.range.replace('bytes=','').split('-');
   const start=Number(startText);const end=endText?Number(endText):size-1;
   res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
   fs.createReadStream(file,{start,end}).pipe(res);
  } else {res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const results = [];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  await page.waitForTimeout(1800);
  const metrics=await page.evaluate(()=>{
   const v=document.querySelector('video');const content=document.querySelector('.hero-content');
   return {scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,topPadding:getComputedStyle(content).paddingTop,gap:getComputedStyle(content).gap,headingFont:getComputedStyle(document.querySelector('h1')).fontSize,serifFont:getComputedStyle(document.querySelector('em')).fontSize,video:{width:v.videoWidth,height:v.videoHeight,playing:!v.paused,time:v.currentTime,transform:getComputedStyle(v).transform,objectFit:getComputedStyle(v).objectFit},fonts:[document.fonts.check('500 80px Geist'),document.fonts.check('italic 100px "Instrument Serif"')]};
  });
  assert(metrics.scrollWidth<=width,'horizontal overflow');assert.equal(metrics.topPadding,'290px');assert.equal(metrics.gap,'32px');assert(metrics.video.playing);assert(metrics.video.time>0);assert(metrics.fonts.every(Boolean));
  await page.getByRole('button',{name:'Pause background video'}).click();
  assert(await page.locator('video').evaluate(v=>v.paused));
  await page.locator('video').evaluate(v=>{v.currentTime=2;});
  await page.waitForTimeout(200);
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Play background video'}).click();
  await page.waitForFunction(()=>!document.querySelector('video').paused);
  await page.getByRole('button',{name:'Create Free Account'}).click();
  assert.equal(await page.locator('input').evaluate(i=>i.validity.valueMissing),true);
  await page.getByLabel('Your work email').fill('invalid');
  assert.equal(await page.locator('input').evaluate(i=>i.validity.typeMismatch),true);
  await page.getByLabel('Your work email').fill('alex@example.com');
  await page.getByRole('button',{name:'Create Free Account'}).click();
  await page.getByRole('status').filter({hasText:'Thanks for your interest!'}).waitFor();
  assert.equal(errors.length,0,JSON.stringify(errors));
  results.push({name,viewport:{width,height},metrics,errors,checks:['no overflow','local fonts loaded','video decoded and autoplaying','video pause and resume','empty and invalid email validation','valid form feedback','screenshot saved']});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'load'});
 await page.waitForTimeout(500);
 assert(await page.locator('video').evaluate(v=>v.paused));
 results.push({name:'reduced motion',passed:true});
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();server.close();
})().catch(err=>{console.error(err);server.close();process.exit(1)});
