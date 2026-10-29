const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/nimbus-security/';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join(process.cwd(), 'dist', pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(r=>server.listen(4173,'0.0.0.0',r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = { base, browsers: 'Chromium', viewports: [], errors: [], failedRequests: [] };
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',820,1000],['above-tablet',821,1000]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      page.on('pageerror', e => report.errors.push(String(e)));
      page.on('console', msg => { if(msg.type()==='error') report.errors.push(msg.text()); });
      page.on('requestfailed', req => report.failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
      await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const metrics = await page.evaluate(()=>({
        title:document.title,
        viewport:innerWidth,
        documentWidth:document.documentElement.scrollWidth,
        columns:getComputedStyle(document.querySelector('.security-card-grid')).gridTemplateColumns,
        cards:[...document.querySelectorAll('.security-card')].map(el=>({x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})),
        fonts:[...document.fonts].map(f=>({family:f.family,weight:f.weight,status:f.status})),
        sansLoaded:document.fonts.check('400 16px "IBM Plex Sans"'),
        monoLoaded:document.fonts.check('400 16px "IBM Plex Mono"'),
        controls:document.querySelectorAll('button,a,input,select,textarea').length
      }));
      assert.equal(metrics.documentWidth,width,'No horizontal overflow');
      assert.equal(metrics.cards.length,3);
      assert.equal(metrics.title,'Nimbus Security');
      if(width<=820) assert(metrics.cards[1].y>metrics.cards[0].y,'Stacked cards');
      else assert.equal(metrics.cards[1].y,metrics.cards[0].y,'Three-column cards');
      await page.evaluate(()=>document.querySelector('.economics-card').scrollIntoView({behavior:'instant'}));
      assert(await page.locator('.economics-card').isVisible());
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      if(name==='desktop'||name==='mobile') await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      report.viewports.push({name,width,height,...metrics});
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify({viewports:report.viewports.map(({name,width,height,documentWidth,sansLoaded,monoLoaded})=>({name,width,height,documentWidth,sansLoaded,monoLoaded})),errors:report.errors,failedRequests:report.failedRequests},null,2));
    assert.equal(report.errors.length,0,'Browser console and script errors');
    assert.equal(report.failedRequests.length,0,'Asset requests');
  } finally { await browser.close(); server.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
