# OYLA

Luxury handcrafted jewelry landing page built from this project's `PROMPT.md`. Project ID: `oyla`. Prepared for review at `/motionsites-results/oyla/`; not deployed.

## Implementation

- Root `index.html` contains the page, inline CSS, and inline application script.
- Express + Vite SPA middleware in development; Express static serving and SPA fallback in production, on port 3000.
- `vite build` emits `dist/index.html`; esbuild emits `dist/server.cjs` with external dependencies.
- GSAP 3.12.5 and ScrollTrigger drive the 500vh hero, character exit, pinned six-product carousel, centered video expansion, copy and stat animations. Both paused videos use 0.08 interpolation and the essential `!video.seeking` guard.
- Responsive sticky studio copy, four stat cards, and a fixed footer with a dynamically measured spacer.
- Exact supplied CloudFront media is bundled in `public/assets/`. Google Fonts provides Instrument Serif, Inter Tight (300–700, normal/italic), and Cormorant Garamond (300–700, normal/italic); these font files are also bundled. GSAP loads from the specified CDN with local copies as fallbacks.
- Higgsfield MP4 extraction is available at `/api/higgsfield-video` and `/motionsites-results/oyla/api/higgsfield-video`. Both supplied share URLs were verified. Failed refreshes retain bundled media.

## Run and build

Requires Node 22 and npm, or the available Docker image. From this directory:

```sh
npm ci
npm run dev
```

Visit `http://localhost:3000/motionsites-results/oyla/`.

```sh
npm run build
npm start
```

Build using the supplied Docker environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

To run locally with Docker, use the same mount and working directory, add `-p 3000:3000`, and run `npm run dev` or `npm start`. The `dist/` directory can also be served as static files at the configured subpath. Dynamic video refresh requires Express; bundled media works without that endpoint. Keep server dependencies installed when running `dist/server.cjs`; `node_modules/` is excluded from the deliverable and can be recreated with `npm ci`.

## Verification

Real production build completed successfully with Vite 6.4.5 and esbuild. npm audit reports zero vulnerabilities; see `audit.json`.

Headless Chromium with the image's `/app/node_modules/playwright-core` checked:

- Desktop 1440×1000 and mobile 390×844; all supplied images, videos, and active fonts loaded.
- No browser script errors, failed requests, HTTP errors, or document horizontal overflow during the primary checks.
- ABOUT, VIEW COLLECTION, DISCOVER, menu open/Escape, bag dialog, email validation and the exact newsletter confirmation alert.
- Horizontal product movement, second video expansion, both videos seeking while paused, and matching footer/spacer heights.
- Resizing across 1000px, 390px and 1440px rebuilds 12 ScrollTriggers without accumulation and uses the specified card widths and column layouts.
- Both real Higgsfield endpoints return direct MP4 URLs. Invalid proxy hosts return HTTP 400.
- Development middleware and production static serving both pass smoke assertions.
- External-network blocking confirms local GSAP 3.12.5, both videos, images, and fonts remain available.

Browser scripts: `scripts/browser-check.cjs` and `scripts/smoke-check.cjs`. With the server running inside the supplied Docker image, execute them using Node in that same container. Set `CHECK_MODE=development` for the development smoke check. They use Chromium at `/usr/bin/chromium`.

Screenshots and raw evidence are in `screenshots/`:

- `desktop.png` and `mobile.png`: required hero screenshots.
- `desktop-collection.png`, `desktop-studio.png`, `desktop-reveal.png`, `desktop-footer.png`, plus corresponding mobile views.
- `browser-report.json`, `production-smoke.json`, `development-smoke.json`: observed browser and API results.

The hero, studio, collection, and mobile footer screenshots were visually inspected. Studio headings have 32px additional top clearance to avoid the fixed logo overlapping the heading.

## Scope and limitations

This is the requested landing page, not an operational store. Newsletter submission displays `You're on the list. Welcome.` and does not save email addresses. Bag/account and policy controls show preview information; no checkout, authentication, or legal policy backend was supplied. Instagram links to Instagram's homepage because no brand profile URL was provided. The SVG wordmark is an inline recreation of the specified lettering; no original SVG paths were supplied.

No asset failures remain. Media follows the exact supplied URLs, including the intentional repeated product images. Temporary Docker containers used for verification were stopped. No deployment, push, other project reads, or agent delegation was performed.
