const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const base = '/motionsites-results/cozypaws/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (!pathname.startsWith(base)) {res.writeHead(404);res.end();return;}
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  try {res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}
  catch {res.writeHead(404);res.end();}
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = { viewports:[], interactions:[], scriptErrors:[], failedRequests:[], badResponses:[] };
  try {
    const page = await browser.newPage();
    page.on('pageerror',err => results.scriptErrors.push(err.message));
    page.on('requestfailed',req => results.failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
    page.on('response',res => {if(res.status() >= 400) results.badResponses.push({url:res.url(),status:res.status()});});
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',834,1112]]) {
      await page.setViewportSize({width,height});
      await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle',timeout:60000});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2200);
      const layout = await page.evaluate(() => ({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,fonts:{inter:document.fonts.check('14px Inter'),serif:document.fonts.check('36px "DM Serif Display"')},images:[...document.images].map(i => ({url:i.src,loaded:i.complete && i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight}))}));
      results.viewports.push({name,...layout});
      assert(layout.images.every(image => image.loaded), name+' failed image');
      assert(layout.fonts.inter && layout.fonts.serif, name+' failed font');
      assert(layout.scrollWidth<=width, name+' horizontal overflow');
      assert(layout.scrollHeight<=height, name+' vertical overflow');
      await page.screenshot({path:'/work/screenshots/'+name+'.png',fullPage:true});
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.getByRole('button',{name:'Search products',exact:true}).click();
    await page.getByRole('textbox',{name:'Search products'}).fill('cat');
    await page.getByRole('button',{name:'Cozy Cat House $49.99'}).click();
    await page.getByRole('button',{name:'Add to cart',exact:true}).click();
    await page.getByRole('button',{name:'Added to cart'}).waitFor();
    await page.keyboard.press('Escape');
    results.interactions.push('Search cat and open result; add product; Escape closes dialog');
    await page.getByRole('button',{name:'Shopping cart, 2 items',exact:true}).click();
    await page.getByText('$99.98',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Increase quantity'}).click();
    await page.getByText('$149.97',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Decrease quantity'}).click();
    await page.getByRole('button',{name:'Close dialog'}).click();
    results.interactions.push('Cart quantity updates subtotal in both directions');
    await page.getByRole('button',{name:'Favorites, 4 items'}).click();
    await page.getByRole('button',{name:'Remove from favorites'}).click();
    await page.getByRole('button',{name:'Save to favorites'}).waitFor();
    await page.keyboard.press('Escape');
    results.interactions.push('Favorite toggle updates header badge');
    await page.getByRole('button',{name:'Watch product reviews',exact:true}).filter({visible:true}).click();
    assert(await page.getByRole('link',{name:'YouTube'}).getAttribute('href') === 'https://www.youtube.com/');
    await page.keyboard.press('Escape');
    results.interactions.push('Review dialog and external platform links');
    for (const label of ['Delivery and payment','Brands','Blog','Your account']) {
      await page.getByRole('button',{name:label,exact:true}).click();
      await page.locator('dialog[open]').waitFor();
      await page.keyboard.press('Escape');
    }
    results.interactions.push('Navigation and account dialogs open and close');
    await page.setViewportSize({width:390,height:844});
    await page.getByRole('button',{name:'Explore Products',exact:true}).filter({visible:true}).click();
    await page.getByRole('button',{name:'Close dialog'}).click();
    await page.getByRole('button',{name:'View Cozy Cat House'}).filter({visible:true}).click();
    await page.keyboard.press('Escape');
    results.interactions.push('Mobile CTA and product arrow open product dialog');
    assert(results.scriptErrors.length===0,'JavaScript errors');
    fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
    console.log(JSON.stringify({viewports:results.viewports.map(({name,width,height,scrollWidth,scrollHeight,fonts,images})=>({name,width,height,scrollWidth,scrollHeight,fonts,imagesLoaded:images.every(i=>i.loaded)})),interactions:results.interactions,scriptErrors:results.scriptErrors,failedRequests:results.failedRequests,badResponses:results.badResponses},null,2));
  } catch(err) {fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify({...results,error:err.message},null,2));throw err;}
  finally {await browser.close();server.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
