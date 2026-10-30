const {chromium} = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={url:'http://127.0.0.1:4173/motionsites-results/acreage-farming-hero/',checks:[],errors:[],failedRequests:[]};
 function check(name,passed,detail){results.checks.push({name,passed,detail});if(!passed)console.log('FAIL',name,detail)}
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();
  page.on('pageerror',e=>results.errors.push({viewport:name,error:e.message}));page.on('requestfailed',r=>results.failedRequests.push({viewport:name,url:r.url(),error:r.failure()?.errorText}));page.on('console',msg=>{if(msg.type()==='error')results.errors.push({viewport:name,error:msg.text(),location:msg.location()})});
  await page.goto(results.url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2200);
  const initial=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,fontSerif:document.fonts.check('500 20px "Playfair Display"'),fontSans:document.fonts.check('400 14px "DM Sans"'),videos:[...document.querySelectorAll('video')].map(v=>({readyState:v.readyState,paused:v.paused,currentTime:v.currentTime,width:v.videoWidth,error:v.error?.message})),images:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)}));
  check(`${name}: initial layout`,!initial.overflow,initial);check(`${name}: fonts`,initial.fontSerif&&initial.fontSans);check(`${name}: images`,initial.images.length===0,initial.images);check(`${name}: hero MP4 playing`,initial.videos[0].readyState>=2&&!initial.videos[0].paused&&initial.videos[0].currentTime>0,initial.videos[0]);
  await page.screenshot({path:`screenshots/${name}.png`});
  if(name==='mobile'){
   await page.getByRole('button',{name:'Open menu',exact:true}).click();check('mobile: menu opens',await page.locator('.nav-links').isVisible());await page.locator('.nav-links').getByRole('link',{name:'Services',exact:true}).click();await page.waitForTimeout(1100);check('mobile: menu closes after navigation',await page.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded')==='false');
  }
  await page.locator('#stats').scrollIntoViewIfNeeded();await page.waitForTimeout(1900);check(`${name}: stats counted`,(await page.locator('.stat-number').allTextContents()).join('|')==='40+|190+|126,000+|$14 Billion');
  await page.locator('#about').scrollIntoViewIfNeeded();await page.waitForTimeout(800);check(`${name}: dark scrolled navigation`,await page.locator('.navigation').evaluate(e=>e.classList.contains('scrolled')));
  await page.locator('.service-card').first().click();check(`${name}: service detail`,await page.getByRole('dialog').isVisible());await page.keyboard.press('Escape');
  await page.locator('.portfolio-card').first().click();check(`${name}: portfolio detail`,await page.getByRole('dialog').isVisible());await page.getByRole('button',{name:'Close dialog'}).click();
  await page.locator('.cinematic').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);const cinema=await page.locator('.cinematic video').evaluate(v=>({readyState:v.readyState,paused:v.paused,time:v.currentTime}));check(`${name}: cinematic MP4 playing in view`,cinema.readyState>=2&&!cinema.paused&&cinema.time>0,cinema);await page.getByRole('button',{name:'Register Now'}).click();check(`${name}: past event explained`,await page.getByRole('dialog').getByText('The January 2024 symposium has concluded.',{exact:false}).isVisible());await page.keyboard.press('Escape');
  await page.locator('.blog-footer button').first().click();check(`${name}: article opens`,await page.getByRole('dialog').getByRole('heading',{name:'Nurturing the Land for Future Generations'}).isVisible());await page.keyboard.press('Escape');
  await page.locator('.nav-cta').click();await page.getByLabel('Your name').fill('Avery Farmer');await page.getByLabel('Email address').fill('avery@example.com');await page.getByLabel('Tell us a little more').fill('Interested in soil and crop planning.');await page.getByRole('button',{name:'Prepare Inquiry'}).click();check(`${name}: inquiry prepared`,(await page.getByRole('link',{name:'Send by email'}).getAttribute('href')).includes('avery%40example.com'));await page.keyboard.press('Escape');
  const layoutIssues=[];
  for(const id of ['about','services','portfolio','events','blog','why']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(800);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)layoutIssues.push(id)}
  check(`${name}: all sections fit viewport`,layoutIssues.length===0,layoutIssues);
  // Reveal each observed element for a complete full-page record.
  for(const el of await page.locator('.reveal').all()){await el.scrollIntoViewIfNeeded();await page.waitForTimeout(100)}
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(900);await page.screenshot({path:`screenshots/${name}-full.png`,fullPage:true});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(800);
  check(`${name}: no missing images after scroll`,await page.evaluate(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0)));
  await context.close();
 }
 check('No JavaScript or console errors',results.errors.length===0,results.errors);
 fs.writeFileSync('browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
 if(results.checks.some(x=>!x.passed))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
