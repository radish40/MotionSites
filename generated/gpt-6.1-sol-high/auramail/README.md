# AuraMail

AuraMail (`auramail`) recreates the supplied Aura hero using React 18, TypeScript, Vite, Tailwind CSS, `motion/react`, and `lucide-react`. It includes the exact inline Aura and Apple marks, supplied copy, animated gradient, staggered entrance motion, original background video with no overlay, desktop guide lines, translucent Mac menu bar, and animated mobile drawer. The required Supabase dependency is included; this design does not require a backend.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured base path is `/motionsites-results/auramail/`; open that path on the dev or preview server. Publishable files are in `dist/`, including `dist/index.html`. Nothing has been deployed or pushed.

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The production build was served at its configured subpath and checked with actual headless Chromium using the image's installed Playwright:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script checks desktop 1440×1000 and mobile 390×844, document overflow, Inter loading, video playback, navigation visibility, download button clickability, drawer opening, all five drawer links, and drawer closing. It records JavaScript exceptions, console errors, HTTP errors, and failed requests. Screenshots were also visually inspected.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`
- `screenshots/browser-checks.json` — detailed results

## Assets and limits

The exact CloudFront video URL and Google Fonts Inter import from `PROMPT.md` are retained. Both loaded during browser verification. These assets require network access; the fallback is the specified dark background and system sans-serif font. Chromium can cancel video stream/range requests with `net::ERR_ABORTED`; the checks separately confirm decoded playback with `readyState: 4`, advancing playback time, and no media error.

The supplied design uses `href="#"` navigation links and download buttons without a download URL. Their visual and hover/click behavior is preserved; no installer, article pages, pricing pages, or backend is invented.

`TASK.md` and `PROMPT.md` are the project specification. `package-lock.json` locks dependencies. `node_modules/` is ignored and is not a deliverable.
