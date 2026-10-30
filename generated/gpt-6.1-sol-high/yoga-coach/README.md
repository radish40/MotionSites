# Yoga Coach

Jessica's full-viewport yoga landing page, implemented from this project's PROMPT.md. The hero plays the supplied HLS video after “LET'S START”; its actual `ended` event slides the collection into view. Three overlapping video cards play on hover, keyboard focus, or touch. “BACK TO START” pauses and rewinds the hero. There is no page scrolling.

React 19, TypeScript, Vite 6, Tailwind CSS v4 via its Vite plugin, Motion (`motion/react`), hls.js, and Anton. All display copy remains uppercase. The Vite base is `/motionsites-results/yoga-coach/`. `dist/` contains the built static site; nothing was deployed or pushed.

## Run and build

With Node 22 installed: `npm ci`, then `npm run dev` or `npm run build`. Use `npm run preview` to inspect the production build at `/motionsites-results/yoga-coach/`.

On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency lock is included. Dependencies are not part of the deliverable.

## Browser verification

Chromium with Playwright, production build, at 1440×1000 and 390×844. The repeatable check is `scripts/browser-check.cjs` (uses the image's `/app/node_modules/playwright-core`). Start the preview on port 5173 and execute it inside the Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 5173 > /work/screenshots/server.log 2>&1 & node scripts/browser-check.cjs'
```

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, both `*-collection.png` views, and `screenshots/browser-checks.json`. Checks cover decoded media, button playback, the real video ended event (seek near the ending), collection entrance, desktop hover/mobile tap playback, return and rewind, loaded font, script exceptions, request failures and viewport overflow. Mobile card sizing and button placement are adjusted to keep controls usable within the viewport. Keyboard focus and Enter/Space also preview the cards; hidden screens are inert.

## Asset recovery and limits

The exact poster proxy URL from the prompt returned HTTP 403 during the source check. The original CloudFront PNG embedded in that URL was successfully recovered. `scripts/recover-assets.cjs` downloads that exact original, resizes it to 1920px and encodes it as WebP at quality 0.85. `public/assets/poster.webp` is the resulting local fallback. The hero still attempts the exact specified poster URL and falls back on failure. The background uses the recovered poster immediately. No screenshot or page text was used as artwork.

Local card posters and an emergency hero still were obtained from Mux's thumbnail endpoint for the exact supplied stream IDs at time zero; all four video sources remain the prompt's original HLS URLs. Anton is included locally from the Google Fonts CSS's official TTF URL, alongside the requested Google Fonts import. Recovery URLs and executable conversion are retained in `scripts/recover-assets.cjs`.

Video playback still requires access to Mux. Native Safari HLS fallback is implemented but was not tested in Safari or on a physical phone. Screenshots use Chromium mobile emulation. Vite reports a bundle-size warning for hls.js; the production build succeeds. The remote poster proxy remains an external issue, covered by the local original-art fallback.
