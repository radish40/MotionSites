const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const prefix = '/motionsites-results/shop/';
const types = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.webp':'image/webp','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(req.url.split('?')[0]);
  if(!pathname.startsWith(prefix)){res.writeHead(404);return res.end();}
  const file=path.join('/work/dist',pathname.slice(prefix.length)||'index.html');
  if(!fs.existsSync(file)){res.writeHead(404);return res.end();}
  const stat=fs.statSync(file);const range=req.headers.range;
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  if(range){const [startText,endText]=range.replace('bytes=','').split('-');const start=Number(startText),end=endText?Number(endText):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else {res.setHeader('Content-Length',stat.size);fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results=[];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];const failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
  await page.goto(`http://127.0.0.1:4173${prefix}`,{waitUntil:'networkidle'});
  await page.waitForTimeout(3500);
  const heroImage=await page.locator('section').first().screenshot({path:`/work/screenshots/${name}-hero.png`});
  await page.getByRole('navigation').getByRole('link',{name:'Shop Now'}).click();
  await page.waitForTimeout(3200);
  const sweetPlayback=await page.locator('#scent-finder video').evaluateAll(videos=>videos.filter(v=>v.getBoundingClientRect().width>0).every(v=>!v.paused&&v.currentTime>0));
  const shopScroll=await page.evaluate(()=>window.scrollY>100);
  await page.locator('#scent-finder button').click();
  await page.getByRole('dialog').waitFor({state:'visible'});
  const sweetAdded=await page.getByRole('dialog').getByText('Eau So Sweet',{exact:true}).isVisible();
  await page.getByRole('button',{name:'Continue shopping'}).click();
  await page.locator('#wild-scent').scrollIntoViewIfNeeded();await page.waitForTimeout(3200);
  const wildPlayback=await page.locator('#wild-scent video').evaluateAll(videos=>videos.filter(v=>v.getBoundingClientRect().width>0).every(v=>!v.paused&&v.currentTime>0));
  await page.locator('#wild-scent button').click();
  const wildAdded=await page.getByRole('dialog').getByText('Eau So Extra',{exact:true}).isVisible();
  await page.getByRole('button',{name:'Close',exact:true}).click();
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1000);
  await page.locator('button:visible').filter({hasText:'Add to Cart'}).click();
  const freshAdded=await page.getByRole('dialog').getByText('Eau So Fresh',{exact:true}).isVisible();
  await page.getByRole('dialog').getByRole('button',{name:'Remove'}).last().click();
  const removed=await page.getByRole('dialog').getByText('Eau So Fresh',{exact:true}).count()===0;
  await page.keyboard.press('Escape');
  await page.getByRole('link',{name:'Cart',exact:true}).click();
  const cartOpens=await page.getByRole('dialog').isVisible();await page.keyboard.press('Escape');
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,sections:[...document.querySelectorAll('section')].map(el=>({height:el.offsetHeight,top:el.offsetTop})),images:[...document.images].map(el=>({src:el.getAttribute('src'),loaded:el.complete&&el.naturalWidth>0})),videos:[...document.querySelectorAll('video')].filter(el=>el.getBoundingClientRect().width>0).map(el=>({src:el.currentSrc,readyState:el.readyState,paused:el.paused,width:el.videoWidth,height:el.videoHeight,currentTime:el.currentTime,muted:el.muted,loop:el.loop}))}));
  await page.evaluate(()=>document.activeElement?.blur());
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  results.push({viewport:{name,width,height},errors,failed,checks:{sweetPlayback,wildPlayback,shopScroll,sweetAdded,wildAdded,freshAdded,removed,cartOpens,noHorizontalOverflow:layout.scrollWidth===width},layout});
  await page.close();
 }
 await browser.close();server.close();server.closeAllConnections();
 fs.writeFileSync('/work/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>r.errors.length||r.failed.length||Object.values(r.checks).some(v=>!v)||r.layout.images.some(i=>!i.loaded)||r.layout.videos.some(v=>v.readyState<2)))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exit(1);});
