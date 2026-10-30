# SaaS Pricing Flow

Design ID: `saas-pricing-flow`. A React + TypeScript + Vite implementation of the supplied Forma AI pricing section. Includes the original animated background, gradient/noise wordmark, three glass cards, monthly/yearly billing, and responsive mobile drawer and scrolling cards. All application state and video behavior live in `src/App.tsx`.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/saas-pricing-flow/` on the Vite server. The production output is `dist/`, with its public base configured in `vite.config.ts`. Mount the contents of `dist/` at that same path.

The actual build in this environment used the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Assets

Both original URLs returned HTTP 200. Unmodified files are stored locally for reliable subpath loading:

- `public/assets/forma-background.mp4`: [original video](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4), 1920×1080, 8 seconds.
- `public/assets/logo.svg`: [original logo](https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/Tests/logoipsum-415.svg).

No asset reconstruction or screenshot extraction was needed. The supplied design preview was consulted only as a visual reference. The page uses real DOM, CSS, SVG, and video. Inter is requested through the font stack, with the permitted system sans-serif fallback; no font import is made.

## Validation

`npm run build` passes TypeScript and creates `dist/index.html`. Real Chromium 148 checks run against the built files served at the required subpath, using a temporary HTTP server with video range support:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The script checks the three plans and all 15 features, monthly/yearly prices, keyboard billing switch, card hover, mobile drawer (close button, Escape, and navigation), horizontal scroll snapping, and absence of page overflow. It verifies video decoding, muted autoplay, no native loop, a natural `ended` event, decreasing reverse seeks, and forward playback resuming at zero. Reverse seeking never stacks pending seeks. Its first step advances one nominal frame inside the video endpoint; decode timing varies by browser and device.

Artifacts:

- `screenshots/desktop.png`: 1440×1000.
- `screenshots/mobile.png`: 390×844 viewport.
- `screenshots/mobile-full.png`: full mobile page, including billing control.
- `screenshots/mobile-menu.png`: open drawer.
- `screenshots/browser-checks.json`: browser version and actual check results, including empty error and failed-request lists.

Screenshots freeze the original video at two seconds for repeatability after verifying live playback. No full-page preview image is used in the application.

## Scope and limits

This is the requested pricing section. Choose Plan buttons are presentation controls; no checkout endpoint was supplied. Home and Pricing have local targets; FAQ, Contact, and Download retain fragment links for future host-page integration. No additional pages, payment flow, or download destination were invented. Only Chromium was available for automated validation; reverse-seek smoothness depends on hardware and browser decoding. Nothing has been deployed or pushed.
