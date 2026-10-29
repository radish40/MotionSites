import http from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import path from 'node:path';
const base = '/motionsites-results/aerocore/';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.mp4': 'video/mp4', '.json': 'application/json' };
http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/' || pathname === base.slice(0,-1)) { res.writeHead(302, { Location: base }); return res.end(); }
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve(root, pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root + '/')) { res.writeHead(403); return res.end(); }
  try {
    const size = (await stat(file)).size;
    const data = await readFile(file);
    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
    if (req.headers.range) {
      const match = /bytes=(\d+)-(\d*)/.exec(req.headers.range);
      const start = Number(match?.[1] || 0), end = Math.min(Number(match?.[2] || size-1),size-1);
      res.writeHead(206, {...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end-start+1});
      res.end(data.subarray(start,end+1));
    } else { res.writeHead(200, {...headers, 'Content-Length': size}); res.end(data); }
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '0.0.0.0', () => console.log(`AeroCore preview: http://localhost:4173${base}`));
