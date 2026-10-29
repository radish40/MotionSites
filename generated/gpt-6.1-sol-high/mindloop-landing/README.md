# Mindloop Landing

A responsive monochrome newsletter landing page built from `PROMPT.md`. Project ID: `mindloop-landing`. Prepared for review at `/motionsites-results/mindloop-landing/`; it has not been deployed.

Uses React, Vite, TypeScript, Tailwind CSS, shadcn/ui-style Button and Radix Dialog primitives, Framer Motion, hls.js, Lucide, and locally bundled Inter and Instrument Serif. Includes all seven sections, glass controls, staggered reveals, scroll-driven mission text, responsive navigation, MP4 backgrounds, and an HLS CTA background with Safari native fallback.

## Build and run

With Node 22 and npm available:

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/mindloop-landing/`. The complete static build is in `dist/`, including `dist/index.html`. Serve the directory at the configured subpath.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` fixes dependency versions. `node_modules/` is excluded from source handoff.

## Validation

The actual production build is checked using Chromium and the existing image's Playwright installation. The check starts its own temporary HTTP server with byte-range support and uses the configured publication subpath:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Screenshots: `screenshots/desktop.png` (1440×1000), `screenshots/mobile.png` (390×844), and supplementary full-page captures. `screenshots/browser-checks.json` contains image loading, video playback, horizontal overflow, page errors, console errors, failed requests, and interaction results. Checks cover newsletter submission, writer interest, modal dismissal, privacy dialog, CTA navigation, and the mobile menu. The screenshots were visually reviewed.

## Assets

The three exact CloudFront MP4s supplied in the prompt are downloaded unchanged to `public/assets/` and included in the build. Posters are extracted from these videos using Chromium canvas. The exact supplied Mux URL is streamed through hls.js; it still requires a network connection. Font files are bundled locally through Fontsource.

No original avatar or platform icon files were supplied. Local PNG avatars were sourced from `i.pravatar.cc` (portraits 47, 12, 49) and converted to grayscale PNGs. The OpenAI, Perplexity, and Google SVG marks were sourced from `@lobehub/icons-static-svg` on jsDelivr and rasterized into the required 200×200 display assets (400×400 pixels for high-density rendering). Google is desaturated by page CSS. Source URLs are preserved in `scripts/fetch-assets.py`; asset rasterization is reproducible with `scripts/prepare-assets.cjs` inside the Docker image.

## Limits

No newsletter, writer account, or email backend was specified. Submissions validate email input and save interest in this browser's local storage; confirmation text states this. No email is sent. Footer dialogs describe the preview's actual behavior. Social icons point to the named platforms' homepages because Mindloop account URLs were not supplied.

Autoplay depends on browser policy; local poster frames provide a fallback. HLS requires the upstream provider to remain reachable. The production build reports a nonfatal JavaScript chunk-size advisory because it includes the HLS playback engine.
