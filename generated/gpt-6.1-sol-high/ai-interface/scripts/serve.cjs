const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/ai-interface/';
const root = path.resolve('dist');
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve(root, url.slice(base.length) || 'index.html');
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.webp': 'image/webp', '.ttf': 'font/ttf' };
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  if (range) {
    const start = +range[1], end = Math.min(range[2] ? +range[2] : size - 1, size - 1);
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  }
}).listen(4173, '0.0.0.0', () => console.log('Serving built AI Interface at port 4173'));
