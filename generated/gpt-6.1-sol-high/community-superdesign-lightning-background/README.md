# Lightning Background

Design ID: `community-superdesign-lightning-background`.

Fullscreen React 18 / TypeScript implementation of the supplied Lightning component and demo. The page displays “Lightning Discharge,” the exact atmospheric rendering subtitle, a Reply button that opens the specified `Reply Action` alert, and an inset rounded frame. The original GLSL noise, animation, prop defaults, and demo values (`hue=210`, `speed=0.8`, `intensity=1.2`, `size=0.9`) are preserved. Equivalent local CSS implements the prompt's utility styles, with a system sans-serif font and a visible keyboard focus ring. WebGL resources are released on component cleanup.

## Run and build

With Node 22/npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/community-superdesign-lightning-background/` on the local server. Vite is configured for that exact base path; the production output is `dist/`, including `dist/index.html`. No deployment was performed.

The host uses the provided Docker image for Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The included check serves the actual production build under the required subpath and uses the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Desktop 1440×1000 and mobile 390×844 checks cover WebGL context/error state, matching canvas dimensions, changing animation frames, visible content, document overflow, Reply click and keyboard activation, page errors, and failed requests. Evidence is saved in `screenshots/browser-checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`. Screenshots show individual moments of the live shader animation.

## Assets and limits

No external images or fonts are required by the supplied prompt. The optional design preview `/home/opc/motionsites/assets/previews/community-superdesign-lightning-background.webp` was absent; the supplied source is the visual reference. No assets were extracted or substituted. Rendering requires WebGL, as in the supplied component. Browser verification uses Chromium software WebGL (SwiftShader); physical GPU performance and other browser engines were not measured. The Reply alert intentionally matches the prompt and has no backend integration.
