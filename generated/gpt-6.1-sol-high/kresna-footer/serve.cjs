const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/kresna-footer/';
const root = path.resolve(__dirname, 'dist');
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/') { res.writeHead(302, { Location: base }); return res.end(); }
  if (url.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
  if (!url.pathname.startsWith(base)) { res.writeHead(404); return res.end('Not found'); }
  const file = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (error, content) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream');
    res.end(content);
  });
}).listen(4173, '0.0.0.0', () => console.log(`Kresna Footer: http://localhost:4173${base}`));
