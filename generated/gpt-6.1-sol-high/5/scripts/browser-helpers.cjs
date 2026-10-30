const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/app/node_modules/playwright-core');
const base='/motionsites-results/5/';
async function start() {
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf'};
 const server=http.createServer((req,res)=>{
  const url=decodeURIComponent(req.url.split('?')[0]);
  const file=path.join('/work/dist',url.startsWith(base)?url.slice(base.length)||'index.html':'__missing');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
 });
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 return {browser,url:'http://127.0.0.1:4173'+base,close:async()=>{await browser.close();await new Promise(r=>server.close(r));}};
}
module.exports={start};
