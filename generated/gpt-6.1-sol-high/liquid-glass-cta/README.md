# Liquid Glass CTA

Design ID: `liquid-glass-cta`. React + Vite + TypeScript + Tailwind CSS implementation of `PROMPT.md`, preserving its component markup, text, typography, liquid glass CSS, icons, and Mux HLS video.

A black standalone parent centers the supplied section in the viewport. Visible keyboard focus is included.

## Build and run

With Node.js 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/liquid-glass-cta/`. The complete static output is in `dist/`. Vite's base is `/motionsites-results/liquid-glass-cta/`.

This environment used the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

The dependency lockfile is included; node_modules is excluded from delivery.

## Verification

The real build passed TypeScript and Vite production bundling. Vite reported a non-fatal chunk-size warning for the bundle containing the required HLS player (828.47 kB minified / 259.05 kB gzip).

Playwright with Chromium checked the built site at its nested base path:

- Desktop 1440 × 1000: 72px heading, horizontal footer.
- Mobile 390 × 844: 48px heading, stacked footer.
- Both fonts loaded; Mux HLS video played at both sizes with 1280 × 720 frames, autoplay, mute, loop, and inline playback enabled.
- No horizontal overflow, page script errors, failed requests, or HTTP error responses.
- Both buttons and all three footer links clicked; glass hover and visible keyboard focus verified.
- Both screenshots visually reviewed.

Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, `checks/browser-results.json`.

Repeat browser verification after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 checks/browser.cjs
```

## Limits

The supplied component has presentation-only CTA buttons and footer links pointing to `#`. No booking, pricing, legal, or contact destinations were supplied; these remain exactly as specified. No additional product flows were added.

Video and fonts depend on external Mux and Google services. Both loaded successfully during verification. No replacement imagery or screenshot backgrounds are used. Native Safari HLS fallback is included but was not tested in Safari. Mobile verification used a Chromium viewport rather than a physical phone.

`ready` means ready for review, not deployed. No push or deployment was performed.
