# Space Voyage

Design ID: `space-voyage`. A full-screen cinematic hero built from the complete local `PROMPT.md`, using React, Vite, TypeScript, Tailwind CSS, `motion/react`, and Lucide icons. The production base is `/motionsites-results/space-voyage/`.

The page includes the specified glass navigation, badge, animated Instrument Serif heading, supporting text, calls to action, and partner bar. The heading uses IntersectionObserver and staggered blur keyframes. Small screens have a collapsible navigation menu. Navigation and voyage buttons open accessible native dialogs; View Liftoff opens the supplied video with playback controls. Dialogs support Escape, close buttons, backdrop dismissal, and native focus management.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is in `dist/`, including `dist/index.html`, the poster, logo, and fallback MP4. Serve that directory at the configured base path. No deployment or push was performed. `package-lock.json` records the installed dependencies; `node_modules` is not a delivery artifact.

## Assets

- The exact CloudFront MP4 specified in `PROMPT.md` is the primary video source. It was accessible with HTTP 200 and plays successfully in Chromium. Despite the space-travel copy, this original asset depicts a flowering landscape, matching this design's supplied preview. It was intentionally retained.
- `public/media/voyage.mp4` is an unchanged local copy of the original video, used if the external source fails and for the liftoff player.
- The prompt referenced `/images/hero_bg.jpeg` without supplying that file. `public/images/hero_bg.jpeg` was generated from the original video's frame at 0.1 seconds through Chromium's video/canvas APIs. Reproduce with the browser script's `--poster` option, then rebuild. No preview extraction or full-page screenshot is used in the application.
- The prompt requests a logo image without giving an asset or logo design. `public/images/logo.svg` is an original white orbital spacecraft mark sized 48×48, an approximation of the unspecified branding.
- Instrument Serif and Barlow load through the exact Google Fonts import requested. Both loaded successfully during browser verification. Font delivery requires network access.
- Poster and logo URLs use Vite's configured base, adapting the prompt's root-relative paths to the required publishing subpath.

## Verification

`npm run build` passed TypeScript checking and a real Vite production build. Installation audit reported zero vulnerabilities.

Run the production browser checks with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The script serves `dist/` under the actual publishing subpath and uses the image's existing Playwright Core and Chromium. It checks desktop 1440×1000 and mobile 390×844, fonts, video playback, overflow, all navigation items, voyage and claim buttons, liftoff controls, dialog dismissal, and the mobile menu. It also blocks the remote video in a separate page to verify local fallback playback. Assertions fail on horizontal overflow, missing fonts, unsuccessful playback, failed normal requests, and JavaScript errors.

Artifacts:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-report.json`

Screenshots were visually inspected. Neither viewport has horizontal overflow or script errors. Both Google font families and the original video load. Chromium emits a warning that `as="video"` is unsupported for preload links; the explicitly requested hint is retained and actual video playback works.

## Limits

This is a static hero implementation. The prompt supplies no reservation endpoint, booking process, or separate destination pages. The navigation dialogs are local informational presentations, and Claim a Spot / Start Your Voyage show launch information rather than claiming to submit a booking. No personal data is collected. Cross-browser behavior beyond the installed Chromium was not tested. Mobile checks use viewport/device emulation rather than a physical phone. Background animation means screenshot frames vary between runs.
