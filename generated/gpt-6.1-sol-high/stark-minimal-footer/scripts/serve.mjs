import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
const base = '/motionsites-results/stark-minimal-footer/';
const types = { '.html': 'text/html', '.css': 'text/css', '.woff2': 'font/woff2', '.txt': 'text/plain' };
http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (!pathname.startsWith(base)) {
    res.writeHead(302, { Location: base }); res.end(); return;
  }
  const file = resolve('dist', '.' + pathname.slice(base.length - 1), pathname.endsWith('/') ? 'index.html' : '');
  if (!file.startsWith(resolve('dist') + '/')) { res.writeHead(403); res.end(); return; }
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '0.0.0.0', () => console.log(`Preview: http://localhost:4173${base}`));
