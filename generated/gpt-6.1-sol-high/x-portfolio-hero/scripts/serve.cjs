const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '../dist');
const base = '/motionsites-results/x-portfolio-hero/';
http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) { res.writeHead(302, {Location: base}); return res.end(); }
  const file = path.join(root, pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.ttf':'font/ttf','.svg':'image/svg+xml'};
  const size = fs.statSync(file).size;
  const range = req.headers.range;
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = Number(startStr), end = endStr ? Number(endStr) : size - 1;
    res.writeHead(206, {'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200, {'Content-Length':size}); fs.createReadStream(file).pipe(res); }
}).listen(4173, '0.0.0.0');
