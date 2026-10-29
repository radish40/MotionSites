const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs'),http=require('http'),path=require('path');
const base='/motionsites-results/nike-hover/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webm':'video/webm','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(base)){res.writeHead(404);return res.end();}const file=path.join('/work/dist',decodeURIComponent(url.pathname.slice(base.length))||'index.html');if(!fs.existsSync(file)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
(async()=>{
await new Promise(r=>server.listen(4173,'0.0.0.0',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const report={desktop:{},mobile:{},tablet:{},errors:[],failedRequests:[]};
for(const [name,viewport]of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844},tablet:{width:768,height:1024}})){
 const context=await browser.newContext({viewport,hasTouch:name==='mobile',isMobile:name==='mobile',deviceScaleFactor:1});const page=await context.newPage();page.on('pageerror',e=>report.errors.push(name+': '+e.message));page.on('requestfailed',r=>report.failedRequests.push({name,url:r.url(),error:r.failure()?.errorText}));
 await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'domcontentloaded'});await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,20000))]));await page.waitForFunction(()=>document.querySelector('video')?.readyState>=3);await page.waitForTimeout(1300);
 const r=report[name];r.layout=await page.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],section:document.querySelector('section').getBoundingClientRect().toJSON(),fonts:{manrope:document.fonts.check('500 44px Manrope'),instrument:document.fonts.check('italic 44px "Instrument Serif"')},boxes:['.stats','.headline','.brand'].map(s=>({element:s,rect:document.querySelector(s).getBoundingClientRect().toJSON()})),video:{readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,error:document.querySelector('video').error?.message||null}}));
 if(name==='desktop'){
  await page.mouse.move(1000,450);await page.waitForTimeout(500);r.hoverPlays=await page.evaluate(()=>!document.querySelector('video').paused);const a=await page.evaluate(()=>document.querySelector('video').currentTime);await page.waitForTimeout(400);r.videoTimeAdvances=await page.evaluate(a=>document.querySelector('video').currentTime>a,a);
  await page.mouse.move(20,950);await page.waitForTimeout(500);r.leavePauses=await page.evaluate(()=>document.querySelector('video').paused);
  await page.mouse.move(425,190);await page.waitForTimeout(300);r.leftHoverPlays=await page.evaluate(()=>!document.querySelector('video').paused);
  await page.mouse.move(20,950);await page.waitForTimeout(250);await page.screenshot({path:'/work/screenshots/desktop.png'});
  await page.mouse.move(1070,400);await page.waitForTimeout(600);r.spotlight=await page.evaluate(()=>Array.from(document.querySelectorAll('[id^="trail-"]')).map(c=>({x:+c.getAttribute('cx'),y:+c.getAttribute('cy')})));await page.screenshot({path:'/work/screenshots/desktop-hover.png'});
 }else if(name==='mobile'){
  r.autoplays=await page.evaluate(()=>!document.querySelector('video').paused);await page.touchscreen.tap(240,360);await page.waitForTimeout(700);r.touchSpotlight=await page.evaluate(()=>({x:+document.querySelector('#trail-0').getAttribute('cx'),y:+document.querySelector('#trail-0').getAttribute('cy'),radius:+document.querySelector('#trail-0').getAttribute('r')}));await page.screenshot({path:'/work/screenshots/mobile.png'});
 }else await page.screenshot({path:'/work/screenshots/tablet.png'});
 await context.close();
}
fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
