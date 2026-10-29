# Solar Energy Hero

Design ID: `solar-energy-hero`. A single-page Reposit hero implemented from this project's `PROMPT.md`. Night switches to Morning using the specified layered, blurred pull-down transition. Includes the sliding theme indicator, staggered entrance animations, responsive navigation drawer, and CTA hover styling.

## Stack and assets

React 18.3.1, TypeScript 5.5.3, Vite 5.4.2, Tailwind CSS 3.4.1 through PostCSS and Autoprefixer, lucide-react 0.344.0 (Zap only), and the installed but unused Supabase client 2.57.4. Styling uses custom global CSS. Outfit loads through the specified Google Fonts stylesheet.

`npm run build` downloads both exact source photographs from the URLs in `scripts/prepare-assets.mjs`, converts them to actual WebP with Sharp, and saves them in `public/images/`. Both are included in `dist/images/`; the page does not request external photographs at runtime. Image URLs use Vite's base URL to support `/motionsites-results/solar-energy-hero/`. The supplied HTML and main entry are retained, with Vite rewriting built asset paths for this base.

## Run and build

With Node 22/npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the printed local URL with `/motionsites-results/solar-energy-hero/` appended. Build output is `dist/`, including `dist/index.html`. Building needs network access for the two original photos; Google Fonts needs network access at runtime.

This host uses Docker:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The initial installation generated the included dependency lockfile. A fresh `npm ci && npm run build` also passed; see `reproducibility.log`. `node_modules/` is excluded from delivery/version control.

## Browser verification

Real Chromium checks against production files at the configured subpath passed at **1440 × 1000** and **390 × 844**. Repeat with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

The script starts and closes an ephemeral HTTP server inside the container. It verifies Night initialization, Morning/Night switching, pull-down class lifecycle, repeated-click protection, mobile menu pointer and keyboard open/close, desktop links and CTA hover, decoded local images, loaded Outfit, and viewport containment. No browser script/console errors or failed requests were observed; Google font stylesheet and font responses returned HTTP 200. Screenshots were also visually inspected.

Artifacts:

- `screenshots/desktop.png` — Night, 1440 × 1000.
- `screenshots/mobile.png` — Night, 390 × 844.
- `screenshots/desktop-morning.png`, `screenshots/mobile-morning.png` — Morning views.
- `screenshots/mobile-menu.png` — mobile drawer.
- `screenshots/browser-checks.json` — detailed browser evidence.
- `build.log`, `validation.log`, `reproducibility.log` — real build, check, and lockfile rebuild output.
- `dependency-audit.json` — dependency audit output.

## Scope and limitations

Navigation anchors use `href="#"`, and quote buttons have no destination or form, as specified in the hero-only prompt. No additional pages, quote workflow, or backend were introduced. The supplied theme colors, including the contrasting title accent treatment, and supplied mobile CSS are preserved. The hamburger additionally supports keyboard activation and announces its expanded state; theme buttons announce selection.

The audit reported four build-tool advisories: esbuild (moderate), Vite, PostCSS, and Sharp (high). Required stack versions were retained; dependency upgrades remain a production consideration. No asset failures occurred. No deployment, push, external messages, other sessions, or sub-agents were used. `ready` means ready for review, not published.
