# Skybridge 404

Single-page 404 screen built with React, Vite, and Tailwind CSS v4. The page uses the supplied LGPSM SVG paths, exact message, Geist Mono SemiBold font, and original animated skybridge MP4. There are no controls or additional interface elements.

The publishable static build is in `dist/`, including `dist/index.html`. Its configured base is `/motionsites-results/skybridge-404/`. Serve the build at that path; it has not been deployed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

In the provided host environment, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

Dependencies are pinned in `package-lock.json`. `node_modules` is excluded from delivery. Vite 6.4.5 was used for the final build; the installation audit reported zero vulnerabilities.

## Browser verification

Run the check against the production output:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

The script runs a temporary HTTP server inside the container and uses the image's Playwright Core and Chromium. It checks desktop 1440×1000, mobile 390×844, narrow 320×568, and short 390×360. Checks passed for the exact page structure and copy, font loading, centered content, required video attributes, actual playback advancement and looping, no unexpected tab stops, and no horizontal overflow. Standard desktop/mobile sizes have no vertical scrolling; the short viewport scrolls to retain all content. There were no script/console errors or failed asset requests. Chromium's expected aborted media range requests during seeking are recorded separately.

- [Desktop screenshot](screenshots/desktop.png)
- [Mobile screenshot](screenshots/mobile.png)
- [Detailed browser measurements](screenshots/checks.json)

Screenshots capture the real DOM and original video at one second. The test pauses the video only for repeatable screenshot capture; the delivered page autoplays and loops. Both screenshots were visually inspected.

## Asset provenance and limitations

Both supplied endpoints returned HTTP 200. The original MP4 is copied byte-for-byte to `public/assets/skybridge.mp4` and included in the build, avoiding a runtime video CDN dependency:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260801_001207_ec20d138-aa45-4b2b-ab8c-bdc71607f240.mp4`

The exact font face uses `https://static.figma.com/font/GeistMono_wght__1` with the required family, weight, style, and `format("woff2")` declaration. An unmodified local copy is a second source if that endpoint is unavailable. The endpoint supplies TrueType/sfnt bytes despite the prompt's WOFF2 declaration; Chromium successfully loaded the exact font. No substitute font or reconstructed artwork was needed.

Asset SHA-256:

```text
skybridge.mp4     603c4d9a334cb0a84fb167a3bad865047aeefa1ee597cc12389fcbd47f0a99fb
geist-mono.woff2  2386ddac2c72b6e0c126561e91486b7284412f303d8d9513da9ffec789e63338
```

Only this design's supplied preview was inspected as a composition reference. It is not embedded in the page and no imagery was extracted from it. Background cropping follows the specified `object-fit: cover`; its appearance changes with viewport ratio and playback time. Browser validation covers the supplied Chromium environment, not physical devices or other browser engines.
