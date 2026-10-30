# Kresna Footer

Design ID: `kresna-footer`. A native HTML footer for Kresna, a sales automation SaaS brand. `index.html` contains all component markup, CSS, and JavaScript. No framework, build dependencies, or keyframe animations are used.

The implementation follows `PROMPT.md`: blue video card, light gray navigation card, floating K badge, Google Fonts (DM Sans and Caveat), brand SVG icons, hover transitions, email field, responsive layouts, and a measured SVG watermark. The exact specified CloudFront video is the primary source; `assets/kresna-background.mp4` is an unmodified local copy used if the CDN fails. No overlays or tints are applied.

## Build and run

From this directory, on the supplied host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --package-lock-only && npm run build'
docker run --rm --name kresna-footer-preview -p 4173:4173 -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 serve.cjs
```

Open `http://localhost:4173/motionsites-results/kresna-footer/`. The publishable files are in `dist/`, including `dist/index.html` and the video fallback. Relative asset paths support the required publication prefix without Vite. With Node 22 installed, `npm run build` and `npm run serve` also work directly.

## Browser verification

While the preview container is running:

```sh
docker exec kresna-footer-preview node browser-check.cjs
```

The check uses the image's existing Playwright Core and Chromium. Actual checks passed at desktop 1440×1000 and mobile 390×844: Google Fonts loaded, video decoded and played muted with loop enabled, no horizontal overflow, all nine navigation links and four social links present, email validity and Enter handling, navigation hash changes, and desktop hover colors and lifts. The script also verifies local video playback when the CDN is deliberately blocked, and checks overflow at 320, 560, 768, 860, 861, 1024, and 1920 pixels.

`screenshots/desktop.png` and `screenshots/mobile.png` are full-page browser captures from those viewports. `screenshots/browser-report.json` contains the actual check data, including script errors and failed requests. No page script errors occurred. Chromium may cancel a continuing remote video download on page closure (`net::ERR_ABORTED`); successful decoded frames and advancing playback were verified before closing each page.

## Integration limits and assets

- The prompt does not provide a subscription endpoint. The button checks the email using native browser validation and announces that the subscription service is not connected; it does not claim success or send/store email data.
- Navigation links use descriptive fragment destinations for integration into the parent site. This standalone footer does not include those page sections. Social icons link to the corresponding platform homepages because brand profile URLs were not supplied.
- Google Fonts requires network access, as specified. Both requested font families loaded in browser verification. The video URL returned HTTP 200; its original bytes are also included locally (3,734,799 bytes).
- The optional reference `/home/opc/motionsites/assets/previews/kresna-footer.webp` was absent. The implementation was checked against the full written prompt; no reference image extraction or approximation was needed.
- Responsive badge positions follow the specified offsets, including its overhang into the gap above the mobile navigation card. The mobile page scrolls vertically.
- No deployment, push, other project access, agents, or external messages were performed. `ready` denotes readiness for review only.
