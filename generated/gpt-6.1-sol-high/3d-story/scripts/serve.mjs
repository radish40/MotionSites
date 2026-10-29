import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
export const base = '/motionsites-results/3d-story/';
export function createServer() {
  const root = resolve('dist');
  const types = { '.html':'text/html; charset=utf-8', '.mp4':'video/mp4', '.css':'text/css', '.ttf':'font/ttf', '.png':'image/png' };
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === base.slice(0,-1)) { res.writeHead(301, { Location: base }); return res.end(); }
      if (!url.pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
      const path = resolve(root, decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
      if (!path.startsWith(root + '/')) { res.writeHead(403); return res.end(); }
      const file = await stat(path);
      const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
      const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      let start=0, end=file.size-1;
      if (range) { start=Number(range[1]); end=range[2] ? Math.min(Number(range[2]),end) : end; headers['Content-Range']=`bytes ${start}-${end}/${file.size}`; }
      headers['Content-Length']=end-start+1;
      res.writeHead(range ? 206 : 200,headers);
      if (req.method === 'HEAD') return res.end();
      createReadStream(path,{start,end}).pipe(res);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  createServer().listen(4173,'0.0.0.0',() => console.log(`Preview: http://localhost:4173${base}`));
}
