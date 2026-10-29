# Eco Intelligence

Design ID: `eco-intelligence`. A responsive TERRA NOVA hero built from this project's `PROMPT.md`, using Vite, React, TypeScript, Tailwind CSS, and Lucide React. Includes the supplied moving background, ghost typography, glass rectangles, findings card, chamfered CTA, and animated slide-in navigation.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run dev
```

Production files are in `dist/`. The configured publication base is `/motionsites-results/eco-intelligence/`; serve `dist/` at that path. Nothing has been deployed.

On this host, Node/npm are supplied by the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Verification

The production build is type-checked with TypeScript. Browser checks use the installed Chromium and Playwright in the Docker image and an ephemeral HTTP server serving the actual production subpath:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Checks cover desktop 1440×1000, mobile 390×844, and tablet 640×900; video decode/autoplay; loaded fonts; card bounds and page overflow; menu opening, closing, scroll lock, focus entry/trap/restoration, Escape and backdrop dismissal; research navigation and CTA anchors; and the call email destination. Browser errors, failed requests, and HTTP errors are collected. Screenshots capture the actual video at two seconds for repeatability.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-menu.png`
- `screenshots/mobile-menu.png`
- `screenshots/browser-report.json`

## Assets and behavior

The original CloudFront MP4 URL specified in the prompt is the first video source. An identical downloaded MP4 is packaged as a local fallback. Bebas Neue was retrieved from Google Fonts; Helvetica Neue Light was retrieved from the exact OnlineWebFonts source specified in the prompt. Both font binaries are packaged locally to avoid runtime font-provider dependency. Provider CSS is preserved in `public/assets/` as provenance. Font source: [Web Fonts](https://www.onlinewebfonts.com/fonts), whose source CSS states CC BY 4.0; Bebas Neue is from [Google Fonts](https://fonts.google.com/specimen/Bebas+Neue).

Navigation uses existing hero content: About → collective introduction, Research → findings, Projects → canopy finding, Journal → watershed finding, Contact → email. Start listening targets Latest findings. Book a call opens an email addressed to `hello@terranova.earth`; no booking service or audio stream was specified. These actions do not submit data to a backend.

Reduced-motion preferences pause the background and remove transition animations. Short mobile viewports can scroll to keep all content accessible. Mobile heading/paragraph colors and the translucent card follow the prompt; contrast naturally varies over the moving video. External video delivery remains dependent on its provider, with the packaged MP4 as fallback. Checks were performed in Chromium, not Safari or Firefox.

The requested project scope is isolated to this directory. No agents, other designs, deployment, pushes, or external messages were used. Model selection is controlled by the surrounding session, not this project's code.
