import express from 'express';
import path from 'node:path';

const app = express();
const base = '/motionsites-results/oyla';
const production = process.env.NODE_ENV === 'production';

async function videoProxy(req: express.Request, res: express.Response) {
  const share = String(req.query.url || 'https://higgsfield.ai/s/keldUFnImRA');
  let url: URL;
  try { url = new URL(share); } catch { return res.status(400).json({ success: false, error: 'Invalid share URL' }); }
  if (url.protocol !== 'https:' || url.hostname !== 'higgsfield.ai' || !url.pathname.startsWith('/s/')) {
    return res.status(400).json({ success: false, error: 'Expected a Higgsfield share URL' });
  }
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Share page unavailable');
    const html = (await response.text()).replace(/\\u002[fF]/g, '/').replace(/\\\//g, '/').replace(/&amp;/g, '&');
    const mp4 = html.match(/https:\/\/[^\s"'<>\\]+\.mp4(?:\?[^\s"'<>\\]*)?/i)?.[0];
    const videoTag = html.match(/<meta[^>]*(?:property|name)=["']og:video(?::url)?["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']og:video(?::url)?["']/i)?.[1];
    const direct = mp4 || videoTag;
    if (!direct || !direct.startsWith('https://')) throw new Error('No direct video URL found');
    res.set('Cache-Control', 'public, max-age=300').json({ success: true, url: direct });
  } catch { res.status(502).json({ success: false, error: 'Video refresh unavailable; use the bundled video.' }); }
}
app.get(['/api/higgsfield-video', `${base}/api/higgsfield-video`], videoProxy);

async function start() {
  if (production) {
    const dist = path.resolve('dist');
    app.use(base, express.static(dist));
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }
  app.listen(3000, '0.0.0.0', () => console.log('OYLA · http://localhost:3000' + base + '/'));
}
start();
