const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/app/node_modules/playwright-core');
const root = path.resolve('dist');
const prefix = '/motionsites-results/orbit-engineers/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.ttf':'font/ttf' };
const server = http.createServer((req,res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(prefix, '') || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  const size = fs.statSync(file).size;
  const headers = {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  const range = req.headers.range;
  if(range) {
    const [a,b] = range.replace('bytes=','').split('-');
    const start=Number(a), end=b?Math.min(Number(b),size-1):size-1;
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else {res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(file).pipe(res);}
});
const assert = (test, msg) => { if(!test) throw Error(msg); };
(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const report = { viewports: [], consoleErrors: [], pageErrors: [], failedRequests: [], httpErrors: [] };
 try {
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
  const mobile=viewport.width===390;
  const page=await browser.newPage({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
  page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),failure:r.failure()}));
  page.on('response',r=>{if(r.status()>=400) report.httpErrors.push({url:r.url(),status:r.status()});});
  await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('video')).every(v=>v.readyState>=2));
  await page.waitForTimeout(1300);
  const entry={viewport,sections:[],navigation:[],fontLoaded:await page.evaluate(()=>document.fonts.check('400 16px Inter'))};
  const checkSection=async(n)=>{
   await page.waitForTimeout(1900);
   assert(await page.locator('main').getAttribute('data-section')===String(n),'Wrong section');
   const metrics=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,headings:document.querySelectorAll('h1').length,videos:Array.from(document.querySelectorAll('video')).map(v=>({ready:v.readyState,playing:!v.paused,width:v.videoWidth,height:v.videoHeight,error:v.error?.message||null,opacity:getComputedStyle(v).opacity})),outOfBounds:Array.from(document.querySelectorAll('h1,p,button,a')).filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.height&&(b.left<0||b.right>innerWidth+1||b.top<0||b.bottom>innerHeight+1)}).map(e=>e.textContent)}));
   assert(metrics.scrollWidth<=viewport.width&&metrics.scrollHeight<=viewport.height,'Document overflow');
   assert(metrics.outOfBounds.length===0,'Content out of viewport: '+metrics.outOfBounds);
   assert(metrics.headings===1,'Expected one visible heading');
   assert(metrics.videos[n].playing&&metrics.videos[n].opacity==='1','Video not playing/active');
   entry.sections.push({section:n,...metrics});
   await page.screenshot({path:`screenshots/${mobile?'mobile':'desktop'}${n?'-section-'+n:''}.png`});
  };
  await checkSection(0);
  await page.mouse.wheel(0,900); await page.waitForTimeout(200);
  assert(await page.locator('main').getAttribute('data-section')==='0','Scroll changed section');
  await page.getByRole('button',{name:'Scroll to explore'}).click(); await checkSection(1);
  await page.getByRole('button',{name:'Next',exact:true}).click(); await checkSection(2);
  assert(await page.getByRole('link',{name:'Reach Out'}).getAttribute('href')==='mailto:hello@orbit.engineers','Contact link invalid');
  await page.getByRole('button',{name:'Back',exact:true}).click(); await page.waitForTimeout(1900);
  await page.getByRole('button',{name:'Begin Your Mission'}).click(); await page.waitForTimeout(1900);
  assert(await page.locator('main').getAttribute('data-section')==='2','Mission CTA failed');
  await page.getByRole('button',{name:'Orbit Engineers home'}).click(); await page.waitForTimeout(1900);
  await page.getByRole('button',{name:'Scroll to explore'}).click(); await page.waitForTimeout(1900);
  await page.getByRole('button',{name:'Back to top'}).click(); await page.waitForTimeout(1900);
  assert(await page.locator('main').getAttribute('data-section')==='0','Back to top failed');
  entry.navigation.push('Scroll to explore','Next','Back','Begin Your Mission','Home','Back to top','Reach Out href','Wheel does not navigate');
  if(!mobile) {
   for(const [label,target] of [['Industries',1],['Projects',2],['Insights',1]]){
    await page.getByRole('button',{name:label,exact:true}).click();await page.waitForTimeout(1900);
    assert(await page.locator('main').getAttribute('data-section')===String(target),label+' failed'); entry.navigation.push(label);
   }
  } else assert(!(await page.getByRole('navigation').isVisible()),'Mobile navigation should be hidden');
  await page.getByRole('button',{name:'Orbit Engineers home'}).focus(); await page.keyboard.press('Enter');await page.waitForTimeout(1900);
  assert(await page.locator('main').getAttribute('data-section')==='0','Keyboard home failed');entry.navigation.push('Keyboard Enter');
  report.viewports.push(entry); await page.close();
 }
 assert(report.pageErrors.length===0 && report.consoleErrors.length===0 && report.httpErrors.length===0 && report.failedRequests.length===0,'Browser errors detected');
 report.passed=true;
 } catch(e) {report.passed=false;report.error=e.stack;process.exitCode=1;}
 finally {fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();}
})();
