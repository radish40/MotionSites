# Luminara

A responsive, single-viewport creative showcase built with React, Tailwind CSS, and Vite. Implements the supplied hero copy, SVG mark, glass navigation pills, bottom gradient, Instrument Serif italic accent, and full-bleed looping video.

## Run and build

With Node.js 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured base path is `/motionsites-results/luminara/`. The complete static deliverable is in `dist/`, including `dist/index.html`. Serve that folder at the configured path.

For this host, which uses Docker for Node tooling:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Assets

The exact supplied CloudFront video is bundled as `public/assets/luminara.mp4` (approximately 16.7 MiB), so playback does not depend on the remote host. It autoplays muted, loops, and plays inline with cover sizing.

The exact required Google Fonts link remains in `index.html`. An intermittent `ERR_SOCKET_NOT_CONNECTED` occurred during the first browser check. Matching Inter 400/500/600 and Instrument Serif font files were downloaded from Google Fonts and bundled under `public/assets/fonts/`; `fonts.css` provides the local fallback. `google-fonts-source.css` records their source URLs.

## Validation

The production build was tested in headless Chromium at desktop **1440 × 1000** and mobile **390 × 844**, served under the actual base path. Checks cover video playback and advancing time, loaded fonts, exact hero copy, mobile navigation visibility, horizontal/vertical overflow, page errors, and hover/focus/click states. Screenshots capture the same video frame at two seconds for consistent comparison; normal playback remains enabled in the application.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json` — detailed measurements and network observations.

Reproduce the browser check using the provided container's Chromium and Playwright:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

Dependency audit after patching Vite and PostCSS reported zero vulnerabilities.

## Scope and limitations

The prompt defines no additional pages, forms, signup service, or quote endpoint. Navigation links resolve to the hero; the two CTA buttons have the requested visual and focus states, with no conversion workflow attached. The mobile navigation links are hidden exactly as specified. The hero uses `100svh` with a `100vh` fallback to fit mobile browser chrome.

Browser checks cover Chromium at the two required sizes; other browser engines were not tested. Video range requests canceled during seeking or page teardown are recorded separately from failed assets. Nothing has been deployed or pushed. `ready` in `result.json` means available for management review.
