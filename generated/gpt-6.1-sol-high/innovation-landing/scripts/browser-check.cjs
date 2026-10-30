const {chromium}=require('/app/node_modules/playwright-core');
const http=require('http'),fs=require('fs'),path=require('path');
const base='/motionsites-results/innovation-landing/';
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mp4':'video/mp4','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const relative=decodeURIComponent(req.url.split('?')[0]).replace(base,'');
 const file=path.join('/work/dist',relative||'index.html');
 if(!file.startsWith('/work/dist/')||!fs.existsSync(file)){res.writeHead(404);return res.end();}
 const stat=fs.statSync(file),range=req.headers.range;
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
 res.setHeader('Accept-Ranges','bytes');
 if(range){const [a,b]=range.replace('bytes=','').split('-');const start=+a,end=b?+b:stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
 else{res.setHeader('Content-Length',stat.size);fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const report={errors:[],failedRequests:[],checks:[]};
 const check=(label,ok,data)=>{report.checks.push({label,passed:!!ok,...(data?{data}:{})});if(!ok)throw new Error(label);};
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('video')).every(v=>v.readyState>=3),{timeout:30000});
  const media=await page.locator('video').evaluateAll(videos=>videos.map(v=>({source:v.currentSrc,readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,playing:!v.paused,duration:v.duration})));
  check(`${name}: five videos decoded and playing`,media.length===5&&media.every(v=>v.readyState>=3&&v.playing),media);
  check(`${name}: Instrument Serif loaded`,await page.evaluate(()=>document.fonts.check('128px "Instrument Serif"')));
  check(`${name}: no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`screenshots/${name}.png`});
  await page.getByRole('button',{name:'Sign Up',exact:true}).click();
  check(`${name}: sign up focuses email`,await page.getByRole('textbox',{name:'Email address'}).evaluate(e=>e===document.activeElement));
  await page.getByRole('textbox',{name:'Email address'}).fill('reader@example.com');
  await page.getByRole('button',{name:'Subscribe to newsletter'}).click();
  check(`${name}: signup shows honest local feedback`,await page.getByRole('status').innerText().then(t=>t.includes('not connected')));
  await page.getByRole('button',{name:'Login',exact:true}).click();
  check(`${name}: login dialog opens`,await page.locator('dialog').isVisible());
  await page.keyboard.press('Escape');
  check(`${name}: dialog closes with Escape`,!(await page.locator('dialog').isVisible()));
  await page.getByRole('link',{name:'Our Manifesto'}).click();
  await page.waitForTimeout(1100);
  check(`${name}: manifesto navigation`,await page.evaluate(()=>location.hash==='#philosophy'));
  await page.getByRole('button',{name:'Learn about Research & Insight'}).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.getByRole('button',{name:'Learn about Research & Insight'}).click();
  check(`${name}: service details opens`,await page.getByRole('dialog').getByRole('heading').innerText().then(t=>t==='Research & Insight'));
  await page.keyboard.press('Escape');
  for(const selector of ['#about','.feature-frame','#philosophy','#services']){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(1000);}
  check(`${name}: no overflow after reveal`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('textbox',{name:'Email address'}).fill('');
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0);});
  await page.waitForTimeout(500);
  await page.screenshot({path:`screenshots/${name}-full.png`,fullPage:true});
  if(name==='desktop'){
   await page.getByRole('button',{name:'Pricing',exact:true}).click();
   check('pricing control opens',await page.getByRole('dialog').getByRole('heading').innerText().then(t=>t==='Pricing'));
   await page.getByRole('button',{name:'Close dialog'}).click();
   await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0);});
   await page.waitForTimeout(300);
   await page.locator('[data-testid="hero-video"]').evaluate(async v=>{v.currentTime=v.duration-.65;await v.play();});
   await page.waitForFunction(()=>{const v=document.querySelector('[data-testid="hero-video"]');return v.currentTime<3 && +v.style.opacity>.9;},{timeout:10000});
   const loop=await page.locator('[data-testid="hero-video"]').evaluate(v=>({time:v.currentTime,opacity:+v.style.opacity,playing:!v.paused}));
   check('hero fades and restarts after ended',loop.time<3&&loop.opacity>0&&loop.playing,loop);
   await page.getByRole('link',{name:'Features',exact:true}).click();
   check('features links to services',await page.evaluate(()=>location.hash==='#services'));
   await page.getByRole('link',{name:'About',exact:true}).click();
   check('about navigation',await page.evaluate(()=>location.hash==='#about'));
  }
  await page.close();
 }
 check('no JavaScript errors',report.errors.length===0);
 }catch(error){report.fatal=error.stack;process.exitCode=1;}
 finally{fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();}
})();
