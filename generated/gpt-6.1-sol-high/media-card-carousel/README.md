# Media Card Carousel

EngineTech’s Video Stories section, implemented from `PROMPT.md`. Design ID: `media-card-carousel`.

## Implementation

Native HTML and CSS, with a dependency-free Node 22 static build. The prompt does not require a framework. Includes the exact five stories, specified spacing/type/colors, autoplaying muted looping inline videos, a horizontal CSS scroll-snap rail with edge bleed, desktop hover/focus transitions, and both responsive breakpoints. Cards are keyboard focusable; the rail supports native arrow keys, horizontal wheel/trackpad scrolling, and touch swipes. The decorative footer retains the exact specified bars and `05 / 05` label.

`index.html` and `styles.css` are the source. `scripts/build.mjs` copies complete static files to `dist/`. Relative asset URLs support the required `/motionsites-results/media-card-carousel/` publication path. No deployment was performed.

## Build and preview

With Node 22:

```sh
npm ci
npm run build
npm run preview
```

Preview: `http://localhost:4173/motionsites-results/media-card-carousel/`.

On this host, which provides Node and Chromium through Docker:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview'
```

## Validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check uses the image’s existing `/app/node_modules/playwright-core` and `/usr/bin/chromium`; no project dependencies are needed. For other environments, supply `PLAYWRIGHT_PATH` and `CHROMIUM_PATH`.

Passed Chromium desktop at 1440×1000 and touch/mobile emulation at 390×844. Checks cover five decoded videos, visible-video autoplay and advancing playback, muted/loop/inline attributes, local font loading, scroll snapping, desktop hover and keyboard focus, arrow and wheel navigation, mobile touch swipe, final-card visibility, no page width overflow, and no console/page errors or HTTP asset failures.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/checks.json`. Screenshots show the initial rail with previews paused at one second for reproducible captures after verifying live playback. Desktop is a full-page capture (1440×1007) of the 1440×1000 viewport; mobile is 390×844.

## Assets and limitations

All three original videos downloaded successfully and are served locally without transcoding. Cards 4 and 5 reuse videos 1 and 2 as specified. Original source prefix:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/`

| Local asset | Original filename |
| --- | --- |
| `assets/integration-review.mp4` | `hf_20260324_032431_5e054107-51c0-4162-9f0f-3a40054761ef.mp4` |
| `assets/hot-fire-campaign.mp4` | `hf_20260324_032535_4ccc152e-0cc8-4ee5-a698-e1a98cea8a1e.mp4` |
| `assets/manufacturing-floor.mp4` | `hf_20260324_033707_b842a2ea-f223-4804-96d0-737ab67510fc.mp4` |

Geist variable font is bundled from Google Fonts’ `ofl/geist/Geist[wght].ttf`, with its OFL license at `assets/Geist-OFL.txt`. No runtime external asset or font requests are required. Downloaded video payload is approximately 37 MB; original imagery is cropped to the requested 16:9 media box via `object-fit: cover`. Chromium may defer autoplay for fully offscreen videos; this is native browser behavior. Real-device Safari and Firefox were not tested. Story times are the supplied editorial labels. No extra video player or navigation controls were added.
