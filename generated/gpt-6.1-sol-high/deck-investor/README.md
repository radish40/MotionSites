# Investor Deck

Design ID: `deck-investor`. A five-slide Viktory investor presentation built with React, Tailwind CSS v4, `motion/react`, and hls.js. All slides and video elements remain mounted. Content animations replay on activation; transitions use opacity over a black background. All copy, metadata, statistics, and the 2017–2024 growth chart follow PROMPT.md.

## Run and build

Node 22 is available through the provided Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable files are in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/deck-investor/`. For local development, run `npm run dev` with Node/npm, then open that base path on Vite's port. Nothing has been pushed or deployed.

Use the five bottom dots, Right/Down/Space to advance, and Left/Up to go back. Navigation stops at the first and last slides. Mobile layouts adjust text widths and header metadata to keep all content on screen.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

This serves the actual production build at the required subpath inside the temporary container, using Chromium and the image's `playwright-core`. It records runtime errors, failed requests, all five dot interactions, keyboard navigation (including a focused dot), video persistence, playback state, and text/page overflow at 1440×1000 and 390×844.

Evidence: `screenshots/browser-check.json`, `screenshots/build.log`, required `screenshots/desktop.png` and `screenshots/mobile.png`, plus individual captures of all five slides at each size. Screenshots are real browser captures, never used as page backgrounds.

## Asset provenance and limits

- All five exact Mux HLS URLs from PROMPT.md are used, with Safari's native HLS fallback and automatic muted playback. Streaming requires network access; startup and buffering depend on the network and browser.
- Local poster JPEGs come from Mux's thumbnail endpoint for those same playback IDs at time=1 and width=1920. They contain only background artwork. `python3 scripts/fetch-posters.py` reproduces the downloads. Posters preserve the intended visual during initial buffering.
- No Aeonik font file or download URL was supplied. The CSS requests Aeonik with a sans-serif fallback. This environment uses the fallback; exact font metrics are unverified. A licensed Aeonik file is needed for exact typography.
- The prompt mentions imported SVG logo path data, but supplies no paths or asset URL. `src/assets/logo.svg` is a locally drawn white Viktory wordmark, sized 116×36. It is an approximation.
- The prompt mentions an imported chart PNG without providing it. `src/assets/chart-fill.png` is a locally generated transparent purple/pink gradient fill. `python3 scripts/generate-chart.py` regenerates it to follow the SVG growth curve. The line, markers, labels, and years remain live DOM/SVG.
- The optional original reference `/home/opc/motionsites/assets/previews/deck-investor.webp` was absent. Pixel matching to that reference could not be verified. No other designs were consulted.
- Vite reports non-fatal Motion "use client" directives and a large bundle warning. The build succeeds. HLS is bundled locally; videos themselves remain external streams.

`ready` in result.json means ready for review, not deployed. Exact font/logo/chart-source fidelity remains limited by the missing supplied assets.
