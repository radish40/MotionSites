const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/community-superdesign-counter/';
const root = path.resolve('dist');
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
  if (!req.url.startsWith(base)) {res.writeHead(404); return res.end();}
  const file = path.join(root, decodeURIComponent(req.url.slice(base.length).split('?')[0]) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) {res.writeHead(404); return res.end();}
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
 await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = {url:base, checks:[], errors:[], failedRequests:[]};
 try {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1});
   page.on('pageerror', e=>report.errors.push(e.message));
   page.on('console', msg=>{if(msg.type()==='error') report.errors.push(msg.text());});
   page.on('requestfailed', r=>report.failedRequests.push(r.url()));
   page.on('response', r=>{if(r.status()>=400) report.failedRequests.push(`${r.status()} ${r.url()}`);});
   await page.goto(`http://127.0.0.1:4173${base}`, {waitUntil:'networkidle'});
   const counter=page.getByTestId('rolling-counter');
   assert.equal(await page.title(),'Rolling Counter');
   assert.equal(await counter.getAttribute('aria-label'),'1234.5');
   await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
   const initialDigit=await counter.locator('span').evaluateAll(nodes=>nodes.filter(n=>n.textContent==='5' && n.style.position==='absolute').map(n=>n.style.transform));
   await page.waitForFunction(()=>document.querySelector('[data-testid="rolling-counter"]').getAttribute('aria-label')==='1235.6');
   await page.waitForTimeout(700);
   const updatedDigit=await counter.locator('span').evaluateAll(nodes=>nodes.filter(n=>n.textContent==='5' && n.style.position==='absolute').map(n=>n.style.transform));
   assert.notDeepEqual(updatedDigit,initialDigit,'Digit transforms should change');
   const button = page.getByRole('button',{name:'Reset Counter'});
   await button.click();
   assert.equal(await counter.getAttribute('aria-label'),'1234.5');
   await page.waitForTimeout(1000);
   const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,card:document.querySelector('.counter-card').getBoundingClientRect().toJSON(),counter:document.querySelector('[data-testid="rolling-counter"]').getBoundingClientRect().toJSON()}));
   assert.ok(layout.scroll<=width,'No horizontal overflow');
   assert.ok(layout.counter.x>=layout.card.x && layout.counter.right<=layout.card.right,'Counter fits card');
   await page.waitForFunction(()=>document.querySelector('[data-testid="rolling-counter"]').getAttribute('aria-label')!=='1234.5');
   await button.focus();
   await page.keyboard.press('Enter');
   assert.equal(await counter.getAttribute('aria-label'),'1234.5');
   assert.equal(await button.evaluate(el=>el.matches(':focus-visible')),true);
   if (name === 'desktop') {
    await page.waitForFunction(()=>document.querySelector('[data-testid="rolling-counter"]').getAttribute('aria-label')==='1240');
    assert.equal(await counter.locator(':scope > span:first-child > span').count(),4);
    await page.waitForFunction(()=>document.querySelector('[data-testid="rolling-counter"]').getAttribute('aria-label')==='1241.1');
    assert.equal(await counter.locator(':scope > span:first-child > span').count(),6);
    report.automaticPlaceDetection = true;
   }
   report.checks.push({viewport:name,width,height,initialValue:true,automaticIncrement:true,springTransforms:true,resetClick:true,resetKeyboard:true,focusVisible:true,noOverflow:true,layout,screenshot:`screenshots/${name}.png`});
   await page.close();
  }
  assert.deepEqual(report.errors,[]);
  assert.deepEqual(report.failedRequests,[]);
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
 } finally {await browser.close(); await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
