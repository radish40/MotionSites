# Vitara

A responsive healthcare AI landing page built with React, TypeScript, Tailwind CSS, Lucide React, and Vite. Design ID: `vitara-hero`.

The page uses the exact supplied CloudFront video, word-staggered Inria Serif headings, a care input with three prompt shortcuts, and the dark two-column care section. Navigation collapses on mobile, the action row scrolls horizontally, and motion respects the reduced-motion preference. Input submission shows a local coming-soon response. Login, sign-up, and navigation dialogs are frontend demonstrations; there is no authentication, clinical AI, or data storage backend.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

The production output is `dist/`, with `dist/index.html` as its entry. Vite uses `/motionsites-results/vitara-hero/` as the asset base. No deployment was performed.

## Assets

- The hero uses the exact CloudFront MP4 specified in `PROMPT.md`. The original file is also saved unchanged at `public/assets/vitara-hero.mp4` and used as a local fallback if the external video fails.
- Inria Serif 300, 400, and 700 is imported from Google Fonts in the HTML head. Matching original TTF files are bundled locally, with a second stylesheet, to preserve typography when Google Fonts is unavailable. `inria-serif-google.css` records the downloaded source CSS.
- No preview was available at the specified reference path. No screenshot extraction, substitute imagery, or generated imagery was used. The rendered page consists of real DOM, text, video, and controls.

## Verification

A real TypeScript check and Vite production build completed successfully. `scripts/serve.cjs` serves the built site at the required subpath. `scripts/check.cjs` uses the image's existing Playwright Core and Chromium to verify:

- Desktop 1440×1000 and mobile 390×844 layouts, with no horizontal document overflow.
- Original video loaded, decoded, and actively playing; fonts loaded.
- Desktop menu visible and mobile menu hidden.
- All three shortcuts, message submission, login form, sign-up dialog, and desktop service navigation.
- No page script errors or failed asset requests during the main checks.
- Local video and font fallbacks with external requests blocked, plus visible text with reduced motion enabled (`screenshots/fallback-checks.json`).

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/checks.json`. Screenshots capture the full page using the requested viewport sizes. Browser playback and network results describe this environment, not every browser or future availability of third-party hosts.

To repeat the checks, run the supplied HTTP server in Docker on port 4173, then execute `node scripts/check.cjs` in the same container. The script imports Playwright from `/app/node_modules/playwright-core`.

