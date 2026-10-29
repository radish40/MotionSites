const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const base = '/motionsites-results/health-portal/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp'};
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  fs.readFile(file,(error,data) => { if (error) return res.writeHead(404).end(); res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream'); res.end(data); });
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = {url:`http://localhost:4173${base}`, checks:[], pageErrors:[], consoleErrors:[], failedRequests:[], assetResponses:[], assets:[]};
  const check = (name,pass,details) => {report.checks.push({name,pass,details}); if (!pass) console.error('FAIL',name,details);};
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({viewport:name,error:m.text()});});
      page.on('pageerror',e=>report.pageErrors.push({viewport:name,error:e.message}));
      page.on('requestfailed',r=>report.failedRequests.push({viewport:name,url:r.url(),failure:r.failure()?.errorText}));
      page.on('response',r=>{if (/higgs|onlinewebfonts/.test(r.url())) report.assetResponses.push({viewport:name,url:r.url(),status:r.status()});});
      await page.goto(report.url,{waitUntil:'domcontentloaded'});
      check(`${name}: splash appears`,await page.getByLabel('Loading Dental Health').count() === 1);
      if (name === 'desktop') await page.screenshot({path:'/work/screenshots/splash.png'});
      await page.getByLabel('Loading Dental Health').waitFor({state:'detached',timeout:10000});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(1500);
      check(`${name}: title`,await page.title() === 'Dental Health - Quality Healthcare');
      check(`${name}: three sections`,await page.locator('section').count() === 3);
      const dimensions = await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,sections:[...document.querySelectorAll('section')].map(s=>({id:s.id,height:s.getBoundingClientRect().height}))}));
      check(`${name}: no horizontal overflow`,dimensions.scrollWidth <= width,dimensions);
      const assets = await page.evaluate(async()=>{
        const urls=[...new Set([...document.images].map(i=>i.src).concat([...document.querySelectorAll('[style]')].map(e=>e.style.backgroundImage).filter(Boolean).map(s=>s.slice(5,-2))))];
        return Promise.all(urls.map(url=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({url,loaded:true,width:img.naturalWidth,height:img.naturalHeight});img.onerror=()=>resolve({url,loaded:false});img.src=url;})));
      });
      report.assets.push({viewport:name,images:assets,fonts:await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status})))});
      check(`${name}: all five images loaded`,assets.length === 5 && assets.every(a=>a.loaded),assets);
      const toggle = name === 'mobile' ? page.getByRole('button',{name:'Open menu'}) : page.getByRole('button',{name:'Menu',exact:true});
      await toggle.click();
      await page.waitForTimeout(600);
      await page.keyboard.press('Escape');
      check(`${name}: Escape closes menu`,await toggle.getAttribute('aria-expanded') === 'false');
      await toggle.click();
      await page.waitForTimeout(600);
      await page.mouse.click(5, height / 2);
      check(`${name}: backdrop closes menu`,await toggle.getAttribute('aria-expanded') === 'false');
      await toggle.click();
      await page.waitForTimeout(800);
      check(`${name}: menu opens and locks scroll`,await page.evaluate(()=>document.body.style.overflow === 'hidden'));
      if (name === 'mobile') await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
      await page.locator('#navigation-panel').getByRole('link',{name:'Gallery',exact:true}).click();
      await page.waitForTimeout(1200);
      check(`${name}: navigation closes menu`,await page.evaluate(()=>document.body.style.overflow !== 'hidden'));
      check(`${name}: gallery navigation`,await page.evaluate(()=>location.hash === '#gallery'));
      await page.locator('#gallery').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1100);
      await page.screenshot({path:`/work/screenshots/${name}-gallery.png`});
      await page.locator('#about').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await page.screenshot({path:`/work/screenshots/${name}-implants.png`});
      const call = page.getByRole('link',{name:'Call Us',exact:true});
      await call.click();
      await page.waitForTimeout(1100);
      check(`${name}: consultation CTA navigates`,await page.evaluate(()=>location.hash === '#contact'));
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await page.waitForTimeout(700);
      await page.screenshot({path:`/work/screenshots/${name}.png`});
      await page.screenshot({path:`/work/screenshots/${name}-full.png`,fullPage:true});
      await page.close();
    }
    check('No browser script errors',report.pageErrors.length === 0,report.pageErrors);
    check('No browser console errors',report.consoleErrors.length === 0,report.consoleErrors);
  } finally {
    fs.writeFileSync('/work/browser-checks.json',JSON.stringify(report,null,2));
    await browser.close();server.close();
  }
  console.log(JSON.stringify({checks:report.checks.map(({name,pass})=>({name,pass})), pageErrors:report.pageErrors, consoleErrors:report.consoleErrors, failedRequests:report.failedRequests},null,2));
  if(report.checks.some(c=>!c.pass)) process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
