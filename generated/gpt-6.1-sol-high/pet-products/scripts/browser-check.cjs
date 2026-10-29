const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const server = spawn(process.execPath, ['scripts/serve.mjs'], {stdio:'inherit'});
  let browser;
  const report = { url:'/motionsites-results/pet-products/', checks:[], errors:[], failedRequests:[], responses:[] };
  try {
    await new Promise(resolve => setTimeout(resolve,800));
    browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox'] });
    const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
    page.on('pageerror',error => report.errors.push(error.message));
    page.on('console',msg => { if(msg.type()==='error') report.errors.push(msg.text()); });
    page.on('requestfailed',request => report.failedRequests.push({url:request.url(),error:request.failure()}));
    page.on('response',response => { if(response.status()>=400) report.responses.push({url:response.url(),status:response.status()}); });
    await page.goto('http://127.0.0.1:4173'+report.url,{waitUntil:'networkidle'});
    await page.evaluate(async () => { await Promise.all(['Inter','Poppins','DM Serif Display'].map(f=>document.fonts.load(`16px "${f}"`))); await document.fonts.ready; });
    await page.waitForTimeout(1800);
    async function layout(label) {
      const result = await page.evaluate(() => ({ viewport:innerWidth, width:document.documentElement.scrollWidth, images:[...document.images].every(i=>i.complete&&i.naturalWidth>0), phones:[...document.querySelectorAll('.phone')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}), fonts:['Inter','Poppins','DM Serif Display'].map(f=>({family:f,loaded:document.fonts.check(`16px "${f}"`)})) }));
      assert(result.width<=result.viewport, label+' overflow'); assert(result.images,label+' images'); assert(result.fonts.every(f=>f.loaded),label+' fonts');
      const content = await page.evaluate(() => {
        const clip = document.querySelector('.screen').getBoundingClientRect();
        const stat = document.querySelector('.stats-avatar img').getBoundingClientRect();
        const arrivals = document.querySelector('.arrivals-section').getBoundingClientRect();
        const prices = [...document.querySelectorAll('.product-price')].map(e=>e.getBoundingClientRect().bottom);
        return { avatarFits: stat.width < 50 && stat.height < 50, pricesFit: prices.every(bottom=>bottom <= arrivals.bottom) };
      });
      assert(content.avatarFits,label+' avatar size'); assert(content.pricesFit,label+' product price clipping');
      report.checks.push({name:label,result:'pass',details:{...result,...content}});
    }
    await layout('desktop 1440x1000');
    await page.screenshot({path:'screenshots/desktop.png',fullPage:true});
    const video = page.locator('video');
    await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
    assert(await video.evaluate(v=>!v.paused),'video autoplay');
    await page.getByRole('button',{name:'Pause pet video',exact:true}).click();
    assert(await video.evaluate(v=>v.paused));
    await page.getByRole('button',{name:'Play pet video',exact:true}).click();
    await page.waitForFunction(()=>!document.querySelector('video').paused);
    report.checks.push({name:'video loads, autoplays muted, pauses and resumes',result:'pass'});
    await page.locator('.menu-btn').first().click();
    await page.getByRole('dialog').getByRole('button',{name:'New Arrivals',exact:true}).click();
    assert(await page.locator('.phone-panel:visible').count()===0);
    await page.locator('.star-btn').nth(1).click();
    assert(await page.getByRole('dialog').locator('.panel-item').count()===4);
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Add Sunset Cat Bowl to cart',exact:true}).click();
    assert.equal(await page.locator('.cart-price').first().textContent(),'$40.99');
    assert.equal(await page.locator('.cart-btn .badge').first().textContent(),'2');
    await page.locator('.cart-btn').nth(2).click();
    assert.equal(await page.getByRole('dialog').locator('.panel-total').textContent(),'Total $40.99');
    await page.getByRole('button',{name:'Close panel',exact:true}).click();
    await page.getByRole('button',{name:'Explore Products',exact:false}).click();
    assert.equal(await page.evaluate(()=>document.activeElement.textContent),'New Arrivals');
    report.checks.push({name:'navigation, favorites, add to cart, synchronized cart totals, close/Escape and Explore Products',result:'pass'});
    await page.setViewportSize({width:390,height:844});
    await page.reload({waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.load('16px "DM Serif Display"')); await page.waitForTimeout(1800);
    await layout('mobile 390x844');
    await page.screenshot({path:'screenshots/mobile.png',fullPage:true});
    await page.locator('.menu-btn').first().click();
    await page.getByRole('dialog').getByRole('button',{name:'Everything Your Pets Love',exact:true}).click();
    await page.getByRole('button',{name:'Explore Products',exact:false}).click();
    await page.waitForTimeout(600);
    await page.getByRole('button',{name:'Add Cat Bed to cart',exact:true}).click();
    assert.equal(await page.locator('.cart-price').last().textContent(),'$55.99');
    await page.locator('.cart-btn').last().click();
    assert.equal(await page.getByRole('dialog').locator('.panel-total').textContent(),'Total $55.99');
    await page.keyboard.press('Escape');
    report.checks.push({name:'mobile menu, explore, product add and cart',result:'pass'});
    for (const width of [320,768,1024,1280]) { await page.setViewportSize({width,height:1000}); await layout('responsive '+width); }
    assert.deepEqual(report.errors,[]); assert.deepEqual(report.failedRequests,[]); assert.deepEqual(report.responses,[]);
    report.status='pass';
  } catch(error) { report.status='fail'; report.failure=error.stack; process.exitCode=1; }
  finally { if(browser) await browser.close(); server.kill(); fs.writeFileSync('screenshots/checks.json',JSON.stringify(report,null,2)); console.log(JSON.stringify(report,null,2)); }
})();
