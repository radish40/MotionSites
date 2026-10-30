import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const base = '/motionsites-results/framelix-3d-studios/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.svg':'image/svg+xml', '.ttf':'font/ttf' };
http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (url === '/') { res.writeHead(302, { Location: base }); return res.end(); }
  if (!url.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve('dist', url.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const type = types[path.extname(file)] || 'application/octet-stream';
  const range = req.headers.range;
  if (range) {
    const [startRaw, endRaw] = range.replace('bytes=', '').split('-');
    const start = Number(startRaw), end = endRaw ? Math.min(Number(endRaw), size - 1) : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges':'bytes', 'Content-Length':end-start+1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.writeHead(200, { 'Content-Type':type, 'Content-Length': size, 'Accept-Ranges':'bytes' }); fs.createReadStream(file).pipe(res); }
}).listen(5173, '0.0.0.0');
