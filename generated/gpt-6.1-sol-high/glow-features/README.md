# Glow Features

Design ID: `glow-features`. A React 19 / Vite / Tailwind CSS v4 implementation of the supplied three-card design. Uses Lucide Monitor, Palette, and Zap icons and `motion/react` for the specified staggered entrance. The reusable `FeatureCard` component preserves the exact copy, gradients, 8px background-clipped borders, 45px blurred glows, dimensions, spacing, and responsive layout in PROMPT.md.

Build with Node 22 and npm:

```bash
npm ci
npm run build
```

On this host, use the available Docker image from the project directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/` contains the complete static build, including `dist/index.html`. Vite's base is `/motionsites-results/glow-features/`; serve the build at that path. For local development:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 5173:5173 -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run dev'
```

Open `http://localhost:5173/motionsites-results/glow-features/`.

The production build was successfully generated using Node 22 in the specified Docker image. Dependency installation reported zero vulnerabilities. The lockfile is included; `node_modules` is omitted.

Browser validation uses the image's Chromium and `/app/node_modules/playwright-core`:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

This script serves `dist/` temporarily at the configured subpath. Passed checks cover desktop 1440×1000, mobile 390×844, tablet 768×1024, and small mobile 320×760; exact titles, card and icon dimensions, borders, responsive arrangement, selectable copy, entrance completion and stagger, text containment, and horizontal overflow. No browser console errors, script exceptions, failed requests, or HTTP error responses were recorded. Detailed measurements are in `browser-checks.json`.

Screenshots were captured from the actual production build and visually inspected: `screenshots/desktop.png` (1440×1000) and `screenshots/mobile.png` (390×908 full-page capture from a 390×844 viewport). Mobile naturally scrolls vertically to fit all three cards. The design has no buttons, links, or additional interactive controls; entrance animation and text selection were verified without inventing extra functionality.

No external images or webfonts are required: icons are bundled and the specified system sans-serif stack is used. The optional `/home/opc/motionsites/assets/previews/glow-features.webp` reference did not exist, so visual matching was assessed against the complete textual specifications. The favicon is a small locally authored SVG. No assets were extracted from screenshots. Validation was performed in Chromium only; other browser engines were not tested. No deployment or push was performed. Status `ready` means ready for management-session review.
