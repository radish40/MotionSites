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

## Asset limitation

The exact hero MP4 returns HTTP 403. Recovery attempts used its original URL, a query variation, browser headers/Referer and the HTTP redirect; none recovered it. The project's optional reference WebP is absent, so no reference extraction was possible. The hero therefore reuses the **supplied launch-pad MP4** from the lower section, preserving real autoplay video with no overlay/gradient. The original hero footage and composition remain unverified; restoring it requires obtaining that source file and changing the hero's `name` in `src/Index.tsx`. This is a documented visual approximation, not an exact asset match.

Both lower-section MP4s are the exact requested files, downloaded locally. Google Fonts loaded successfully and an identical local copy of weights 400–700 is included for resilience. Full provenance is in `public/assets/sources.json`. The prompt does not supply the two science paragraphs; original supporting prose was written under the specified headings. All layout, type, controls and text are real DOM; no page screenshot is used as site content.
