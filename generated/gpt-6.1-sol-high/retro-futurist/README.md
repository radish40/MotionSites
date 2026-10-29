# Retro-Futurist

Mainframe® full-screen agency hero, implemented from this project's `PROMPT.md` using React, TypeScript, Vite, and Tailwind CSS. The project index title is **Retro-Futurist**, ID **retro-futurist**.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/retro-futurist/`. Vite's base is set to that path, including video, font, CSS, and JavaScript resources. The complete static output is in `dist/`, with `dist/index.html` as its entry point. `package-lock.json` locks dependencies. No deployment was performed.

On the provided host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Behavior

The original paused background video responds to horizontal mouse movement with sensitivity 0.8. Seeks are clamped and queued through `seeked`, preventing overlapping seeks. Touch devices display its initial frame, as specified by the mouse-only interaction.

The introduction uses the specified blur. The greeting types after 600 ms, at 38 ms per character, and removes its blinking cursor when complete. Pills start fading in after 400 ms independently. The email pill copies the exact address and announces success or failure. The mobile menu animates its bars and overlay, supports Escape and keyboard focus containment, and closes when switching to desktop width.

## Assets and provenance

- `public/assets/mainframe.mp4` is the unchanged original from [the specified CloudFront video](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4). Retrieved successfully over HTTPS; no recovery or replacement was needed. The local copy avoids a runtime dependency on the video provider. Its duration is 4.041667 seconds and its resolution is 3828×2164.
- Both exact stylesheet links remain in `index.html`. The corresponding original WOFF2 fonts are also mirrored locally and declared in `src/index.css`. The original downloaded provider CSS is retained in `public/assets/*-provider.css` for provenance. Font attribution: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), whose provider CSS states CC BY 4.0. No fonts were substituted.
- Only this design's permitted `retro-futurist.webp` preview was inspected for composition. The page uses actual DOM text, controls, and the original video; no preview pixels were extracted or displayed.
- `public/assets/provenance.json` records original URLs and local SHA-256 hashes.

## Validation

The production build passed TypeScript validation and Vite compilation. Chromium checked the actual `dist/` files served under the required subpath, at desktop **1440×1000** and mobile **390×844**. The reproducible check uses the image's existing Playwright and Chromium rather than adding application dependencies:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.mjs
```

Validated typewriter completion, early pill appearance, loaded fonts, paused video, mouse scrubbing in both directions, clipboard contents and feedback, mailto links, mobile menu opening/closing/Escape, and absence of horizontal or vertical overflow. Browser script errors, console errors, and failed requests were all empty. Desktop and mobile screenshots were visually inspected.

- [Desktop screenshot](screenshots/desktop.png)
- [Mobile screenshot](screenshots/mobile.png)
- [Mobile menu screenshot](screenshots/mobile-menu.png)
- [Machine-readable browser report](screenshots/browser-report.json)

## Limits

The prompt did not specify navigation URLs. Labs, Studio, Openings, and Shop use their corresponding paths at `https://mainframe.co/`; these remote destinations were not validated or changed. Contact actions use the supplied email with mailto links, and recruitment/operations pills use the corresponding navigation destinations. Email delivery was not attempted. Clipboard behavior was verified on a trustworthy localhost origin; the browser Clipboard API requires localhost or HTTPS in deployment. The required external font stylesheet links still need network access, with original local font copies available as a fallback. Validation used Chromium emulation rather than physical mobile hardware. Ready means available for review, not deployed.
