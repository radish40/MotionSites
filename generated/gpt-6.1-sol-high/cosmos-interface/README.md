# Cosmos Interface

Design ID: `cosmos-interface`. A static Cortex — Mind Amplified landing page implemented from the complete `PROMPT.md`. Built with React 19, Framer Motion 12.42.2, Tailwind CSS 3, and Vite. The index name remains Cosmos Interface; the visible brand and browser title remain Cortex as specified.

The page preserves the supplied copy, floating navigation, Inter Tight typography, gradient fallback, character/word blur reveals, scroll-driven hero video, and sticky three-stage interface video with opposing text motion. Both exact supplied MP4 files and the Google Fonts Inter Tight variable Latin font are stored locally. Asset origins are recorded in `asset-sources.json` and `public/assets/font-source.css`.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/cosmos-interface/`. The Vite base is `/motionsites-results/cosmos-interface/`; `dist/` contains the complete static deliverable, including `dist/index.html`. Mount its contents at that exact URL prefix.

On this host, use the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules/` is ignored and is not part of the deliverable.

## Verification

The repeatable browser check uses the image's installed Playwright Core and Chromium. It serves only this project's `dist/` at the required prefix, with HTTP range support for video seeking:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Checks cover desktop 1440×1000 and mobile 390×844: initial render, video decoding, font loading, Discover Cortex and all four navigation links, three interface text stages, changing video times while scrolling, browser errors, failed requests, and horizontal overflow. Screenshots are in `screenshots/desktop.png`, `screenshots/mobile.png`, and additional about/interface captures. Machine-readable evidence is `screenshots/browser-report.json`; build and audit evidence are `build.log` and `dependency-audit.json`. Chromium may cancel in-flight video range requests during seeks (`net::ERR_ABORTED`); these are recorded separately from actual failures.

## Implementation details and limitations

- The prompt's React 19 UMD CDN approach was converted to npm module imports and a production bundle. Tailwind is compiled at build time, with no Babel/CDN runtime dependency.
- The exact first video URL resolves successfully but actually depicts a white cartoon cat against a red background. The second shows a person amid blue abstract visuals. These are the supplied videos, retained without substitution; the hero asset's subject does not match the neural-interface copy. Both decode successfully in Chromium.
- Navigation targets missing from the supplied markup were connected to existing content: Cortex goes home, Discover Cortex goes to Neural Extension, Interface goes to the sticky sequence, Developer goes to Capabilities, and Support goes to its last row. Capability links enter the interface section. No extra product sections or backend were invented.
- Mobile hero spacing is adjusted so the heading, CTA, and Concept paragraph fit within the initial screen. Keyboard focus indicators and labels for animated text are provided. Smooth anchor scrolling respects reduced-motion preference; the prescribed scroll animations remain.
- The final Insight text stays visible at the end of the sequence to avoid an empty final screen.
- Videos total approximately 36 MiB; the prompt's preload behavior is retained. Scroll decoding performance can vary by device. Browser validation covers Chromium, not Safari or Firefox.
- Framer Motion emits benign ignored `use client` directive warnings during Vite bundling. The build completes successfully.
- No deployment, push, external messages, or other project changes were performed.
