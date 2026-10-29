# Luxury Escapes

Design ID: `luxury-escapes`. A React + Vite showcase for **ZENITH ESCAPES**, implementing the two mobile screens in `PROMPT.md`. The 370 × 790 devices remain side by side with a 70px gap and scale together to fit the viewport with 40px total clearance. All application styles are inline JSX; global CSS contains reset, animation, focus, and reduced motion rules. No runtime dependencies beyond React and ReactDOM.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/luxury-escapes/` on the development or preview server. Vite's base is configured for that exact publishing path. `dist/index.html` and the remaining contents of `dist/` are the static delivery. No deployment was performed.

This host uses the available Docker image instead of host Node:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The check serves the actual production build under its publishing path using a temporary container HTTP server, and uses the image's existing Playwright and Chromium. It checks 1440 × 1000 and 390 × 844, page/console errors, failed requests, viewport overflow, Google Font loading, video playback, offer/back navigation focus, menu opening and closing, description focus, and reduced motion video pausing. Evidence is saved in `screenshots/browser-report.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`.

The View Offer button replays the detail entrance and focuses its title. Back replays the teaser and focuses View Offer. The menu exposes the existing getaway summary; its item closes the menu and focuses the detail title. The bottom arrow focuses the existing description. These interactions remain within the supplied two-screen showcase.

## Assets and limitations

- Both exact supplied CloudFront MP4s are downloaded unchanged to `public/videos/` and included in `dist/videos/`; runtime playback does not depend on the remote video host. They total approximately 78 MiB. The teaser uses both the original and blurred duplicate video layers.
- Anton is loaded using the exact Google Fonts stylesheet link requested in the prompt. Browser verification checks it is loaded. An internet connection is required for this font on a fresh client.
- The prompt references `linotype-projekt-regular.woff2` and `.woff`, but neither file nor a download source was supplied. The named `@font-face` is configured with subpath-safe URLs; the actual font binaries are absent. This unused font produces build-time asset warnings, but neither screen uses it and the browser makes no requests for it. Licensed originals can be placed in `public/fonts/` and the project rebuilt. No unrelated font is represented as Projekt.
- Long Anton headline lines are measured after font loading and compressed horizontally only where necessary to preserve the exact specified line breaks and avoid clipped text.
- On phones the full paired presentation scales down as explicitly required; it does not become a vertically stacked page.
- Reduced motion disables entrance animations and pauses the videos. The page has no booking service or additional screens.

The dependency lockfile is included. `node_modules/` is excluded from delivery.
