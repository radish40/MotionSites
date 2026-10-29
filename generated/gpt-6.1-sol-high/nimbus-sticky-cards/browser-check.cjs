const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('dist');
const base = '/motionsites-results/nimbus-sticky-cards/';
const server = http.createServer((req,res)=>{
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.join(root, relative || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', ({'.html':'text/html','.css':'text/css','.js':'application/javascript'})[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const results = [];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[], failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`screenshots/${name}.png`});
  const initial=await page.evaluate(()=>({active:document.querySelector('.accordion-tab.active').dataset.accordionTab,overflow:document.documentElement.scrollWidth>innerWidth,fontSans:document.fonts.check('400 16px "IBM Plex Sans"'),fontMono:document.fonts.check('400 11px "IBM Plex Mono"'),sectionHeight:document.querySelector('section').offsetHeight,stackHeight:document.querySelector('.accordion-stack').clientHeight}));
  const tabs=[];
  for(const panel of ['residency','scaling','visibility','infra']){
   await page.locator(`[data-accordion-tab="${panel}"]`).click();
   await page.waitForFunction(panel=>document.querySelector('.accordion-tab.active').dataset.accordionTab===panel,panel);
   await page.waitForTimeout(1000);
   const state=await page.evaluate(()=>({active:document.querySelector('.accordion-tab.active').dataset.accordionTab,selected:document.querySelectorAll('[aria-selected="true"]').length,scrollY,overflow:document.documentElement.scrollWidth>innerWidth}));
   if(state.active!==panel || state.selected!==1 || state.overflow) throw new Error(`${name} tab ${panel} failed`);
   tabs.push(state);
   if(panel==='visibility') await page.screenshot({path:`screenshots/${name}-stacked.png`});
  }
  const scroll=[];
  for(let i=0;i<4;i++){
   await page.evaluate(i=>{const s=document.querySelector('section');window.scrollTo({top:s.offsetTop+i/3*(s.offsetHeight-innerHeight),behavior:'instant'});},i);
   await page.waitForTimeout(100);
   scroll.push(await page.locator('.accordion-tab.active').getAttribute('data-accordion-tab'));
  }
  if(scroll.join(',')!=='infra,residency,scaling,visibility') throw new Error('Scroll sequence failed');
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(100);
  await page.keyboard.press('Tab');
  const keyboardFocus=await page.locator(':focus').getAttribute('data-accordion-tab');
  results.push({name,width,height,initial,tabs,scroll,keyboardFocus,errors,failed});
  await page.close();
 }
 fs.writeFileSync('browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();
 server.close();
})().catch(e=>{console.error(e);process.exit(1)});
