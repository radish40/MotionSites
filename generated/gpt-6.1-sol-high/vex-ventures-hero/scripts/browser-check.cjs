const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const base = '/motionsites-results/vex-ventures-hero/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4'};
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base,'');
  const file = path.join('/work/dist', relative || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) {res.writeHead(404); return res.end();}
  const size=fs.statSync(file).size;
  const range=req.headers.range;
  if(range) {
    const [start,end] = range.replace('bytes=','').split('-').map(Number);
    const last=end || size-1;
    res.writeHead(206,{'Content-Type':types[path.extname(file)],'Content-Range':`bytes ${start}-${last}/${size}`,'Accept-Ranges':'bytes','Content-Length':last-start+1});
    fs.createReadStream(file,{start,end:last}).pipe(res);
  } else {res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Content-Length':size}); fs.createReadStream(file).pipe(res);}
});
(async()=>{
  await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const results=[];
  for (const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
    const page=await browser.newPage({viewport,deviceScaleFactor:1});
    const errors=[], failedRequests=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure().errorText}));
    await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
    await page.waitForTimeout(3500);
    const measurements=await page.evaluate(async()=>{
      await document.fonts.ready;
      const v=document.querySelector('video');
      const t=v.currentTime;
      await new Promise(r=>setTimeout(r,250));
      return {viewport:{width:innerWidth,height:innerHeight},page:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},font:getComputedStyle(document.body).fontFamily,interLoaded:document.fonts.check('16px Inter'),video:{readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,playing:!v.paused && v.currentTime>t,muted:v.muted,loop:v.loop},heading:document.querySelector('h1').getBoundingClientRect().toJSON(),lastCharacterOpacity:getComputedStyle(document.querySelector('h1 .heading-line:last-child span:last-child')).opacity};
    });
    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    await page.getByRole('link',{name:'Explore Now'}).click();
    await page.waitForTimeout(200);
    const exploreWorks=new URL(page.url()).hash==='#ventures';
    const chatLinks=await page.getByRole('link',{name:'Start a Chat'}).evaluateAll(links=>links.map(l=>l.getAttribute('href')));
    const navigation={};
    if (name==='desktop') {
      for(const link of ['Story','Investing','Building','Advisory']) {
        await page.getByRole('link',{name:link,exact:true}).click();
        navigation[link]=new URL(page.url()).hash === '#'+link.toLowerCase();
      }
      await page.getByRole('link',{name:'Explore Now'}).hover();
      await page.waitForTimeout(250);
      navigation.exploreHover=await page.getByRole('link',{name:'Explore Now'}).evaluate(el=>({background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}));
    }
    const result={name,...measurements,errors,failedRequests,exploreWorks,chatLinks,navigation};
    results.push(result);
    if(measurements.page.width>viewport.width || measurements.page.height>viewport.height || errors.length || failedRequests.length || !measurements.interLoaded || !measurements.video.playing || !exploreWorks || (name==='desktop' && (navigation.exploreHover.background!=='rgb(255, 255, 255)' || navigation.exploreHover.color!=='rgb(0, 0, 0)'))) throw new Error(JSON.stringify(result));
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close(); server.close();
})().catch(e=>{console.error(e);process.exit(1)});
