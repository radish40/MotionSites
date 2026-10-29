const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/portfolio-about/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(process.cwd(),'dist',pathname.slice(base.length) || 'index.html');
  if(!fs.existsSync(file)) {res.writeHead(404).end(); return;}
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(4173,'0.0.0.0',r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = {};
  try {
    for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
      const page = await browser.newPage({viewport});
      const errors=[],failedRequests=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
      await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(1300);
      const initial = await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth > innerWidth,
        imageCount:document.images.length,
        imagesLoaded:[...document.images].every(i=>i.complete && i.naturalWidth>0),
        fontLoaded:[...document.fonts].some(f=>f.family==='Kanit' && f.weight==='900' && f.status==='loaded'),
        loadedFontWeights:[...document.fonts].filter(f=>f.family==='Kanit' && f.status==='loaded').map(f=>f.weight),
        heading:getComputedStyle(document.querySelector('h1')).fontSize,
        opacities:[...document.querySelectorAll('[data-character]')].map(e=>+getComputedStyle(e).opacity)
      }));
      assert.equal(initial.overflow,false);
      assert.equal(initial.imageCount,4);
      
      assert.ok(initial.imagesLoaded && initial.fontLoaded);
      await page.screenshot({path:`screenshots/${name}.png`});
      await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
      await page.waitForTimeout(500);
      const revealed = await page.locator('[data-character]').evaluateAll(els=>els.map(e=>+getComputedStyle(e).opacity));
      assert.ok(revealed.every(x=>x>.99),'All characters fully revealed after scrolling');
      assert.ok(initial.opacities.some((x,i)=>revealed[i]>x+.1),'Scroll changes character opacity');
      await page.screenshot({path:`screenshots/${name}-scrolled.png`});
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      const button=page.getByRole('link',{name:'Contact Me'});
      await button.hover();
      await page.waitForTimeout(250);
      assert.ok(Math.abs(+(await button.evaluate(e=>getComputedStyle(e).opacity))-.9)<.01);
      await page.mouse.down();
      await page.waitForTimeout(250);
      assert.ok(Math.abs(+(await button.evaluate(e=>getComputedStyle(e).opacity))-.75)<.01);
      await page.mouse.up();
      await button.focus();
      assert.ok(await button.evaluate(e=>e===document.activeElement));
      await button.click();
      await page.waitForTimeout(500);
      assert.ok(page.url().endsWith('#contact'));
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.reload({waitUntil:'networkidle'});
      assert.ok((await page.locator('[data-character]').evaluateAll(els=>els.map(e=>+getComputedStyle(e).opacity))).every(x=>x===1));
      assert.equal(errors.length,0,JSON.stringify(errors));
      report[name]={viewport,...initial,opacities:undefined,scrollReveal:true,contactAnchor:true,keyboardFocus:true,hoverAndActive:true,reducedMotion:true,errors,failedRequests};
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
