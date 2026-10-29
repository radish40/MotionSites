import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const base = '/motionsites-results/remit-race/';
const types = { '.html':'text/html', '.css':'text/css', '.woff2':'font/woff2', '.ttf':'font/ttf', '.png':'image/png', '.mp4':'video/mp4', '.json':'application/json' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/') { res.writeHead(302, { Location: base }); res.end(); return; }
  if (!url.pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const file = path.resolve('dist', decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); res.end(); return; }
  try {
    const data = await readFile(file);
    const headers = { 'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes' };
    if (req.headers.range) {
      const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!range) { res.writeHead(416); res.end(); return; }
      const start = Number(range[1]); const end = Math.min(range[2] ? Number(range[2]) : data.length - 1, data.length - 1);
      if (start > end) { res.writeHead(416, {'Content-Range':`bytes */${data.length}`}); res.end(); return; }
      res.writeHead(206, {...headers, 'Content-Range':`bytes ${start}-${end}/${data.length}`, 'Content-Length':end-start+1});
      res.end(data.subarray(start,end+1));
    } else { res.writeHead(200, {...headers,'Content-Length':data.length}); res.end(data); }
  }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '0.0.0.0', () => console.log(`http://localhost:4173${base}`));
