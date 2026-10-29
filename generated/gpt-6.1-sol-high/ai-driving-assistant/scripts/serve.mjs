import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
const base = '/motionsites-results/ai-driving-assistant/';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/') { res.writeHead(302, { Location: base }); return res.end(); }
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve(root, pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root + '/')) { res.writeHead(403); return res.end(); }
  try {
    const info = await stat(file);
    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]); const end = range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
      if (start > end) { res.writeHead(416); return res.end(); }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1 });
      createReadStream(file, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { ...headers, 'Content-Length': info.size });
      createReadStream(file).pipe(res);
    }
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '0.0.0.0', () => console.log(`Preview: http://localhost:4173${base}`));
