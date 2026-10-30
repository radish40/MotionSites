# Targo Logistics Hero

A compact, full-viewport logistics hero built with React, Tailwind CSS, Vite and lucide-react. Project ID: `targo-logistics-hero`.

The page uses the specified original racing video at full opacity, Rubik typography, a white SVG targo logo, red clipped-corner buttons and a consultation card with `blur(40px) saturate(180%)`, a 12% white border, diagonal shine and inset shadows. Desktop/mobile padding is 64px/32px; headlines are 64px/42px. The video has a pause/play control. Navigation and consultation buttons open accessible native dialogs; mobile navigation uses a compact menu.

## Build and run

With Node 22:

```sh
npm ci
npm run build
npm run preview
```

The configured public base is `/motionsites-results/targo-logistics-hero/`. Open that path on the preview server. Deployable static output is in `dist/`, including `dist/index.html` and all media/fonts. Nothing has been deployed or pushed.

The host environment uses this existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Dependencies are locked in `package-lock.json`. `node_modules` is excluded from delivery; reinstall with `npm ci`.

## Browser verification

Run the repeatable checks against the actual production build:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script starts a temporary static server at the configured subpath and uses the image’s Playwright Core and Chromium. It checks desktop 1440×1000 and mobile 390×844, video autoplay/muting/looping/opacity and pause/play, Rubik loading, horizontal overflow, headline clipping, About/Contact navigation, mobile menu, consultation buttons, required form validation, demo confirmation and dialog close/Escape. Final run passed with zero browser script/console errors and zero failed HTTP responses. The production build passed; npm reported zero dependency vulnerabilities after updating Vite.

Artifacts:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-report.json`

Screenshots pause the actual video at 1.5 seconds for reproducibility; normal page load autoplays it. Both final viewport screenshots were visually reviewed.

## Assets and limitations

- Original video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260227_042027_c4b2f2ea-1c7c-4d6e-9e3d-81a78063703f.mp4
- Downloaded unchanged to `public/assets/targo-motion.mp4` (native 960×720, approximately 11 MB). It uses `object-fit: cover`; mobile necessarily crops the wider scene. No dark overlay is applied.
- Rubik weights 400/500/600/700 are self-hosted from Google Fonts. Original font metadata is saved in `public/assets/rubik-source.css`; the SIL Open Font License is in `public/assets/Rubik-OFL.txt`. The runtime does not depend on external font or video URLs.
- The permitted design-specific preview was viewed for visual reference only. No preview screenshot or extracted reference image is rendered in the page.
- No original logo vector was supplied. The abstract symbol and Rubik wordmark are recreated in inline white SVG; the favicon uses the same symbol.
- No asset failed or required recovery. Browser playback is verified in Chromium; other browser engines and devices were not tested. Autoplay remains subject to browser policies.
- No contact destination, booking API or backend was supplied. The enquiry dialog explicitly identifies itself as a demo; validation and preparation work locally, and no information is sent or stored. About text is brief presentation copy without added operational claims.
