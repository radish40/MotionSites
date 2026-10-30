import http from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
const root = path.resolve('dist')
const base = '/motionsites-results/nexora-features/'
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.json': 'application/json' }
http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return }
  let file = path.resolve(root, pathname.slice(base.length) || 'index.html')
  if (!file.startsWith(root + '/')) { res.writeHead(403).end(); return }
  try {
    let info = await stat(file)
    if (info.isDirectory()) { file = path.join(file, 'index.html'); info = await stat(file) }
    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' }
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
    if (range) {
      const start = Number(range[1]), end = Math.min(range[2] ? Number(range[2]) : info.size - 1, info.size - 1)
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1 })
      createReadStream(file, { start, end }).pipe(res)
    } else {
      res.writeHead(200, { ...headers, 'Content-Length': info.size })
      createReadStream(file).pipe(res)
    }
  } catch { res.writeHead(404).end() }
}).listen(3000, '0.0.0.0', () => console.log(`http://localhost:3000${base}`))
