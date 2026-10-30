# Hyperspeed Background

Design ID: `community-superdesign-hyperspeed-background`.

A full-screen React and Three.js warp-speed simulation integrated from `PROMPT.md`. The interface retains the italic Hyperspeed title, system telemetry, translucent press-and-hold hint, six pill-shaped preset controls, Reply button, and circular restart/information controls. Framer Motion animates the overlay and Lucide supplies the icons. CSS reproduces the supplied utility styles with adjustments for narrow screens.

The original palettes and 2,000-line tunnel geometry are retained. All five distortion modes work. Preset options are memoized so speed-state changes do not recreate the renderer. Movement uses elapsed time, positions are recomputed without cumulative distortion drift, and old geometries, materials, renderers, animation frames, and input listeners are disposed on replacement.

## Run and build

Requires Node 22 and npm. Dependencies are pinned by `package-lock.json`.

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the URL under `/motionsites-results/community-superdesign-hyperspeed-background/`. Vite uses that exact base path. The publishable static output is `dist/`, including `dist/index.html`. No deployment was performed.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Interactions

- Hold the simulation with a mouse, pen, or finger to accelerate and widen the field of view. Release, cancel the gesture, or leave the window to slow down. Space also works while the simulation has focus.
- Select One through Six to switch colors and distortions.
- Restart regenerates the current simulation. Information opens the instructions.
- Reply opens a small local note form. Saving stores the note only in this browser's local storage; no message is transmitted. Escape or Close dismisses either dialog.

## Verification

The production build is checked with TypeScript and Vite. The browser script serves `dist/` at the required base path and uses Chromium through the image's installed `playwright-core`:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

Checks cover desktop 1440×1000 and mobile 390×844: changing rendered WebGL frames, six presets, press/release, keyboard acceleration, restart, information dialog, Escape, local reply saving, dialog closing, mobile touch cancellation, page errors, failed requests, and document overflow.

Evidence is saved in `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/browser-checks.json`.

## Assets and limits

The optional reference `/home/opc/motionsites/assets/previews/community-superdesign-hyperspeed-background.webp` was absent. The implementation follows the complete supplied source and styles; visual comparison with that image was unavailable. No assets were extracted or substituted. All tunnel visuals are rendered live with Three.js. Fonts use the supplied system sans-serif/monospace stacks; no remote font or image requests are needed.

The supplied component renders a stylized tunnel, rather than modeled road surfaces or vehicles; this integration preserves that design. Its road-related option fields and original palettes remain available, but only the parameters used by the tunnel affect its geometry. Rendering requires WebGL. Chromium validation uses software WebGL in Docker and does not establish a hardware-device 60 fps guarantee. The build reports a bundle-size advisory for the Three.js/React/motion bundle, which is approximately 236 kB gzipped. Mobile verification uses Chromium emulation, not a physical device.
