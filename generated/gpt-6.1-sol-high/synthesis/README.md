# Synthesis

A scroll-driven landing page for **Elias Norden — Health Capital**, built with Vite, React, TypeScript, and Tailwind CSS. Project ID: `synthesis`.

The 700vh hero uses the original DNA video, fetched as a local blob and pre-extracted into 30–110 resized ImageBitmaps. A single animation loop smooths scroll progress, renders object-cover frames, crossfades the hero to near-black, and reveals the three supplied paragraphs. A seeked video remains available during extraction or if frame extraction fails. Bitmap, event, fetch, and object URL cleanup is included. Extraction can take roughly a minute on a shared CPU; the original video remains visible and scrubbable throughout preparation.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Without host Node, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Publishable files are in `dist/`. The configured base is `/motionsites-results/synthesis/`; the host must serve that directory under this path. No deployment or push was performed.

## Browser verification

The reproducible check serves the production build at its configured subpath and uses the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Required screenshots: `screenshots/desktop.png` (1440×1000) and `screenshots/mobile.png` (390×844). Additional scrub and final-reveal screenshots and a machine-readable browser report are saved in the same directory.

The production build and automated browser checks passed at both required sizes. Each viewport extracted 110 frames, changed from frame 0 to frame 59 during scrolling, passed the midpoint fade check, revealed paragraphs in order, and had no horizontal overflow or page script errors. An intentional bitmap-extraction failure also confirmed the seeked-video fallback. Original fonts loaded from bundled files. The browser report includes benign aborted media requests when loads were superseded or decoder sources were cleared; no missing assets were observed.

## Assets and scope

The exact external stylesheet links requested by the prompt are included in `index.html`. Original font files and video are also bundled locally to make rendering resilient to external host failures. See `public/assets/SOURCES.md` and retained provider CSS for sources and font attribution. No preview imagery is used in the page. The Synthesis preview alone was inspected for composition.

The prompt provides navigation labels but no article URLs or inquiry recipient. Articles navigates to the press/video portion; Allocations navigates to the final biography paragraph. Inquire opens an email composer with the subject “Health Capital inquiry” and leaves the recipient blank. Press names are typography, as specified. No destinations or contact addresses were invented.

Browser checks cover Chromium; Safari/iOS hardware behavior is not validated. This project uses the specified trial body font; the bundled asset is not a claim of commercial font rights.
