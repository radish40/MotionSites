const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/app/node_modules/playwright-core');
const root = path.resolve('dist');
const base = '/motionsites-results/flowmate-landing/';
const types = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4'};
const server = http.createServer((req,res)=>{
  const requested = decodeURIComponent(req.url.split('?')[0]);
  if(!requested.startsWith(base)){res.writeHead(404);return res.end();}
  const file=path.join(root,requested.slice(base.length)||'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}
  const stat=fs.statSync(file); const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
  if(req.headers.range){const [start,end]=req.headers.range.replace('bytes=','').split('-').map(Number);const last=end||stat.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${last}/${stat.size}`,'Content-Length':last-start+1});fs.createReadStream(file,{start,end:last}).pipe(res);}else{res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={url:base,viewports:[],interactions:[],console_errors:[],page_errors:[],failed_requests:[]};
 const assert=(value,label)=>{if(!value)throw new Error(label);results.interactions.push(label)};
 try{
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   page.on('pageerror',e=>results.page_errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')results.console_errors.push(m.text())});
   page.on('response',r=>{if(r.status()>=400)results.failed_requests.push({url:r.url(),status:r.status()})});
   await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(900);
   const initial=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,font:document.fonts.check('16px PPMondwest'),images:[...document.images].map(i=>({src:i.src,loaded:i.complete&&i.naturalWidth>0})),video:{ready:document.querySelector('video').readyState,error:document.querySelector('video').error?.message,playing:!document.querySelector('video').paused}}));
   assert(initial.scrollWidth<=width,`${name}: no horizontal overflow`);
   assert(initial.font,`${name}: custom font loaded`);
   assert(initial.images.every(i=>i.loaded),`${name}: images loaded`);
   assert(initial.video.ready>=2,`${name}: supplied video playable`);
   // Reveal each scroll-triggered section before producing a full-page image.
   for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=Math.floor(height*.6)){await page.evaluate(top=>scrollTo({top,behavior:'instant'}),y);await page.waitForTimeout(350);}
   await page.waitForTimeout(700);
   assert(await page.locator('.feature-card').evaluateAll(els=>els.every(el=>Number(getComputedStyle(el).opacity)>.99)),`${name}: all feature cards revealed for screenshot`);
   await page.locator('button[aria-label="Pause carousel"]').click();
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(800);
   await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
   results.viewports.push({name,width,height,...initial});
   await page.getByRole('link',{name:'View our intro video'}).click();await page.waitForTimeout(1800);
   assert(await page.evaluate(()=>Math.abs(document.getElementById('video').getBoundingClientRect().top)<180),`${name}: intro link scrolls to video`);
   await page.waitForTimeout(1800);
   assert(await page.locator('.glass-prompt').innerText() === 'Daily check rival companies and ping me on messenger',`${name}: complete typewriter prompt`);
   await page.getByRole('button',{name:'Pause video',exact:true}).click();
   assert(await page.locator('video').evaluate(v=>v.paused),`${name}: video pause works`);
   await page.getByRole('button',{name:'Play video',exact:true}).click();
   assert(await page.locator('video').evaluate(v=>!v.paused),`${name}: video play works`);
   if(name==='desktop'){
    assert(await page.locator('.sidebar nav a.active').innerText().then(x=>x.includes('Video')),'desktop: section observer tracks video');
    await page.locator('.sidebar nav').getByRole('link',{name:/Features/}).click();await page.waitForTimeout(1000);
    assert(await page.locator('.sidebar nav a.active').innerText().then(x=>x.includes('Features')),'desktop: sidebar navigation and observer');
   }else{
    await page.getByRole('button',{name:'Toggle section navigation'}).click();
    assert(await page.locator('.mobile-nav').isVisible(),'mobile: navigation menu opens');
    await page.locator('.mobile-nav').getByRole('link',{name:'Features',exact:true}).click();
    assert(!await page.locator('.mobile-nav').count(),'mobile: navigation closes after selection');
   }
   await page.locator('#cards').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
   const before=await page.locator('.story-label').first().innerText();
   await page.getByRole('button',{name:'Next cards'}).click();await page.waitForTimeout(800);
   assert(await page.locator('.story-label').first().innerText()!==before,`${name}: next carousel card`);
   await page.getByRole('button',{name:'Previous cards'}).click();await page.waitForTimeout(800);
   assert(await page.locator('.story-label').first().innerText()===before,`${name}: previous carousel card`);
   await page.getByRole('button',{name:'Show Security',exact:true}).click();await page.waitForTimeout(800);
   assert(await page.locator('.story-label').first().innerText()==='Security',`${name}: direct carousel navigation`);
   await page.mouse.move(1,1);
   await page.getByRole('button',{name:'Resume carousel'}).click();await page.waitForTimeout(4900);
   assert(await page.locator('.story-label').first().innerText()!=='Security',`${name}: carousel automatically advances`);
   await page.getByRole('button',{name:'Sign up',exact:true}).click();
   assert(await page.locator('dialog').isVisible(),`${name}: signup opens accessible dialog`);
   await page.getByLabel('Your email').fill('tester@example.com');
   await page.getByRole('button',{name:'Request access',exact:true}).click();
   assert(await page.locator('.success-message').isVisible(),`${name}: preview form confirms request locally`);
   await page.keyboard.press('Escape');
   assert(!await page.locator('dialog').isVisible(),`${name}: Escape closes dialog`);
   await page.close();
  }
  results.passed=results.page_errors.length===0&&results.console_errors.length===0&&results.failed_requests.length===0;
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));
  if(!results.passed)throw new Error('Browser errors recorded');
  console.log(JSON.stringify(results,null,2));
 }catch(e){results.passed=false;results.error=e.message;fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));throw e;}
 finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
