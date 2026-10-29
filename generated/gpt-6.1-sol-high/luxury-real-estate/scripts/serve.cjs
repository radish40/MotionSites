// Local verification only. Serve the built site at its required publication path.
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', 'dist');
const prefix = '/motionsites-results/luxury-real-estate/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4' };
http.createServer((req, res) => {
 const url = decodeURIComponent(req.url.split('?')[0]);
 if (!url.startsWith(prefix)) { res.writeHead(404); res.end('Not found'); return; }
 const file = path.resolve(root, url.slice(prefix.length) || 'index.html');
 if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
 fs.readFile(file, (error, data) => { res.writeHead(error ? 404 : 200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(error ? 'Not found' : data); });
}).listen(4173, '0.0.0.0', () => console.log(`http://localhost:4173${prefix}`));
