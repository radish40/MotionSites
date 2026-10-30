const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/new-era-automotive-hero/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.ttf':'font/ttf','.webp':'image/webp'};
const server = http.createServer((req,res) => {
  const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0].replace(base, '') || 'index.html'));
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {res.writeHead(404).end(); return;}
  res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(r => server.listen(4173,'0.0.0.0',r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = [];
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors = [], failed = [];
    page.on('pageerror',error => errors.push(error.message));
    page.on('response',response => {if(response.status()>=400) failed.push(`${response.status()} ${response.url()}`)});
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => {const v=document.querySelector('video');return v.readyState>=3 && v.currentTime>0;});
    const media = await page.locator('video').evaluate(v => ({playing:!v.paused,muted:v.muted,loop:v.loop,autoplay:v.autoplay,playsInline:v.playsInline,width:v.videoWidth,height:v.videoHeight,duration:v.duration}));
    assert.ok(media.playing && media.muted && media.loop && media.autoplay && media.playsInline);
    await page.locator('video').evaluate(v => {v.currentTime=v.duration-.15;});
    await page.waitForFunction(() => document.querySelector('video').currentTime < 1.5);
    assert.ok(await page.evaluate(() => document.fonts.check('400 20px Inter') && document.fonts.check('400 64px "Bebas Neue"')));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth));
    const heroHeight = await page.locator('.hero').evaluate(el=>el.offsetHeight);
    assert.equal(heroHeight,Math.max(600,Math.min(height,965)));
    assert.equal(await page.locator('nav').isVisible(),width>=1024);
    assert.equal(await page.getByText('Sign In',{exact:true}).isVisible(),width>=640);
    await page.getByRole('link',{name:'Shop Now'}).click();
    assert.equal(new URL(page.url()).hash,'#shop');
    await page.getByRole('link',{name:'Cart',exact:true}).click();
    assert.equal(new URL(page.url()).hash,'#cart');
    if(width>=1024) {
      for(const [label,hash] of [['Home','home'],['Shop','shop'],['Blog','blog'],['About Us','about-us'],['Contact Us','contact-us']]) {
        await page.getByRole('navigation').getByRole('link',{name:label,exact:true}).click();
        assert.equal(new URL(page.url()).hash,`#${hash}`);
      }
      await page.getByRole('link',{name:'Sign In'}).click();
      assert.equal(new URL(page.url()).hash,'#sign-in');
    }
    await page.getByRole('link',{name:'Logoipsum home'}).click();
    await page.mouse.move(0,0);
    await page.locator('video').evaluate(async v => {v.pause();v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    results.push({viewport:{width,height},heroHeight,media,loopPlayback:'passed',errors,failed,overflow:false,links:'passed (hero-only hash destinations)',fonts:'loaded'});
    await page.close();
  }
  await browser.close();
  server.close();
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
