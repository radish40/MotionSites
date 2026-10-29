const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/skills-lea/';
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.jpg':'image/jpeg', '.ttf':'font/ttf', '.mp4':'video/mp4' };
const server = http.createServer((req,res) => {
  const clean = decodeURIComponent(req.url.split('?')[0]);
  if (!clean.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const file = path.join('/work/dist', clean.slice(base.length) || 'index.html');
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(file); const range = req.headers.range;
  const headers = { 'Content-Type':mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes' };
  if (range) { const parts = range.replace(/bytes=/,'').split('-'); const start = Number(parts[0]); const end = parts[1] ? Number(parts[1]) : stat.size-1; res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`, 'Content-Length':end-start+1}); fs.createReadStream(file,{start,end}).pipe(res); }
  else { res.writeHead(200,{...headers,'Content-Length':stat.size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const errors=[]; const failures=[]; const checks=[];
 const expect = (condition,name) => {checks.push({name,passed:!!condition}); if(!condition) throw Error(name)};
 const context = await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()})});
 await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('video')).every(v=>v.readyState>=2),{},{timeout:30000});
 await page.waitForTimeout(1500);
 const media=await page.locator('video').evaluateAll(vs=>vs.map(v=>({src:v.currentSrc,readyState:v.readyState,width:v.videoWidth,playing:!v.paused,error:v.error?.message||null})));
 expect(media.length===6&&media.every(v=>v.width>0&&!v.error),'All six supplied videos decode and play');
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),'Background and avatar images load');
 expect(await page.evaluate(()=>document.fonts.check('400 16px "Space Grotesk"')),'Space Grotesk loaded');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Desktop has no horizontal overflow');
 expect(await page.locator('.phone').evaluateAll(phones=>phones.every(p=>p.getBoundingClientRect().width===370&&p.getBoundingClientRect().height===760)&&new Set(phones.map(p=>p.getBoundingClientRect().top)).size===1),'Desktop phone dimensions and horizontal arrangement');
 await page.locator('video').evaluateAll(videos => videos.forEach(v => { v.pause(); v.currentTime = Math.min(5, v.duration * 0.65) }));
 await page.waitForTimeout(500);
 for (const video of await page.locator('video').all()) {
   const capture = await video.evaluate(v => { const canvas = document.createElement('canvas'); canvas.width = v.videoWidth; canvas.height = v.videoHeight; canvas.getContext('2d').drawImage(v,0,0); return {name:v.currentSrc.split('/').pop().replace('.mp4','.jpg'),data:canvas.toDataURL('image/jpeg',0.9).split(',')[1]} });
   if (!fs.existsSync('/work/public/assets/'+capture.name)) fs.writeFileSync('/work/public/assets/'+capture.name, Buffer.from(capture.data,'base64'));
 }
 await page.locator('video').evaluateAll(videos => videos.forEach(v => { v.pause(); v.removeAttribute('src'); v.load() }));
 await page.waitForTimeout(250);
 await page.screenshot({path:'/work/screenshots/desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Design',exact:true}).click();
 expect(await page.locator('.course-card').count()===2,'Design filter shows two courses');
 await page.getByRole('button',{name:'Programming',exact:true}).click();
 expect(await page.locator('.course-card').count()===1,'Programming filter shows one course');
 await page.getByRole('button',{name:'All',exact:true}).click();
 await page.getByRole('button',{name:'Search courses',exact:true}).click();
 await page.getByRole('textbox',{name:'Search course titles'}).fill('Digital');
 expect(await page.locator('.course-card').count()===1,'Search filters course titles');
 await page.getByRole('textbox',{name:'Search course titles'}).fill('missing');
 expect(await page.getByText('No courses in this field yet.').isVisible(),'Empty search state');
 await page.getByRole('button',{name:'Close search'}).click();
 await page.getByRole('button',{name:'View UI/UX Design lesson',exact:true}).click();
 expect(await page.getByRole('heading',{name:'Components & Variants'}).isVisible(),'Course card opens corresponding schedule');
 expect(await page.getByRole('heading',{name:'August 2024'}).isVisible(),'Calendar starts August 2024');
 expect(await page.getByRole('button',{name:'August 16, 2024',exact:true}).getAttribute('aria-pressed')==='true','August 16 selected initially');
 expect(await page.locator('.calendar-day').count()===42,'Calendar has 42 cells');
 await page.getByRole('button',{name:'Next month',exact:true}).click();
 expect(await page.getByRole('heading',{name:'September 2024'}).isVisible(),'Next month navigation');
 await page.getByRole('button',{name:'Previous month',exact:true}).click();
 await page.getByRole('button',{name:'August 21, 2024',exact:true}).click();
 expect(await page.getByRole('button',{name:'August 21, 2024',exact:true}).getAttribute('aria-pressed')==='true','Calendar day selection');
 await page.getByRole('button',{name:'Share lesson schedule'}).click();
 expect((await page.evaluate(()=>navigator.clipboard.readText())).endsWith('#lesson-schedule'),'Share copies schedule link');
 await page.getByRole('button',{name:'View lesson: Components & Variants',exact:true}).click();
 expect(await page.getByRole('dialog',{name:'Lesson preview'}).isVisible(),'Lesson preview opens');
 await page.getByRole('button',{name:'Close lesson preview'}).click();
 expect(await page.getByRole('dialog').count()===0,'Lesson preview closes');
 await page.getByRole('button',{name:'Home',exact:true}).click();
 expect(await page.locator('.course-card').count()===4,'Home resets course view');
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'networkidle'});
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('video')).every(v=>v.readyState>=2),{},{timeout:30000});
 await page.locator('video').evaluateAll(videos => videos.forEach(v => { v.pause(); v.currentTime = Math.min(5, v.duration * 0.65) }));
 await page.waitForTimeout(500);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Mobile has no horizontal overflow');
 expect(await page.locator('.phone').evaluateAll(ps=>ps.every(p=>p.getBoundingClientRect().width===320)&&ps[1].getBoundingClientRect().top>ps[0].getBoundingClientRect().bottom),'Mobile phones stack vertically at 320 pixels');
 await page.locator('video').evaluateAll(videos => videos.forEach(v => { v.pause(); v.removeAttribute('src'); v.load() }));
 await page.waitForTimeout(250);
 await page.screenshot({path:'/work/screenshots/mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Start exploring'}).click(); await page.waitForTimeout(700);
 expect(await page.locator('section[aria-label="Explore courses"]').evaluate(e=>e.getBoundingClientRect().top>=0 && e.getBoundingClientRect().bottom<=innerHeight),'Onboarding navigates to Explore on mobile');
 await page.getByRole('button',{name:'View UI/UX Design lesson',exact:true}).click(); await page.waitForTimeout(700);
 expect(await page.locator('section[aria-label="Lesson schedule"]').evaluate(e=>e.getBoundingClientRect().top>=0 && e.getBoundingClientRect().bottom<=innerHeight),'Course navigates to schedule on mobile');
 await page.getByRole('button',{name:'Back to explore'}).click(); await page.waitForTimeout(700);
 expect(await page.locator('section[aria-label="Explore courses"]').evaluate(e=>e.getBoundingClientRect().top>=0 && e.getBoundingClientRect().bottom<=innerHeight),'Back returns to Explore on mobile');
 for(const width of [768,1024]) {await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),`No overflow at ${width}px`)}
 expect(errors.length===0,'No browser script errors'); expect(failures.length===0,'No failed asset responses');
 fs.writeFileSync('/work/browser-checks.json',JSON.stringify({checks,errors,failures,media},null,2));
 await browser.close(); server.close(); console.log(JSON.stringify({checks,errors,failures},null,2));
})().catch(error=>{console.error(error);process.exit(1)});
