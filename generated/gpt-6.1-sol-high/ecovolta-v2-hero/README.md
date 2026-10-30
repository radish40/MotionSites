# EcoVolta V2

Design ID: `ecovolta-v2-hero`. A full-screen **closer** landing hero built with React, TypeScript, Tailwind CSS v4, Vite, and hls.js. Production files are in `dist/`; the configured public base is `/motionsites-results/ecovolta-v2-hero/`.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

In this host environment, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Open the configured base path on the Vite server. `package-lock.json` pins dependencies. No deployment or push was performed.

## Design and assets

The exact supplied Mux HLS URL supplies the animated forest/waterfall background. hls.js uses the requested 20/30-second buffers, 60 MiB buffer limit, no quality cap to player size, and selects the highest bitrate rendition after parsing the manifest. Native HLS is detected for Safari/iOS, with bounded network/media recovery. The local poster `public/video-poster.jpg` comes from the same Mux asset's thumbnail endpoint at time zero, width 1920. It contains only the background artwork, no page UI. It remains available while playback loads or is unavailable.

Google Fonts imports Instrument Serif regular/italic, Manrope 400/500/600, and Instrument Sans 400/500/600. The prompt also mentions SF Pro Display Medium, but its detailed headline specification explicitly uses Instrument Serif Regular/Italic; that detailed rule is used. No SF Pro font file or license was supplied; it is a secondary local fallback only. The headline SVG gradient contains the supplied color stops and exact transform, with a cropped gradient viewport mapped onto real DOM text. The logo is an original 23px SVG star with the requested blue/yellow gradient; its exact geometry was unspecified.

The optional reference `/home/opc/motionsites/assets/previews/ecovolta-v2-hero.webp` was absent. No reference extraction was necessary. No other designs were read.

## Verification

The real production build passed TypeScript and Vite. Vite reports a nonfatal bundle-size advisory because the full HLS library is included (about 258 kB gzip for the combined application bundle).

Browser checks use the image's existing Playwright Core and Chromium. With a preview server running inside a project-mounted container, run:

```sh
node scripts/check-browser.cjs
node scripts/check-recovery.cjs
```

The scripts require `/app/node_modules/playwright-core` and `/usr/bin/chromium` from the specified Docker image. Outputs:

- `screenshots/desktop.png`: 1440 × 1000.
- `screenshots/mobile.png`: 390 × 844.
- `screenshots/browser-checks.json`: geometry, fonts, highest HLS level, playback properties, hover/focus behavior, script errors, request failures, and navigation hash checks.
- `screenshots/recovery-check.json`: interrupted initial manifest request and recovery result.

Desktop and mobile have no document overflow, load all three font families, play the highest rendition at 1104 × 832 (requested and active HLS level 4), autoplay muted and inline, and show no script errors or failed asset requests in normal operation. Screenshots were visually inspected.

## Integration boundaries

This is the requested hero only. Navigation uses destination hashes; no destination pages were supplied. Get started and Login are styled, keyboard-focusable buttons without backend actions. Their visual states and clickability are checked; signup/authentication flows are not claimed. Native Safari/iOS playback detection is implemented, but only Chromium was available for a real browser run. Streaming and Google Fonts require network access. The static poster remains local. The result status `ready` means ready for management review, not deployed.
