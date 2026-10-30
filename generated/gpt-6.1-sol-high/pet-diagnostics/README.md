# Pet Diagnostics

Design ID: `pet-diagnostics`. A single-file Lume landing page built from the exact requirements in `PROMPT.md`. Real DOM text, CSS grid comparison panels, responsive remote imagery, and the original autoplaying video. No framework, external JavaScript, runtime packages, or local image dependencies. All CSS is in one head style block and the sole page script handles video reveal.

## Build and run

The page works directly as `index.html` without compilation. The delivery build copies it byte-for-byte to `dist/index.html`:

```sh
npm install --package-lock-only
npm run build
```

On this host, Node 22 is available through the specified existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --package-lock-only && npm run build'
```

Serve `dist/` at `/motionsites-results/pet-diagnostics/`. Asset URLs are absolute remote URLs; there are no root-relative dependencies. The only distributable file is `dist/index.html`. Nothing has been deployed or pushed.

## Browser validation

Run the included check with Chromium and Playwright from the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

The check starts its own temporary HTTP server and tests the actual delivery subpath. Evidence:

- `screenshots/desktop.png`: 1440 × 1000.
- `screenshots/mobile.png`: 390 × 844.
- `screenshots/browser-report.json`: computed measurements, playback state, responsive checks, interactions, and request/script failures.

Chromium verified the video at readyState 4, playing, 1928px wide, opacity 1. Its actual duration is 8.041667s, which rounds to the specified 8.04s. At 1440px the measure is 1180.796875px, headline 23.9702px, and comparison text 10.8633px, matching the prompt’s rounded 24.0px and 10.9px. Font checks passed for Inter and Instrument Serif. The cream panel overhangs the header and the features panel continues behind it.

Mobile uses the portrait still and hides the video; the three columns measure approximately 60% / 20% / 20%. Reduced-motion mode hides the video, displays the loaded desktop still, and removes transitions. All three pills passed hover, press, focus, and keyboard activation checks. No horizontal overflow at tested widths 320, 375, 390, 640, 820, 821, 1024, 1280, 1440, 1920, and 2560px. The desktop sizing sweep includes 1440 × 900. No page script errors or failed browser requests were observed. Both screenshots were visually inspected.

## Assets and limitations

All four exact CloudFront URLs are retained. Desktop still and video returned HTTP 200; both hero stills loaded in Chromium; the Open Graph image separately returned HTTP 200. Google Fonts loaded successfully. No recovery, extraction, or substitute assets were needed. Only this design’s original reference was inspected; it is not embedded in the page.

The prompt supplies button labels and states but no checkout URL or call scheduler. Their anchors use `href="#"` as explicit placeholders; they do not perform checkout or book calls. No additional product flow has been invented. External assets and fonts require an internet connection. Browser verification used the available Linux Chromium, not physical devices or other browser engines. Mobile/reduced-motion rules hide the video as prescribed; they do not prevent its network download. The exact prescribed responsive geometry is retained.
