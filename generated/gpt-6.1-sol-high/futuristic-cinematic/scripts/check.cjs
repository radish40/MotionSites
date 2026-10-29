const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const base = '/motionsites-results/futuristic-cinematic/';
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  fs.readFile(file, (error,data) => { if(error) res.writeHead(404).end(); else {res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');res.end(data);} });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl']});
  const report = {url:`http://localhost:4173${base}`,errors:[],warnings:[],failedRequests:[],checks:[]};
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const context = await browser.newContext({viewport:{width,height}, deviceScaleFactor:1, isMobile:name==='mobile',hasTouch:name==='mobile'});
      const page = await context.newPage();
      page.on('pageerror',error=>report.errors.push({name,message:error.message}));
      page.on('console',message=> {if(message.type()==='error')report.errors.push({name,message:message.text()});else if(message.type()==='warning')report.warnings.push({name,message:message.text()});});
      page.on('requestfailed',request=>report.failedRequests.push({name,url:request.url(),error:request.failure()?.errorText}));
      await page.goto(report.url,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(5000);
      await page.waitForFunction(() => document.querySelector('canvas')?.width > 0);
      report.checks.push(await page.evaluate(({name,width,height})=>({name,viewport:{width,height},title:document.title,heading:document.querySelector('h1').innerText,canvas:[...document.querySelectorAll('canvas')].map(c=>({width:c.width,height:c.height})),fontLoaded:document.fonts.check('400 16px Inter'),overflow:document.documentElement.scrollWidth>innerWidth || document.documentElement.scrollHeight>innerHeight,navPosition:getComputedStyle(document.querySelector('nav')).position}),{name,width,height}));
      await page.mouse.move(width*0.65,height*0.3);
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      if(name==='mobile') {
        await page.getByRole('button',{name:'Open menu'}).click();
        await page.locator('#mobile-menu').waitFor({state:'visible'});
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#mobile-menu')).opacity === '1');
        const visible = await page.locator('#mobile-menu').isVisible();
        const expanded = await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded');
        await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        const escaped = await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')==='false';
        await page.getByRole('button',{name:'Open menu'}).click();
        await page.locator('#mobile-menu').getByRole('link',{name:'AI Defense',exact:true}).click();
        const linkCloses = await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')==='false';
        report.checks.push({name:'mobile-menu',visible,expanded,escaped,linkCloses});
      } else {
        await page.getByRole('button',{name:'See it in motion'}).hover();
        await page.waitForFunction(() => getComputedStyle(document.querySelector('button.group svg')).translate === '2px');
        report.checks.push({name:'cta-hover',transform:await page.getByRole('button',{name:'See it in motion'}).locator('svg').evaluate(el=>getComputedStyle(el).translate)});
      }
      if (name === 'desktop') {
        await page.mouse.move(100,100);
        const first = await page.screenshot();
        await page.waitForTimeout(1000);
        await page.mouse.move(1100,300);
        const second = await page.screenshot();
        report.checks.push({name:'live-motion',framesDiffer:!first.equals(second)});
      }
      await context.close();
    }
    if(report.errors.length || report.failedRequests.length || report.checks.some(c => c.overflow || c.fontLoaded === false || c.visible === false || c.escaped === false || c.linkCloses === false || c.framesDiffer === false)) throw new Error('Browser checks failed; see screenshots/checks.json');
  } finally {
    fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
    await browser.close();
    server.close();
  }
})().catch(e=>{console.error(e);process.exit(1)});
