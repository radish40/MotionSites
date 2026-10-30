# Slam Dunk

A runnable **independent original basketball landing concept**, built with React, TypeScript, Vite, and responsive CSS. It is ready for management review, not deployed.

The supplied `PROMPT.md` is preserved verbatim: 86 bytes containing only the Google AI Studio footer. It has no usable design instructions or remix link, and the design’s own reference image is absent. Management explicitly authorized interpreting the catalog brief: “Slam Dunk; Hero Section/landing; a Slam Dunk basketball themed hero with dynamic basketball elements and passionate sports styling.” This implementation is not a claimed recreation, recovery, or affiliated product.

The orange and charcoal sports-poster direction uses Barlow Condensed headlines, an original SVG basketball with procedural pebble texture, an illustrated hoop and court, and CSS motion. The warm paper background and editorial grid balance the energetic artwork. All artwork and copy were authored here. Fonts are bundled locally from Google Fonts under the included OFL licenses; interface icons come from Lucide. Detailed creative decisions and asset sources are in `provenance.json` and `public/fonts/provenance.json`.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The app’s base is `/motionsites-results/slam-dunk-hero/`. Open that path on the dev/preview server. Production output is `dist/`, including `dist/index.html`; serve it at the same subpath. `package-lock.json` is included. Do not publish `node_modules`.

On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Interactions

- Find Your Game opens fictional pickup/training sessions. Filters work, and saving/canceling demo reservations persists on the device through localStorage. The dialog explicitly explains that no actual booking occurs.
- The Playbook provides three selectable shooting fundamentals.
- Our Community presents original principles and links to the demo session picker.
- Click/tap the basketball to shoot and increment a local score. Optional sound is synthesized after toggling the footer speaker control.
- Mobile navigation, native modal keyboard handling, focus return, and reduced-motion support are included. The ball pauses on hover/focus for easier targeting.

There is no backend, account, payment, AI service, real event registration, or external runtime asset dependency. The footer identifies the page as an independent concept. Initials are illustrations, not real players or endorsements. Decorative dates, number, and coordinates do not represent affiliation or a real business history.

## Verification

A real TypeScript/Vite production build was run in the supplied Docker image. Browser verification runs against `dist/` at the actual required subpath, using Chromium and the image’s existing Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script starts and closes a temporary HTTP server inside the container. It checks desktop 1440×1000 and mobile 390×844, production fonts, session filtering and persistence, cancellation, dialog Escape/focus return, playbook navigation, community handoff, mobile menu, score/audio controls, normal/reduced motion, browser errors, failed asset responses, and overflow at additional widths 320/768/1024/1920.

Actual full-page screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`, captured using the requested viewport sizes with reduced motion for stable inspection. Machine-readable browser evidence is `screenshots/checks.json`. The checks cover Chromium only; they do not certify other browsers or real devices. There is no source reference available for fidelity comparison.
