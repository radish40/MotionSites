# Personal Showcase

Design ID: `personal-showcase`. Single viewport portfolio for **Marcus — Bennet**, implemented from this project's `PROMPT.md` with Vite, React, TypeScript, Tailwind CSS, and Lucide React (mobile X icon only).

The page includes the exact copy, cream palette, original background and portrait URLs, Helvetica Neue ME print-to-all stylesheet, responsive chrome, dual-span 30-second marquee, entrance animation timings, and mobile drawer. Drawer support includes focus containment, Escape/backdrop/link/close actions, and body scroll locking. Reduced motion collapses animation and transition durations and delays.

## Build and run

With Node 22/npm:

```sh
npm ci
npm run build
npm run dev
```

The Vite base is `/motionsites-results/personal-showcase/`. `dist/` is the complete static build, including `dist/index.html` and original-image fallback files. Serve the build at that prefix.

In the provided host environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules/` is excluded by `.gitignore` and is not a delivery artifact.

## Browser verification

The browser check serves the actual `dist/` build under the required prefix inside a temporary container and runs Chromium through the image's installed Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Evidence:

- `screenshots/desktop.png`: 1440 × 1000.
- `screenshots/mobile.png`: 390 × 844.
- `screenshots/mobile-menu.png`: open mobile drawer.
- `screenshots/checks.json`: measurements, interactions, image/font status, network responses, and console/script errors.
- `screenshots/browser-check.log`: successful final check output.
- `screenshots/dependency-audit.json`: dependency audit.

Checks cover the document title, loaded images and font, viewport/document dimensions with no overflow, desktop hover opacity, drawer open/close and body scroll restoration, Escape and backdrop dismissal, reduced motion, and original-image fallback loading when the remote hosts are deliberately blocked. Screenshots were visually inspected against this design's own reference for composition and portrait/text layering. A favicon request discovered during verification was removed using an empty data favicon. The final browser run is free of console and script errors. The final dependency audit reports zero vulnerabilities.

## Assets and limits

The primary image sources remain the exact URLs in `PROMPT.md`; `public/assets/background.webp` and `public/assets/portrait.png` are unmodified downloads from those same URLs, used only on image-loading failure. No substitute images, preview extractions, or screenshot-based page elements were used. The only reference inspected was `/home/opc/motionsites/assets/previews/personal-showcase.webp`.

The specified OnlineWebFonts stylesheet and its Helvetica Neue ME font loaded successfully in Chromium. The font is still externally hosted and needs network access; the specified Helvetica/Arial fallbacks apply if that host is unavailable. Font attribution: [Web Fonts / OnlineWebFonts](https://www.onlinewebfonts.com/fonts); its provided stylesheet identifies CC BY 4.0.

The marquee moves continuously, so screenshot text positions depend on capture time. Verification covers Chromium desktop and emulated mobile, not physical devices or other browser engines. Navigation and social links intentionally remain `href="#"` as requested. Nothing has been pushed or deployed; `ready` means ready for review.
