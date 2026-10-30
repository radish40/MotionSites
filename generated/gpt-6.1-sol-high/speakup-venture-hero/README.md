# SpeakUp Venture Hero

Design ID: `speakup-venture-hero`. Page title and brand: **Speakup**.

A React + TypeScript + Tailwind CSS hero built from `PROMPT.md`, using lucide-react icons. Includes the supplied SVG logo, Recoleta heading, Inter typography, original full-cover background video with no overlay, responsive navigation, and a full-screen mobile menu. The menu supports Escape, focus trapping, focus restoration and scroll locking.

## Build and run

Dependencies are pinned by `package-lock.json`. With Node 22:

```bash
npm ci
npm run build
npm run dev
```

Without host Node, from this directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable artifact is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/speakup-venture-hero/`. Serve that directory at this URL prefix. Nothing has been pushed or deployed.

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

This starts an ephemeral internal HTTP server against the actual production build and runs Chromium through the image's installed playwright-core. Evidence is in `screenshots/browser-checks.json`.

- Desktop: 1440×1000; mobile: 390×844.
- Checked no horizontal overflow, 128px/56px headings, loaded fonts, original video's playback/muted/loop state, desktop navigation and hover color, CTA anchor behavior, mobile menu open/close, Escape, focus trapping, and link selection.
- Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-menu.png`.
- Screenshots pause the video at one second for a repeatable frame after confirming live autoplay. The delivered page plays continuously.

## Assets and scope

Original MP4, downloaded unchanged to `public/assets/venture.mp4`:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_150921_27df94bd-d1e3-4440-9f55-314c4611902b.mp4

The specified Recoleta and Google Fonts stylesheet links remain in `index.html`. Matching font files are also served locally for reliability. Recoleta source:
https://db.onlinewebfonts.com/c/67415ab41a7350f81536b69763e6d031?family=Recoleta+Regular

Recoleta provider attribution: [Web Fonts](http://www.onlinewebfonts.com/fonts), provider lists CC BY 4.0. Google Fonts Inter source CSS is preserved in `public/assets/inter-source.css`, including each original file URL. The wordmark's requested black weight uses Inter 900 in addition to 400/500/600/700.

The supplied design preview was inspected only as visual reference. No preview pixels were used in the page; no assets required reconstruction. The actual video frame changes naturally throughout playback and cover cropping moves its sprout offscreen on narrow mobile viewports, as expected from the prescribed centered object-cover background.

Navigation and venture CTAs use descriptive fragment placeholders because the prompt specifies no destination pages, contact address, or submission workflow. They update the URL; connect them to real destinations during site integration. Browser checks cover Chromium only. Ready means ready for review, not deployed.
