const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('dist');
const base = '/motionsites-results/community-superdesign-light-rays-background/';
const mime = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml'};
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) {res.writeHead(404); res.end(); return;}
  const file = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  if (!file.startsWith(root + '/') && file !== root) {res.writeHead(403); res.end(); return;}
  fs.readFile(file, (err, data) => {
    if(err) {res.writeHead(404); res.end(); return;}
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(4173, '0.0.0.0');
