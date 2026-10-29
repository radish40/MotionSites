import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import path from 'node:path';
const base='/motionsites-results/bl/';
const types={'.svg':'image/svg+xml','.html':'text/html','.css':'text/css','.js':'text/javascript','.mp4':'video/mp4','.ttf':'font/ttf','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/' || url.pathname===base.slice(0,-1)){res.writeHead(302,{Location:base});return res.end();}
 if(!url.pathname.startsWith(base)){res.writeHead(404);return res.end();}
 const file=path.resolve('dist',decodeURIComponent(url.pathname.slice(base.length))||'index.html');
 if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403);return res.end();}
 try{
 const info=await stat(file); if(!info.isFile())throw Error();
 const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),info.size-1):info.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});createReadStream(file,{start,end}).pipe(res);}
 else{res.writeHead(200,{...headers,'Content-Length':info.size});createReadStream(file).pipe(res);}
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(4173,'0.0.0.0',()=>console.log('Bloom preview: http://localhost:4173'+base));
