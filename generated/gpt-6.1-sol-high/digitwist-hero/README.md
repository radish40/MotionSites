# Digitwist AI Builder

Design ID: `digitwist-hero`. Responsive dark hero implemented from this project's `PROMPT.md` with the specified typography, colors, responsive sizes, HLS video, overlays, Motion entrance animations, and Lucide icons. No deployment was performed.

## Stack and build

React 19, TypeScript, Vite 6, Motion, HLS.js, and Lucide React. `package-lock.json` records exact dependency versions, all meeting the required minimums.

With Node 22 and npm:

```bash
npm ci
npm run build
npm run dev
```

Using this host's available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Complete static output is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/digitwist-hero/`. Serve the output at that path. For local preview, run `npm run preview` and open `http://localhost:4173/motionsites-results/digitwist-hero/`.

## Interactions

Products opens a dropdown, closing on outside click or Escape. Navigation opens compact informational dialogs. Get Started and Start Building Free open a local concept form. See Examples opens selectable starting points. The form requires an idea and displays a concept preview. Native dialogs provide modal focus containment, Escape dismissal, close buttons, and backdrop dismissal. These are frontend demonstration interactions: no AI, account, payment, booking, or publishing backend was supplied or connected.

## Assets

- The exact specified Mux stream plays through HLS.js with native HLS fallback. Video is muted, looping, inline, and uses the specified opacity, blur, and black overlay.
- The exact specified Unsplash image was successfully downloaded to `public/assets/poster.jpg` and bundled locally as the video fallback.
- The exact Google Fonts CSS import loads Instrument Sans and Instrument Serif. Both loaded in browser checks.
- The optional reference `/home/opc/motionsites/assets/previews/digitwist-hero.webp` was absent. The written specifications guided the implementation; reference screenshot comparison was unavailable.
- Sunburst: inline SVG. Other icons: Lucide React. No substitute or extracted reference assets were needed.

## Verification

The actual TypeScript/Vite production build passed. npm reported zero vulnerabilities at installation. Vite emitted a nonfatal bundle-size advisory for the bundle containing HLS.js and Motion.

The browser script serves `dist/` at the required subpath and runs Chromium through Playwright:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Verified at 1440×1000 and 390×844:

- No horizontal overflow, script errors, or failed requests.
- Both fonts loaded; HLS video actively played with readyState 4.
- CTA form submission, example selection, Get Started, and dialog dismissal passed.
- Desktop navigation and Products dropdown passed; navigation hides on mobile as specified.
- Reduced-motion preference pauses the background video and is respected by Motion.

Visually reviewed `screenshots/desktop.png` and `screenshots/mobile.png`. Machine-readable evidence: `screenshots/browser-checks.json`.

## Limits

Mux video and Google Fonts require network access; the poster is local and system font fallbacks are defined. Chromium was tested; Safari native HLS fallback is implemented but untested in Safari. Screenshots capture a moment in the live video and may differ between runs. The extra dialogs are local demonstration interactions only. `ready` means ready for review, not deployed.
