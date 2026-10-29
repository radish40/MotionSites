const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const root = path.resolve('dist');
const prefix = '/motionsites-results/travel-journal/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.ttf':'font/ttf','.json':'application/json'};
const server = http.createServer((req,res) => {
 const url = decodeURIComponent(req.url.split('?')[0]);
 if (!url.startsWith(prefix)) {res.writeHead(404); return res.end();}
 const file = path.join(root,url.slice(prefix.length) || 'index.html');
 if (!file.startsWith(root) || !fs.existsSync(file)) {res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
 fs.createReadStream(file).pipe(res);
});
(async () => {
 await new Promise(r => server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const report = {viewports:[], errors:[], failedRequests:[], interactions:[]};
 try {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   page.on('pageerror',e => report.errors.push(e.message));
   page.on('console',m => {if(m.type()==='error') report.errors.push(m.text())});
   page.on('requestfailed',r => report.failedRequests.push({url:r.url(),error:r.failure().errorText}));
   const response = await page.goto('http://localhost:4173'+prefix,{waitUntil:'networkidle'});
   assert.equal(response.status(),200);
   await page.evaluate(() => document.fonts.ready);
   await page.waitForTimeout(1500);
   const layout = await page.evaluate(() => {
    const phone=document.querySelector('.phone').getBoundingClientRect();
    return {documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,phone:{x:phone.x,y:phone.y,width:phone.width,height:phone.height},images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),fontLoaded:[...document.fonts].some(f=>f.family==='Inter' && f.weight==='700' && f.status==='loaded'),cards:[...document.querySelectorAll('article')].map(a=>({opacity:getComputedStyle(a).opacity,height:a.offsetHeight}))};
   });
   assert(layout.documentWidth<=width,'Horizontal page overflow');
   assert(layout.phone.x>=0 && layout.phone.y>=0,'Phone outside viewport');
   assert(layout.images.length===4 && layout.images.every(i=>i.loaded),'Missing images');
   assert(layout.cards.every(a=>a.opacity==='1' && a.height===200),'Card styles or animations incorrect');
   assert(layout.fontLoaded,'Font not loaded');
   await page.screenshot({path:`screenshots/${name}.png`});
   await page.getByRole('button',{name:'Asia',exact:true}).click();
   await page.getByRole('dialog',{name:'Region',exact:true}).waitFor();
   await page.getByRole('dialog').getByRole('button',{name:'Asia',exact:true}).click();
   await page.getByRole('button',{name:'Open calendar'}).click();
   await page.getByRole('dialog',{name:'calendar',exact:true}).waitFor();
   await page.keyboard.press('Escape');
   await page.getByRole('button',{name:'More options for Tokyo'}).click();
   await page.getByRole('button',{name:'Save to favorites',exact:true}).click();
   await page.getByRole('button',{name:'Saved to favorites ✓',exact:true}).click();
   await page.getByRole('button',{name:'Save to favorites',exact:true}).waitFor();
   await page.getByRole('button',{name:'Close panel'}).click();
   for (const tab of ['Feed','Account','Trips']) {
    await page.getByRole('navigation').getByRole('button',{name:tab,exact:true}).click();
    assert.equal(await page.getByRole('navigation').getByRole('button',{name:tab,exact:true}).getAttribute('aria-current'),'page');
    if(tab!=='Trips') await page.getByRole('button',{name:'Close panel'}).click();
   }
   await page.getByLabel('Destination journals').evaluate(el=>el.scrollTop=el.scrollHeight);
   await page.waitForTimeout(250);
   assert(await page.getByRole('article',{name:'Rome, 15 moments'}).isVisible());
   const scroll = await page.getByLabel('Destination journals').evaluate(el=>({top:el.scrollTop,height:el.scrollHeight,client:el.clientHeight}));
   assert(scroll.top>0,'Content does not scroll');
   await page.getByRole('button',{name:'More options for Rome'}).click();
   await page.getByRole('dialog',{name:'Rome',exact:true}).waitFor();
   await page.getByRole('button',{name:'Close panel'}).click();
   await page.screenshot({path:`screenshots/${name}-scrolled.png`});
   report.viewports.push({name,width,height,layout,scroll});
   report.interactions.push({viewport:name,passed:['region menu','calendar','Escape closes panel','favorite toggle','navigation selection','internal scrolling','Rome menu']});
   await page.close();
  }
  fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2)+'\n');
  assert.equal(report.errors.length,0,'Browser errors');
  console.log(JSON.stringify(report,null,2));
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
