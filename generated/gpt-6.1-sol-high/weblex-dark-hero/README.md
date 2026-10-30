# Weblex Dark Hero

Design ID: `weblex-dark-hero`. A React + TypeScript + Tailwind CSS implementation of the supplied Weblex hero, using Lucide ArrowUpRight, Menu and X icons. The page includes the exact copy, HSL theme, transparent fixed navigation, responsive typography, mobile dropdown and full-viewport background video without a dark overlay.

## Build and run

The dependency lockfile is included. With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

The production page is served at `/motionsites-results/weblex-dark-hero/`. Vite's base is configured for this path. All runtime assets are local and the complete static output is in `dist/`.

The build used in this environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Verification

Real production build completed successfully (TypeScript and Vite). Chromium checks served `dist/` at the exact publishing subpath, using the image's existing Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Checks passed for desktop 1440×1000 and mobile 390×844: no horizontal or vertical overflow, 100px content bottom padding, 62px desktop and 36px mobile headings. The intermediate 48px heading was checked at 768px. Menu opening, Escape closing, link closing, anchor navigation, video loading/autoplay/loop/muted/playsInline, and natural loop restart were verified. No console errors, page errors or failed HTTP requests occurred.

The requestAnimationFrame opacity logic was checked at 0.5 seconds (0.5 opacity), 1.2 seconds (1), 0.9 seconds before ending (0.5), and 0.2 seconds before ending (0). There is no dark overlay.

Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/checks.json` — measured browser results

Screenshots show the original video paused at three seconds for repeatable captures; runtime playback remains automatic.

## Assets and scope

The exact supplied MP4 was successfully downloaded, without transformation, into `public/assets/hero.mp4`, and is included in `dist/assets/hero.mp4`. Source:

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260221_085953_8463b46e-ba85-4bb7-912a-1feaf346e970.mp4

The original video is 1088×720 and approximately 12.04 seconds long. The supplied project-specific WebP reference was inspected only for visual comparison; no screenshot is used as page content. No asset recovery or approximation was necessary. No custom font was specified; the site uses local Arial/Helvetica/system sans-serif without remote font requests.

Only the requested hero is implemented. Navigation and CTA links use local hero anchors because the prompt supplies no destinations, pricing details or signup service. They do not perform account creation or purchases. On short viewports, a 700px mobile / 720px desktop minimum height preserves content access and may require vertical scrolling. Browser verification used Chromium; other engines and device-specific autoplay policies were not tested. No deployment or push was performed.
