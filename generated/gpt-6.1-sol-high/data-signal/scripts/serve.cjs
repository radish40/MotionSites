const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const prefix = '/motionsites-results/data-signal/';
const types = {'.html':'text/html; charset=utf-8','.mp4':'video/mp4','.png':'image/png','.ttf':'font/ttf','.txt':'text/plain','.css':'text/css'};
const server = http.createServer((req,res)=>{
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/') { res.writeHead(302, {Location:prefix}); return res.end(); }
  if (!url.pathname.startsWith(prefix)) {res.writeHead(404); return res.end();}
  const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + '/') || !fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404);return res.end();}
  const size = fs.statSync(file).size;
  const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  const match = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
  if (match) {
    const start = Number(match[1]), end = Math.min(match[2] ? Number(match[2]) : size-1, size-1);
    if(start > end) {res.writeHead(416, {'Content-Range':`bytes */${size}`}); return res.end();}
    res.writeHead(206, {...headers, 'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else {res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);}
});
server.listen(process.env.PORT || 4173,'0.0.0.0',()=>console.log('Serving '+prefix));
