# Interior Features

Design ID: `interior-features`. A single interactive room card built with native HTML, CSS, and JavaScript. The day photo transitions into the supplied looping night video through a keyboard- and touch-accessible theme switch. Footer copy, icon, media URLs, gradient, card proportions, and the 660×836 scaled artboard follow `PROMPT.md`.

The four-column grid contains one centered card. It switches to two columns below 920px and one column below 540px. JavaScript sets the artboard scale on load, resize, and container resize. Photo changes fade out, load the requested still, then fade back in; stale changes are cancelled during rapid toggling. Night starts muted inline playback; day pauses playback. Reduced-motion preferences remove the fades.

## Build and run

Requires Node.js 22 and npm. There are no browser runtime dependencies or framework requirements.

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:5173/motionsites-results/interior-features/`. The build writes the full static site to `dist/`, including `dist/index.html`. All local asset references are relative, so the output supports the required `/motionsites-results/interior-features/` publishing path.

On this host, use its existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

For a local preview, run the same command with `-p 5173:5173` and replace the final command with `npm run preview`. No deployment was performed.

## Assets

- Day and night images use the exact supplied Cloudinary URLs.
- Video uses the exact supplied CloudFront MP4 URL and `muted loop playsinline preload="auto"` attributes.
- Material Icons loads from the exact Google Fonts stylesheet specified by the prompt.
- Original font files were not supplied. Genuine PP Neue Montreal Book, Medium, and Bold were obtained from CDNFonts, converted into local WOFF2 files, and registered as `Neue Montreal` at weights 400, 500, and 700, with `sans-serif` fallback. The PP edition is the font source used here. Source URLs are recorded in `font-source.css`; original WOFF files and `scripts/convert-fonts.mjs` make conversion reproducible (`node scripts/convert-fonts.mjs`).

## Verification

A real `npm run build` completed successfully. Playwright Core and system Chromium from the existing Docker image checked the built output under the required subpath.

- Desktop viewport: 1440×1000; mobile viewport: 390×844, plus 768×1024 resize coverage.
- Desktop card measured 319×404. The calculated artboard scale matched the required minimum ratio on desktop and mobile.
- Day/night control tested by click, Space, Enter, and a mobile touch context.
- Night playback progressed; video faded to opacity 1, and the night still loaded. Returning to day paused playback, restored the day still, and reached opacity 0.
- The intermediate video opacity confirmed a gradual crossfade. Rapid toggles ended in the correct mode. Reduced-motion behavior passed.
- No JavaScript errors, failed requests, HTTP error responses, or horizontal overflow were observed. All three font weights and Material Icons loaded.
- Screenshots were visually inspected for legible footer copy, proportional media, clean edges, and responsive layout.

Evidence: `screenshots/browser-checks.json`, `screenshots/desktop.png`, `screenshots/mobile.png`, and supplemental `desktop-night.png` / `mobile-night.png`. Mobile screenshots capture the full scrollable page at a 390×844 viewport.

To rerun browser checks while the preview server is running in the same Docker container:

```sh
node scripts/check.cjs
node scripts/capture.cjs
```

The check scripts use `/app/node_modules/playwright-core` and `/usr/bin/chromium` from the specified Docker image. They do not add Playwright to this site's dependencies.

## Limits

The supplied media and Google icon font require network access. All were available during verification; no media URLs were substituted. Browser playback policy may reject `play()`, which is caught as requested. This is the requested presentation card, with its supplied room-building copy; it does not implement a room editor.

Status: ready for management-session review, not published.
