import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const base='/motionsites-results/travel-hero';
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.mp4':'video/mp4','.json':'application/json','.txt':'text/plain'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/' ){res.writeHead(302,{Location:base+'/'});return res.end();}let rel=decodeURIComponent(url.pathname).replace(base,'');let f=path.join(process.cwd(),'dist',rel);if((await stat(f)).isDirectory())f=path.join(f,'index.html');const data=await readFile(f);res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});res.end(data)}catch{res.writeHead(404,{'Content-Type':'text/html'});res.end(await readFile('dist/404.html').catch(()=>Buffer.from('Not found')))}}).listen(3000,'0.0.0.0');
