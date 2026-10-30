const http=require('http');
const fs=require('fs');
const path=require('path');
const base='/motionsites-results/nickel-payments/';
http.createServer((req,res)=>{
 const url=decodeURIComponent(req.url.split('?')[0]);
 if(!url.startsWith(base)){res.writeHead(404);return res.end('Not found');}
 const relative=url.slice(base.length)||'index.html';
 const file=path.resolve('/work/dist',relative);
 if(!file.startsWith('/work/dist/')){res.writeHead(403);return res.end();}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end('Not found');} const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.ttf':'font/ttf'};res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);});
}).listen(4173,'0.0.0.0');
