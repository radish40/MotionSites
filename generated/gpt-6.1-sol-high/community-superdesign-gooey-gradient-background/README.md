# Gooey Gradient Background

Design ID: `community-superdesign-gooey-gradient-background`.

A React 18 + TypeScript implementation of the supplied Bubbles design. The full-screen scene preserves the prompt’s five gradient layers, colors, blend modes, SVG goo filter, animation durations, Dongle typography, centered copy, and glass buttons. The gradient follows mouse and touch pointers with requestAnimationFrame smoothing. The reusable component accepts `children` and `className`.

Get Started reveals an exploration hint; Learn More opens an accessible native dialog with close, backdrop, and Escape dismissal. Keyboard focus is visible. Reduced-motion preferences stop the background animations. Pointer listeners and animation frames are cleaned up on unmount. Pointer easing uses elapsed time to preserve the reference’s 60fps feel when rendering runs at a lower frame rate.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

The Vite base is `/motionsites-results/community-superdesign-gooey-gradient-background/`. Build output is in `dist/`, including `dist/index.html`. Serve the output at that base path.

The available Docker environment can build without host Node:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible browser check serves the actual build under its configured base path, using Chromium and playwright-core supplied by the Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Checks cover desktop 1440×1000 and mobile 390×844, font loading, viewport overflow, live CSS animation, mouse/touch pointer tracking, both buttons, dialog dismissal, keyboard focus, reduced motion, browser errors, and failed resource responses. Evidence is saved to `screenshots/browser-checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`.

## Assets and limitations

Dongle Light (300) and Regular (400) are downloaded from Google Fonts and bundled in `public/fonts/` with their SIL Open Font License. The Google Fonts source CSS is retained for provenance. The page makes no runtime requests to external font or image services. All background visuals are CSS/SVG and real DOM; no screenshot is used as page content.

The optional reference WebP specified by TASK.md was absent. Visual fidelity was assessed against the complete reference code in PROMPT.md; comparison to that image was unavailable. No extracted assets or substitute imagery were needed. Animated colors naturally differ between screenshot capture times. Software-rendered headless Chromium can run the large blur/filter layers slowly, so pointer checks wait for smoothing to converge rather than assuming a fixed frame rate. Real device GPU performance has not been measured.

This project is built for review and has not been deployed or pushed.
