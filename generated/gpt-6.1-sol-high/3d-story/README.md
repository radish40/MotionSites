# 3D Story

A native HTML, CSS, and JavaScript implementation of the supplied **Veldara** design. The page preserves the original copy, Inter weights, dark palette, supplied floral video, floating particles, fixed navigation, hero fade, masked feature-card reveal, and Veldara 8 finale. No framework or third-party JavaScript runtime is required; the prompt supplies a native HTML implementation.

The static release is in `dist/`, with the publication base `/motionsites-results/3d-story/`. Relative asset paths work beneath that base. This project has not been deployed or pushed.

## Build and preview

With Node 22 or newer:

```bash
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/3d-story/`. The preview server supports MP4 byte ranges.

On the provided host, use its existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

To preview in Docker, use the same mount with `-p 4173:4173` and run `npm run preview`.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check'
```

The check uses the image's existing `/app/node_modules/playwright-core` and `/usr/bin/chromium`. These can be overridden through `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH`. It starts a temporary local server and closes it afterward. See `screenshots/checks.json` and `screenshots/fallback-checks.json` for recorded results.

The browser checks desktop 1440×1000 and mobile 390×844; font and video decoding; scroll scrubbing; hero fade and restoration; feature reveal and responsive columns; finale animation; internal navigation and scroll cue; reduced motion; page/console errors; failed asset requests; and horizontal overflow. The 120-frame preload can take over a minute in headless Chromium; the browser check allows three minutes, and the native video displays and scrubs while frames are prepared. A separate check intentionally fails the frame-fetch request and verifies that the video fallback still scrubs.

Chromium may intentionally cancel redundant media or blob requests when changing media state; those cancellations are excluded from asset failures.

Required screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional feature and finale screenshots document the scroll sequence.

## Assets and implementation notes

- `assets/veldara-scroll.mp4` is the exact video from the CloudFront URL in `PROMPT.md`, downloaded successfully (6,282,757 bytes).
- Inter 400, 500, 600, and 700 are downloaded from the Google Fonts stylesheet specified in the prompt. `assets/fonts/inter-source.css` records the original source URLs; `inter.css` loads local copies. The Inter OFL license is included at `assets/fonts/LICENSE.txt`.
- All visual assets are served locally. No Google Fonts or CloudFront connection is required at runtime.
- The source prompt's empty navigation targets are connected to the existing feature and finale sections. Get Started and the scroll cue open the feature section. Social icons have accessible labels and lead to the respective service homepages because the prompt supplies no Veldara account URLs.
- Decorative canvases are hidden from assistive technology. Links have keyboard focus indicators. Reduced-motion preferences stop particle drift and the bouncing cue and remove the finale transition.
- The npm command is the exact display text required by the prompt. The site does not execute it or claim that the package has been published.

Only this project's files were modified. `TASK.md` and `PROMPT.md` remain the original requirements.
