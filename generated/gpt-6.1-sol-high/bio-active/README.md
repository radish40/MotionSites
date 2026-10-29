# Clarity Core

Design ID: `bio-active`. A single-screen LumiDerm luxury skincare/biotech landing page, built from this project's TASK.md and PROMPT.md. Browser title: **LumiDerm | Advanced Skin Science**.

Uses React, TypeScript, Vite, Tailwind CSS and lucide-react. Includes the 2400 ms loader, 300 ms hold, 1200 ms split-curtain reveal, glass navigation, mobile menu, two video scenes, product card and clinical statistics.

## Run and build

With Node 22:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured base is `/motionsites-results/bio-active/`. The production entry point is `dist/index.html`; serve the entire `dist/` directory at that URL prefix.

On this host, which has no Node/npm installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Interaction

Scroll down/up to crossfade forward/backward; video activation changes at progress 0.5. Videos are muted and play once per scene entry. Phones support swiping. Arrow/Page keys also change progress; Home/End select the endpoints. Explore Now and the product arrow reveal the science scene. The logo restores the opening scene. The mobile menu closes after navigation or Escape.

The prompt specifies only two hero states and provides no booking destination or additional sections. Navigation links and Book Now select the supplied science scene and update the URL fragment. No booking submission or external service is connected.

## Verification

A real TypeScript/Vite production build passes. Chromium checks run against the production files at the configured subpath, at desktop **1440×1000** and mobile **390×844**:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script uses the image's existing playwright-core and Chromium, starts an internal static server, and closes it after checking. It verifies the loader, title, media decoding, font, viewport overflow, wheel transition, active video, play-once behavior, mobile menu, home reset, Explore Now and touch events. Details are saved in `screenshots/browser-checks.json`. Browser touch checks dispatch touch events; physical-device testing was not performed.

Screenshots:

- `screenshots/desktop.png` and `screenshots/mobile.png`: opening scene.
- `screenshots/desktop-science.png` and `screenshots/mobile-science.png`: second scene.
- `screenshots/mobile-menu.png`: mobile navigation.
- `screenshots/splash.png`: loading overlay.

## Assets and limitations

Both exact supplied video files and the supplied product image were downloaded into `public/assets/` and are included in the static build. Helvetica Now Text loads from the specified OnlineWebFonts CDN and was confirmed available in Chromium. The downloaded CDN stylesheet is preserved as `public/assets/font-cdn.css` for provenance. Font source: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts); the CDN stylesheet identifies CC BY 4.0 attribution. The live font remains dependent on the external CDN, with Helvetica/Arial fallbacks.

Chromium can abort/reissue video range requests during seeking; these appear as `net::ERR_ABORTED` in the raw report. Both videos decoded with readyState 2 or higher and no media errors. No JavaScript page errors or viewport overflow were observed. The large source videos (about 21 MB combined) are preserved to match the requested assets.

This is a static design delivery, ready for review, with no deployment or push performed.
