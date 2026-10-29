# Cybersecurity Hero v2

Xero data encryption landing-page hero, implemented directly from `PROMPT.md`. Design ID: `cybersecurity-hero-v2`.

React 18 + TypeScript 5.5 + Vite 5.4 + Tailwind CSS 3.4, with `shaders/react`, `lucide-react`, and the required Supabase dependency. Uses Google Fonts Inter (300–800), inline SVG brand representations, and the specified live shader composition. No screenshot is used as page content.

The hero includes the radial light arc, masked grid, responsive icon pipeline, measured SVG beam with a 3.4-second requestAnimationFrame cycle, node illumination, and center splash. The mobile menu animates from the right; its toggle becomes an X. Escape closes menus and dialogs. Reduced-motion preferences disable the beam and hide the moving shader.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

The host has no Node installation. Equivalent isolated build from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Production output is `dist/`, including `dist/index.html`. Vite’s base is `/motionsites-results/cybersecurity-hero-v2/`; open the preview at that full path. All bundled assets and the favicon support it. This project has not been deployed or pushed.

## Browser verification

`scripts/browser-check.cjs` runs the built page in Chromium using the container’s existing Playwright installation. Start the preview, then run this script inside the same container:

```sh
node scripts/browser-check.cjs
```

The test checks the desktop heading, loaded Inter font, live shader canvas, moving SVG gradient, desktop navigation and account/CTA previews, mobile menu opening and closing, Escape behavior, reduced motion, and horizontal overflow at widths 320, 390, 768, 860, 1440, and 1920. It captures page errors and failed network requests. Results: `screenshots/browser-report.json`.

Screenshots: `screenshots/desktop.png` (1440×1000), `screenshots/mobile.png` (390×844), and `screenshots/mobile-menu.png`. Desktop and mobile images were also visually reviewed.

## Scope and limitations

The brief provides no account backend, pricing, documentation pages, or destination URLs. Navigation and account/CTA buttons open accessible local preview dialogs. They clearly indicate that the service is not connected; no credentials or data are collected. Supabase is installed as requested but no service connection is configured.

Google Fonts requires network access; it loaded during browser validation. Remaining assets are bundled or inline. WebGL is required for the live shader; reduced-motion mode supplies a static gradient. Software-rendered Chromium is slower than typical GPU rendering.

Vite warns that the shader-containing JavaScript bundle exceeds 500 kB (approximately 1.49 MB, 411 kB gzip). `dependency-audit.json` records npm’s two development-tool findings: one moderate esbuild issue and one high Vite issue with multiple advisories. The required Vite 5.4 version line is retained; the deliverable is its static production output. Do not expose the development server publicly.
