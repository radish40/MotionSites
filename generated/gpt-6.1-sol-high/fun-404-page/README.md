# Fun 404 Page

Design ID: `fun-404-page`. A single-screen animated TinyTrails 404 page built to `PROMPT.md`: orange gradient, dynamically stretched and masked 404, supplied fox video, responsive navigation, and animated menu. The full page is implemented in `src/App.tsx` using React, Tailwind CSS, and Lucide React. Inter weights 400–900 load from Google Fonts.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/fun-404-page/` on the preview server. Vite's asset base is configured for that exact path. The distributable static site is `dist/`, including `dist/index.html` and the video fallback.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible check serves the real production build from its configured subpath and uses the image's Playwright Core and Chromium. It requires no extra project dependencies:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Verified desktop 1440×1000 and mobile 390×844: no document overflow or script errors, Inter loaded, muted video autoplay, resize scaling, menu open/close, desktop backdrop dismissal, Escape dismissal, keyboard focus trapping and return, body scroll lock, menu link destinations, and Back to Home navigation. Home destinations use a minimal local test fixture; the host site's home page is outside this project.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, plus `desktop-menu.png` and `mobile-menu.png`. Raw browser evidence is in `screenshots/browser-checks.json`. The build passes TypeScript and Vite; the dependency audit reported zero vulnerabilities after updating Vite and PostCSS.

## Assets and limits

The exact supplied CloudFront MP4 is the primary video source and loaded successfully in Chromium. A byte-for-byte downloaded copy is bundled at `public/assets/tinytrails-404.mp4` and is used automatically on remote playback failure; deliberately blocking CloudFront confirmed fallback playback. Google Fonts loaded successfully; its availability remains dependent on the network, with sans-serif as the CSS fallback. Browser logs retain `net::ERR_ABORTED` media requests caused by navigating away during video streaming; playback was verified before those navigations.

Links to `/` follow the prompt. Navigation links point to the corresponding home-page anchors (`/#about-us`, `/#programs`, `/#reviews`, `/#faq`, `/#contacts`); destination content belongs to the host site. There is no deployment or push. `ready` means prepared for review, not published.
