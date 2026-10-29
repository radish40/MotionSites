import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const base = '/motionsites-results/pet-products/';
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.webp':'image/webp', '.mp4':'video/mp4', '.ttf':'font/ttf', '.woff2':'font/woff2', '.json':'application/json' };
http.createServer(async (req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end('Not found'); }
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(file);
    const range = req.headers.range;
    const headers = {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
    if (range) {
      const [,startText,endText] = /bytes=(\d+)-(\d*)/.exec(range) || [];
      const start = Number(startText), end = endText ? Math.min(Number(endText),data.length-1) : data.length-1;
      res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1}); res.end(data.subarray(start,end+1));
    } else { res.writeHead(200,{...headers,'Content-Length':data.length}); res.end(data); }
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173,'0.0.0.0',() => console.log('Pet Products listening on port 4173'));
