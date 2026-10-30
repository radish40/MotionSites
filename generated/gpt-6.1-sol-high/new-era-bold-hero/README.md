# New Era Bold Hero

Design ID: `new-era-bold-hero`. A responsive, full-screen React + Tailwind CSS hero built with Vite. The page uses the original animated blue video, locally hosted Rubik Bold, the exact three-line headline, and a white SVG-shaped 184 × 65 CTA. Mobile content starts at 128px; desktop/tablet content starts at 192px. Headline sizes are 60px, 96px, and 100px, with a smaller fluid size below 375px to keep all three lines visible.

## Run and build

Requires Node 22.12+ and npm. All commands run from this directory:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/new-era-bold-hero/` on the chosen server. The production output is `dist/`, with `dist/index.html` and local assets. The Vite base is `/motionsites-results/new-era-bold-hero/`.

On this host, use the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Validation

The actual production build passed. The dependency audit reported zero vulnerabilities after updating Vite to 7.3.7. Browser checks use the image's Chromium and `/app/node_modules/playwright-core`:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check'
```

This starts a temporary local HTTP server serving `dist/` at the required subpath. It checks 1440×1000, 390×844, 320×740, and 768×1024. All passed: no horizontal overflow or clipped headline, Rubik loaded, correct heading offsets and button dimensions, video autoplay/muted/loop/inline attributes and advancing playback, mouse hover and press scaling, keyboard focus/Enter, mobile tap, and no browser console/page/resource errors.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Machine-readable browser observations: `screenshots/checks.json`. Screenshots hold the actual video at one second after confirming playback so that the composition can be reviewed consistently; the application itself continuously plays the video.

## Assets and scope

- `public/assets/new-era.mp4` is the unmodified 12,803,547-byte original file downloaded successfully from https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260206_044704_dd33cb15-c23f-4cfc-aa09-a0465d4dcb54.mp4 . Its decoded dimensions are 1704×1212. It is bundled locally to remove runtime dependency on the external URL.
- `public/assets/rubik-bold.ttf` is Rubik 700 obtained from Google Fonts' stylesheet for `family=Rubik:wght@700&display=swap`, served from https://fonts.gstatic.com/s/rubik/v31/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-4I-1UA.ttf . The font license is `public/assets/Rubik-OFL.txt` (from the Google Fonts Rubik directory).
- The specified design reference WebP was viewed only for composition. No screenshot or extracted reference element is used as the webpage.
- The custom CTA shape is native SVG; layout, text, and controls are real DOM elements. No additional sections or flows were added.

No asset recovery or approximated replacement asset was needed. The prompt specifies button hover and active interactions but no destination; the button implements those interactions and keyboard focus without inventing a signup or navigation flow. Checks used headless Chromium, including mobile viewport emulation; physical iOS/Android devices and other browser engines were not tested. Browser policies or user settings can prevent autoplay; the required dark blue fallback remains available. No deployment or push was performed. `ready` means ready for review, not published.
