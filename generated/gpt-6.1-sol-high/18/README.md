# Loader Animation

Design ID **18**. A fullscreen portfolio loader built with **Next.js 14, React, TypeScript, and Framer Motion**, exported as a static site for `/motionsites-results/18/`.

The interface follows PROMPT.md: near-black background, uppercase Portfolio label, centered italic Instrument Serif words, a zero-padded counter, and a 3px blue gradient progress bar. The word index advances every 900ms and stops at Inspire. The counter uses requestAnimationFrame over 2700ms; completion waits another 400ms. The loader exits over 600ms, then the underlying page fades in over 500ms. Refresh the browser to replay.

`components/LoadingScreen.tsx` exposes `onComplete: () => void`, stores the callback in a ref, and cleans up its interval, frame, and timeout. `app/page.tsx` owns visibility and AnimatePresence. The post-load surface repeats Portfolio/Inspire; no further portfolio design was specified. The explicit 3.7s reveal in the timing summary is implemented using onExitComplete, resolving the prompt's simpler inline-style example that would otherwise reveal the page during the exit.

## Build and run

With Node 22 available:

```bash
npm ci
npm run build
```

In this host environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.home -e NEXT_TELEMETRY_DISABLED=1 \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --cache /work/.npm-cache && npm run build'
```

The full publishable output is `dist/`, including `dist/index.html`. Mount that directory at `/motionsites-results/18/` on a static HTTP server. No Node server is required to serve the export. For development, run `npm run dev` and open `http://localhost:3000/motionsites-results/18/`.

## Browser verification

Real production output was tested in headless Chromium using the installed playwright-core. Reproduce with:

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.home -v "$PWD":/work -w /work \
  --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script starts a temporary local static server, checks 1440×1000 and 390×844 viewports, captures the live loader, verifies Design → Create → Inspire, three-digit padding, counter timing, full progress, delayed exit, page reveal, font availability, page errors, failed requests, horizontal overflow, and refresh replay. Counter duration is measured from the first changing digit, accounting for its represented progress, to exclude the static HTML's pre-hydration 000. Animation timing is subject to display-frame scheduling. `browser-checks.json` records measured results; `verification.log` records build/type/browser verification. Screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`.

## Assets and limitations

Instrument Serif italic 400 was downloaded directly from Google Fonts and is served locally, with its OFL license in `public/fonts/OFL.txt`. `public/fonts/google-fonts.css` preserves the source response. Font source: https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zATiw.ttf . Runtime needs no external asset requests.

The optional reference `/home/opc/motionsites/assets/previews/18.webp` was absent, so visual implementation follows the complete written specification. No reference imagery or other designs were read. Browser verification covers Chromium at the requested sizes, not other browser engines. npm install reported two dependency advisories (one high, one critical) in the requested Next.js 14 dependency stack; see `build.log`. No deployment or push was performed.
