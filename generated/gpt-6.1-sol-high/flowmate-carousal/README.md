# FlowMate Carousal

Single-section carousel implemented from `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide React. The project index name is **FlowMate Carousal**; the visible brand is **FlowMate**.

Three consecutive cards cycle through the exact five supplied items. Previous/next buttons wrap in both directions; automatic advance runs every four seconds. Cards use the specified directional slide, opacity, scale, hover zoom, gradient, typography, and one-time staggered scroll reveal. At 768px and above the cards have three columns; below that they stack. Every card remains 500px tall. Horizontal animation movement is clipped at the section boundary to prevent page overflow.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the dev or preview server at `/motionsites-results/flowmate-carousal/`. Vite's base is set to that exact path, and `dist/` contains the complete static build, including all five images. `package-lock.json` locks dependencies; `node_modules/` is generated and ignored.

On this host, Node and Chromium are provided by the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

The check script serves `dist/` on a temporary loopback HTTP server and checks Chromium at **1440×1000** and **390×844**. It verifies initial card order, both buttons, wrapping in both directions, keyboard activation, four-second auto-advance, desktop hover zoom, all five decoded assets, 500px card heights, column/stack geometry, and horizontal overflow, including during slide animation. It also fails on browser script/console errors and failed HTTP requests. Detailed results are saved in `browser-checks.json`.

Screenshots:

- `screenshots/desktop.png`: desktop viewport.
- `screenshots/mobile.png`: mobile viewport.
- `screenshots/mobile-full.png`: full mobile section, including all three stacked cards.

## Assets and limits

The exact five WebP assets from the prompt are stored in `public/images/`; `asset-manifest.json` records their source URLs and byte sizes. Initial Python requests to the image proxy stalled and returned HTTP 403; retrying with curl successfully downloaded every supplied WebP. The original CloudFront images were temporarily verified during recovery and are not included in the final build. The delivered page has no external image or font requests; it uses the exact requested system font stack.

Validation covers Chromium at the two requested sizes. Cards have no destinations because the prompt supplies none. Auto-advance continues on the specified interval. No deployment or push was performed. `ready` in `result.json` means ready for management-session acceptance, not published.
