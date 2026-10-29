# Orbis Hello

React + Tailwind CSS implementation of `PROMPT.md`, design ID `orbis-hello`. The page uses the exact supplied copy, responsive utility classes, Anton and Condiment fonts, and original CloudFront video. All typography is live DOM content. The only motion is the autoplaying, muted, looping video; there are no controls or JavaScript interactions by design.

## Build and run

Use Node 22.12 or newer:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/orbis-hello/` on the preview server. Vite uses this exact base path, and `dist/` contains the complete static build. No deployment has been performed.

This environment uses the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

The script serves the real `dist/` build at its required subpath and uses the image's Chromium and Playwright. It checks 1440×1000 desktop and 390×844 mobile: no horizontal overflow, viewport-height section, both fonts loaded, video actually advancing with autoplay/muted/loop/inline attributes, responsive right-column visibility, and no script errors. There are no interactive controls to exercise. Playback is paused and sought to 3 seconds only for reproducible screenshots, then resumed.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json` — measured results and network failures

Both screenshots were visually inspected. The supplied Orbis Hello preview was inspected only as a visual reference; no screenshot pixels were used as website assets.

## Assets and limitations

The original video URL and Google Fonts links are preserved exactly as requested. Both fonts and the video loaded successfully in Chromium with no failed requests. These assets require network access; no extraction, substitute artwork, or font fallback recovery was needed. Video framing naturally crops at narrow viewports through the required `object-cover` layout. Browser checks cover Chromium at the two requested viewport sizes, not physical devices or other engines.
