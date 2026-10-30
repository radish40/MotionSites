# NOVA Space Systems

Design ID: `nova-space-landing`. A single-page aerospace landing page built with React 18, TypeScript, Vite, the SWC React plugin, Tailwind CSS v3, shadcn/ui design tokens and utilities, and lucide-react. It uses Space Grotesk, square corners, monochrome UI, a viewport-height video hero, and a staggered Rocket Science grid. No deployment or push was performed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

This host supplies Node through Docker. From this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable build is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/nova-space-landing/`. Use that path when running dev/preview. `package-lock.json` pins dependencies; `node_modules` is not a deliverable.

## Interactions and verification

The fleet CTA and Programs link scroll to Launch vehicles. Systems opens Rocket Science; Discover opens the first science card. Menu and Search are usable on desktop and mobile. Search filters the three page destinations, including a no-results state. Panels support Escape, focus trapping and restoration. Ambient videos play muted and loop; reduced-motion preference pauses them.

The actual production build and Chromium checks passed at 1440×1000 and 390×844: video loading/playback, viewport hero sizing, horizontal overflow, CTA and navigation, search results, panel keyboard handling, mobile menu, reduced motion, and absence of JavaScript/console errors. See `screenshots/browser-checks.json`. Video range requests can be cancelled (`ERR_ABORTED`) by navigation; all rendered videos successfully decoded and played.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`; full-page captures also included. Screenshots hold videos at 1.5 seconds for inspection; the live page loops normally. Run checks in the same Docker image after building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

## Asset provenance and reference inspection

The exact hero MP4 still returns **HTTP 403 AccessDenied**. Initial attempts used its original URL, a query variation, browser headers/Referer and the HTTP redirect. A fresh request after reference inspection also returned AccessDenied; see `reference-inspection/hero-response-headers.txt` and `hero-response.xml`.

Management supplied this design's catalog reference: `/home/opc/motionsites/assets/library/videos/NOVA_Space_Systems_1.mp4`. It exists and was inspected directly in Chromium. It is **1440×1440, 10.041667 seconds, 9,814,953 bytes**. Frames at 0, 1, 2, 4, 6, 8 and 10 seconds show a star field, a coastal launch site and a rising light trail. These frames contain no page typography, navigation or controls. Crucially, a whole-file SHA-256 comparison proves it is **byte-identical to `public/assets/engineering.mp4`**, the exact top-right science video supplied by PROMPT.md:

```text
106bf97dfbd17f22fcb49a77be0de1efd75d6097ae7b9e43c008307599fc0e7b
```

This is clean, isolated science-section footage, rather than a page recording containing a recoverable hero region. Its filename alone does not establish it as the separately specified unavailable hero. There are no obscured hero pixels to extract from this reference, and no evidence identifies it with the missing URL. Therefore the exact hero **cannot be recovered from the supplied evidence**. The optional WebP remains absent. No other designs or asset directories were inspected.

The hero retains the explicitly documented **supplied launch-pad MP4** approximation (`launch.mp4`), preserving real autoplay video with no overlay/gradient. It is not claimed to match the original hero. Obtaining the distinct original source remains necessary for an exact hero match. The catalog footage was not repurposed as proof of a hero recovery, and no page movie, screenshot or inspection frame is used as website content.

Reproducible inspection code is in `scripts/inspect-reference.cjs` (mount the single authorized reference read-only at `/reference.mp4` in the same Docker image) and `scripts/reference-evidence.py` (whole-file fingerprints). `reference-inspection/evidence.json`, metadata and sampled PNGs record the inspection outside `public/` and `dist/`. Provenance shipped with the build is in `public/assets/sources.json`.

Both lower-section MP4s are the exact requested files, downloaded locally. Google Fonts loaded successfully and an identical local copy of weights 400–700 is included for resilience. The prompt does not supply the two science paragraphs; original supporting prose was written under the specified headings. All layout, type, controls and text are real DOM.

After the reference inspection and provenance update, the project was rebuilt and the desktop/mobile browser checks and all four screenshots were regenerated. The visual implementation retains the documented hero approximation.
