const {chromium}=require('/app/node_modules/playwright-core');
const http=require('http');
const fs=require('fs');
const path=require('path');
const root='/work/dist';
const base='/motionsites-results/layered-depth/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const relative=decodeURIComponent(req.url.split('?')[0]).replace(base,'');
 const file=path.join(root,relative||'index.html');
 if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const report={viewports:[],scriptErrors:[],networkFailures:[],checks:[]};
 const check=(name,pass)=>{report.checks.push({name,pass});if(!pass)throw Error(name);};
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.scriptErrors.push(e.message));
  page.on('requestfailed',r=>report.networkFailures.push({url:r.url(),reason:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)report.networkFailures.push({url:r.url(),status:r.status()});});
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1000);
  check(name+' exactly two sections',await page.locator('main > section').count()===2);
  check(name+' no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  check(name+' local fonts loaded',await page.evaluate(()=>document.fonts.check('24px "Zimula Trial Bd"')&&document.fonts.check('24px "Zimula Trial Med"')));
  check(name+' CTA image loaded',await page.locator('img[alt="A collaborative conversation around a studio table"]').evaluate(img=>img.complete&&img.naturalWidth>0));
  await page.screenshot({path:'/work/screenshots/'+name+'.png'});
  if(name==='desktop'){
   await page.getByRole('button',{name:'Studio',exact:true}).click();
   check('desktop nav selection',await page.getByRole('button',{name:'Studio',exact:true}).getAttribute('aria-pressed')==='true');
   await page.getByRole('button',{name:'Language: English'}).click();
   check('language menu opens',await page.getByRole('button',{name:'English ✓'}).isVisible());
   await page.keyboard.press('Escape');
   check('language Escape dismisses',await page.getByRole('button',{name:'English ✓'}).count()===0);
  }else{
   await page.getByRole('button',{name:'Open menu'}).click();
   check('mobile menu opens',await page.locator('#mobile-menu').isVisible());
   await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
   await page.getByRole('button',{name:'Responsibility',exact:true}).click();
   check('mobile selection closes menu',await page.locator('#mobile-menu').count()===0);
   await page.getByRole('button',{name:'Open menu'}).click();
   check('mobile nav selection',await page.getByRole('button',{name:'Responsibility',exact:true}).getAttribute('aria-pressed')==='true');
   await page.keyboard.press('Escape');
  }
  // Real Web Animations completion and genuine scrolling; no synthetic media events.
  await page.waitForFunction(() => document.querySelector('[data-bird-state]').dataset.birdState.startsWith('idle'));
  const bird = page.locator('[data-recovered-bird]');
  check(name+' recovered bird image decoded',await bird.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0));
  check(name+' bird idle animation running',await bird.evaluate(el=>el.getAnimations().some(a=>a.playState==='running')));
  const initialIdle=await page.locator('[data-bird-state]').getAttribute('data-bird-state');
  await page.waitForFunction(state=>document.querySelector('[data-bird-state]').dataset.birdState!==state,initialIdle);
  check(name+' natural idle transition',await page.locator('[data-bird-state]').getAttribute('data-bird-state')!==initialIdle);
  const leaf=page.locator('[data-leaf-shadows] img').first();
  const before=await leaf.evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(350);
  check(name+' leaf shadows visibly animate',before!==await leaf.evaluate(el=>getComputedStyle(el).transform));
  await page.evaluate(()=>window.scrollTo({top:160,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('[data-bird-state]').dataset.birdState==='leave');
  check(name+' genuine scroll triggers leave',await bird.isVisible());
  await page.screenshot({path:'/work/screenshots/'+name+'-bird-leave.png'});
  check(name+' sculpture parallax',await page.locator('img[alt=""]').evaluateAll(imgs=>imgs.some(img=>img.style.transform.includes('-48px'))));
  await page.waitForFunction(()=>document.querySelector('[data-bird-state]').dataset.birdState==='hidden');
  check(name+' animation completes leave and hides',!await bird.isVisible());
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('[data-bird-state]').dataset.birdState==='enter');
  const entry1=await bird.boundingBox();await page.waitForTimeout(300);const entry2=await bird.boundingBox();
  check(name+' re-enter bird moves across screen',Math.abs(entry1.x-entry2.x)>5);
  await page.screenshot({path:'/work/screenshots/'+name+'-bird-enter.png'});
  await page.waitForFunction(()=>document.querySelector('[data-bird-state]').dataset.birdState==='idle1');
  check(name+' real re-enter completes to idle',await bird.isVisible());
  await page.screenshot({path:'/work/screenshots/'+name+'.png'});
  check(name+' email CTA',await page.getByRole('link',{name:'Start a project with Qelora by email'}).getAttribute('href')==='mailto:hello@qelora.studio');
  await page.getByRole('link',{name:'EXPLORE OUR APPROACH'}).click();await page.waitForTimeout(1100);
  check(name+' approach anchor scrolls to section 2',await page.evaluate(()=>Math.abs(window.scrollY-document.querySelector('#approach').offsetTop)<2));
  await page.screenshot({path:'/work/screenshots/'+name+'-section2.png'});
  check(name+' no overflow after interactions',await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  report.viewports.push({name,width,height,sections:2,horizontalOverflow:false});await page.close();
 }
 check('no uncaught script errors',report.scriptErrors.length===0);
 }catch(e){report.error=e.message;process.exitCode=1;}finally{
  fs.writeFileSync('/work/browser-checks.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));await browser.close();server.close();
 }
})();
