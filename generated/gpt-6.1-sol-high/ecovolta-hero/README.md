# EcoVolta

Single-screen renewable energy hero built from `PROMPT.md` with React 18, TypeScript, Vite, Tailwind CSS 3, Framer Motion, Lucide React, clsx, and tailwind-merge.

Includes the original looping landscape video, responsive navigation and typography, per-letter heading reveal, FadeDown content, liquid-glass video control, deployment avatars, address, and continuously scrolling partner names. The page fills the viewport without scrolling. Reduced-motion preferences disable the text and marquee animation.

## Build and run

With Node 22:

```sh
npm ci
npm run build
npm run preview -- --port 5173
```

This host uses Docker for Node and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The production output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/ecovolta-hero/`. Open that path on the preview server. Nothing has been deployed or pushed. Dependencies are recorded in `package-lock.json`; `node_modules` is excluded from source delivery.

## Assets

All runtime assets are local under `public/assets/` and copied to `dist/assets/`:

- `energy.mp4`: original CloudFront video specified in the prompt, downloaded without transformation (9,994,664 bytes).
- `avatar-left.webp`, `avatar-center.webp`, `avatar-right.webp`: original images from the three supplied Higgs image URLs. These assets depict plants/greenery; their original content is retained in the requested circular avatar layout.
- `inter-300.ttf` through `inter-900.ttf`: Google Fonts Inter, weights 300–900, with the source stylesheet retained as `inter-source.css`.
- `emoji.woff2`: Google Fonts Noto Color Emoji subset for the exact sun, earth, and seedling characters, bundled to avoid missing platform glyphs. Source stylesheet retained as `emoji-source.css`.

The optional `/home/opc/motionsites/assets/previews/ecovolta-hero.webp` reference did not exist. No reference extraction, substitute landscape, or screenshot-based page was used. Asset source URLs are recorded in `asset-sources.json`.

## Browser verification

Real production build and headless Chromium via `/app/node_modules/playwright-core`, with desktop 1440×1000 and mobile 390×844 viewports. The reproducible check is `scripts/check.cjs`:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp --shm-size=256m -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run build && (npm run preview -- --port 5173 > /work/preview.log 2>&1 & node scripts/check.cjs)'
```

Checks include loaded images/font, decoded and autoplaying video, complete heading reveal, play/pause interaction, button clicks, script errors, failed HTTP requests, and document overflow. Screenshots were visually inspected for composition and responsive visibility. Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`

## Scope and limitations

This is the requested hero section. The prompt provides no navigation destinations, language alternatives, sign-in flow, or CTA workflows; these controls retain their presentation without fabricated downstream pages. The glass play control toggles the real background video. Chromium is verified; other browser engines and physical mobile devices were not tested. Readiness means prepared for review, not published.
