# Learnly

Single-page “Learnly - Professional Learning Platform” built with Vite, React, TypeScript, and Tailwind. All seven files supplied in PROMPT.md are preserved verbatim. Added configuration supports TypeScript, linting, the required Vite base, and an external Learnly favicon. No Framer Motion, inline SVG, or icon library is used. Supabase and lucide-react remain in the required manifest but are not imported. No persistence is needed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev -- --host 0.0.0.0
npm run build
npm run typecheck
npm run lint
npm run preview -- --host 0.0.0.0
```

Open `/motionsites-results/learnly/` on the local server. Vite uses this base for built assets. The static deliverable is `dist/`, including `dist/index.html`. No deployment was performed. The lockfile is included; node_modules is ignored and must be excluded when transferring the source.

The host has no Node. The actual successful build command was:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build && npm run typecheck && npm run lint'
```

## Browser verification

The real production build was served under its publication path and checked using Chromium and playwright-core from the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

- Desktop viewport: 1440 × 1000. Mobile viewport: 390 × 844.
- Full-page captures: `screenshots/desktop.png` and `screenshots/mobile.png`. The mobile capture includes content below the viewport. Both were visually reviewed.
- Passed card accordion expansion and content visibility, search input and Up button hover/click, and trial button hover.
- Passed mobile menu open/close, scroll locking/restoration, dismissal on desktop resize, and horizontal carousel scrolling with 300px cards.
- No horizontal document overflow, JavaScript errors, console errors, or failed network requests.
- The three exact remote Pexels images, Google Fonts CSS, and Outfit font returned HTTP 200. Images decoded and Outfit loaded. All remain remote; no remote assets were downloaded into the project.

Evidence: `screenshots/browser-checks.json`.

## Limitations

The supplied account, navigation, and trial links use `href="#"`. The supplied search button has no search handler. These prompt behaviors are preserved without adding destinations, authentication, or other features. External image/font availability is required.

The exact required dependency manifest yielded two npm audit findings: high-severity Vite and moderate-severity transitive esbuild. Details are in `screenshots/dependency-audit.json`. The audit exits 1 due to these findings; build, typecheck, lint, and browser checks passed.

`result.json` marks this local deliverable ready for management-session review, not deployed.
