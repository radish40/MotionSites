const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const base = '/motionsites-results/datacore-booking/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.ttf':'font/ttf','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
 let url = decodeURIComponent(req.url.split('?')[0]);
 if(!url.startsWith(base)){ res.writeHead(404).end(); return; }
 let file = path.resolve('dist', url.slice(base.length) || 'index.html');
 if(!file.startsWith(path.resolve('dist') + '/') || !fs.existsSync(file)){res.writeHead(404).end();return;}
 const size=fs.statSync(file).size;
 const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
 if(req.headers.range){ const match=/bytes=(\d+)-(\d*)/.exec(req.headers.range);const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),size-1):size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
 else {res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const report={viewports:[], interactions:[], errors:[], failedRequests:[]};
 try {
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   page.on('pageerror',e=>report.errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
   page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),failure:r.failure()}));
   page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
   await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{await Promise.all(['400 16px Manrope','500 16px Manrope','600 16px Manrope','400 16px Cabin','500 16px Cabin','600 16px Cabin','400 16px "Instrument Serif"','italic 400 16px "Instrument Serif"','400 16px Inter','500 16px Inter'].map(f=>document.fonts.load(f)));await document.fonts.ready;});
   await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=2&&!v.paused&&v.currentTime>0.2;},{timeout:20000});
   const metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,fontStatus:document.fonts.status,fonts:['Manrope','Cabin','Instrument Serif','Inter'].map(f=>[f,document.fonts.check(`16px "${f}"`)]),video:{width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight,muted:document.querySelector('video').muted,loop:document.querySelector('video').loop,playing:!document.querySelector('video').paused}}));
   assert(metrics.scrollWidth<=width,'Horizontal overflow'); assert(metrics.fonts.every(x=>x[1]),'Missing font');
   await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
   await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
   if(name==='desktop'){
    await page.getByRole('button',{name:'Services',exact:true}).click();
    await page.getByRole('button',{name:'Hotels',exact:true}).click();
    await page.getByRole('dialog').waitFor({state:'visible'});
    await page.getByRole('button',{name:'Back to home'}).click();
    for(const label of ['Sign In','Get Started','Book a Free Demo','Get Started Now','Reviews','Contact us']){
     await page.getByRole('button',{name:label,exact:true}).click();
     await page.getByRole('dialog').waitFor({state:'visible'});
     await page.keyboard.press('Escape');
    }
    report.interactions.push('Desktop Services dropdown, service selection, all navigation and CTA preview dialogs, Escape dismissal');
   }else{
    await page.getByRole('button',{name:'Open menu'}).click();
    assert(await page.locator('#mobile-menu').isVisible());
    const bg=await page.locator('#mobile-menu').evaluate(e=>getComputedStyle(e).backgroundColor);assert.equal(bg,'rgb(0, 0, 0)');
    await page.screenshot({path:'screenshots/mobile-menu.png'});
    await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('button',{name:'Services',exact:true}).click();
    await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('button',{name:'Stays',exact:true}).click();
    await page.getByRole('dialog').waitFor({state:'visible'});
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.getByRole('button',{name:'Close menu'}).click();
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-menu').count(),0);
    report.interactions.push('Mobile fullscreen black menu, close button, Escape, Services selection, scroll restoration');
   }
   report.viewports.push({name,width,height,...metrics});await page.close();
  }
  console.log(JSON.stringify(report,null,2));assert.equal(report.errors.length,0,'Browser errors');assert.equal(report.failedRequests.length,0,'Failed requests');
  report.status='passed'; fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
