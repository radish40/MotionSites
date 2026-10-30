const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const checks = [];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[], failed=[], httpErrors=[];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('response', r=>{ if(r.status()>=400) httpErrors.push({url:r.url(),status:r.status()}); });
  page.on('requestfailed', r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://127.0.0.1:4173/motionsites-results/x-portfolio-hero/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').readyState >= 2);
  const autoplay = await page.evaluate(()=>{ const v=document.querySelector('video'); return {playing:!v.paused,muted:v.muted,loop:v.loop,playsInline:v.playsInline}; });
  await page.evaluate(()=>{const v=document.querySelector('video');v.pause();v.currentTime=2;});
  await page.waitForTimeout(500);
  const layout=await page.evaluate(()=>({
   viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],
   video:{loaded:document.querySelector('video').readyState>=2,width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight},
   fonts:{anton:[...document.fonts].some(f=>f.family==='Anton'&&f.status==='loaded'),inter:[...document.fonts].some(f=>f.family==='Inter'&&f.status==='loaded')},
   overflow:[...document.querySelectorAll('main *, header *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.right>innerWidth+1||b.bottom>innerHeight+1||b.left<0||b.top<0)}).map(e=>e.tagName+'.'+e.className)
  }));
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Start today',exact:true}).click();
  await page.locator('#email').fill('test@example.com');
  await page.getByRole('button',{name:'Try demo enquiry'}).click();
  const enquiry=await page.getByRole('status').textContent();
  await page.getByRole('button',{name:'Close dialog'}).click();
  await page.getByRole('button',{name:'Log In',exact:true}).click();
  await page.locator('#email').fill('test@example.com');
  await page.locator('#password').fill('demopassword');
  await page.getByRole('button',{name:'Try demo login'}).click();
  const login=await page.getByRole('status').textContent();
  await page.keyboard.press('Escape');
  if(name==='desktop') for(const title of ['About','Features','Pricing','FAQ','Help']){
   await page.getByRole('button',{name:title,exact:true}).click();
   if(!await page.locator('dialog').isVisible())throw Error('Missing dialog '+title);
   await page.keyboard.press('Escape');
  }
  await page.getByRole('button',{name:'Sign Up',exact:true}).click();
  const signUp=await page.locator('#email').isVisible();
  await page.keyboard.press('Escape');
  if(errors.length || httpErrors.length || layout.overflow.length || !layout.fonts.anton || !layout.fonts.inter || !autoplay.playing) throw Error('Browser validation failed: '+JSON.stringify({errors,httpErrors,layout,autoplay}));
  checks.push({name,...layout,autoplay,errors,failed,httpErrors,interactions:{enquiry,login,signUp,escapeDismiss:true}});
  await page.close();
 }
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(checks,null,2));
 console.log(JSON.stringify(checks,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
