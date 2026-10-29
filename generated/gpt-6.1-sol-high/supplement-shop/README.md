# Supplement Shop

Design ID: `supplement-shop`. A TerraElix supplement storefront displayed inside a 375 × 812 px iPhone frame, built from the supplied `PROMPT.md` using React, Tailwind CSS, Vite, and lucide-react.

The screen includes the status bar, Dynamic Island, sliding navigation, horizontally scrollable category tabs, five carousel slots, three supplied product bottles, product details, quantity pricing, and Buy Now feedback. The carousel runs every three seconds, animates for 450 ms, loops, and resets quantity when each transition ends. Opening a menu or purchase dialog pauses autoplay.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/supplement-shop/`. Vite's base is configured for that exact path. The complete publishable output is in `dist/`, including `dist/index.html` and local product assets. `package-lock.json` records dependency versions.

On the supplied host, which has Docker instead of Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

Run the browser checks against the production build:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 /work/browser-check.cjs
```

The check script serves only this project's `dist/` on a temporary container-local HTTP server and uses Chromium with the image's existing playwright-core package. It verifies desktop 1440 × 1000 and mobile 390 × 844 layouts, frame dimensions, image loading, page overflow, menu navigation, category selection, quantity controls, price totals, purchase feedback, bag count, carousel navigation, looping, autoplay, and quantity resets. Browser errors and failed requests are captured in `browser-checks.json`.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`.

## Assets and limits

All three original Higgs image URLs supplied in `PROMPT.md` downloaded successfully and are stored in `public/assets/product-1.webp` through `product-3.webp`. No substitute imagery was used. Google Fonts loads DM Sans 400/500 and Inter 400/500/600; both families loaded successfully in Chromium. Fonts still require network access; standard sans-serif fallbacks are available.

This is the requested storefront demonstration, with local React state. Buy Now adds to the visible bag count and shows confirmation; no payment or order backend is connected. Category tabs update their selected state; the brief supplies only the same three capsule products, so no additional category inventory is invented. Secondary navigation opens brief local informational panels. No deployment or push was performed.
