# Bloom AI

A full-screen Bloom landing page built with React, Vite, and lucide-react. It uses a locally hosted looping video, Poppins, Source Serif 4, and two tiers of liquid glass. The desktop layout is split 52% / 48%; below 1024px the right panel is hidden.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured public base is `/motionsites-results/bloom-ai/`. The completed static build is in `dist/`, including `dist/index.html`. Serve the directory at that exact public path. No deployment was performed.

This host uses the available Docker image for Node/npm:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Dependencies are pinned by `package-lock.json`. `node_modules` is intentionally excluded from the delivery.

## Interactions

Menu opens category navigation. Explore Now, the three category pills, the ecosystem card, and feature cards open accessible native dialogs. Dialogs support Escape, a close button, focus restoration, and backdrop clicks. Account opens a browser-only preview form with email validation and a confirmation; no account is created and no data is transmitted or persisted. Social links go to their respective platform homepages because no Bloom profile URLs were supplied. The Sparkles button opens AI Generation. Reduced-motion visitors receive a paused video; normal playback is muted, inline, autoplaying, and looping.

## Assets and fidelity

- The exact supplied CloudFront MP4 was successfully downloaded to `public/assets/bloom-background.mp4`. It contains a planet and stars, rather than floral footage. It is retained and rendered in grayscale to match the strict palette. `poster.png` is a frame at two seconds from this same video, serving only as the video loading poster.
- Poppins 400/500/600 and Source Serif 4 italic 400/500 were downloaded from Google Fonts and are bundled locally. No external asset requests are needed at runtime.
- `/logo.png` and `@/assets/hero-flowers.png` were referenced without supplied files or download locations. The optional `/home/opc/motionsites/assets/previews/bloom-ai.webp` does not exist. Consequently the exact original mark and thumbnail could not be recovered. `public/logo.png` is an eight-petal bloom mark recreated with canvas. `public/assets/hero-flowers.png` is a separately rendered grayscale botanical sculpture, not an extracted screenshot. Both are approximations. Reproducible rendering and video poster extraction are in `scripts/prepare-assets.cjs` and `scripts/assets.html`.
- All page typography, controls, cards, and layouts are real DOM/CSS. The exact two glass styles are defined under `@layer components`. No reference screenshot is used as the page.
- No source preview was available for pixel-level comparison. Text not specified verbatim in the prompt uses original concise supporting copy. The static landing page provides local exploration previews; live AI generation, authentication, and a community backend are outside the supplied implementation.

To regenerate the local image assets using the provided Docker environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/prepare-assets.cjs
```

## Validation

A real Vite production build completed successfully. Chromium/Playwright checks ran against `dist/` at its configured subpath, at **1440 × 1000** and **390 × 844**. Both passed video playback advancement, muted/loop attributes, local font/image loading, no horizontal or vertical overflow, and no script errors or HTTP failures. Main menu, category dialogs, Explore Now, Escape, close controls, all desktop feature cards, and the account preview submission were exercised. The right panel was verified hidden on mobile.

- [Desktop screenshot](screenshots/desktop.png)
- [Mobile screenshot](screenshots/mobile.png)
- [Machine-readable browser checks](screenshots/checks.json)

Screenshots were captured with the video at two seconds for repeatability; normal page playback remains enabled. Screenshots were visually inspected. Chromium was the tested browser; physical devices and other browser engines were not tested.

To repeat checks after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp --shm-size=256m -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The validation script starts a temporary HTTP server inside its container and closes it when finished. It does not publish the site.
