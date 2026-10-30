import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const prefix = '/motionsites-results/community-superdesign-scroll-journey-line/';
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.ttf':'font/ttf' };
http.createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (url === '/') { res.writeHead(302, {Location:prefix}); return res.end(); }
  const relative = url.startsWith(prefix) ? url.slice(prefix.length) : url.slice(1);
  const file = path.resolve('dist', relative || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  try { const data = await readFile(file); res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'}); res.end(data); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(3000, '0.0.0.0', () => console.log('Site running on port 3000'));
