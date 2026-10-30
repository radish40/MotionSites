import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
const prefix = '/motionsites-results/technical-specifications/';
const root = resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
http.createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (path === '/') { res.writeHead(302, { Location: prefix }); return res.end(); }
  const file = resolve(root, path.startsWith(prefix) ? path.slice(prefix.length) || 'index.html' : '__missing__');
  if (!file.startsWith(root + '/')) { res.writeHead(403); return res.end(); }
  try { const data = await readFile(file); res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' }); res.end(data); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(5173, '0.0.0.0', () => console.log('Serving on :5173' + prefix));
