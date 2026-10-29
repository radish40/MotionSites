import { createRequire } from 'node:module';
import { writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createServer, base } from './serve.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright-core');
const server = createServer();
await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
const report = { base, checks: [], errors: [], requestsFailed: [] };
await mkdir('screenshots', { recursive: true });
try {
 for (const [name, viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
  const context = await browser.newContext({viewport, deviceScaleFactor:1, isMobile:name==='mobile', hasTouch:name==='mobile'});
  const page = await context.newPage();
  page.on('pageerror',e=>report.errors.push(`${name}: ${e.message}`));
  page.on('console',msg=>{ if(msg.type()==='error') report.errors.push(`${name}: ${msg.text()}`); });
  page.on('requestfailed',req=>{ if(req.failure()?.errorText==='net::ERR_ABORTED' && (req.resourceType()==='media'||req.url().startsWith('blob:'))) return; report.requestsFailed.push({viewport:name,url:req.url(),error:req.failure()?.errorText}); });
  page.on('response',res=>{if(res.status()>=400) report.errors.push(`${name}: HTTP ${res.status()} ${res.url()}`);});
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.getElementById('video-fallback').readyState>=2);
  await page.waitForFunction(()=>getComputedStyle(document.getElementById('video-canvas')).visibility==='visible'||Boolean(document.getElementById('video-canvas').dataset.frameError),{},{timeout:180000});
  assert.equal(await page.locator('#video-canvas').evaluate(c=>c.dataset.frameError),undefined);
  await page.screenshot({path:`screenshots/${name}.png`});
  const initial=await page.evaluate(()=>({title:document.title, width:innerWidth, scrollWidth:document.documentElement.scrollWidth, font:document.fonts.check('600 16px Inter'), videoDuration:document.querySelector('video').duration, canvasVisible:getComputedStyle(document.querySelector('#video-canvas')).visibility, heading:document.querySelector('h1').textContent.replace(/\s+/g,' ').trim()}));
  assert.equal(initial.title,'Veldara'); assert(initial.scrollWidth<=initial.width); assert(initial.font); assert(initial.videoDuration>0);
  report.checks.push({viewport:name,check:'initial render, local video, extracted frames, Inter font, no overflow',passed:true,details:initial});
  const before=await page.locator('#video-canvas').evaluate(c=>c.toDataURL());
  await page.getByRole('link',{name:'Get Started'}).click();
  await page.waitForTimeout(600);
  assert(await page.evaluate(()=>scrollY>=innerHeight*2));
  assert.equal(await page.locator('#hero').evaluate(e=>Number(getComputedStyle(e).opacity)),0);
  report.checks.push({viewport:name,check:'Get Started navigates to feature story; hero fades',passed:true});
  await page.evaluate(()=>scrollTo(0,innerHeight*3.8));
  await page.waitForTimeout(500);
  const cards=await page.locator('#fixed-cards').evaluate(e=>({opacity:Number(getComputedStyle(e).opacity),columns:getComputedStyle(e.querySelector('.grid')).gridTemplateColumns,mask:e.querySelector('.grid').style.maskImage,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}));
  assert.equal(cards.opacity,1); assert(cards.top>=0); assert(cards.bottom<=viewport.height+1);
  assert.notEqual(before,await page.locator('#video-canvas').evaluate(c=>c.toDataURL()));
  await page.screenshot({path:`screenshots/${name}-features.png`});
  report.checks.push({viewport:name,check:'video changes with scroll; feature reveal and responsive layout',passed:true,details:cards});
  if(name==='desktop') {
   await page.getByRole('link',{name:'Journal',exact:true}).click();
  } else { await page.evaluate(()=>document.getElementById('section-three').scrollIntoView()); }
  await page.waitForTimeout(1200);
  assert(await page.locator('#section-three-inner').evaluate(e=>e.classList.contains('visible')));
  assert.equal(await page.locator('#fixed-cards').evaluate(e=>Number(getComputedStyle(e).opacity)),0);
  await page.screenshot({path:`screenshots/${name}-finale.png`});
  report.checks.push({viewport:name,check:'finale reveals Veldara 8; feature cards fade away',passed:true});
  await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(300);
  assert.equal(await page.locator('#hero').evaluate(e=>Number(getComputedStyle(e).opacity)),1);
  if(name==='desktop') {
   await page.getByRole('link',{name:'Guides',exact:true}).click();
   assert(await page.evaluate(()=>scrollY>=innerHeight*2));
   report.checks.push({viewport:name,check:'Guides navigates to feature story',passed:true});
  }
  assert.equal(await page.getByRole('link',{name:'GitHub',exact:true}).getAttribute('href'),'https://github.com/');
  await page.evaluate(()=>scrollTo(0,0));
  await page.getByRole('link',{name:'Explore Veldara',exact:true}).click();
  assert(await page.evaluate(()=>scrollY>=innerHeight*2));
  report.checks.push({viewport:name,check:'scroll cue works; social links are labeled; return to top restores hero',passed:true});
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.goto('http://localhost:4173'+base);
 assert.equal(await page.locator('.bounce-arrow svg').evaluate(e=>getComputedStyle(e).animationName),'none');
 report.checks.push({check:'reduced motion disables arrow animation',passed:true});
 await context.close();
 assert.equal(report.errors.length,0); assert.equal(report.requestsFailed.length,0);
 report.passed=true;
} catch(error) { report.passed=false; report.failure=error.stack; process.exitCode=1; }
finally { await writeFile('screenshots/checks.json',JSON.stringify(report,null,2)+'\n'); console.log(JSON.stringify(report,null,2)); await browser.close(); await new Promise(resolve=>server.close(resolve)); }
