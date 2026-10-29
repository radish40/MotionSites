# Layered Depth

Design ID: `layered-depth`. A Qelora architecture studio landing page with exactly two sections, built with React, Vite, TypeScript, and Tailwind CSS for the base reset. All element styling is inline; there are no JSX CSS classes or animation libraries. Runtime dependencies are only `react`, `react-dom`, and the requested unused `lucide-react`.

The production site is in `dist/`, with its base path set to `/motionsites-results/layered-depth/`. This project has not been deployed or pushed.

## Run and build

With Node 22 and npm installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the displayed server URL with `/motionsites-results/layered-depth/` appended.

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The lockfile is included. `node_modules` is not part of the deliverable. Serve the contents of `dist/` under the configured base path; no backend is required.

## Implementation

`src/Hero.tsx` implements the fixed navigation, 768px responsive breakpoint, mobile dropdown, active navigation pills, English selector, layered wordmark and sculpture, bottom panels, and scroll parallax. The panel bottom follows `offset + scrollY * 0.5`; the sculpture translates by `-scrollY * 0.3`.

The bird system preloads all four clips and uses both state and refs: enter → idle1 ↔ idle2; scrolling past 10px plays leave, and returning to the top plays enter. Native video methods handle readiness, reset, pause, and playback. `src/Section2.tsx` implements the second video layer, headline, map pin, and subtext.

“Explore our approach” scrolls to Section 2. Navigation pills update selection, as specified; no additional sections or routes have been invented. The project CTA opens an email composer. Its address, `hello@qelora.studio`, is an implementation assumption because no contact destination was supplied; it is not verified.

## Assets and limitations

All eight supplied Cloudinary asset URLs were tested. They return HTTP 401 with `x-cld-error: cloud_name dy5er7kv5 is disabled`. This includes both background videos, all four bird clips, the sculpture, and the declared but unused logo. The original URLs remain in `src/assets.ts`; if the account is restored, the videos and sculpture will be requested automatically on page load.

The repair replaces the initial geometric fallback with isolated reference pixels: `pedestal-recovered.png` contains only the organic mossy pedestal and planting; `bird-recovered.png` contains only the kingfisher silhouette. Both have alpha transparency. No whole-page reference frame or reference movie is used as a website background. The DOM wordmark, navigation, cards, and both sections remain independent.

Recovery source: the authorized [Layered Depth animated reference](https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(43).webp), also identified by `/home/opc/motionsites/assets/previews/layered-depth.webp`. Its downloaded original is preserved only in `recovery/reference.webp` for reproducibility, never served in `dist/`. It is 640×470 with 74 frames; upscaling limits fine detail. `scripts/recover.py` records the silhouette masks, chroma segmentation, frame numbers, and placement. It requires Pillow and NumPy only for asset reproduction, not for building or running the site. `recovery/manifest.json` records attribution and hashes. These are reproductions from the supplied design, not recovered original Cloudinary binaries; original creator attribution was not provided.

The **pedestal and bird appearance are pixel recoveries** from reference frames 26 and 0 respectively, with manual masks and edge cleanup. Some fine grass details are approximate due to the small reference and foreground/UI occlusion. The **bird motion is reconstructed**, using native Web Animations for a 1.5-second arrival, alternating 2.6-second idle poses, and a 1.1-second departure; it does not reproduce the unavailable original wing articulation. The fallback shares the real state/ref-based state machine with the original videos. Video errors activate the visible fallback; returning to the top restarts arrival. `src/RecoveredMotion.tsx` contains the fallback animations. The leaf-shadow matte is an original SVG reconstruction guided by the reference, with soft, independently swaying layers in both sections. It is an approximation of the reference shadows, not an exact extraction of the original video.

The initial Python fetches for the supplied Pexels photo and fonts returned HTTP 403. Retrying with curl recovered the exact CTA image and all three exact Zimula WOFF2 fonts. These are bundled locally for reliability. The two required font stylesheet links remain in `index.html`, and the required Reg import remains in `src/index.css`. Asset request details are in `asset-checks.json`.

Font source and attribution: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), Zimula Trial Med / Bd / Reg, supplied stylesheet license notice [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Photo: [provided Pexels asset](https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400).

## Browser verification

The reproducible browser check serves the actual production `dist/` at its configured subpath and uses the existing Docker image's Playwright and Chromium:

```sh
docker run --rm -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

`browser-checks.json` records the desktop 1440×1000 and mobile 390×844 results, interactions, loaded local fonts and photo, section count, horizontal overflow, uncaught JavaScript errors, and remote asset failures. Bird checks use **no synthetic media events**. They verify decoded local bird imagery, running native animations, natural idle completion, real scroll-triggered departure, automatic hiding after departure, screen-position changes during re-entry, and natural completion back to idle. Leaf checks verify changing rendered transforms. Scroll checks exercise actual browser scrolling and the sculpture parallax. Original video decoding remains unavailable because of HTTP 401; actual fallback animation is verified instead.

Screenshots:

- `screenshots/desktop.png` — desktop hero
- `screenshots/mobile.png` — mobile hero
- `screenshots/desktop-section2.png` — desktop second section
- `screenshots/mobile-section2.png` — mobile second section
- `screenshots/mobile-menu.png` — open mobile navigation

Additional `*-bird-enter.png` and `*-bird-leave.png` screenshots capture actual fallback animation phases on both viewport sizes. The recovered composition was visually reviewed against the authorized reference. The organic pedestal, blue bird, and moving soft leaf shadows replace the earlier geometric/static fallback.

The build and repaired visible animation are ready for review. Exact original video fidelity remains limited by the upstream Cloudinary failure; recovery and approximation are explicitly distinguished above.
