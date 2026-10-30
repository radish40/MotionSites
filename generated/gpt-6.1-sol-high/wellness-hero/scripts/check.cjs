const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const root = '/work/dist';
const base = '/motionsites-results/wellness-hero/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  let name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(base)) { res.writeHead(404); return res.end(); }
  let file = path.join(root,name.slice(base.length) || 'index.html');
  fs.stat(file,(err,stat)=>{
    if(err) {res.writeHead(404); return res.end();}
    const range=req.headers.range;
    if(range){ const [a,b]=range.replace('bytes=','').split('-'); const start=Number(a),end=b?Number(b):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1,'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file,{start,end}).pipe(res); }
    else {res.writeHead(200,{'Content-Length':stat.size,'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);}
  });
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const results = [];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[];const failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
  const before=await page.locator('video').evaluate(v=>v.currentTime);
  await page.waitForTimeout(600);
  const media=await page.locator('video').evaluate(v=>({time:v.currentTime,paused:v.paused,muted:v.muted,loop:v.loop,width:v.videoWidth,height:v.videoHeight,position:getComputedStyle(v).objectPosition}));
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,askan:document.fonts.check('16px "Askan Light"'),inter:document.fonts.check('16px Inter')}));
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  const menu=page.locator(width<640?'#mobile-menu':'#desktop-menu');
  await menu.waitFor({state:'visible'});
  await menu.getByRole('link',{name:'Story',exact:true}).click();
  if(await menu.count()) throw Error('Menu did not close');
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  if(width<640) await page.locator('#mobile-menu').getByRole('button',{name:'Join the list'}).click();
  else await page.locator('nav').getByRole('button',{name:'Join the list',exact:true}).click();
  const focus=await page.locator('#email').evaluate(el=>el===document.activeElement);
  await page.locator('#email').fill('wellness@example.com');
  let alert='';page.once('dialog',async d=>{alert=d.message();await d.accept()});
  await page.locator('form').getByRole('button',{name:'Join the list'}).click();
  await page.waitForTimeout(100);
  await page.locator('#email').fill('invalid');
  const invalid=await page.locator('#email').evaluate(el=>!el.checkValidity());
  const result={viewport:name,layout,media,playbackAdvanced:media.time>before,menuToggle:true,menuLinkCloses:true,joinFocusesInput:focus,emailAlert:alert,invalidEmailRejected:invalid,scriptErrors:errors,failedRequests:failed};
  if(layout.scrollWidth>width || layout.scrollHeight>height || !layout.askan || !layout.inter || media.paused || !result.playbackAdvanced || !focus || !alert.includes('wellness@example.com') || !invalid || errors.length || failed.length) throw Error(JSON.stringify(result));
  results.push(result);await page.close();
 }
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
