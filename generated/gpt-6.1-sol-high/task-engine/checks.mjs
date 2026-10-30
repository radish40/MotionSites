import {createServer} from 'node:http';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('/app/package.json');
const {chromium}=require('playwright-core');
const base='/motionsites-results/task-engine/';
const server=createServer(async(req,res)=>{if(req.url===base || req.url===base+'index.html'){res.setHeader('Content-Type','text/html');res.end(await readFile('dist/index.html'));}else {res.statusCode=404;res.end('Not found');}});
await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',820,1180]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[], failures=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
  await page.waitForTimeout(2700);
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,cardCount:document.querySelectorAll('.card').length,cards:[...document.querySelectorAll('.card')].map(el=>{const r=el.getBoundingClientRect();return {name:el.className,x:r.x,y:r.y,width:r.width,height:r.height,visible:getComputedStyle(el).opacity==='1'&&getComputedStyle(el).visibility==='visible'}}),animationDetached:!document.documentElement.matches('.motion-pending,.entrance-run'),fontLoaded:document.fonts.check('800 35px "Plus Jakarta Sans"'),fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status})),images:document.images.length}));
  const field=page.getByRole('searchbox');
  await field.fill('Weekly client report');
  if(await field.inputValue()!=='Weekly client report')throw new Error('Search input failed');
  await field.press('Tab');
  await field.fill('');
  await field.blur();
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  results.push({name,viewport:{width,height},...layout,searchInput:'passed',errors,requestFailures:failures});
  if(layout.scrollWidth>width || layout.cardCount!==5 || !layout.animationDetached || !layout.cards.every(c=>c.visible) || errors.length)throw new Error('Layout/script check failed: '+name);
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await reduced.goto('http://localhost:4173'+base);
 const reducedCheck=await reduced.evaluate(()=>({rootClass:document.documentElement.className,allVisible:[...document.querySelectorAll('.card')].every(el=>getComputedStyle(el).opacity==='1'),animations:document.getAnimations().length}));
 if(!reducedCheck.allVisible||reducedCheck.animations)throw new Error('Reduced motion failed');
 results.push({name:'reduced-motion',...reducedCheck});
 const motion=await browser.newPage({viewport:{width:1440,height:1000}});
 await motion.goto('http://localhost:4173'+base,{waitUntil:'domcontentloaded'});
 await motion.waitForFunction(()=>document.documentElement.classList.contains('entrance-run'));
 results.push({name:'entrance',running:await motion.evaluate(()=>({animations:document.getAnimations().length,played:window.__entrancePlayed}))});
 await motion.waitForTimeout(2000);
 if(await motion.evaluate(()=>document.getAnimations().length)!==0)throw new Error('Animation did not detach');
 await writeFile('screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
} finally {await browser.close();server.close();}
