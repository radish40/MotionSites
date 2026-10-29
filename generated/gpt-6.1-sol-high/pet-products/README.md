# Pet Products

Design ID: `pet-products`. CozyPaws — Everything Your Pets Love.

A native HTML, CSS and JavaScript implementation of `PROMPT.md`: three phone shells, pet photography, local looping video, supplied typography, mint/orange palette and staggered entrance animations. Desktop displays the phones in a row; mobile stacks them in the supplied order.

All source, assets and outputs are contained in this project. No deployment or push was performed.

## Build

The host does not require Node. From this project directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --package-lock-only --ignore-scripts && npm run build'
```

The dependency-free build writes the complete static site to `dist/`, including `dist/index.html`. The dependency lockfile is `package-lock.json`. No `node_modules` is included. Asset references are relative and support `/motionsites-results/pet-products/`.

## Local preview

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/serve.mjs
```

Open `http://localhost:4173/motionsites-results/pet-products/`.

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Real headless Chromium checks desktop 1440×1000 and mobile 390×844, plus widths 320, 768, 1024 and 1280. It verifies image/font loading, horizontal overflow, avatar dimensions, product price visibility, navigation, favorites, product additions, synchronized cart totals, Escape/close behavior, Explore navigation, and video autoplay/pause/resume. Script errors, failed requests and HTTP errors are captured in `screenshots/checks.json`.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. The mobile screenshot captures the full stacked page. Screenshots were visually reviewed. Small CSS corrections keep the client avatar contained, reveal all four prices and fit the desktop composition at intermediate widths. Reduced-motion preferences and accessible button labels are supported.

## Assets and limits

All nine supplied media URLs downloaded successfully; the requested Inter, Poppins and DM Serif Display fonts are also bundled locally. `assets/manifest.json` records media provenance. The site needs no third-party requests at runtime. Fetch helpers are provenance/recovery utilities and are not required to build.

The prompt's supplied images do not all match their product labels: Sunset Cat Bowl shows a green mouse toy, Cat Toy shows an orange bowl, and Cat Bed shows a red mouse toy. The exact supplied image assignments and copy are retained.

Cart and favorites are local demonstration interactions. Cart changes last for the current page session; the initial one-item $21 cart and four favorites follow the prompt. No commerce backend or checkout is specified. Video uses muted autoplay; a play/pause control is available. `ready` means ready for review, not published.
