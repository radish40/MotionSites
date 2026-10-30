# Shamoni

Design ID: `shamoni-hero`. A React + Vite + Tailwind CSS v4 + `motion/react` implementation of the supplied Shamoni prompt. The 600vh sticky scene preserves every supplied scroll transform array, the SVG wordmark, elliptical reveal, orbit path mathematics, six-image gallery, typography and copy. The menu and collection buttons navigate within the existing scroll experience.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 5174
```

On this host, use the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is `dist/`, including `dist/index.html`. Serve it under `/motionsites-results/shamoni-hero/`. Vite's base and all local asset paths use that prefix. No deployment was performed.

## Assets

All six exact PNGs were downloaded from the prompt's Figma URLs and are served locally without modification. Original URLs remain in `src/App.tsx` and `public/assets/sources.json`.

The exact supplied Mux stream works, but its URL is HLS rather than MP4. Its original 1280×720 fMP4 initialization and two media segments are joined byte-for-byte into `public/assets/sailing.mp4` for reliable native Chromium playback. It is 8.08333 seconds, muted and looping; no transcoding or visual substitutions were made. The original HLS URL remains as a native fallback. `scripts/cache-video.py` reproduces this packaging; `public/assets/video-provenance.json` records the source and rendition playlist.

The supplied video actually shows a cat among flowers, and the six PNGs show ceramic bowls. These exact source assets have been preserved despite the prompt's sailing copy. The optional `/home/opc/motionsites/assets/previews/shamoni-hero.webp` reference did not exist, so reference-image comparison was unavailable.

Instrument Serif, Manrope (300–600) and Great Vibes come from the exact supplied Google Fonts stylesheet. The exact original import is retained as a source comment, with active local copies of the same font files to prevent font rendering from depending on the external service. Production rendering uses only the local copies. `public/assets/google-fonts.css` preserves their source URLs.

## Validation

A real TypeScript check and Vite production build are required by `npm run build`. `screenshots/build.log` contains the final build output. All 11 scroll transform array pairs were compared programmatically with `PROMPT.md` and match exactly.

The browser check runs against the production preview, using the image's actual Chromium and `/app/node_modules/playwright-core`:

```sh
# In a container with this project mounted at /work, start the preview first.
npm run preview -- --port 5174
# In another shell in that same container:
PW_TEST_SCREENSHOT_NO_FONTS_READY=1 node scripts/browser-check.cjs
```

`screenshots/checks.json` records desktop 1440×1000 and mobile 390×844 results. Checks assert native video playback at 1280×720, six loaded images, loaded font families, menu navigation, collection button navigation, orbit item growth from 80 to 520, zero script/request errors and zero horizontal overflow. Screenshots include the entry, orbit, collection and returning orbit scenes. `screenshots/desktop.png` and `screenshots/mobile.png` are the requested entry captures. Animated video and orbit positions vary naturally between captures. Chromium may cancel MP4 byte-range requests during looping; these are recorded separately in `cancelledVideoRequests`, with actual video playback asserted independently.

The collection button opens the existing collection portion of this page; no checkout or commerce backend was specified. Validation covers Chromium at the requested sizes; Safari and Firefox were not run.
