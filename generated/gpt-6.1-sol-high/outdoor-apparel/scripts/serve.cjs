const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve('dist'),prefix='/motionsites-results/outdoor-apparel/';
http.createServer((req,res)=>{
 const pathname=decodeURIComponent(req.url.split('?')[0]);
 if(!pathname.startsWith(prefix)){res.writeHead(404);return res.end('Not found');}
 let file=path.join(root,pathname.slice(prefix.length)||'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.stat(file,(err,stat)=>{
  if(err){res.writeHead(404);return res.end('Not found');}
  const types={'.html':'text/html','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.woff2':'font/woff2'};
  const range=req.headers.range;
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
  if(range){const [a,b]=range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):stat.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else{res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}
 });
}).listen(4173,'0.0.0.0',()=>console.log('Serving built project on 4173'));
