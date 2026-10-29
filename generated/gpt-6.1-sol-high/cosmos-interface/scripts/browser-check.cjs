const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const base = '/motionsites-results/cosmos-interface/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.woff2':'font/woff2' };
const server = http.createServer((req,res) => {
 const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0].replace(base,'') || 'index.html'));
 if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404);return res.end();}
 const size=fs.statSync(file).size; const range=req.headers.range;
 res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
 if(range){const [a,b]=range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
 else {res.writeHead(200,{'Content-Length':size,'Accept-Ranges':'bytes'});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 try {
 for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
 const page=await browser.newPage({viewport}); const errors=[],failed=[],aborted=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('requestfailed',r=>{const entry={url:r.url(),error:r.failure()?.errorText};if(entry.error==='net::ERR_ABORTED')aborted.push(entry);else failed.push(entry)});
 await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
 const media=await page.evaluate(()=>[...document.querySelectorAll('video')].map(v=>({readyState:v.readyState,duration:v.duration,width:v.videoWidth,error:v.error?.message||null})));
 if(media.some(v=>v.readyState<2||!v.width))throw Error('Video failed '+JSON.stringify(media));
 await page.screenshot({path:`/work/screenshots/${name}.png`});
 const overflow=[];
 async function checkOverflow(stage){if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))overflow.push(stage);}
 await checkOverflow('hero');
 await page.getByRole('link',{name:'Discover Cortex'}).click();await page.waitForTimeout(2000);
 const discover=await page.evaluate(()=>({hash:location.hash,y:scrollY,time:document.querySelector('video').currentTime}));
 await page.screenshot({path:`/work/screenshots/${name}-about.png`});await checkOverflow('about');
 const nav=[];
 for(const label of ['Cortex','Developer','Support','Interface']){await page.getByRole('navigation').getByRole('link',{name:label,exact:true}).click();await page.waitForTimeout(1300);nav.push({label,...await page.evaluate(()=>({hash:location.hash,y:scrollY}))});}
 const section=await page.locator('#solutions').evaluate(e=>({top:e.offsetTop,height:e.offsetHeight}));
 const stages=[];
 for(const [index,progress]of [0.14,0.49,0.83].entries()){
 await page.evaluate(({section,progress})=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,section.top+(section.height-innerHeight)*progress)}, {section,progress});
 await page.waitForTimeout(2300);await checkOverflow(`stage-${index+1}`);
 stages.push(await page.locator('#solutions').evaluate(e=>({time:e.querySelector('video').currentTime,visibleText:[...e.querySelectorAll('h1')].filter(h=>Number(getComputedStyle(h.parentElement.parentElement).opacity)>.9).map(h=>h.textContent)})));
 await page.screenshot({path:`/work/screenshots/${name}-interface-${index+1}.png`});
 }
 const font=await page.evaluate(()=>document.fonts.check('400 16px "Inter Tight"'));
 report[name]={viewport,media,font,discover,nav,stages,errors,failed,aborted,overflow};
 if(errors.length||failed.length||overflow.length||!font||discover.hash!=='#discover'||!stages.every(s=>s.visibleText.length===2)||stages[2].time<=stages[0].time)throw Error('Browser checks failed '+JSON.stringify(report[name]));
 await page.close();
 }
 fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
