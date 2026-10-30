const { chromium } = require('/app/node_modules/playwright-core');
const fs=require('fs'),http=require('http'),path=require('path');
const prefix='/motionsites-results/akor-security/';
const server=http.createServer((req,res)=>{
 let pathname=decodeURIComponent(req.url.split('?')[0]);
 if(!pathname.startsWith(prefix)){res.writeHead(404).end();return;}
 let file=path.join('/work/dist',pathname.slice(prefix.length)||'index.html');
 if(!fs.existsSync(file)){res.writeHead(404).end();return;}
 const size=fs.statSync(file).size, ext=path.extname(file);
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.mp4':'video/mp4','.ttf':'font/ttf','.woff2':'font/woff2'})[ext]||'application/octet-stream');
 res.setHeader('Accept-Ranges','bytes');
 if(req.headers.range){const m=req.headers.range.match(/bytes=(\d+)-(\d*)/);let start=+m[1],end=m[2]?+m[2]:size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res)}else{res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res)}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});let errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})});
 await page.goto(`http://localhost:4173${prefix}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1400);
 const fonts=await page.evaluate(async()=>{await Promise.all([300,400,500,600,700].map(weight=>document.fonts.load(`${weight} 16px Sora`)));return [300,400,500,600,700].every(weight=>document.fonts.check(`${weight} 16px Sora`))});if(!fonts)throw Error('Fonts not loaded');
 const media=await page.locator('video').evaluateAll(vs=>vs.map(v=>({src:v.currentSrc,readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,paused:v.paused,currentTime:v.currentTime,muted:v.muted,loop:v.loop})));
 console.log(label,JSON.stringify(media));if(media.some(v=>v.readyState<2))throw Error('Video not ready');
 await page.screenshot({path:`/work/screenshots/${label}.png`,fullPage:true});
 const dimensions=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));if(dimensions.document>width)throw Error('Horizontal overflow');
 await page.getByRole('link',{name:'Learn More'}).click();await page.waitForTimeout(800);if(await page.evaluate(()=>location.hash)!=='#services')throw Error('Learn more link failed');
 await page.getByRole('button',{name:'Get Consultation',exact:true}).last().click();await page.waitForTimeout(100);
 if(!await page.locator('dialog').isVisible())throw Error('Dialog did not open');
 await page.getByRole('button',{name:'Prepare Request'}).click();if(await page.locator('input:invalid').count()===0)throw Error('Required validation missing');
 await page.getByLabel('Name',{exact:true}).fill('Browser Check');await page.getByLabel('Work email').fill('check@example.com');await page.getByLabel('How can we help?').fill('Security and automation consultation');await page.getByRole('button',{name:'Prepare Request'}).click();await page.getByRole('status').waitFor();await page.getByRole('button',{name:'Done',exact:true}).click();
 await page.locator('#about').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);const aboutPlayback=await page.locator('.about-media video').evaluate(v=>({paused:v.paused,currentTime:v.currentTime}));if(aboutPlayback.paused||aboutPlayback.currentTime===0)throw Error('About video autoplay failed in viewport');
 await page.getByRole('button',{name:'Get Quote',exact:true}).last().click();await page.keyboard.press('Escape');if(await page.locator('dialog').isVisible())throw Error('Escape close failed');
 if(label==='desktop'){for(const name of ['Services','About Us','Projects','Team']){await page.getByRole('link',{name,exact:true}).click();await page.waitForTimeout(650)}await page.getByRole('button',{name:'Contacts',exact:true}).click();await page.getByRole('button',{name:'Close dialog'}).click();}
 report[label]={viewport:{width,height},dimensions,fonts,media,aboutPlayback,scriptErrors:errors,failedRequests:failed,checks:['fonts loaded','both videos autoplay muted and loop','no horizontal overflow','Learn More navigation','consultation dialog','required form validation','request confirmation','quote dialog','Escape close',...(label==='desktop'?['all navigation links','Contacts dialog']:[])]};
 if(errors.length||failed.length)throw Error('Browser errors');await page.close();
 }
 fs.writeFileSync('/work/browser-checks.json',JSON.stringify(report,null,2));await browser.close();server.close();console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);server.close();process.exit(1)});
