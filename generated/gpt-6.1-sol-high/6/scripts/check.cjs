const {chromium}=require('/app/node_modules/playwright-core');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
(async()=>{
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(d.toString().includes('4173'))resolve()});server.on('error',reject)});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results={};
try{
for(const [name,size] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
const page=await browser.newPage({viewport:size,deviceScaleFactor:1});let errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(r.url()));page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+': '+r.status())});
await page.goto('http://127.0.0.1:4173/motionsites-results/6/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1400);
const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,portraitLoaded:document.querySelector('.portrait').naturalWidth>0,mask:getComputedStyle(document.querySelector('.portrait-wrap')).maskImage,anton:document.fonts.check('16px Anton'),inter:document.fonts.check('16px Inter'),headline:document.querySelector('h1').innerText}));
await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
await page.getByRole('link',{name:'// HIRE ME'}).click();await page.getByRole('dialog').waitFor({state:'visible'});
const contact=await page.locator('.email-link').getAttribute('href');await page.keyboard.press('Escape');
const modalClosed=await page.getByRole('dialog').count()===0;
await page.getByRole('link',{name:'MORE ABOUT ME'}).click();await page.getByRole('heading',{name:'Hi, I’m Olivia.'}).waitFor();await page.getByRole('button',{name:'Close panel'}).click();
let navigation=true;if(name==='desktop'){for(const key of ['projects','blog','about','resume']){await page.locator('nav a',{hasText:key}).click();await page.getByRole('dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');}}
results[name]={...layout,errors,failed,contact,escapeClosesDialog:modalClosed,navigation};await page.close();
}
fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exit(1)});
