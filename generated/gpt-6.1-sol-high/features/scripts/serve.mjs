import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const base = '/motionsites-results/features/';
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.ttf':'font/ttf', '.woff2':'font/woff2', '.mp4':'video/mp4', '.jpg':'image/jpeg' };
http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/') { res.writeHead(302, { Location:base }); return res.end(); }
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve(root, decodeURIComponent(pathname.slice(base.length)) || 'index.html');
  if (!file.startsWith(root + '/')) { res.writeHead(403); return res.end(); }
  try {
    const info = await stat(file);
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Content-Length':info.size });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '0.0.0.0', () => console.log(`http://localhost:4173${base}`));
