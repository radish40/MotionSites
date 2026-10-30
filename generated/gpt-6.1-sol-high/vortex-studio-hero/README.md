# AI Designer Portfolio

Design ID: `vortex-studio-hero`. A single-page creative studio portfolio for **Viktor Oddy**, implemented from this project's `PROMPT.md` with React, TypeScript, Vite, Tailwind CSS, and lucide-react.

Includes the narrow editorial hero, animated GIF marquee, quote and portrait parallax, pricing cards, infinite testimonial carousel, three animated project showcases, interactive cursor thumbnail trail, footer, and fixed contact pill. Scroll reveals use IntersectionObserver. The carousel advances every three seconds and pauses on hover or keyboard focus. Reduced motion settings stop the marquee and entrance animations.

## Build and run

Requires Node 22 and npm. Install and build with `npm ci && npm run build`. Run `npm run dev` for development or `npm run preview` to inspect the production output. The configured URL prefix is `/motionsites-results/vortex-studio-hero/`. Serve the contents of `dist/` at that path.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency lock is `package-lock.json`; dependencies are not included with the deliverable. `dist/index.html` and all runtime media/fonts are included. The eleven original GIFs total approximately 109 MB with the other assets; their animation and original quality have been retained.

## Browser validation

`scripts/browser-check.cjs` launches a temporary local HTTP server and Chromium through the existing container's Playwright installation. It checks the production build at 1440×1000 and 390×844: heading, custom fonts, marquee timing and movement, project anchor, portrait parallax, carousel buttons/autoplay/pause, desktop cursor trail and cleanup, image loading, CTA destinations, horizontal overflow, and browser errors.

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

All 30 checks passed with zero browser errors, failed requests, or horizontal overflow. Detailed results are saved in `browser-checks.json`. Full page screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional viewport captures are stored beside them.

## Asset provenance and limits

- All eight marquee GIFs and three project GIFs were downloaded unchanged from the exact motionsites.ai URLs in the prompt. The Higgs portrait was also downloaded from the specified URL. The page uses actual DOM content and controls; no reference screenshot was used as the page.
- Pexels avatars use photos 220453, 614810, 2379004, 415829, and 1681010. The partner CTA uses the requested photo 415829. Specific testimonial avatar photo IDs were not supplied.
- Both supplied Webflow font URLs returned HTTP 403, including an alternate Webflow hostname. The exact Neue Montreal Book and Medium fonts were recovered as WOFF2 from `https://cdn.b3.fun/fonts/ppneuemontreal-book-webfont.woff2` and `https://cdn.b3.fun/fonts/ppneuemontreal-medium-webfont.woff2`. Local copies load first; the original Webflow URLs remain as secondary font sources.
- No local Mondwest file was supplied, and the obvious motionsites.ai font paths returned 404. The original font was recovered from the foundry: `https://pangrampangram.com/cdn/shop/files/PPMondwest-Regular.woff?v=7568021129578465612`. Despite the `.woff` suffix, the source has a WOFF2 signature; its bytes are preserved unchanged in `public/PPMondwest-Regular.woff2`. `scripts/recover-mondwest.cjs` records the recovery method. `font-recovery.json` and `asset-report.json` record sources and download outcomes.
- The optional reference `/home/opc/motionsites/assets/previews/vortex-studio-hero.webp` was absent. Visual validation therefore follows the written layout requirements rather than a direct screenshot comparison.
- Contact buttons retain the prompt's exact external booking destination. Footer social links point to the named platforms because profile URLs were not supplied. External booking/social pages were not navigated or tested.
- This is a static portfolio. No deployment, push, external messaging, or other project work was performed. `ready` means prepared for review, not published.
