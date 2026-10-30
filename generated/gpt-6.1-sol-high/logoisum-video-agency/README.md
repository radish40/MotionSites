# Logoisum Video Agency

A responsive, full-viewport video agency hero built from `PROMPT.md`. Project ID: `logoisum-video-agency`.

The page uses the supplied floral landscape video, a floating white navigation bar, Barlow typography, an 84px italic Instrument Serif headline on desktop, and the exact hero and CTA copy. The video is muted, autoplaying, looping and cropped with `object-fit: cover`; no color overlay is applied. The mobile layout provides a collapsible menu and responsive typography. Keyboard-accessible dialogs, a background pause control and reduced-motion support complete the interactions.

## Stack and build

Vite 6.4.5, native HTML, CSS and JavaScript. The prompt specifies typography and visual behavior but no framework. Dependencies are pinned in `package-lock.json`.

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

On this host, use the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/index.html` and its assets are the complete static deliverable. The configured base is `/motionsites-results/logoisum-video-agency/`. Serve at that prefix; no deployment was performed.

## Assets

All runtime assets are local, including fonts, so rendering does not depend on third-party requests.

- `public/assets/landscape.mp4`: original supplied MP4, downloaded intact from https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4 (12,419,424 bytes; 1928×1072). The background and reel player both use this file.
- `public/assets/barlow-medium.ttf`: Google Fonts Barlow Medium, https://fonts.gstatic.com/s/barlow/v13/7cHqv4kjgoGqM7E3_-gc4A.ttf.
- `public/assets/barlow-semibold.ttf`: Google Fonts Barlow Semibold, https://fonts.gstatic.com/s/barlow/v13/7cHqv4kjgoGqM7E30-8c4A.ttf.
- `public/assets/instrument-serif-italic.ttf`: Google Fonts Instrument Serif Italic, https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zATiw.ttf.
- Brand mark, favicon, arrow and play icons are native SVG geometry. No logo asset was supplied, so the wordmark and star mark are custom approximations.

Only this design's provided reference image was inspected. It contains the landscape scene, without page typography or navigation. No screenshot is used to render any part of the page, and no asset recovery or reference extraction was necessary.

## Verification

Real production build completed in Docker with Node 22. Chromium checks used the image's installed `playwright-core` and `/usr/bin/chromium`. The final dependency audit reported zero vulnerabilities.

Screenshots:

- `screenshots/desktop.png`: 1440×1000.
- `screenshots/mobile.png`: 390×844.
- `screenshots/workreel.png`: reel dialog.
- `screenshots/checks.json`: machine-readable checks and browser error results.

Verified background decoding, advancing playback time, mute/loop/autoplay attributes, object-cover styling, local font loading, pause/resume, navigation dialogs, Escape dismissal, workreel controls, meeting draft creation and download, mobile menu operation, reduced-motion behavior, and no horizontal overflow at both required sizes. There were no browser JavaScript errors or HTTP asset failures. Both required screenshots were visually reviewed.

To reproduce checks in one temporary container:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build && (node scripts/serve.cjs & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/check.cjs)'
```

The test server serves only `dist/` at the configured prefix on container port 4173.

## Delivery limits

The supplied brief has no booking endpoint, calendar link, separate agency workreel, or client testimonials. The meeting CTA opens a clearly labeled local draft form and can download the request; it sends nothing and schedules no meeting. The reel dialog previews the supplied landscape film and explicitly identifies it. The Testimonial dialog transparently states that testimonials are pending. About and Services dialogs use short editorial agency copy. These controls can be connected to real agency content later.

Browser verification covers Chromium at the required desktop and mobile viewport sizes, plus an emulated reduced-motion preference. It does not include physical iOS devices or Safari. Normal autoplay is enabled; reduced-motion preferences deliberately pause the background. The 12.4 MB original video is retained at its supplied quality.

Status `ready` means ready for management-session review, not published or deployed.
