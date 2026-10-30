# Slate

Fullscreen productivity SaaS hero built from this project's `PROMPT.md`. Project ID: `slate-hero`.

## Implementation

Vite, React, TypeScript, Tailwind CSS, lucide-react, GSAP and @gsap/react. The page includes the exact logo path, copy, responsive navigation, white liquid-glass surfaces, stacked character animations, staggered supporting text and buttons, and a locally served fullscreen looping video. `SplitText` uses IntersectionObserver for entrance thresholds and GSAP for the character stagger, with cleanup and reduced-motion support.

The original video downloaded successfully and is preserved without modification at `public/assets/slate-landscape.mp4`. It is copied to the production build. System Helvetica Neue / Helvetica / Arial typography follows the prompt; the actual face depends on installed system fonts. No external font request is needed.

Buttons open accessible native dialogs with Escape dismissal and focus restoration. The start form validates email locally and explicitly reports that nothing is sent or stored. Navigation and guide dialogs provide small local previews. Watch demo plays the supplied scenic asset with native controls; no separate product demo, signup service, billing integration or documentation destination was supplied.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The host environment uses the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The production output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/slate-hero/`. Serve the contents of `dist/` at that path. No deployment or push was performed. `package-lock.json` preserves the dependency versions; `node_modules/` is ignored.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.cjs
```

This starts a temporary local HTTP server for the actual production output at its configured subpath and uses the image's Chromium and Playwright Core. Checks cover 1440×1000 desktop, 390×844 mobile, and 768×1024 tablet; heading animation completion; reduced-motion text visibility; navigation visibility; horizontal overflow; original video decoding and muted autoplay; guide dialog; email form preview; demo controls and pause on dismissal; desktop navigation dialogs; script/console errors and failed network requests.

Artifacts:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`

Screenshots are real browser captures after entrance animations. For reproducibility, the background is paused at 3 seconds immediately before capture; the delivered page autoplays and loops normally. Both screenshots were visually reviewed.

## Asset provenance and limits

Original video URL:

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260425_081506_cfddbdab-90d5-49b8-aa1a-8f52de33d335.mp4

SHA-256: `4b3d3b5dd2f5d56e2d8c7f99119dde4fb5c4c6ed8f610e9d88eb212561581c79` (source and built copy match).

The optional reference `/home/opc/motionsites/assets/previews/slate-hero.webp` was absent. No reference screenshot was used or reconstructed. The supplied video itself contains violet mountain/cloud tones, which conflicts with the prompt's blanket “No purple/indigo hues” constraint. The exact video takes precedence here: no color filter was applied, and no purple/indigo UI colors were added. Glass surfaces use only white RGBA values.

Validation was performed in Chromium, including mobile-sized viewports; physical iOS/Safari and other browser engines were not available. Backdrop-filter rendering and font weights may differ by browser and platform. The optional signup and content dialogs are local preview interactions, not connected services.
