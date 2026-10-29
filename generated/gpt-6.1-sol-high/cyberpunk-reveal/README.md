# Cyberpunk Reveal

A single-screen cyberpunk hero built to `PROMPT.md`, using React 18, TypeScript, Vite, Tailwind CSS, and only the Menu/X icons from lucide-react. Includes the supplied portraits, smoothed canvas spotlight reveal, parallax grid, animated SVG statistics, staggered text entrance, Ken Burns intro, responsive navigation, CTA shine, and reduced-motion styles.

The publishable static build is in `dist/`. Its configured base path is `/motionsites-results/cyberpunk-reveal/`. This project has not been deployed or pushed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the base path above on the Vite server. On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Dependencies are pinned in `package.json` and `package-lock.json`. No additional runtime packages were added beyond the requested stack. `node_modules` is excluded from delivery.

## Verification

The real production build passed TypeScript and Vite compilation. npm reported zero vulnerabilities after updating Vite and PostCSS within their existing major versions.

The browser check serves `dist/` at the required subpath in a temporary container and runs Chromium via the image's existing playwright-core installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Verified desktop 1440×1000 and mobile 390×844, correct document dimensions without overflow, locally loaded JetBrains Mono, canvas mask updates with cursor movement, CTA hover transform, hidden mobile stats, menu open/close, link dismissal, Escape dismissal, and reduced-motion handling. No JavaScript/console errors or failed requests were observed in the final run. Screenshots were visually inspected.

- `screenshots/desktop.png`: desktop default state.
- `screenshots/mobile.png`: mobile default state.
- `screenshots/desktop-reveal.png`: active spotlight.
- `screenshots/mobile-menu.png`: expanded menu.
- `screenshots/checks.json`: machine-readable browser results.

## Assets and limits

Both exact Higgs image URLs in `PROMPT.md` returned HTTP 200 and are bundled as `public/images/base.webp` and `reveal.webp`. The required Google Fonts import remains in `src/index.css`; all eight requested JetBrains Mono weights/styles are additionally bundled locally to keep the rendering font available without a font CDN. Its OFL license is included in `public/fonts/OFL.txt`.

The prompt's Helvetica Neue Roman `.woff2` and `.woff` files were not supplied. The required unused font-face declaration remains and produces two build warnings. JetBrains Mono renders throughout, so the missing unused fonts do not affect the page or generate browser requests.

The prompt supplies no destinations, reservation service, or connection backend. Navigation links target the single hero; Connect and Reserve Now retain the specified button presentation and interaction styling without submitting data or inventing additional product flows. The mobile Connect button dismisses the menu.

The cursor mask intentionally uses the prompt's full-window canvas-to-data-URL operation each animation frame; this can be CPU intensive on weaker devices. Mouse listeners and the single animation loop are cleaned up on unmount.
