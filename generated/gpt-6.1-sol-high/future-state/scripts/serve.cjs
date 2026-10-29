const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/future-state/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2','.png':'image/png'};
http.createServer((req,res)=>{
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) { res.writeHead(302,{Location:base}); res.end(); return; }
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith('/work/dist/')) {res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);});
}).listen(4173,'0.0.0.0');
