import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const base = '/motionsites-results/place-saver/';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.mp4':'video/mp4','.woff2':'font/woff2'};
http.createServer(async (req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/') { res.writeHead(302, {Location: base}); res.end(); return; }
  if (!pathname.startsWith(base)) {res.writeHead(404);res.end();return;}
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + path.sep)) {res.writeHead(403);res.end();return;}
  try { const data = await readFile(file);res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});res.end(data); }
  catch {res.writeHead(404);res.end('Not found');}
}).listen(5173, '0.0.0.0', () => console.log('http://localhost:5173' + base));
