# Futuristic Cinematic

Design ID: `futuristic-cinematic`. A single-viewport axentra hero implemented from `PROMPT.md` using React, TypeScript, Tailwind CSS, Lucide React, Vite, and `shaders/react` (locked to 2.5.135).

The background is a live GPU shader: StudioBackground, Spherize, Swirl, LensFlare, FloatingParticles, CursorRipples, and FilmGrain use the exact requested values and nesting. Explicit node IDs avoid invalid double-underscore GLSL identifiers generated from React 19 default IDs. Shader telemetry is disabled. There is no video or screenshot background.

The layout includes the liquid-glass desktop navigation, responsive typography, Google Fonts Inter, animated mobile Menu/X toggle, 50 ms menu item staggering, Escape dismissal with focus restoration, and link dismissal. Keyboard focus is visible and a closed mobile menu is inert.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/futuristic-cinematic/`. Vite's base matches the required publication path. `dist/` contains the complete static build, including `dist/index.html`. Serve it at that same prefix.

On this host, build using the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The check starts a temporary HTTP server inside the container and uses its installed Chromium and Playwright Core. It loads the actual production files at the required base path, checks desktop 1440×1000 and mobile 390×844, fonts, canvas size, page/console errors, request failures, overflow, CTA arrow hover, menu opening, Escape, and link dismissal. It compares rendered frames for live motion. Browser evidence is saved to `screenshots/checks.json`; screenshots are `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`.

## Limits

- The supplied prompt specifies no navigation destinations, waitlist service, or CTA click action. Navigation targets the existing hero; the two CTA labels are styled prototype buttons. No additional pages, form, or backend were invented.
- Inter is imported from the exact Google Fonts URL requested. It loaded successfully during verification; offline environments use the sans-serif fallback.
- Headless Chromium reports that WebGPU has no available adapter and automatically uses WebGL2. The live shader renders successfully through SwiftShader; software rendering is slower than hardware graphics. Modern GPU-capable browsers are required for the background.
- Vite reports a bundle size warning (approximately 1.61 MB minified / 445 KB gzip), largely from the shader/Three.js runtime. The build succeeds.
- Ready means available for local acceptance review. Nothing was pushed, deployed, or published.
