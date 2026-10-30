# Scenic Travel

Design ID: `travel-hero`. A luxury travel concept built from this project's `PROMPT.md` with Next.js 16.2.6 App Router (webpack), React 19.2.4, Framer Motion, Lucide, Tailwind v4 and TypeScript. GSAP is installed as requested and unused.

The home page uses the original CloudFront videos, a split black/white animated headline, a Hidden Gems card and animated navigation. Destinations offers a horizontally scrolling gallery and live name filtering. All seven tours have detail pages. Booking, FAQ and Account intentionally show the specified 404 screen; the booking button has only its prescribed hover/press interaction.

## Build and run

Dependencies are locked in `package-lock.json`. With Node 22:

```sh
npm ci
npm run build
npm run lint
node scripts/serve.mjs
```

Open `http://localhost:3000/motionsites-results/travel-hero/`.

This host uses Docker instead of a host Node installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -e NEXT_TELEMETRY_DISABLED=1 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build && npm run lint'
```

`npm run build` runs the required `next build --webpack` and copies the static export into `dist/`. `dist/index.html` is the entry point. Serve the contents of `dist` at `/motionsites-results/travel-hero/`; unknown paths should serve `dist/404.html` with a 404 status. `npm start` retains the specified Next start script, but static exports are served with the included local server or any static host.

## Delivery adaptations

The prompt's empty Next configuration conflicts with the task's static `dist/` delivery and required subpath. The configuration therefore enables `output: 'export'`, the required `basePath`, trailing slashes, and unoptimized local images. Dynamic tour parameters and the three named placeholder routes are generated statically. Local photograph paths include the base path. No remote image patterns are used.

All original CloudFront video URLs are unchanged. All ten photographs are downloaded into `public/`; their source URLs are recorded in `asset-sources.json`. The prompt permits any ten photographs. Google Inter is loaded with the specified head links. The project's own visual reference was inspected only for comparison, and no screenshot is used as a page asset.

## Verification

Re-run the browser checks without exposing a port:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.mjs & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/browser-check.mjs'
```

The production export is tested using Chromium and the existing Playwright Core in the Docker image. `scripts/serve.mjs` serves the actual `dist/` files under the required subpath; `scripts/browser-check.mjs` checks desktop 1440×1000 and mobile 390×844, saves screenshots, and records results in `browser-results.json`.

The checks cover video playback, menu open/close, home-to-gallery navigation, all seven gallery cards, filtering and empty states, video and image detail pages, return links, placeholder 404 behavior, horizontal overflow, and uncaught browser errors. See `result.json` for the final outcome and any limitations. Primary screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`.

Videos and Google Fonts remain external dependencies as specified. No backend booking workflow is specified or implemented. Nothing has been deployed or pushed.
