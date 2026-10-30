const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const base = '/motionsites-results/weblex-dark-hero/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
  const clean = decodeURIComponent(req.url.split('?')[0]);
  if (!clean.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', clean.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const range = req.headers.range;
  const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes'};
  if (range) {
    const [a,b] = range.replace('bytes=','').split('-');
    const start = Number(a), end = b ? Number(b) : size-1;
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(file).pipe(res); }
});
(async()=>{
  await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const errors = [];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{ if(msg.type()==='error') errors.push(msg.text()); });
  page.on('response',res=>{ if(res.status()>=400) errors.push(`${res.status()} ${res.url()}`); });
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('video').currentTime>1);
  const checkLayout = async()=>page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,heading:getComputedStyle(document.querySelector('h1')).fontSize, bottomPadding:innerHeight-document.querySelector('.hero-actions').getBoundingClientRect().bottom}));
  const desktop = await checkLayout();
  assert(desktop.scrollWidth===desktop.width); assert(desktop.scrollHeight===desktop.height); assert(desktop.heading==='62px'); assert(desktop.bottomPadding===100);
  const video = await page.locator('video').evaluate(v=>({duration:v.duration,muted:v.muted,loop:v.loop,autoplay:v.autoplay,playsInline:v.playsInline,readyState:v.readyState,width:v.videoWidth,height:v.videoHeight}));
  assert(video.muted && video.loop && video.autoplay && video.playsInline && video.readyState>=2);
  // Pause at a repeatable actual video frame for evidence screenshots.
  await page.locator('video').evaluate(v=>{v.pause();v.currentTime=3;});
  await page.waitForTimeout(250);
  await page.screenshot({path:'/work/screenshots/desktop.png',fullPage:true});
  const fade = [];
  for (const time of [0.5,1.2,video.duration-0.9,video.duration-0.2]) {
    await page.locator('video').evaluate((v,t)=>{v.currentTime=t;},time);
    await page.waitForTimeout(100);
    fade.push({time,opacity:await page.locator('video').evaluate(v=>Number(v.style.opacity))});
  }
  assert(Math.abs(fade[0].opacity-.5)<.02 && fade[1].opacity===1 && Math.abs(fade[2].opacity-.5)<.02 && fade[3].opacity===0);
  await page.locator('video').evaluate(v=>{v.currentTime=v.duration-.1;v.play();});
  await page.waitForFunction(()=>document.querySelector('video').currentTime<1);
  const naturalLoop = true;
  await page.getByRole('navigation').getByRole('link',{name:'Features',exact:true}).click();
  assert(await page.evaluate(()=>location.hash==='#features'));
  await page.getByRole('link',{name:'See Pricing',exact:true}).click();
  assert(await page.evaluate(()=>location.hash==='#pricing'));
  await page.getByRole('link',{name:'Get Started Now',exact:true}).click();
  assert(await page.evaluate(()=>location.hash==='#features'));
  await page.setViewportSize({width:768,height:1000});
  assert(await page.locator('h1').evaluate(e=>getComputedStyle(e).fontSize)==='48px');
  await page.setViewportSize({width:390,height:844});
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('video').currentTime>1);
  const mobile = await checkLayout();
  assert(mobile.scrollWidth===mobile.width && mobile.scrollHeight===mobile.height && mobile.heading==='36px' && mobile.bottomPadding===100);
  await page.getByRole('button',{name:'Open menu'}).click();
  await page.locator('#mobile-menu').waitFor({state:'visible'});
  assert(await page.locator('#mobile-menu a').count()===5);
  await page.keyboard.press('Escape');
  assert(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')==='false');
  await page.getByRole('button',{name:'Open menu'}).click();
  await page.locator('#mobile-menu').getByRole('link',{name:'About',exact:true}).click();
  assert(await page.evaluate(()=>location.hash==='#about'));
  assert(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')==='false');
  await page.locator('video').evaluate(v=>{v.pause();v.currentTime=3;});
  await page.waitForTimeout(250);
  await page.screenshot({path:'/work/screenshots/mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);
  const report = {desktop,mobile,video,fade,naturalLoop,errors,checks:['Production page served at exact subpath','Desktop and mobile: no horizontal or vertical overflow','Responsive heading 62px / 48px / 36px','Content bottom padding 100px','Video loaded, autoplayed and naturally looped','Fade-in, full opacity, fade-out and black interval verified','Desktop navigation and hero anchors','Mobile menu open, close, Escape, and navigation','No browser console errors, page errors or failed HTTP requests']};
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1);});
