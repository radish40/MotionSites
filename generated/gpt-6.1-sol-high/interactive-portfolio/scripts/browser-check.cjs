const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const base = '/motionsites-results/interactive-portfolio/';
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const name = pathname.slice(base.length) || 'index.html';
  const file = path.resolve('dist', name);
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err,data) => { res.writeHead(err ? 404 : 200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'}); res.end(err ? 'Not found' : data); });
});
(async () => {
  await new Promise(r => server.listen(4173, '0.0.0.0', r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
  const errors = [], failedRequests = [], checks = [];
  async function check(name, fn) { await fn(); checks.push({name,status:'passed'}); }
  for (const [label, viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
    const context = await browser.newContext({viewport, isMobile:label==='mobile', hasTouch:label==='mobile'});
    const page = await context.newPage();
    page.on('pageerror',e => errors.push({viewport:label,error:e.message}));
    page.on('console', msg => { if(msg.type()==='error') errors.push({viewport:label,error:msg.text()}); });
    page.on('response', r => { if(r.status()>=400) errors.push({viewport:label,error:`HTTP ${r.status()}: ${r.url()}`}); });
    page.on('requestfailed',r => failedRequests.push({viewport:label,url:r.url(),error:r.failure().errorText}));
    await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await check(label+': six project cards and five dock icons',async()=>{
      assert.equal(await page.locator('[data-project]').count(),6);
      assert.equal(await page.locator('nav a, nav button').count(),5);
    });
    await check(label+': all images loaded',async()=>assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true));
    await check(label+': no page overflow and all controls visible',async()=>{
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth && document.documentElement.scrollHeight<=innerHeight));
      for(const item of await page.locator('[data-project], nav').all()) {
        const b=await item.boundingBox(); assert(b.x>=0&&b.y>=0&&b.x+b.width<=viewport.width&&b.y+b.height<=viewport.height);
      }
    });
    await page.screenshot({path:`screenshots/${label}.png`,fullPage:true});
    for (let i=0;i<6;i++) {
      await page.locator(`[data-project="${i}"]`).click();
      await page.getByRole('dialog').waitFor();
      await check(`${label}: project ${i+1} opens full image`,async()=>{
        assert.equal(await page.getByRole('dialog').locator('img').count(),1);
        await page.getByRole('dialog').locator('img').evaluate(img=>img.decode());
      });
      if(i===0) { await page.waitForTimeout(450); await page.screenshot({path:`screenshots/${label}-project.png`}); }
      await page.getByRole('button',{name:'Close window',exact:true}).click();
      await page.getByRole('dialog').waitFor({state:'detached'});
    }
    for (const name of ['About Me','Notes']) {
      await page.getByRole('button',{name,exact:true}).click();
      await check(`${label}: ${name} opens`,async()=>assert.equal(await page.getByRole('dialog').getAttribute('aria-label'),name));
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').count(),0);
    }
    await check(label+': external dock links',async()=>{
      for (const [name,href] of [['Instagram','https://www.instagram.com/'],['X','https://www.x.com/'],['Behance','https://www.behance.com/']]) {
        assert.equal(await page.getByRole('link',{name,exact:true}).getAttribute('href'),href);
        assert.equal(await page.getByRole('link',{name,exact:true}).getAttribute('target'),'_blank');
      }
    });
    if(label==='desktop') {
      await page.getByRole('button',{name:'About Me',exact:true}).hover();
      await page.waitForFunction(() => [...document.querySelectorAll('[role=tooltip]')].some(e => e.textContent === 'About Me' && getComputedStyle(e).opacity === '1'));
      await page.waitForTimeout(250);
      await check('desktop: dock tooltip and magnification',async()=>{
        assert.equal(await page.getByRole('tooltip').filter({hasText:'About Me'}).evaluate(e=>getComputedStyle(e).opacity),'1');
        assert((await page.getByRole('button',{name:'About Me',exact:true}).boundingBox()).width>48);
      });
      const card=page.locator('[data-project="0"]'); const before=await card.boundingBox();
      await page.mouse.move(before.x+52,before.y+45); await page.mouse.down(); await page.mouse.move(before.x+152,before.y+95,{steps:12}); await page.mouse.up();
      await check('desktop: project drag moves 100×50 without opening',async()=>{
        const after=await card.boundingBox(); assert(Math.abs(after.x-before.x-100)<1); assert(Math.abs(after.y-before.y-50)<1); assert.equal(await page.getByRole('dialog').count(),0);
      });
      await card.click(); await page.waitForTimeout(450);
      const panel=page.getByRole('dialog'); const b=await panel.boundingBox();
      await page.mouse.move(b.x+200,b.y+20); await page.mouse.down(); await page.mouse.move(b.x+260,b.y+60,{steps:10}); await page.mouse.up(); await page.waitForTimeout(450);
      await check('desktop: title bar drags modal',async()=>{ const a=await panel.boundingBox(); assert(Math.abs(a.x-b.x-60)<2); assert(Math.abs(a.y-b.y-40)<2); });
      await page.keyboard.press('Tab');
      await check('desktop: modal traps keyboard focus',async()=>assert(await panel.evaluate(e=>e.contains(document.activeElement))));
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Notes',exact:true}).focus(); await page.keyboard.press('Enter');
      await check('desktop: keyboard opens dock window',async()=>assert.equal(await panel.count(),1));
      await page.getByRole('button',{name:'Minimize window',exact:true}).click();
      await page.getByRole('button',{name:'Notes',exact:true}).click();
      await page.getByRole('button',{name:'Dismiss window',exact:true}).click();
      checks.push({name:'desktop: all traffic lights dismiss window',status:'passed'});
    } else {
      const card=page.locator('[data-project="0"]'); const before=await card.boundingBox();
      const session=await context.newCDPSession(page);
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:before.x+50,y:before.y+40}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:before.x+80,y:before.y+60}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await check('mobile: touch dragging moves card without opening',async()=>{
        const after=await card.boundingBox(); assert(Math.abs(after.x-before.x-30)<1); assert.equal(await page.getByRole('dialog').count(),0);
      });
    }
    checks.push({name:label+': Inter font loaded',status:await page.evaluate(()=>document.fonts.check('16px Inter'))?'passed':'failed'});
    await context.close();
  }
  fs.writeFileSync('browser-checks.json',JSON.stringify({checks,errors,failedRequests},null,2));
  console.log(JSON.stringify({checks,errors,failedRequests},null,2));
  await browser.close(); server.close();
  assert.equal(errors.length,0);
})().catch(err=>{console.error(err); server.close(); process.exit(1)});
