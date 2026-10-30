# Wanderful Hero

Design ID: `wanderful-hero`. A cinematic, full-viewport Wanderful travel hero implemented with React, TypeScript, Vite, Tailwind CSS, GSAP, and lucide-react. All text and controls are real DOM elements over the exact requested CloudFront video; no reference screenshot is used as a page asset.

The implementation includes liquid-glass navigation, the specified typography and copy, 1.25× muted looping video, interpolated mouse parallax, entrance transitions, CTA hover/pressed states, and visible keyboard focus. Mobile navigation wraps onto a second row and the headline wraps to fit the viewport. Reduced-motion preferences disable parallax and shorten transitions.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run dev
```

The Vite base is `/motionsites-results/wanderful-hero/`. Open that path on the dev server. The complete production output is in `dist/`, including `dist/index.html`. Serve `dist/` at that exact URL prefix; no deployment has been performed.

The actual build in this environment used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

`package-lock.json` is included for reproducible installation. Use `npm ci` for subsequent builds.

## Browser verification

The production output was served under its configured subpath in a temporary Docker container and checked using the container's Chromium and Playwright Core. Reproduce the checks with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Verified at desktop 1440×1000 and mobile 390×844:

- Video successfully decoded at 1664×1244, played automatically, was muted and looping, and used playbackRate 1.25.
- Inter loaded from Google Fonts. No failed browser requests, HTTP errors, or uncaught script errors occurred.
- Both layouts fit the viewport without horizontal or vertical overflow or headline/CTA overlap.
- Desktop mouse movement produced GSAP translation; the CTA hover produced 1.03 scale and the specified glow.
- Header links resolve to existing hero elements, the CTA can receive a click, and keyboard navigation reaches links.
- Both screenshots were visually inspected.

Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, and detailed machine-readable observations in `screenshots/browser-checks.json`. Screenshots seek the video to one second for a repeatable frame after verifying live autoplay; the application itself keeps playing normally.

## Assets and limits

The exact CloudFront MP4 is used directly in the video `src` and returned HTTP 200. The required Google Fonts import is in `src/index.css` and loaded successfully in Chromium. These resources require network access.

The exact requested Dirtyline URL, `https://fonts.cdnfonts.com/s/15011/Dirtyline36DaysofType.woff`, returned HTTP 404. It remains the first source in the required font-face declaration. The provider's `https://fonts.cdnfonts.com/css/dirtyline-36daysoftype-2022` stylesheet supplied a related 2022 font at `https://fonts.cdnfonts.com/s/83214/Dirtyline%2036daysoftype%202022.woff` (HTTP 200); it was saved as `public/fonts/dirtyline-2022.woff` and added as a local fallback. This is a related variant, not a verified recovery of the original file. Dirtyline is declared but unused by the requested visible layout, so the unavailable original does not change the rendered text. No assets were extracted from the reference.

The prompt describes a single hero and supplies no booking form, backend, or destination pages. The CTA implements its requested visual interaction without adding a booking workflow. Navigation links point to existing hero elements rather than additional pages. Browser checks cover Chromium at the two requested viewport sizes; Safari and physical mobile hardware were not tested.
