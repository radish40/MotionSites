# Nike Premium Landing

Design ID: `nike-premium-landing`. React 19 + TypeScript + Vite, Tailwind v4, GSAP, and react-player. Two viewport-height sections use the specified copy, swoosh vectors, typography, glass statistics card, impact badge, sticky reveal, and animated pill menu. The six-circle SVG spotlight reveals local video beneath a photograph. Section-local coordinates and unique SVG IDs keep the second mask working after scrolling. Keyboard menu support includes Escape, focus cycling, and an accessible toggle label. Mobile rules keep the original content within 390px.

## Status and asset limitation

**Ready for management acceptance — APPROXIMATION.** The production build is runnable with the existing Unsplash fallback photographs and locally generated camera/light sweep clips. Management has authorized documented visual approximations when original recovery is exhausted. The original images and videos remain unavailable, and the optional preview does not exist. This is not an exact visual match or recovered original motion footage. `ready` indicates a deliverable for review, not deployment.

The prior `blocked` classification reflected unavailable original media; the user has now explicitly accepted that limitation. Original URL failures and substitute provenance remain recorded. The application source, checker, media, production output, and passing browser evidence are retained unchanged for this classification update.

`asset-manifest.json` records every original URL, failure, and substitute. GitHub blob and raw main URLs returned 404; the repository page and master image path also returned 404. Both signed Pikaso URLs and their query-free equivalents returned 403. The GitHub API returned a rate-limit response and did not restore the files. No other project or preview was read.

Follow-up exact-source recovery also failed: direct repository access returned HTTP 404, Git refs returned HTTP 401, and the API returned HTTP 403 with rate-limit evidence. Both exact raw main image URLs and both jsDelivr GitHub mirror URLs returned HTTP 404. A web-tool cached repository snapshot listed the requested filenames; neither corresponding blob-page fetch yielded the files. This historical listing does not establish current availability. Fresh response details are preserved in `source-recovery-review.json` and `source-recovery-cdn-review.json`, alongside the unchanged initial original URL evidence. No authenticated/private access was attempted.

Local fallback photographs are from Unsplash image IDs `photo-1542291026-7eec264c27ff` (red Nike running shoe) and `photo-1543508282-6319a3e2621f` (black Nike shoe). These are different assets and products from the inaccessible originals. `scripts/create-motion.cjs` creates four-second muted WebM camera/light sweeps from those photographs using Chromium canvas and MediaRecorder. These clips are approximations, not recovered source videos. A dark monochrome treatment and bottom gradient support legible text while the spotlight reveals color and movement. No screenshot is used as webpage content.

The specified Google Fonts import and Tailwind theme are preserved. Manrope and Instrument Serif loaded during browser verification; they require network access on an uncached visit. All photographs, clips, JS, and CSS are local and use the configured subpath.

## Build and run

On a machine with Node 22:

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/nike-premium-landing/`. Vite base is `/motionsites-results/nike-premium-landing/`; complete static output is in `dist/`, including `dist/index.html`. The lockfile is checked into this deliverable; node_modules is excluded.

In the provided host environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For the browser check, run a temporary container from this directory:

```sh
docker run --rm -d --name nike-premium-check -u 1000:1000 -e HOME=/tmp -p 127.0.0.1:4173:4173 -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/serve.cjs
docker exec nike-premium-check node scripts/check.cjs
docker stop nike-premium-check
```

To regenerate the approximate clips, run `node scripts/create-motion.cjs` inside that container while the built server is running, then rebuild to include the clips in dist.

## Verification

Production compilation uses TypeScript and Vite. Browser verification uses real headless Chromium via the image's playwright-core, serving the actual dist at its required subpath. Desktop: 1440×1000. Mobile: 390×844 with touch emulation.

`screenshots/browser-checks.json` records the final run: both sections, document overflow, five animated menu links, menu close/navigation, Escape support, separate SVG mask IDs, local pointer coordinates after scrolling, font loading, decoded video, hover play/pause, runtime errors, failed requests, and HTTP failures. `screenshots/desktop.png` and `screenshots/mobile.png` show the hero; additional `*-innovation.png` and `*-menu.png` files show section two and the open menu. Screenshots were visually inspected for layout.

Initial checks overlapped fallback video creation and reported two missing clips. Those were corrected before the final build and verification. Vite reports large optional third-party media-provider chunks from react-player; build succeeds. Original footage timing and exact image composition cannot be verified without the original media or missing preview. Mobile composition is a responsive adaptation because the prompt supplies desktop-only fixed offsets. Placeholder menu categories use the two available sections; no additional pages, commerce, or external services are added.

`acceptance-preservation.json` records SHA-256 fingerprints confirming that source, media, production output, checker, screenshots and browser report were unchanged during the documentation-only acceptance update. The passing production/browser checks above are retained from the genuine original verification; no new run is claimed for this classification update.

No deployment or push was performed.
