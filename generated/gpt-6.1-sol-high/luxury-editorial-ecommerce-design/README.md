# Luxury Ecommerce Design

Design ID: `luxury-editorial-ecommerce-design`  
Brand: **STRETCH**  
Status: ready for review; not deployed.

Responsive beauty and skincare landing page following `PROMPT.md`: split image/video hero, seven-product carousel with best sellers/sets tabs, and three video category cards. Includes fullscreen mobile navigation, a five-second slideshow with dots and pause/play, IntersectionObserver reveals, staggered cards, button lift/sweep effects, image/video hover zoom, and reduced-motion CSS support.

## Stack and assets

Vite, React 18, TypeScript, Tailwind CSS 3.4, lucide-react, and the system font stack. No custom fonts or additional UI libraries. All five unique images and six videos specified in the prompt are saved in `public/assets/` and copied into `dist/assets/`. Products repeat images exactly as specified. Original URLs and download outcomes are in `asset-manifest.json`. No failed assets remain.

The configured base is `/motionsites-results/luxury-editorial-ecommerce-design/`. Serve `dist/` at this URL prefix. `dist/index.html` is included. No deployment or server configuration changes were made.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the configured URL prefix on the development or preview server. The lockfile is included; `node_modules` is excluded.

On this host, run from this project directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

The real production build passed TypeScript checking and Vite bundling. The dependency audit reports zero vulnerabilities (`audit.json`).

Run browser checks against the production files:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

The script uses the image's installed Playwright Core and Chromium, serves `dist/` on a temporary container-local HTTP server at the required prefix, then closes it. No project dependency on Playwright is needed.

All 27 browser checks passed; evidence is in `browser-checks.json`. Desktop viewport: 1440×1000. Mobile viewport: 390×844. Verified page loading, no horizontal document overflow, slideshow dot controls, pause over a full slide interval, resumed advancement, seven products, sets filtering, wheel-to-horizontal scrolling, mobile menu opening/navigation/closing, local product search, all images loading, and all six videos decoding. No browser script, console, or HTTP resource errors were observed.

Full-page screenshots captured at the required viewport widths and visually reviewed:

- `screenshots/desktop.png`
- `screenshots/mobile.png`

## Scope and limitations

This is a frontend landing page. Utility icons expose local search, an empty bag, the supplied France/EUR selection, and an account availability message. No checkout, authentication, or commerce backend is connected. Navigation uses anchors within the three supplied sections; category buttons return to the collection. Browser autoplay preferences can affect playback. Pause controls the hero slideshow and active hero video; category videos loop independently. Supplied media totals approximately 57 MB and is retained without replacing or recompressing the specified assets.
