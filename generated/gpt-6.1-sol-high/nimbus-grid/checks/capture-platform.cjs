const {chromium}=require('/app/node_modules/playwright-core');
const http=require('http');
const fs=require('fs');
const path=require('path');
const assert=require('assert');
const base='/motionsites-results/nimbus-grid/';
const server=http.createServer((req,res)=>{
 const target=path.join('/work/dist',decodeURIComponent(req.url.split('?')[0]).replace(base,''));
 const file=req.url.split('?')[0].endsWith('/')?path.join(target,'index.html'):target;
 try{const data=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html');res.end(data);}catch{res.statusCode=404;res.end('Not found');}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.route('https://fragcoord.xyz/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html></html>'}));
 await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 for(let i=0;i<4;i++){
 await page.evaluate(i=>{document.documentElement.style.scrollBehavior='auto';const e=document.querySelector('#platform');scrollTo({top:scrollY+e.getBoundingClientRect().top+(e.offsetHeight-innerHeight)*i/3,behavior:'instant'});},i);
 await page.waitForTimeout(1200);
 console.log(i,await page.locator('.accordion-card h2').nth(i).evaluate(e=>({text:e.textContent,color:getComputedStyle(e).color,visibility:getComputedStyle(e).visibility,rect:e.getBoundingClientRect().toJSON()})));
 await page.screenshot({path:`/work/screenshots/mobile-platform-${i+1}.png`});
 }
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
