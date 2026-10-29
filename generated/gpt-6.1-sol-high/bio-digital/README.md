# Bio-Digital

Design ID: `bio-digital`. A single-screen NeuralKinetics landing page implemented from `PROMPT.md` with React 19, Vite 6, TypeScript, Tailwind CSS v4 through `@tailwindcss/vite`, Motion 12 (`motion/react`), and Lucide React.

The page uses the specified CloudFront background video, Google Fonts Inter and Outfit, custom capsule logo and adaptive-systems SVG, responsive pills, footer gradient, and specified entrance animations. All source, build artifacts, and verification outputs are inside this project.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/bio-digital/` on the local Vite server. The production output is `dist/`, including `dist/index.html`; Vite's base is `/motionsites-results/bio-digital/`. Serve that directory at the configured path. The dependency lockfile is included; `node_modules` is ignored.

The build used in this environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The real production build passed TypeScript checking and Vite bundling. Chromium checks serve `dist/` under the configured subpath, exercising 1440×1000 and 390×844 viewports:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

- No JavaScript errors, failed requests, HTTP errors, or page overflow in either viewport.
- Supplied video loaded at 3828×2164, autoplayed muted inline, and advanced in both viewports.
- Inter and Outfit loaded successfully from Google Fonts.
- Tag hover changes to black with white text; button clicks and keyboard focus were exercised.
- Screenshots were visually reviewed: [desktop](screenshots/desktop.png) and [mobile](screenshots/mobile.png).
- Detailed browser evidence: [browser-checks.json](screenshots/browser-checks.json).

## Scope and limitations

Menu, Adaptive Systems, and topic tags retain the prompt's specified button styling and hover/press feedback. No menu contents, navigation destinations, or filtering behavior were specified, so these controls do not navigate or open additional views.

Video and fonts use the exact external sources from the prompt and require network access. Both worked during verification; no asset failures were observed. Screenshot video frames naturally vary with playback time. No deployment or push was performed.
