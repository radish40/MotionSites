const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/vitara-hero/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.ttf':'font/ttf', '.png':'image/png' };
http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(302, { Location: base }); res.end(); return; }
  const file = path.join('/work/dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(4173, '0.0.0.0');
