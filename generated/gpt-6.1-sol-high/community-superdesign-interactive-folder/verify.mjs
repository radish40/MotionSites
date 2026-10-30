import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require = createRequire('/app/node_modules/playwright-core/package.json');
const {chromium} = require('playwright-core');
const base = '/motionsites-results/community-superdesign-interactive-folder/';
const server = createServer(async (req,res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!path.startsWith(base) || path.includes('..')) {res.writeHead(404).end();return;}
    const file = path.slice(base.length) || 'index.html';
    const data = await readFile(`dist/${file}`);
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
    res.end(data);
  } catch {res.writeHead(404).end();}
});
await new Promise(r=>server.listen(4173,'0.0.0.0',r));
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const checks = [];
const errors = [];
const assert = (condition,message) => {if (!condition) throw new Error(message);checks.push(message);};
try {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
    const page = await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
    assert(await page.getByRole('button').count() === 4,`${name}: four folder controls`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${name}: no horizontal overflow when closed`);
    for (const label of ['RESOURCES','ARTSETS','TUNES','MAILS']) {
      const folder = page.getByRole('button',{name:label,exact:true});
      await folder.click();
      await page.waitForTimeout(650);
      assert(await folder.getAttribute('aria-expanded')==='true',`${name}: ${label} opens`);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${name}: ${label} opens without horizontal overflow`);
      const paperBounds = await folder.locator('[data-paper]').evaluateAll(els => els.map(el => {const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top};}));
      assert(paperBounds.every(r=>r.left>=0 && r.right<=width && r.top>=0),`${name}: ${label} paper bounds stay inside viewport`);
      if (label==='RESOURCES') {
        await page.screenshot({path:`screenshots/${name}-open.png`,fullPage:true});
        if (name==='desktop') {
          const paper = folder.locator('[data-paper="2"]');
          const before = await paper.evaluate(el=>getComputedStyle(el).transform);
          const box = await paper.boundingBox();
          await page.mouse.move(box.x+box.width*.65,box.y+box.height*.3);
          await page.waitForTimeout(500);
          const after = await paper.evaluate(el=>getComputedStyle(el).transform);
          assert(before!==after,'desktop: hover changes paper transform');
          await page.mouse.move(20,20);
          await page.waitForTimeout(600);
          const reset = await paper.evaluate(el=>getComputedStyle(el).transform);
          assert(reset===before,'desktop: paper drift resets on pointer leave');
        }
      }
      await folder.click();
      await page.waitForTimeout(500);
      assert(await folder.getAttribute('aria-expanded')==='false',`${name}: ${label} closes`);
    }
    if (name==='desktop') {
      const folder = page.getByRole('button',{name:'RESOURCES',exact:true});
      await folder.focus();await page.keyboard.press('Enter');
      assert(await folder.getAttribute('aria-expanded')==='true','keyboard: Enter opens');
      await page.keyboard.press('Space');
      assert(await folder.getAttribute('aria-expanded')==='false','keyboard: Space closes');
    }
    await context.close();
  }
  if(errors.length) console.error(JSON.stringify(errors));
  assert(errors.length===0,'no browser script, console or HTTP errors');
  console.log(JSON.stringify({status:'passed',checks,errors},null,2));
} finally {await browser.close();server.close();}
