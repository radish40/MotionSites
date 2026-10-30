const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = path.resolve('dist');
const base = '/motionsites-results/scroll-marquee/';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.gif':'image/gif','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length);
  const file = path.resolve(root, relative || 'index.html');
  if (!req.url.startsWith(base) || !file.startsWith(root+'/')) { res.writeHead(404).end(); return; }
  fs.readFile(file,(err,data) => {
    if(err) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173,'127.0.0.1',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = [];
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      const errors=[], failures=[];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if(m.type()==='error') errors.push(m.text()); });
      page.on('requestfailed', r => failures.push({url:r.url(),error:r.failure()?.errorText}));
      page.on('response', r => { if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`); });
      await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      const measure = () => page.evaluate(() => {
        const gallery=document.querySelector('[aria-label="Scroll-driven design gallery"]');
        const rows=[...document.querySelectorAll('[data-row]')];
        const card=rows[0].firstElementChild;
        const style=getComputedStyle(card);
        return {scroll:scrollY,sectionTop:gallery.getBoundingClientRect().top+scrollY, heroHeight:document.querySelector('[aria-label="Hero"]').offsetHeight,
          x:rows.map(r => new DOMMatrixReadOnly(getComputedStyle(r).transform).m41), count:rows.map(r=>r.children.length),
          card:{width:card.offsetWidth,height:card.offsetHeight,radius:style.borderRadius}, gap:getComputedStyle(rows[0]).gap,
          rowGap:rows[1].getBoundingClientRect().top-rows[0].getBoundingClientRect().bottom,
          padding:getComputedStyle(gallery).paddingTop, background:getComputedStyle(gallery).backgroundColor,
          font:getComputedStyle(document.body).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth};
      });
      const start=await measure();
      assert.equal(start.heroHeight,height); assert.deepEqual(start.count,[33,30]);
      assert.deepEqual(start.card,{width:420,height:270,radius:'16px'});
      assert.equal(start.gap,'12px');assert.equal(start.rowGap,12);
      assert.equal(start.padding,name==='desktop'?'160px':'96px');
      assert.equal(start.overflow,false); assert.deepEqual(start.x,[-200,200]);
      await page.mouse.wheel(0,300); await page.waitForTimeout(400);
      const scrolled=await measure();
      assert.ok(scrolled.scroll>0); assert.ok(scrolled.x[0]>start.x[0]);assert.ok(scrolled.x[1]<start.x[1]);
      assert.ok(Math.abs(scrolled.x[0]-((scrolled.scroll-scrolled.sectionTop+height)*.3-200))<.001);
      const stationary=scrolled.x; await page.waitForTimeout(250);
      assert.deepEqual((await measure()).x,stationary);
      await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
      await page.waitForTimeout(1000);
      await page.waitForFunction(() => [...document.querySelectorAll('img')].filter(i => {const r=i.getBoundingClientRect(); return r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight}).every(i=>i.complete&&i.naturalWidth>0));
      await page.screenshot({path:`screenshots/${name}.png`});
      // Explicitly decode every unique supplied/fallback asset, including offscreen cards.
      const assets=await page.evaluate(async()=> {
        const sources=[...new Set([...document.images].map(i=>i.src))];
        return Promise.all(sources.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({src,ok:true,width:img.naturalWidth});img.onerror=()=>resolve({src,ok:false});img.src=src;})));
      });
      assert.ok(assets.every(a=>a.ok)); assert.equal(assets.length,21);
      await page.mouse.wheel(0,-250);await page.waitForTimeout(400);
      const reverse=await measure();
      assert.ok(reverse.x[0]<(await page.evaluate(()=>(document.documentElement.scrollHeight-innerHeight)*.3-200)));
      assert.equal(errors.length,0,JSON.stringify(errors));
      results.push({viewport:{name,width,height},start,scrolled,final:await measure(),all21AssetsDecoded:true,reverseScroll:true,noAutonomousMovement:true,errors,requestFailures:failures,screenshot:`screenshots/${name}.png`});
      await page.close();
    }
    fs.writeFileSync('browser-checks.json',JSON.stringify({status:'passed',results},null,2)+'\n');
    console.log(JSON.stringify(results,null,2));
  } finally { await browser.close();server.close(); }
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
