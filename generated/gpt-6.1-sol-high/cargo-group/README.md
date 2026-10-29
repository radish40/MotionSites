# Cargo Group

Single-screen CARGOX GROUP logistics hero implemented from PROMPT.md. React 18, TypeScript, Vite, Tailwind CSS 3, Motion 12 (`motion/react`), and lucide-react. The production base is `/motionsites-results/cargo-group/`.

The supplied video gates content and entrance animations through `onCanPlay`. Includes the staggered headline and tagline, animated SVG routes and arrows, spring map markers and transport icons, hover treatments, custom SVG CTA, and mobile navigation with close button, selection close, and Escape support. Mobile spacing is adjusted to fit the complete design without scrolling.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
```

In the provided environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Publishable files are in `dist/`, including all media. Serve that directory at the configured base path. No deployment has been performed.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node check.cjs'
```

The checker uses the image's Chromium and playwright-core and a temporary HTTP server serving the actual production build at its base path. Checks desktop 1440×1000 and mobile 390×844: content remains absent while video delivery is held, video decoding/readiness, all five images, loaded Barlow Condensed font face, document dimensions, browser exceptions and failed requests. Exercises desktop navigation color, CTA rotation and icon hover, plus mobile menu opening, selection closing and Escape closing. Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-menu.png`; machine-readable evidence: `screenshots/checks.json`. The video is paused at two seconds for consistent screenshots only; the page normally autoplays and loops.

## Assets and limits

All six exact media URLs in PROMPT.md were successfully downloaded to `public/assets/` with their original contents. The required Google Fonts CSS import remains, with a local copy of the same Barlow Condensed 800 face to ensure reliable rendering. Some imported Unicode font faces remain unloaded because the local font supplies the text; validation checks the actually loaded face. Initial Python downloads stalled; curl retries succeeded for every asset.

Desktop navigation and Get in touch preserve the requested visual/hover behavior. The prompt provides no destinations, dropdown content, or contact details, so no additional pages, forms, or contact action were invented. Content deliberately waits for video readiness as specified; an undecodable video leaves the dark fallback. Browser validation used Chromium only.
