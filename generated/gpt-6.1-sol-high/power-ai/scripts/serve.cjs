const http=require('http'),fs=require('fs'),path=require('path');
const base='/motionsites-results/power-ai/';
http.createServer((req,res)=>{
 if(!req.url.startsWith(base)){res.writeHead(404);return res.end();}
 const file=path.join(process.cwd(),'dist',decodeURIComponent(req.url.slice(base.length)).split('?')[0]||'index.html');
 if(!file.startsWith(path.join(process.cwd(),'dist')+'/')){res.writeHead(403);return res.end();}
 fs.stat(file,(err,s)=>{
  if(err||!s.isFile()){res.writeHead(404);return res.end();}
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.mp4':'video/mp4'};
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
  if(req.headers.range){const [a,b]=req.headers.range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):s.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${s.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else{res.writeHead(200,{...headers,'Content-Length':s.size});fs.createReadStream(file).pipe(res);}
 });
}).listen(4173,'127.0.0.1');
