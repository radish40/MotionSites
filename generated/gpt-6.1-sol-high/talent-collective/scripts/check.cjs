const { chromium } = require('/app/node_modules/playwright-core')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const base = '/motionsites-results/talent-collective/'
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) {res.writeHead(404);res.end();return}
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html')
  const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.woff2':'font/woff2'}
  fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(err?'Not found':data)})
})
;(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve))
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})
 const errors=[], failed=[]
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1})
 page.on('pageerror',e=>errors.push(e.message))
 page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure().errorText}))
 page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})})
 await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle',timeout:60000})
 await page.evaluate(()=>document.fonts.ready)
 await page.waitForTimeout(1000)
 const initial=await page.evaluate(()=>({title:document.title,font:document.fonts.check('500 16px Geist'),imageCount:document.images.length,images:[...document.images].map(i=>({alt:i.alt,loaded:i.complete&&i.naturalWidth>0})),layers:document.querySelectorAll('section > div.absolute.bg-cover').length,overflow:document.documentElement.scrollWidth>innerWidth}))
 await page.screenshot({path:'/work/screenshots/desktop.png'})
 const names=await page.getByRole('button').evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-label').replace('Show ','')))
 const interactions=[]
 for(let i=0;i<names.length;i++){
   await page.getByRole('button',{name:'Show '+names[i],exact:true}).click()
   await page.waitForFunction(index=>getComputedStyle(document.querySelectorAll('section > div.absolute.bg-cover')[index]).opacity==='1', i, {timeout:5000})
   interactions.push(await page.evaluate(({name,i})=>({name,pressed:document.querySelectorAll('[aria-pressed="true"]').length===1&&document.querySelector('[aria-pressed="true"]').getAttribute('aria-label')==='Show '+name,footer:document.querySelector('[aria-live]').textContent===name,activeBackground:getComputedStyle(document.querySelectorAll('section > div.absolute.bg-cover')[i]).opacity==='1',bioAnimation:getComputedStyle(document.querySelector('p')).animationDuration,backgroundDuration:getComputedStyle(document.querySelector('section > div.absolute.bg-cover')).transitionDuration}),{name:names[i],i}))
 }
 await page.getByRole('button',{name:'Show Andrei Baranov',exact:true}).focus()
 await page.keyboard.press('Enter')
 await page.waitForTimeout(800)
 const keyboardSelection=await page.locator('[aria-live]').textContent()==='Andrei Baranov'
 await page.getByRole('link',{name:'WhatsApp'}).hover()
 await page.waitForTimeout(300)
 const hover=await page.getByRole('link',{name:'WhatsApp'}).evaluate(e=>({href:e.getAttribute('href'),color:getComputedStyle(e).color}))
 await page.evaluate(()=>document.activeElement.blur())
 await page.mouse.move(0,0)
 await page.setViewportSize({width:390,height:844})
 await page.waitForTimeout(400)
 const mobile=await page.evaluate(()=>({width:innerWidth,height:innerHeight,sectionHeight:document.querySelector('section').getBoundingClientRect().height,overflow:document.documentElement.scrollWidth>innerWidth,roleVisible:getComputedStyle(document.querySelector('.hidden.sm\\:block')).display!=='none',tenureVisible:getComputedStyle(document.querySelector('.hidden.md\\:block')).display!=='none',avatarWidth:document.querySelector('button img').getBoundingClientRect().width,pickerScroll:document.querySelector('[aria-label="Choose a team member"]').scrollWidth>document.querySelector('[aria-label="Choose a team member"]').clientWidth}))
 await page.screenshot({path:'/work/screenshots/mobile.png'})
 await page.getByRole('button',{name:'Show Ksenia Romanova',exact:true}).click()
 await page.waitForTimeout(800)
 mobile.lastAvatarWorks=await page.locator('[aria-live]').textContent()==='Ksenia Romanova'
 await page.waitForTimeout(1800)
 mobile.noAutoplay=await page.locator('[aria-live]').textContent()==='Ksenia Romanova'
 const report={initial,interactions,keyboardSelection,hover,mobile,errors,failed}
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2))
 console.log(JSON.stringify(report,null,2))
 await browser.close();server.close()
 if(errors.length||failed.length||initial.images.some(i=>!i.loaded)||initial.overflow||!initial.font||!keyboardSelection||!mobile.lastAvatarWorks||!mobile.noAutoplay||mobile.overflow||interactions.some(i=>!i.pressed||!i.footer||!i.activeBackground))process.exitCode=1
})().catch(e=>{console.error(e);server.close();process.exitCode=1})
