# ClearInvoice SaaS Hero

Design ID **3**. A responsive dark SaaS hero built with React, Vite, Tailwind CSS, motion/react, lucide-react, and a native HTML5 video streamed through hls.js.

The production output is in `dist/`, with the required base path `/motionsites-results/3/`. It has not been deployed.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Using the host's existing Docker image, from this directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules/` is excluded from delivery.

## Verification

The real production build was served at its configured subpath and tested with Chromium and Playwright from the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

- Desktop: 1440 × 1000; mobile: 390 × 844.
- Confirmed video playback, muted and loop attributes, loaded fonts, and no horizontal overflow.
- Exercised the primary CTA, secondary CTA, navigation dialogs, Sign In, Sign Up, local form submission, dialog closing, Escape key, mobile dropdown, and primary hover arrow.
- Final run: no browser console errors, JavaScript errors, or failed network requests.
- Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`.
- Machine-readable evidence: `screenshots/checks.json`.
- Both screenshots were visually inspected.

## Assets and behavior

- Original background stream: `https://stream.mux.com/hUT6X11m1Vkw1QMxPOLgI761x2cfpi9bHFbi5cNg4014.m3u8`. The memoized video component supports native HLS and hls.js, uses full opacity without an overlay, and cleans up playback and streaming on unmount. hls.js requests a higher initial rendition when used; native playback selects its own quality. Chromium reported a 640-pixel video width during the recorded checks.
- `public/images/video-poster.jpg` is a thumbnail obtained from the same Mux asset at time 0, used while the video loads or if streaming is unavailable. It contains only the background artwork.
- Switzer Medium was downloaded from Fontshare, and Geist Regular from Google Fonts; both are served locally. The brand uses Switzer and an original lucide-based receipt mark.
- Three local avatar crops come from Unsplash photos `photo-1494790108377-be9c29b29330`, `photo-1500648767791-00dcc994a43e`, and `photo-1534528741775-53994a69daeb`, downloaded with `w=80&h=80&fit=crop&crop=faces`.
- The optional reference `/home/opc/motionsites/assets/previews/3.webp` was absent. No other design was read, and no screenshot extraction was used.

## Limits

This is the requested hero implementation. Navigation opens lightweight local dialogs. Account forms explicitly describe their preview status: no account service, payment flow, or data transmission is connected. No unprovided pricing or customer quotations are invented.

The video still requires access to Mux; fonts, avatars, and the video poster are local. Its image changes over time, so screenshots can vary. Vite reports a non-blocking bundle-size warning for the combined streaming and animation dependencies. Build and browser checks pass.
