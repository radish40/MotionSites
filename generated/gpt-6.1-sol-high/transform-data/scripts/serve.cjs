const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve('dist');
const base = '/motionsites-results/transform-data/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.ttf':'font/ttf','.svg':'image/svg+xml'};
http.createServer((req,res) => {
  let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const filename = path.resolve(root,pathname.slice(base.length) || 'index.html');
  if (!filename.startsWith(root + '/') || !fs.existsSync(filename)) { res.writeHead(404); res.end(); return; }
  const size = fs.statSync(filename).size;
  const headers = {'Content-Type':types[path.extname(filename)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  const range = req.headers.range;
  if (range) {
    const [startRaw,endRaw] = range.replace('bytes=','').split('-');
    const start = Number(startRaw); const end = endRaw ? Math.min(Number(endRaw),size-1) : size-1;
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(filename,{start,end}).pipe(res);
  } else { res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(filename).pipe(res); }
}).listen(4173,'0.0.0.0');
