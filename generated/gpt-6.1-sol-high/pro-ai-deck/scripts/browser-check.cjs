const { chromium } = require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={errors:[],failedRequests:[],viewports:{}};
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});const page=await context.newPage();
 page.on('pageerror',e=>results.errors.push(e.message));page.on('requestfailed',r=>results.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 await page.goto('http://localhost:4173/motionsites-results/pro-ai-deck/',{waitUntil:'networkidle'});
 await page.waitForTimeout(2500);await page.screenshot({path:`screenshots/${name}.png`});
 results.viewports[name]={slides:[],titleSlideFonts:await page.evaluate(()=>({heading:document.fonts.check('italic 16px "Instrument Serif"'),body:document.fonts.check('16px Barlow'),icons:document.fonts.check('16px "Material Symbols Rounded"')}))};
 for(let i=0;i<7;i++){
 if(i){await page.getByRole('button',{name:`Go to slide ${i+1}:`,exact:false}).click();await page.waitForTimeout(2100);}
 results.viewports[name].slides.push(await page.evaluate(()=>({label:document.querySelector('section')?.getAttribute('aria-label'),overflow:document.documentElement.scrollWidth>innerWidth,video:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,ready:v.readyState,width:v.videoWidth,error:v.error?.message})),outside:[...document.querySelectorAll('h1,h2,h3,p,blockquote,section a,section button')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+1||r.left< -1||r.bottom>innerHeight-55}).map(el=>({text:el.textContent,bounds:el.getBoundingClientRect().toJSON()}))})));
 await page.screenshot({path:`screenshots/${name}-slide-${i+1}.png`});
 }
 await page.getByRole('button',{name:'Previous slide',exact:true}).click();await page.waitForTimeout(1500);results.viewports[name].previous=await page.locator('section').getAttribute('aria-label');
 await page.getByRole('button',{name:'Go to slide 1: Introduction',exact:true}).click();await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Get Started',exact:true}).click();await page.waitForTimeout(1500);results.viewports[name].getStarted=await page.locator('section').getAttribute('aria-label');
 results.viewports[name].links=await page.locator('section a').evaluateAll(a=>a.map(x=>({text:x.textContent,href:x.getAttribute('href')})));
 await page.getByRole('button',{name:'Go to slide 1: Introduction',exact:true}).click();await page.waitForTimeout(1500);
 if(name==='desktop'){await page.locator('main').click({position:{x:1100,y:300}});await page.keyboard.press('ArrowRight');await page.waitForTimeout(1500);results.viewports[name].keyboard=await page.locator('section').getAttribute('aria-label');await page.mouse.wheel(0,100);await page.waitForTimeout(1500);results.viewports[name].wheel=await page.locator('section').getAttribute('aria-label');}
 else {const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:330,y:400}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:100,y:400}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(1500);results.viewports[name].swipe=await page.locator('section').getAttribute('aria-label');}
 results.viewports[name].fonts=await page.evaluate(()=>({heading:document.fonts.check('italic 16px \"Instrument Serif\"'),body:document.fonts.check('16px Barlow'),icons:document.fonts.check('16px \"Material Symbols Rounded\"')}));await context.close();
 }
 fs.writeFileSync('browser-checks.json',JSON.stringify(results,null,2));await browser.close();console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
