# Nex Max Upgrade

A React + TypeScript section built with Vite for `/motionsites-results/nex-max-upgrade/`. The supplied copy, inline Apple SVG, Google Fonts Inter import, glass cards, responsive breakpoints, and CSS are implemented directly. All styles live in a React `<style>` block. No preview screenshot is used as page content.

The exact CloudFront MP4 remains the video source. It is muted and paused; a requestAnimationFrame loop seeks by 0.05 seconds, throttled to 33ms, waits while `video.seeking`, and reverses at both bounds. There are no native `play()` calls or CSS keyframe animations.

## Build and run

From this directory, on a Node 22 machine:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/nex-max-upgrade/` on the preview server. The complete publishable output is in `dist/`; dependencies are locked in `package-lock.json`.

On the provided host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible check serves the actual `dist/` at its configured subpath, then uses the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Screenshots: `screenshots/desktop.png` (1440×1000) and `screenshots/mobile.png` (390×844). Detailed results, including decoded frames, paused state, native play call count, boundary reversal samples, font loading, controls, browser errors, failed requests, grid columns, and page dimensions, are in `screenshots/browser-checks.json`.

## Scope and limitations

- The prompt supplies a button but no installer URL or click action. The download button preserves that specification and does not initiate a download. Usage Policy retains the exact `href="#"` placeholder. Both were checked for clickability.
- Exact supplied CSS combines body padding of 40px above and below with a root minimum height of 100vh. This produces 80px of vertical scroll at both checked viewports. No horizontal overflow occurs; viewport screenshots show all content.
- Video and Google Fonts require network access. Both loaded in Chromium. A metadata-only readiness assertion initially timed out because continuous seeking frequently leaves `readyState` at 1; the final check uses actual decoded frames and advancing timestamps instead.
- Only this design's reference was inspected. No assets were extracted or approximated. `assets/source-video.mp4` is an unchanged archival copy of the exact remote MP4, downloaded during diagnostics; the application still uses the specified remote URL, and this archival file is not part of `dist/`.
- No deployment or push was performed. `ready` means available for review.
