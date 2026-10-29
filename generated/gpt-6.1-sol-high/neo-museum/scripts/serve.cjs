const http = require('http');
const fs = require('fs');
const path = require('path');
const base = '/motionsites-results/neo-museum/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.mp4': 'video/mp4' };
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(302, { Location: base }); return res.end(); }
  const relative = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (error, data) => { if (error) { res.writeHead(404); return res.end('Not found'); } res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(data); });
}).listen(4173, '0.0.0.0');
