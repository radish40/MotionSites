const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/agent-grove/';
http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const relative = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.slice(1);
  const file = path.join('/work/dist', relative || 'index.html');
  fs.readFile(file, (err,data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const types = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.mp4':'video/mp4', '.jpg':'image/jpeg', '.ttf':'font/ttf' };
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data);
  });
}).listen(4173,'0.0.0.0');
