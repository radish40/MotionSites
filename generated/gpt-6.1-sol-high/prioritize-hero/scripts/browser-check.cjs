const {chromium}=require('/app/node_modules/playwright-core');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base='/motionsites-results/prioritize-hero/';
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const rel=decodeURIComponent(url.pathname.slice(base.length));
 if(!url.pathname.startsWith(base)||rel.includes('..')){res.writeHead(404);return res.end();}
 const file=path.join('/work/dist',rel||'index.html');
 try{const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf'}[path.extname(file)];res.writeHead(200,{'Content-Type':type||'application/octet-stream'});res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
});
(async()=>{await new Promise(r=>server.listen(4173,r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const results=[];
try{for(const [name,width,height]of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[],failures=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>failures.push(r.url()));page.on('response',r=>{if(r.status()>=400)failures.push(r.url()+': '+r.status());});
 await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2200);
 assert.equal(await page.locator('h1').innerText(),'Draft, build, and ship\nevery single idea');
 const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,fonts:document.fonts.size===9&&document.fonts.check('400 16px Inter')&&document.fonts.check('400 21px Caveat'),images:[...document.images].every(i=>i.complete&&i.naturalWidth>0)}));assert.ok(layout.scrollWidth<=width,'horizontal overflow');assert.ok(layout.fonts);assert.ok(layout.images);
 await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Start free trial',exact:true}).click();await page.getByRole('dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
 if(name==='mobile'){
  const toggle=page.getByRole('button',{name:'Open menu'});await toggle.click();await page.locator('#mobile-menu').waitFor({state:'visible'});assert.equal(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');await page.screenshot({path:'/work/screenshots/mobile-menu.png',fullPage:true});await page.locator('#mobile-menu').getByRole('button',{name:'Features',exact:true}).click();await page.getByRole('dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.locator('#mobile-menu').waitFor({state:'hidden'});await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Close menu'}).click();await page.locator('#mobile-menu').waitFor({state:'hidden'});
 }else{
  for(const label of ['Features','Solutions','Resources','Pricing','Sign in','Try for free']){await page.getByRole('button',{name:label,exact:true}).click();await page.getByRole('dialog').waitFor({state:'visible'});await page.getByRole('button',{name:'Close dialog'}).click();}
  const icon=page.locator('.integration').first();await icon.hover();await page.waitForTimeout(250);assert.ok((await icon.evaluate(e=>getComputedStyle(e).transform))!=='none');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);results.push({name,viewport:{width,height},layout,script_errors:errors,failed_requests:failures,interactions:'passed'});await page.close();
 }
 const page=await browser.newPage({viewport:{width:768,height:1024},reducedMotion:'reduce'});await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});await page.waitForTimeout(2000);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.close();
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify({passed:true,results,additional_checks:['768px tablet: no horizontal overflow','reduced motion: page renders'],base_path:base},null,2));
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
