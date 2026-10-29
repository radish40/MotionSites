import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
const base = '/motionsites-results/book-hero/';
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
http.createServer(async (req, res) => {
  let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (name === '/') { res.writeHead(302, { Location: base }); return res.end(); }
  if (!name.startsWith(base)) { res.writeHead(404); return res.end(); }
  name = name.slice(base.length) || 'index.html';
  const path = resolve('dist', name);
  if (!path.startsWith(resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  try { const file = await readFile(path); res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }); res.end(file); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '0.0.0.0', () => console.log('Preview http://localhost:4173' + base));
