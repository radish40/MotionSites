const http = require('http'), fs = require('fs'), path = require('path');
const root = '/work/dist', base = '/motionsites-results/prompt-hero/';
http.createServer((req,res) => {
  let name = decodeURIComponent(req.url.split('?')[0]);
  if(!name.startsWith(base)) {res.writeHead(404);return res.end();}
  name = path.join(root, name.slice(base.length) || 'index.html');
  if(!name.startsWith(root) || !fs.existsSync(name)) {res.writeHead(404);return res.end();}
  const stat = fs.statSync(name), type = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.webp':'image/webp','.ttf':'font/ttf'}[path.extname(name)] || 'application/octet-stream';
  const range = req.headers.range;
  if(range) {const [a,b]=range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):stat.size-1;res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(name,{start,end}).pipe(res);}
  else {res.writeHead(200,{'Content-Type':type,'Content-Length':stat.size,'Accept-Ranges':'bytes'});fs.createReadStream(name).pipe(res);}
}).listen(4173,'0.0.0.0');
