import { cp, access, readdir, rm } from 'node:fs/promises'
// Start emits a prerendered client build. Deliver only those static files.
for (const entry of await readdir('dist')) {
  if (entry !== 'client' && entry !== 'server') await rm(`dist/${entry}`, { recursive: true, force: true })
}
await cp('dist/client', 'dist', { recursive: true })
await access('dist/index.html')
await rm('dist/client', { recursive: true, force: true })
await rm('dist/server', { recursive: true, force: true })
console.log('Static delivery ready: dist/index.html')
