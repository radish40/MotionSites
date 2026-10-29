# USD Halo

Design ID: `halo-usd-landing`. A React + TypeScript + Vite + Tailwind CSS landing page using lucide-react, built from this project's TASK.md and PROMPT.md. The page includes the supplied logo path, video hero, two looping brand marquees, savings cards, backers, and Commerce use case. No other UI libraries are used.

The production output is `dist/`, with `dist/index.html` as its entry point. Vite's base is `/motionsites-results/halo-usd-landing/`. This is a static deliverable; it has not been deployed or pushed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the printed server URL with `/motionsites-results/halo-usd-landing/` appended. The dependency lockfile is included. Do not publish `node_modules`.

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

A real production build passed TypeScript checking and Vite compilation. Browser validation uses the image's `/app/node_modules/playwright-core` and `/usr/bin/chromium`; the test script starts a temporary HTTP server serving `dist/` under the configured subpath and shuts it down afterward:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

The script validates desktop 1440×1000 and mobile 390×844, video decoding and autoplay/mute/loop/inline properties, horizontal overflow, in-page CTA targets, all desktop navigation links, wallet dialog opening/closing/Escape, both marquee durations, and reduced-motion behavior. It also requires both TT Norms Pro font faces to load, checks their successful WOFF2 responses, and uses Chromium DevTools to confirm the actual custom fonts rendering the heading and body text. JavaScript errors, console errors, and HTTP error responses cause the check to fail. Evidence:

- `screenshots/desktop.png`: full-page capture at 1440×1000 viewport.
- `screenshots/mobile.png`: full-page capture at 390×844 viewport.
- `screenshots/browser-report.json`: actual browser check results.

Videos are frozen at one second only for reproducible screenshots, after playback has been verified. The live page plays them normally. Screenshots were visually reviewed.

## Assets and limitations

Both original CloudFront MP4s and the specified Higgs savings image downloaded successfully. They are stored locally in `public/assets/` and copied to `dist/assets/`, avoiding runtime external asset dependencies. The source URLs remain in PROMPT.md.

The font repair adds actual TT Norms Pro WOFF2 files to `public/fonts/`: Regular at weight 400 and the foundry’s DemiBold face at weight 600, saved as the prompt’s `tt-norms-pro-semibold.woff2`. Both were downloaded from [TypeType’s official TT Norms Pro page](https://typetype.org/fonts/tt-norms-pro/):

- [Regular source](https://typetype.org/wp-content/uploads/TT_Norms_Pro_Regular.woff2)
- [DemiBold source](https://typetype.org/wp-content/uploads/TT_Norms_Pro_DemiBold.woff2)

`public/fonts/provenance.json` records the sources, original styles, filenames, sizes, and SHA-256 hashes. The font binaries are unmodified. The original CSS requirements are retained: `@font-face`, weights 400/600, `font-display: swap`, primary font on html/body and inheritance on `*`. Source CSS uses the specified `/fonts/` paths; Vite resolves the public files and rewrites them under `/motionsites-results/halo-usd-landing/fonts/`. Vite copies both files to `dist/fonts/`.

Browser checks against the real `dist/` output confirm both font URLs return 200 with `font/woff2`, both faces have status `loaded`, and Chromium renders heading glyphs using `TTNormsPro-DmBd` and body glyphs using `TTNormsPro-Rg`. There are no same-origin 404s, console errors, or JavaScript errors. The hero paragraph retains the exact requested Inter/system font override.

`screenshots/live-check.json` is retained as the original pre-repair production failure report. It is historical evidence, not a check of the repaired build. Updated evidence is in `screenshots/browser-report.json` and the refreshed desktop/mobile screenshots. No deployment or remote changes were performed.

No wallet provider or application URL was supplied. “Open Wallet” opens a small accessible native dialog explaining that connection is unavailable in this preview. It does not simulate a financial connection. Other navigation and CTAs link to relevant existing sections; no external destination was invented. Reduced-motion preferences pause video playback and disable marquees.
