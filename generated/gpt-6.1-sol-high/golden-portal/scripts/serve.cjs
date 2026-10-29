const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('dist');
const prefix = '/motionsites-results/golden-portal/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith(prefix)){res.writeHead(302,{Location:prefix});res.end();return;}
 const file=path.resolve(root,pathname.slice(prefix.length)||'index.html');
 if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return;}
 fs.stat(file,(err,stat)=>{if(err){res.writeHead(404);res.end('Not found');return;}
 const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
 const range=req.headers.range;
 if(range){const [,start,end]=/bytes=(\d+)-(\d*)/.exec(range)||[];const a=Number(start),b=end?Number(end):stat.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${a}-${b}/${stat.size}`,'Content-Length':b-a+1});fs.createReadStream(file,{start:a,end:b}).pipe(res);}
 else {res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}
 });
}).listen(4173,'0.0.0.0',()=>console.log('Golden Portal preview ready'));
