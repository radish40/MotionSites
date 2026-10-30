const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('dist');
const base = '/motionsites-results/404/';
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(root,pathname.startsWith(base) ? pathname.slice(base.length) || 'index.html' : 'missing');
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(4173,'0.0.0.0',r));
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const errors=[],failed=[],requests=[],checks=[];
  const page=await browser.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('requestfailed',r=>failed.push(r.url()));
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
  page.on('request',r=>requests.push(r.url()));
  function assert(condition,message){if(!condition)throw Error(message);checks.push(message)}
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
    await page.setViewportSize({width,height});
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(300);
    const metrics=await page.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,fonts:document.fonts.check('500 20px "DM Sans"')&&document.fonts.check('400 24px "Material Symbols Rounded"'),cards:[...document.querySelectorAll('.nav-card')].map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})),title:document.querySelector('h1').getBoundingClientRect().toJSON()}));
    assert(metrics.sw===width && metrics.sh===height,`${name}: no document overflow`);
    assert(metrics.fonts,`${name}: both local fonts loaded`);
    assert(metrics.cards.every(c=>c.top>=0&&c.bottom<=height),`${name}: cards visible`);
    assert(metrics.title.x>=0&&metrics.title.right<=width,`${name}: heading fits`);
    await page.screenshot({path:`screenshots/${name}.png`});
    if(name==='desktop'){
      const card=page.locator('.nav-card').first();const before=await card.boundingBox();await card.hover();await page.waitForTimeout(300);const after=await card.boundingBox();assert(after.y<before.y-2,'desktop: card rises on hover');
      assert(await page.locator('.desktop-links').isVisible(),'desktop: navigation visible');
      assert(await page.locator('.desktop-cta .connect').getAttribute('href')===base+'contact','desktop: connect destination set');
    }else{
      assert(!(await page.locator('.desktop-links').isVisible()),'mobile: desktop navigation hidden');
      const toggle=page.getByRole('button',{name:'Open navigation'});await toggle.click();await page.waitForTimeout(600);
      assert(await page.getByRole('button',{name:'Close navigation'}).getAttribute('aria-expanded')==='true','mobile: menu opens');
      assert(await page.locator('#mobile-menu').evaluate(e=>Math.round(e.getBoundingClientRect().x)===0),'mobile: overlay slides into viewport');
      await page.screenshot({path:'screenshots/mobile-menu.png'});
      await page.keyboard.press('Escape');await page.waitForTimeout(600);
      assert(await toggle.getAttribute('aria-expanded')==='false','mobile: Escape closes menu');
      assert(await toggle.evaluate(e=>e===document.activeElement),'mobile: focus returns to toggle');
      await toggle.click();await page.waitForTimeout(600);
      await page.keyboard.press('Shift+Tab');assert(await page.getByRole('button',{name:'Close navigation'}).evaluate(e=>e===document.activeElement),'mobile: focus trap wraps');
      await page.getByRole('button',{name:'Close navigation'}).click();await page.waitForTimeout(600);
    }
  }
  assert(await page.locator('.nav-card').first().getAttribute('href')===base,'Main Page points to project base');
  assert(await page.locator('.nav-card').nth(1).getAttribute('href')===base+'showcase','Showcase destination set');
  console.log({errors,failed});assert(errors.length===0,'no browser script or console errors');assert(failed.length===0,'no failed asset requests');
  assert(requests.every(u=>u.startsWith('http://localhost:4173/')),'all runtime requests are local');
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify({checks,errors,failed,requests:[...new Set(requests)]},null,2));
  console.log(JSON.stringify({checks,errors,failed},null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
