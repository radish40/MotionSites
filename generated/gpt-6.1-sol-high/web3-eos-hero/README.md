# Web3 EOS Hero

Responsive, full-screen EOS hero built with HTML, CSS, JavaScript and Vite. The prompt did not specify a framework; the implementation uses native DOM elements. Project ID: `web3-eos-hero`.

The page includes the exact hero copy, original looping video, a 50% black overlay, local General Sans fonts, gradient heading, layered pill buttons, responsive navigation and an accessible waitlist notice. All page assets are bundled locally. The configured publication base is `/motionsites-results/web3-eos-hero/`.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the server at `/motionsites-results/web3-eos-hero/`. The static deliverable is `dist/`, including `dist/index.html`. No deployment has been performed.

This host uses the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The production build was served and checked in Chromium using the image's existing Playwright installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

- Desktop: 1440 × 1000; mobile: 390 × 844.
- Both fit the required viewport heights and have no horizontal overflow.
- Video loads at 1708 × 1212, autoplays, advances, loops, stays muted and uses inline playback.
- General Sans loads; heading sizes are 56px and 36px; mobile navigation links are hidden.
- Both waitlist buttons open a native modal; Escape and the close button dismiss it.
- Reduced motion pauses playback.
- No browser script/console errors, HTTP errors or failed requests.
- Additional overflow checks at widths 320, 375, 768, 900, 1024, 1280 and 1920.
- `npm audit`: zero vulnerabilities with pinned Vite 6.4.5.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`. Both were visually reviewed. The video is paused at two seconds only during screenshot capture for repeatability. Runtime playback remains enabled. Machine-readable checks: `screenshots/checks.json`.

## Asset provenance

- `public/assets/eos-vortex.mp4`: original, unmodified video downloaded successfully from https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4 (14,779,133 bytes).
- `public/assets/general-sans-regular.woff2` and `general-sans-medium.woff2`: original Fontshare files for weights 400 and 500, obtained through https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap and its referenced CDN URLs. No font substitution.
- Logo: custom inline SVG geometric mark with the requested placeholder wordmark, LOGOIPSUM. Chevrons are inline SVG.
- Only this design's supplied WebP preview was viewed for visual context. It is not used in the rendered page, and no extracted screenshot material is used.

## Limits and implementation choices

No waitlist service or destination was provided. Both CTAs open a clearly labeled registration-unavailable notice and link to EOS; they do not collect data or claim a successful registration. Navigation destinations were unspecified: Get Started and Resources link to the EOS site, Developers links to AntelopeIO on GitHub, and Features links to the hero description. External EOS and GitHub destinations returned HTTP 200 during verification; a candidate EOS docs subdomain did not resolve and was not retained.

The badge retains the requested May 1, 2026 date verbatim. Mobile font and padding adjustments preserve the requested 13px badge and 36px heading. Video uses cover cropping on narrow screens. Browser verification used Chromium emulation, not physical phones or Safari/Firefox. The original video is approximately 14.8 MB, so initial playback depends on connection speed and browser autoplay policy. Reduced-motion visitors see a still frame.
