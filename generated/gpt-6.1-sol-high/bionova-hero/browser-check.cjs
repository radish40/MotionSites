const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const base = '/motionsites-results/bionova-hero/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg'};
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) {res.writeHead(404);res.end();return;}
  const file = path.join('/work/dist',pathname.slice(base.length) || 'index.html');
  fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream'});res.end(err?'Not found':data);});
});
(async()=>{
  await new Promise(r=>server.listen(4173,'0.0.0.0',r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = { viewports: [], interactions: [], errors: [], failedRequests: [] };
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    page.on('pageerror',e=>report.errors.push(e.message));
    page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
    await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle',timeout:60000});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(5000);
    const metrics=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,heroHeight:document.querySelector('.hero').getBoundingClientRect().height,fontLoaded:document.fonts.check('400 32px Poppins'),videos:[...document.querySelectorAll('video')].map(v=>({readyState:v.readyState,playing:!v.paused,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,error:v.error?.message || null}))}));
    report.viewports.push({name,...metrics});
    if(metrics.scrollWidth>width) throw Error(name+' has horizontal overflow');
    if(name==='desktop' && metrics.heroHeight!==height) throw Error('Desktop hero is not 100vh');
    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    await page.getByRole('button',{name:'How do we work'}).click();
    await page.getByRole('dialog').waitFor({state:'visible'});
    await page.getByRole('heading',{name:'Science. Strategy. Progress.'}).waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Contact us',exact:true}).click();
    await page.getByRole('heading',{name:'Let’s build what’s next.'}).waitFor();
    await page.getByRole('button',{name:'Close dialog'}).click();
    await page.getByRole('button',{name:'Explore our locations'}).click();
    await page.getByRole('dialog').getByRole('heading',{name:'United bio-entrepreneurs'}).waitFor();
    await page.keyboard.press('Escape');
    if(name==='desktop'){
      for(const item of ['About','Offerings','Pricing','Blog']){
        await page.getByRole('link',{name:item,exact:true}).click();
        await page.getByRole('dialog').waitFor({state:'visible'});
        await page.keyboard.press('Escape');
      }
      await page.getByRole('button',{name:'Log in',exact:true}).click();
      await page.getByRole('heading',{name:'Welcome back.'}).waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Request a call',exact:true}).first().click();
      await page.getByRole('dialog').waitFor({state:'visible'});
      await page.keyboard.press('Escape');
    }
    report.interactions.push({viewport:name,passed:true,checks:['process dialog','contact dialog','location dialog','Escape dismissal','close button',...(name==='desktop'?['navigation dialogs','login dialog','request call']:[])]});
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
