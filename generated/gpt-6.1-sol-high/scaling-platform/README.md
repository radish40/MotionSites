# Scaling Platform

Targo's two-section hero and about page, built from `PROMPT.md` with semantic HTML, CSS, vanilla JavaScript, and Vite. Includes the staircase typography, original animated videos, cyan hue overlay, chamfered buttons, responsive navigation, and video autoplay retries. No additional sections or footer.

## Build and run

Requires Node 22 and npm. The dependency version is pinned in `package-lock.json`.

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static deliverable is `dist/`, including `dist/index.html`. Serve it at `/motionsites-results/scaling-platform/`. Vite's base is configured for that exact path. Nothing has been deployed or pushed.

## Assets and compatibility

Both original CloudFront URLs in `PROMPT.md` returned HTTP 200. Their byte-for-byte HEVC originals are preserved in `assets-source/`. Chromium could not decode them, so the delivered videos in `public/assets/` are H.264 conversions of those same files, using FFmpeg 7.0.2, libx264, CRF 19, yuv420p, and faststart. The frame dimensions, frame rate, and animation are retained; recompression introduces minor pixel differences. Reproduce with `sh scripts/transcode-assets.sh /path/to/ffmpeg`. FFmpeg was downloaded from `https://johnvansickle.com/ffmpeg/`; its binary is not part of the deliverable.

Quantico 400 and 700 are downloaded from Google Fonts and served locally. `public/assets/font-source.css` preserves the upstream font URLs. Runtime assets require no external requests. The Quantico license is included as `public/assets/Quantico-OFL.txt`. The favicon is a native SVG matching the requested logo. The supplied Scaling Platform preview was viewed only for comparison; no screenshot content is used in the page.

## Browser verification

The repeatable browser script is `scripts/browser-check.cjs`, using the image's `/app/node_modules/playwright-core` and `/usr/bin/chromium`. Run against the production preview:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173 > /work/screenshots/preview.log 2>&1 & server=$!; trap "kill $server" EXIT; node scripts/browser-check.cjs'
```

Results are saved in `screenshots/browser-checks.json`. Required full-page captures: `screenshots/desktop.png` at 1440×1000 and `screenshots/mobile.png` at 390×844. Checks cover loaded Quantico, both videos actively advancing, exact section count, navigation anchors, CTAs, menu open/close, Escape, close-on-selection, console errors, failed resource requests, and horizontal overflow. Additional layout widths: 320, 700, 701, 1024, and 1920 pixels. Below 360px, the About minimum width relaxes and the hero button padding narrows to prevent overflow.

## Limits and routing decisions

The prompt supplies no contact email or backend. Contact links use `mailto:` to open the visitor's email application without inventing an address. Get Started goes to About; Learn More goes to its detail paragraph. No form or extra section is added. Autoplay depends on browser policy; muted retry logic and first-click/touch retries are implemented as requested. Browser verification covers the available Chromium, not Safari or Firefox.
