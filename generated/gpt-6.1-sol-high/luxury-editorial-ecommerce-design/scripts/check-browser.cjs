const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const base = '/motionsites-results/luxury-editorial-ecommerce-design/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
 const url = decodeURIComponent(req.url.split('?')[0]);
 const rel = url.startsWith(base) ? url.slice(base.length) : '';
 const file = path.join('/work/dist', rel || 'index.html');
 if (!fs.existsSync(file)) {res.writeHead(404); res.end(); return;}
 const stat = fs.statSync(file); const range = req.headers.range;
 res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
 res.setHeader('Accept-Ranges', 'bytes');
 if (range) {const [startText,endText] = range.replace('bytes=','').split('-'); const start=Number(startText), end=endText ? Number(endText) : stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
 else {res.setHeader('Content-Length',stat.size); fs.createReadStream(file).pipe(res);}
});
(async()=> {
 await new Promise(resolve=>server.listen(4173, '127.0.0.1',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={checks:[],errors:[],assets:[]};
 function assert(ok,name){report.checks.push({name,passed:!!ok});if(!ok)throw Error(name);}
 try {
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  await page.waitForTimeout(1300);
  assert(await page.title()==='STRETCH — ethical beauty, sustainable impact.',`${name}: page loads`);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name}: no horizontal page overflow`);
  await page.getByRole('button',{name:'Pause slideshow'}).click();
  await page.getByRole('button',{name:'Show slide 2'}).click();
  assert(await page.locator('[data-slide]').getAttribute('data-slide')==='1',`${name}: slide dot control`);
  await page.waitForTimeout(5200);
  assert(await page.locator('[data-slide]').getAttribute('data-slide')==='1',`${name}: pause stops automatic advancement`);
  await page.getByRole('button',{name:'Play slideshow'}).click();
  await page.waitForTimeout(5100);
  assert(await page.locator('[data-slide]').getAttribute('data-slide')==='2',`${name}: automatic advancement resumes`);
  await page.getByRole('button',{name:'Pause slideshow'}).click();
  await page.getByRole('button',{name:'Show slide 1'}).click();
  if(name==='mobile'){
   await page.getByRole('button',{name:'Open menu'}).click();
   assert(await page.getByRole('button',{name:'Close menu'}).isVisible(),'mobile: menu opens');
   await page.locator('.fixed a').filter({hasText:/^shop$/}).click();
   assert(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')==='false','mobile: menu navigation closes overlay');
  }
  await page.locator('#shop').scrollIntoViewIfNeeded(); await page.waitForTimeout(1000);
  assert(await page.locator('.product-card').count()===7,`${name}: seven ordered products`);
  await page.getByRole('tab',{name:'sets',exact:true}).click();
  assert(await page.locator('.product-card').count()===1,`${name}: sets filters collection`);
  await page.getByRole('tab',{name:'best sellers',exact:true}).click();
  const carousel=page.getByRole('tabpanel'); const box=await carousel.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+100); await page.mouse.wheel(0,400); await page.waitForTimeout(400);
  assert(await carousel.evaluate(e=>e.scrollLeft)>0,`${name}: vertical wheel moves carousel`);
  await carousel.evaluate(e=>e.scrollLeft=0);
  await page.locator('#categories').scrollIntoViewIfNeeded(); await page.waitForTimeout(1300);
  report.assets.push({viewport:name,media:await page.locator('video').evaluateAll(vs=>vs.map(v=>({src:v.currentSrc.split('/').pop(),readyState:v.readyState,width:v.videoWidth,error:v.error?.message||null}))),images:await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.currentSrc.split('/').pop(),loaded:i.complete&&i.naturalWidth>0})))});
  assert(report.assets.at(-1).media.every(v=>v.width>0&&!v.error),`${name}: all six videos decode`);
  assert(report.assets.at(-1).images.every(i=>i.loaded),`${name}: all images load`);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name}: lower sections no overflow`);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(1000);
  await page.getByRole('button',{name:'Search',exact:true}).click();
  await page.getByLabel('Search skincare').fill('serum');
  assert(await page.getByRole('dialog').getByText('Unifying serum spray').isVisible(),`${name}: search matches product`);
  await page.keyboard.press('Escape');
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  await page.close();
 }
 assert(report.errors.length===0,'no browser script, console, or resource errors');
 }catch(e){report.failure=e.stack; process.exitCode=1;}
 finally {fs.writeFileSync('/work/browser-checks.json',JSON.stringify(report,null,2));await browser.close();server.close();}
})();
