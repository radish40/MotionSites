const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/wisa-space-hero/';
const root = path.resolve('dist');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
  let route = decodeURIComponent(req.url.split('?')[0]);
  if(!route.startsWith(base)) {res.writeHead(404);return res.end();}
  const file = path.join(root,route.slice(base.length) || 'index.html');
  if(!file.startsWith(root + '/') || !fs.existsSync(file)) {res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
 await new Promise(r => server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = {base, browser:'Chromium / Playwright', checks:[], errors:[], failedRequests:[]};
 try {
 for (const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page = await context.newPage();
  page.on('pageerror',e=>report.errors.push(label+': '+e.message));
  page.on('console',m=> {if(m.type()==='error')report.errors.push(label+': '+m.text())});
  page.on('requestfailed',r=>report.failedRequests.push(r.url()));
  page.on('response',r=>{if(r.status()>=400)report.errors.push(label+': HTTP '+r.status()+' '+r.url())});
  await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:/Big ideas/}).waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.screenshot({path:'screenshots/'+label+'.png',fullPage:true});
  await page.getByRole('button',{name:'Make yourself a space'}).click();
  await page.getByLabel('Your space name').fill('Orbit of ideas');
  await page.getByRole('button',{name:'Create my space'}).click();
  await page.getByRole('heading',{name:'Orbit of ideas'}).waitFor();
  await page.getByLabel("What's on your mind?").fill('Design a calmer creative morning.');
  await page.getByRole('tab',{name:'Canvas',exact:true}).click();
  await page.getByLabel('New idea',{exact:true}).fill('A studio among the stars');
  await page.getByRole('button',{name:'Add idea',exact:true}).click();
  await page.getByText('A studio among the stars',{exact:true}).waitFor();
  await page.getByRole('tab',{name:'Collections',exact:true}).click();
  await page.getByLabel('New inspiration',{exact:true}).fill('The colors of a quiet moonrise');
  await page.getByRole('button',{name:'Add inspiration',exact:true}).click();
  await page.getByText('The colors of a quiet moonrise',{exact:true}).waitFor();
  await page.screenshot({path:'screenshots/'+label+'-workspace.png',fullPage:true});
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
  assert.equal(await page.getByRole('button',{name:'Make yourself a space'}).evaluate(el=>el === document.activeElement),true);
  await page.reload({waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Your workspace'}).click();
  await page.getByRole('heading',{name:'Orbit of ideas'}).waitFor();
  assert.equal(await page.getByLabel("What's on your mind?").inputValue(),'Design a calmer creative morning.');
  await page.getByRole('tab',{name:'Canvas',exact:true}).click();
  await page.getByText('A studio among the stars',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Remove A studio among the stars',exact:true}).click();
  assert.equal(await page.getByText('A studio among the stars',{exact:true}).count(),0);
  await page.getByRole('tab',{name:'Collections',exact:true}).click();
  await page.getByText('The colors of a quiet moonrise',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Remove The colors of a quiet moonrise',exact:true}).click();
  await page.getByRole('button',{name:'Close dialog'}).click();
  for(const name of ['Open notes','Explore canvas','Start a collection']) {
   await page.getByRole('button',{name,exact:true}).click();
   assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);
   const tab = name==='Open notes' ? 'Notes' : name==='Explore canvas' ? 'Canvas' : 'Collections';
   assert.equal(await page.getByRole('tab',{name:tab,exact:true}).getAttribute('aria-selected'),'true');
   await page.keyboard.press('Escape');
  }
  await page.getByRole('button',{name:'An original workspace concept'}).click();
  await page.getByText('This interactive demo keeps your work in this browser.',{exact:false}).waitFor();
  await page.keyboard.press('Escape');
  if(label === 'desktop') {
   await page.getByRole('link',{name:'The possibilities'}).click();
   assert.equal(await page.evaluate(()=>location.hash),'#possibilities');
  }
  await page.getByRole('button',{name:'Your workspace'}).click();
  await page.getByRole('tab',{name:'Notes',exact:true}).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab',{name:'Canvas',exact:true}).getAttribute('aria-selected'),'true');
  await page.keyboard.press('Escape');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  report.checks.push({viewport:label,width,height,overflow:false,creation:true,notesPersistence:true,canvasAddRemove:true,collectionAddRemove:true,featureEntryPoints:true,about:true,keyboardTabs:true,escapeClose:true,screenshot:'screenshots/'+label+'.png'});
  await context.close();
 }
 assert.deepEqual(report.errors,[]); assert.deepEqual(report.failedRequests,[]);
 report.status='passed';
 fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
 } finally {await browser.close(); server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
