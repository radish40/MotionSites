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
(async()=>{
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage();await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('video')).every(v=>v.readyState>=2));
 await page.locator('video').evaluateAll(vs=>vs.forEach(v=>{v.pause();v.currentTime=Math.min(5,v.duration*.65)}));await page.waitForTimeout(700);
 for(const video of await page.locator('video').all()){
 const frame=await video.evaluate(v=>{const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return {name:v.currentSrc.split('/').pop().replace('.mp4','.jpg'),data:c.toDataURL('image/jpeg',.9).split(',')[1]}});
 fs.writeFileSync('/work/public/assets/'+frame.name,Buffer.from(frame.data,'base64'));
 }
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
