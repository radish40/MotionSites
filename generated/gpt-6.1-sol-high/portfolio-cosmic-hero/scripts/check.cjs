const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={url:'http://127.0.0.1:4173/motionsites-results/portfolio-cosmic-hero/',checks:[],errors:[],failedRequests:[]};
 const assert=(name,pass,details)=>{results.checks.push({name,pass,details});if(!pass)console.error('FAIL',name,details)};
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 page.on('pageerror',err=>results.errors.push({viewport:name,message:err.message}));
 page.on('requestfailed',req=>{if(!req.failure().errorText.includes('ERR_ABORTED'))results.failedRequests.push({viewport:name,url:req.url(),error:req.failure().errorText})});
 await page.goto(results.url,{waitUntil:'domcontentloaded'});
 await page.screenshot({path:`screenshots/${name}-loading.png`});
 await page.locator('.loader').waitFor({state:'detached',timeout:12000});
 await page.waitForTimeout(2200);
 assert(`${name}: page title`,await page.title()==="Michael Smith — Portfolio '26");
 assert(`${name}: fonts loaded`,await page.evaluate(()=>document.fonts.check('16px Inter')&&document.fonts.check('italic 16px "Instrument Serif"')));
 assert(`${name}: no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth})));
 const before=await page.locator('.role-word').textContent();await page.waitForTimeout(2100);const after=await page.locator('.role-word').textContent();assert(`${name}: role cycles`,before!==after,{before,after});
 const video=await page.locator('.hero video').evaluate(v=>({readyState:v.readyState,time:v.currentTime,paused:v.paused,width:v.videoWidth}));
 assert(`${name}: specified HLS plays`,video.readyState>=2&&video.time>0&&!video.paused,video);
 await page.screenshot({path:`screenshots/${name}.png`});
 await page.getByRole('link',{name:'See Works',exact:true}).click();await page.waitForTimeout(1500);
 assert(`${name}: smooth work navigation`,await page.locator('#work').evaluate(e=>Math.abs(e.getBoundingClientRect().top-110)<10));
 await page.getByRole('button',{name:'View Automotive Motion',exact:true}).click();
 await page.getByRole('dialog').waitFor();assert(`${name}: project details`,await page.getByRole('dialog').getByRole('heading',{name:'Automotive Motion'}).isVisible());
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});
 assert(`${name}: escape closes details`,await page.getByRole('dialog').count()===0);
 await page.locator('.journal-entry').first().click();await page.getByRole('dialog').waitFor();assert(`${name}: journal opens`,await page.getByRole('dialog').getByRole('heading',{name:'The beauty of doing less'}).isVisible());await page.getByRole('button',{name:'Close detail'}).click();await page.getByRole('dialog').waitFor({state:'detached'});
 await page.getByRole('button',{name:'Resume',exact:true}).click();await page.getByRole('dialog').waitFor();assert(`${name}: resume opens`,await page.getByRole('dialog').getByText('20+ years of experience',{exact:false}).isVisible());await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});
 await page.locator('.exploration-card').first().scrollIntoViewIfNeeded();await page.waitForTimeout(1200);await page.locator('.exploration-card').first().click({force:true});await page.waitForTimeout(400);assert(`${name}: exploration lightbox`,await page.getByRole('dialog').count()===1);if(await page.getByRole('dialog').count())await page.keyboard.press('Escape');
 await page.getByRole('link',{name:'Say hi',exact:false}).click();await page.waitForTimeout(1500);assert(`${name}: contact navigation`,await page.locator('.email').isVisible());assert(`${name}: email link`,await page.locator('.email').getAttribute('href')==='mailto:hello@michaelsmith.com');
 await page.screenshot({path:`screenshots/${name}-contact.png`});
 for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=650){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(100)}
 await page.waitForTimeout(1200);
 const images=await page.locator('main img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})));
 assert(`${name}: all section images load`,images.every(i=>i.loaded),images);
 assert(`${name}: no overflow after scrolling`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(500);
 await page.screenshot({path:`screenshots/${name}-full.png`,fullPage:true});
 await page.close();
 }
 assert('No browser script errors',results.errors.length===0,results.errors);
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();if(results.checks.some(c=>!c.pass))process.exitCode=1;
})();
