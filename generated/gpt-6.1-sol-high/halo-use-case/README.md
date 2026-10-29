# Halo Use Case

Design ID: `halo-use-case`. A faithful implementation of the supplied USD Halo “Use modes” section using React, TypeScript, Tailwind CSS 3, Vite, and lucide-react's `ArrowRight`.

The section uses the exact supplied copy, responsive grid, spacing, typography, rounded video card, and icon-first button. The specified TT Norms Pro stylesheet and CloudFront MP4 remain external assets. No scrim or gradient is placed over the video.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/halo-use-case/` on the development or preview server. The Vite base is configured for this exact path. `dist/` contains the complete static production build, including `dist/index.html`. Serve that directory at the configured public path.

The build was performed in the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` records exact dependency versions. No deployment or push was performed.

## Browser verification

The production build was served under the configured subpath and tested with real Chromium through Playwright, using the existing tools in the Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node \
  louislam/uptime-kuma:2 scripts/check.cjs
```

- Desktop: 1440 × 1000, two equal columns, card 680 × 720 with 24px corners.
- Mobile: 390 × 844, single column, card 342 × 720; full-page screenshot includes content below the viewport.
- Neither viewport has horizontal overflow.
- TT Norms Pro loaded successfully in both viewports.
- The video loaded at 1248 × 1664, autoplayed muted, and advanced during observation. Loop and inline-playback attributes were verified.
- “Know more” accepts mouse and keyboard activation; the icon circle transitions from translucent white to solid white on hover.
- Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Both show the same video frame at two seconds for consistent visual review. The production page continues to autoplay normally.
- No JavaScript exceptions, console errors, or HTTP error responses were recorded in the final checks.
- Detailed runtime observations, asset requests, and error lists: `screenshots/checks.json`.

## Limits and asset observations

The prompt supplies no destination or click action for “Know more”; the button retains the supplied presentational behavior without adding a route, dialog, or content.

The font and video require access to their external providers. Both loaded successfully during verification. Chromium reported some `net::ERR_ABORTED` MP4 requests during media handling/seeking; the video nevertheless reached readyState 4, had no media error, and visibly rendered and played. These raw observations are retained in the browser report.

This deliverable is ready for review and has not been published.
