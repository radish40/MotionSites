# Arceage Stats

Implementation of the supplied Arceage Stats design (`arceage-stats`). Built with React 19, Tailwind CSS 4 and its Vite plugin, Motion imported from `motion/react`, and Vite 6. The page contains only the requested agricultural stats section, including the exact copy, five counters, character reveals, Instrument Serif accents, and supplied SVG mask and video.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/arceage-stats/` on the development or preview server. The production output is `dist/`, with the required base path configured in `vite.config.js`. The dependency lockfile is included.

On this host, Node and Chromium were run inside the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Verification

The real production build completed successfully. `build.log` records its output. Vite reports harmless ignored `use client` directives from Motion dependencies; the bundle builds and runs successfully.

Browser verification uses the image's existing Playwright Core and Chromium. It serves the actual `dist/` files under the configured subpath, without deploying anything:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

Desktop (1440×1000) and mobile (390×844) checks passed:

- Typewriter characters become visible; counters finish at `500K+`, `99.8%`, `50+`, `15+`, and `24/7` and retain values after scrolling back.
- Responsive row/column layout, no document horizontal overflow, and no internal horizontal scroll displacement.
- Both Google Fonts load; supplied video decodes and advances with autoplay, muted, looping, and inline playback enabled.
- No browser console errors, uncaught script errors, or failed requests in the final pass.

Full-page screenshots, visually reviewed, are `screenshots/desktop.png` and `screenshots/mobile.png`. The mobile screenshot includes the section below the 844px viewport. Detailed browser evidence is in `screenshots/checks.json`.

## Implementation notes and limits

The left flex column includes `min-w-0` so the specified heading width can shrink within the specified desktop columns and gap without shifting the section horizontally. All requested section, heading, grid, mask, and animation settings are retained.

The exact Google Fonts CSS import and Krea-hosted MP4 remain external dependencies, as specified. Both worked in the final browser pass; offline use requires connectivity or separately hosting those assets. An initial preliminary run observed a canceled video request while the video still played; this did not recur in the final pass.

No deployment, push, other session, or external messages were performed. `ready` means ready for review, not published. `node_modules/` is ignored and is not part of the static deliverable.
