import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const base = '/motionsites-results/community-superdesign-typing-animation/';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.ttf': 'font/ttf' };
http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/') { res.writeHead(302, { Location: base }); return res.end(); }
  if (!pathname.startsWith(base) || pathname.includes('..')) { res.writeHead(404); return res.end(); }
  try {
    const file = pathname.slice(base.length) || 'index.html';
    const data = await readFile(path.join('dist', file));
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(3000, '0.0.0.0', () => console.log(`http://localhost:3000${base}`));
