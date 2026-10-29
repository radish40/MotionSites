import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const base = '/motionsites-results/interior-features/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/' || url.pathname === base.slice(0, -1)) { res.writeHead(302, { Location: base }); res.end(); return; }
  if (!url.pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const name = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
  if (name.split('/').includes('..')) { res.writeHead(403); res.end(); return; }
  try { const file = await readFile(path.join('dist', name)); res.writeHead(200, { 'Content-Type': mime[path.extname(name)] || 'application/octet-stream' }); res.end(file); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(5173, '0.0.0.0', () => console.log(`http://localhost:5173${base}`));
