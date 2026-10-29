# Orbis CTA

Implementation of the supplied Orbis CTA design (`orbis-cta`) using React, Tailwind CSS, Vite, and lucide-react. The section uses the original autoplaying, muted, looping MP4, Anton and Condiment typography, exact responsive utility classes, neon accent, and vertical glass social buttons. All headings and controls are real DOM elements. No reference screenshot is used in the application.

## Build and run

With Node/npm installed:

```sh
npm ci
npm run build
npm run dev
```

Open `/motionsites-results/orbis-cta/` on the Vite server. The publish base is configured in `vite.config.js`. The complete static output is in `dist/`; serve it at `/motionsites-results/orbis-cta/`. Nothing has been deployed or pushed.

The provided environment has Node/npm in Docker:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.npm-home -e npm_config_cache=/work/.npm-cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.browser-home -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

This serves the actual production build at the required subpath and uses the image's Playwright and Chromium. Checks cover 1440×1000 desktop and 390×844 mobile, natural video geometry, advancing autoplay, muted/loop attributes, loaded fonts, horizontal overflow, social button hover, clicks, keyboard tab order/focus, uncaught script errors, and browser console errors. A separate check blocks remote video and Google Fonts to verify local asset availability. Machine-readable evidence is in `screenshots/checks.json`.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. They capture the video at one second for reproducibility; playback is paused only by the screenshot script, after autoplay is verified. The application itself keeps playing. Both images were visually inspected.

## Assets and fidelity

- Original video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4 — HTTP 200. Preserved unchanged as `public/assets/orbis.mp4` and used automatically if the specified remote source fails. Natural dimensions: 1784×1160.
- Required Google Fonts stylesheet remains in the document head. Exact font files are also served locally: Anton from https://fonts.gstatic.com/s/anton/v27/1Ptgg87LROyAm0K0.ttf and Condiment from https://fonts.gstatic.com/s/condiment/v26/pONk1hggFNmwvXALyH6Sqw.ttf — both HTTP 200. Vite emits font URLs with the required publish base.
- Mail, Twitter, and Github icons are imported from lucide-react.
- Only this design's supplied preview was viewed for comparison. No extraction, replacement artwork, or approximation was necessary. The explicit prompt controls the layout where the preview differs.

## Limitations and intentional behavior

The prompt specifies a video-height section, not a full-screen page. At 390px wide the section is about 254px tall; the rest of the 844px viewport is the plain background. Social buttons have hover and focus feedback, but no destination or click action was specified, so none was invented. The only continuous motion is the original video.

The initial npm install reported three dependency audit advisories (one moderate, two high); no forced dependency migration was applied. Build and Chromium checks pass. Remote playback can depend on the visitor's network and browser autoplay policies; the unchanged local MP4 fallback is included and tested. Browser validation used Chromium, not Safari or Firefox.
