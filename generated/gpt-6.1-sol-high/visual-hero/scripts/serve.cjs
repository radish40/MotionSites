const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/visual-hero/';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(302, {Location: base}); return res.end(); }
  const relative = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const match = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  if (match) {
    const start = Number(match[1]), end = match[2] ? Math.min(Number(match[2]),size-1) : size-1;
    res.writeHead(206, {...headers,'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(file).pipe(res); }
}).listen(4173, '0.0.0.0');
