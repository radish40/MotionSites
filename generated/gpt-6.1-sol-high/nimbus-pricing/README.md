# NimBus Pricing

Design ID: `nimbus-pricing`. A standalone Nimbus Grid pricing section implemented from this project's `PROMPT.md` using semantic HTML, CSS, JavaScript, and Vite `^5.4.2`. The page includes the five specified storage prices, three plan cards, responsive layouts at 820px and 520px, and twelve alternating gold bars with the specified scroll-driven wave calculation.

## Build and run

With Node and npm available:

```sh
npm ci
npm run build
npm run dev
```

In this environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The static deliverable is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/nimbus-pricing/`; serve the contents of `dist/` at that path. `npm run preview` provides a local preview at the same path. No deployment was performed.

## Verification

The real Vite production build succeeded using Node 22 in the supplied Docker image. Browser checks serve the built files under the required subpath and use the image's Chromium and `playwright-core`:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

Results are recorded in `browser-checks.json`. The checks cover desktop 1440×1000 and mobile 390×844, horizontal overflow, responsive columns, five pricing rows, three cards, twelve bars with six muted bars, changing scroll morph values, all three plan anchors, visible keyboard focus, JavaScript/console errors, and failed network requests. Screenshots were visually reviewed.

- `screenshots/desktop.png` and `screenshots/mobile.png`: full-page captures at the required viewport sizes.
- `screenshots/desktop-viewport.png` and `screenshots/mobile-viewport.png`: exact viewport captures.
- `screenshots/desktop-bars.png` and `screenshots/mobile-bars.png`: scrolled viewport captures showing the animated bars.

## Assets and scope

IBM Plex Sans and IBM Plex Mono use the exact Google Fonts families and 400/500 weight declarations, with both required preconnects. Font requests succeeded in Chromium; the fonts remain external runtime dependencies. All decorative visuals are CSS gradients and real DOM elements. The supplied project-specific WebP reference was visually inspected only; no screenshot or extracted image is used in the page.

The billing pill is the static span/strong presentation specified by the prompt. Plan links preserve the specified `#pricing` and `#plans` destinations; `id="plans"` is placed on the plan row so that destination resolves. No signup or sales backend was requested. Keyboard focus styling and a reduced-motion transition override are included.

The requested Vite 5 dependency range resolves to 5.4.21. Installation reports two development dependency audit findings (one moderate, one high in Vite/esbuild); the prescribed major version is retained. The deliverable is static HTML/CSS/JS and does not include a development server or `node_modules`.
