const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async()=>{
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const results = {};
 for (const [name, viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
  const context = await browser.newContext({viewport,permissions:['clipboard-read','clipboard-write']});
  const page = await context.newPage();
  const errors=[],failed=[],warnings=[];
  page.on('pageerror',err=>errors.push(err.message));
  page.on('requestfailed',req=>failed.push({url:req.url(),error:req.failure()?.errorText}));
  page.on('console',msg=>{if(msg.type()==='warning'||msg.type()==='error') warnings.push(msg.text());});
  await page.goto('http://localhost:4173/motionsites-results/future-state/',{waitUntil:'networkidle'});
  const progress = setInterval(async()=>console.log(name, await page.evaluate(()=>({...document.querySelector('canvas')?.dataset})).catch(()=>null)),20000);
  await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.frameCount,null,{timeout:300000}).catch(()=>{});
  clearInterval(progress);
  await page.waitForTimeout(1800);
  const initial = await page.evaluate(()=>({title:document.title,loading:document.querySelector('canvas')?.dataset.loading,frameCount:document.querySelector('canvas')?.dataset.frameCount,frame:document.querySelector('canvas')?.dataset.frame,fontLoaded:document.fonts.check('16px "Flexo Soft Medium"'),horizontalOverflow:document.documentElement.scrollWidth>innerWidth,heroHeight:document.querySelector('#main').getBoundingClientRect().height,bodyHeight:document.documentElement.scrollHeight,canvasSize:[document.querySelector('canvas').width,document.querySelector('canvas').height]}));
  await page.screenshot({path:`/work/screenshots/${name}.png`});
  await page.getByRole('link',{name:'Begin Today',exact:true}).click();
  await page.waitForTimeout(2500);
  const end = await page.evaluate(()=>({scrollY,frame:document.querySelector('canvas')?.dataset.frame,headingVisible:document.querySelector('h2').getBoundingClientRect().top>=0,horizontalOverflow:document.documentElement.scrollWidth>innerWidth}));
  await page.screenshot({path:`/work/screenshots/${name}-section-two.png`});
  await page.getByRole('button',{name:'Share',exact:true}).last().click();
  await page.waitForTimeout(200);
  const shared = await page.getByRole('status').last().textContent();
  await page.getByRole('link',{name:'Run the demo again from the beginning'}).click();
  await page.waitForTimeout(2200);
  const replay = await page.evaluate(()=>({scrollY,frame:document.querySelector('canvas')?.dataset.frame,heroRevealed:getComputedStyle(document.querySelector('h1 span')).opacity==='1'}));
  const nav = {};
  for (const label of ['tiers','features','talk to us','main']) {
   await page.getByRole('navigation').getByRole('link',{name:label,exact:true}).click();
   await page.waitForTimeout(1500);
   nav[label] = await page.evaluate(()=>({hash:location.hash,scrollY}));
  }
  results[name] = {initial,end,replay,shared,nav,errors,failed,warnings};
  await context.close();
 }
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();
})().catch(err=>{console.error(err);process.exit(1);});
