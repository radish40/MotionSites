# 3D Collectible Hero

Design ID: `3d-collectible-hero`. A single full-viewport TOONHUB figurine carousel, implemented from this project's `PROMPT.md` with React, TypeScript, Vite, Tailwind CSS and lucide-react.

The four original image URLs, paired colors, Google Fonts head links, exact copy, grain overlay, responsive positions and 650 ms carousel behavior are preserved. The images preload on mount. Navigation wraps in both directions and ignores repeated clicks during animation. Buttons support native keyboard activation and visible focus.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/3d-collectible-hero/`. Development: `npm run dev` (port 5173, same path).

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The actual production build has passed TypeScript checking and Vite compilation. `dist/index.html` and its compiled assets are ready for the configured `/motionsites-results/3d-collectible-hero/` path. The dependency lockfile is included; node_modules is excluded from delivery. npm's audit reported zero vulnerabilities after updating Vite and PostCSS within their existing major versions.

## Browser validation

Run the included checks against the built static files using Chromium and playwright-core in the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The script serves `dist/` at its real subpath inside the temporary container and closes the browser and server afterward. Results are saved in `screenshots/browser-checks.json`.

Verified:

- Desktop 1440×1000 and mobile 390×844: full viewport, no horizontal or vertical page overflow, expected responsive text and figurine sizing.
- All four original PNGs loaded at 2160×2880; Anton and Inter loaded successfully.
- Both arrow directions, all four carousel states, wrapping, animation lock and background transition.
- Keyboard Enter and Space navigation, mobile-sized controls, Discover link hover and destination.
- No JavaScript exceptions, console errors, failed network requests or HTTP errors.
- Visually reviewed `screenshots/desktop.png` and `screenshots/mobile.png`.

## Notes and limits

The prompt specifies no destination for “DISCOVER IT”; it opens the active figurine's original artwork in a new tab. Images and fonts retain the required external URLs and require network access. No external asset failures occurred during validation. Browser validation used Chromium; other browser engines were not tested. This project has not been deployed or pushed.
