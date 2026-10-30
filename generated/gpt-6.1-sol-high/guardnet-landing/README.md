# Guardnet

Single-page guardnet security/privacy landing page. Design ID: `guardnet-landing`.
Built with React, TypeScript, Vite, and Tailwind CSS. The page components live in
`src/App.tsx`; styles live in `src/index.css`. No UI library, database, or backend.

## Run and build

With Node 22 and npm available:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Production base: `/motionsites-results/guardnet-landing/`.
The complete static deliverable is `dist/`, including `dist/index.html`.
Open the configured base path when previewing.

The host build used the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -e npm_config_cache=/work/.cache/npm -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` locks dependencies. `node_modules/` is ignored and is not a deliverable.

## Assets and design

All three original prompt videos were downloaded unchanged into `public/assets/`
and copied into `dist/assets/` by Vite:

- `hero.mp4`: `hf_20260421_074215_f4339e1c-0b1a-4f60-98b2-90e3d7840cb7.mp4`
- `security.mp4`: `hf_20260421_072418_508a7d2e-396d-4f6f-9d42-ec920fcf7755.mp4`
- `benefit.mp4`: `hf_20260421_072701_f6a01abb-eb30-4559-9d6e-774362defbc3.mp4`

Source prefix:
`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/`.

The exact requested Futura CSS import remains in `src/index.css`. A local copy
of its original WOFF2 (`e55e9079ee863276569c8a68d776ef04`) supplies the same font
reliably. Font source/credit: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts),
whose stylesheet identifies the font as CC BY 4.0. SVG marks use the prompt's paths.
There are no substitute images or screenshot-based page elements.

## Verification

A real TypeScript check and Vite production build completed successfully.
`browser-check.cjs` serves only this project's `dist/` at the production base and
runs Chromium through the existing image's `playwright-core`:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

Browser coverage: desktop 1440×1000 and mobile 390×844, font loading, all three
videos' decoding and playback when visible, muted/loop settings, navigation,
start CTA, confirmation toggle, demo replay, lower demo CTA, script/console errors,
failed requests, HTTP errors, and document horizontal overflow. Chromium may
pause offscreen autoplay videos; playback is also checked after scrolling each
video into view.

Full-page screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`.
Machine-readable evidence: `screenshots/browser-report.json`.
The screenshots were visually inspected for composition and responsive layout.

## Scope and limitations

The optional Guardnet reference WebP does not exist at the supplied path; the
implementation follows the complete written specification. The prompt leaves
stat positions unspecified beyond their corners; their offsets use those locations.
The contact nav points to the existing lower CTA, since no contact form or contact
information is specified. Confirmation is a local UI toggle, not identity verification.
The demo control restarts the supplied security video. No persistence is used.
Motion consists of the provided videos and hover transitions.

Checks cover Chromium at the two requested sizes, not every browser or device.
The specified remote font CSS import remains a network request; the font also
has a local copy. Nothing was deployed, pushed, or sent to another person.
