const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const base='/motionsites-results/bold-studio/';
const server=http.createServer((req,res)=>{let file=path.join('/work/dist',decodeURIComponent(req.url.split('?')[0]).replace(base,'')); if(req.url===base)file='/work/dist/index.html'; try{const data=fs.readFileSync(file); const types={'.html':'text/html','.js':'application/javascript','.css':'text/css'};res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end('Not found');}});
(async()=>{await new Promise(r=>server.listen(4173,'0.0.0.0',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']}); const checks=[];const errors=[];const failures=[];
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});page.on('pageerror',e=>errors.push(e.message)); page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));
await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle',timeout:60000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2500);
checks.push({name,...await page.evaluate(()=>({viewport:[innerWidth,innerHeight],page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],font:document.fonts.check('16px "FSP DEMO - PODIUM Sharp 4.11"'),inter:document.fonts.check('16px Inter'),video:{readyState:document.querySelector('video').readyState,currentTime:document.querySelector('video').currentTime,paused:document.querySelector('video').paused,error:document.querySelector('video').error?.message||null},heading:document.querySelector('h1').innerText}))});
await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
if(name==='mobile') {await page.getByRole('button',{name:'Open menu'}).click();await page.waitForTimeout(650);checks.push({menuOpen:await page.getByRole('dialog').isVisible()});await page.screenshot({path:'/work/screenshots/mobile-menu.png'});await page.getByRole('button',{name:'Close menu'}).click();await page.waitForTimeout(600);checks.push({menuClosed:!await page.getByRole('dialog').isVisible()});await page.getByRole('button',{name:'Open menu'}).click();await page.waitForTimeout(650);await page.getByRole('navigation',{name:'Mobile navigation links'}).getByRole('link',{name:'Studio',exact:true}).click();await page.waitForTimeout(600);checks.push({menuLinkCloses:!await page.getByRole('dialog').isVisible()});}
await page.close();}
fs.writeFileSync('/work/browser-checks.json',JSON.stringify({checks,errors,failures},null,2));console.log(JSON.stringify({checks,errors,failures},null,2));await browser.close();server.close();})().catch(e=>{console.error(e);process.exit(1)});
