# Cursor Follow

Design ID: `cursor-follow`. A fullscreen **Orbis.Nft** hero built with React 18, TypeScript, Tailwind CSS 3, Vite, and lucide-react, following `PROMPT.md`.

The supplied video fills the viewport and starts paused at time zero. Horizontal mouse deltas accumulate a target time with sensitivity `0.8`; the `seeked` event chains pending seeks without React re-renders. The page includes the exact geometric logo, desktop navigation, responsive headline, Condiment accent, mobile dropdown, and unused liquid-glass utility.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/cursor-follow/` on the Vite server. The production output is `dist/`, configured for that same base path.

On this host, the real build was run using the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install --no-audit --no-fund && npm run build'
```

`package-lock.json` records resolved dependencies. Use `npm ci` for subsequent reproducible installs. Dependencies and temporary npm caches are excluded from the deliverable.

## Browser validation

The included check script serves the actual `dist/` files under the required base path, with HTTP range support for video seeking, and runs Chromium through the image's existing Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/check.cjs
```

Passed checks:

- Desktop 1440×1000 and mobile 390×844, with no horizontal or vertical overflow.
- Video decodes at 3840×2160, duration 4.041667 seconds, starts paused at zero.
- Forward and reverse mouse scrubbing, rapid seek chaining, and both timeline clamps.
- Anton and Condiment load successfully from Google Fonts.
- Mobile menu opens and closes; menu items, CTA, and Escape dismiss it.
- No browser console errors, script exceptions, or failed asset requests.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. Detailed measurements are in `screenshots/checks.json`. Screenshots were also visually inspected.

## Assets and limits

`public/assets/orbis.mp4` is an unchanged local copy of the exact CloudFront video supplied in `PROMPT.md`; Vite copies it to the production output. Google Fonts use the specified external stylesheet and preconnect links. No asset failures were observed during validation; fonts still require network access on a fresh client.

Navigation labels and the reservation CTA have no destinations or backend in the supplied prompt, so no additional pages or reservation workflow were added. Touch devices display the initial video frame; the specified scrub interaction uses mouse movement. Validation used Chromium; no other browsers were checked. This deliverable is ready for review and has not been deployed or pushed.
