const http = require('http');
const fs = require('fs');
const path = require('path');
const base = '/motionsites-results/nike-premium-landing/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webm':'video/webm','.woff2':'font/woff2','.json':'application/json'};
http.createServer((req,res) => {
  let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (!pathname.startsWith(base)) {res.writeHead(404); return res.end('Not found');}
  let filename = path.resolve('dist',pathname.slice(base.length) || 'index.html');
  if (!filename.startsWith(path.resolve('dist') + '/')) {res.writeHead(403); return res.end();}
  fs.readFile(filename,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream'});res.end(data);});
}).listen(4173,'0.0.0.0');
