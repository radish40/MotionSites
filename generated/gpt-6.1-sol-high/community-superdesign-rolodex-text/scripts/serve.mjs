import http from 'node:http';
import { readFile } from 'node:fs/promises';
const base = '/motionsites-results/community-superdesign-rolodex-text/';
http.createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  if (!path.startsWith(base)) { res.writeHead(302, { Location: base }); return res.end(); }
  const file = path.slice(base.length) || 'index.html';
  if (!['index.html', 'style.css', 'app.js'].includes(file)) { res.writeHead(404); return res.end(); }
  try {
    const data = await readFile(`dist/${file}`);
    res.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html');
    res.end(data);
  } catch { res.writeHead(404); res.end(); }
}).listen(5173, '0.0.0.0', () => console.log(`http://localhost:5173${base}`));
