# Apex Program Accordion

Design ID: `apex-program-accordion`.

Complete implementation of the Course Curriculum section in `PROMPT.md`, using React 18, TypeScript, Vite, TailwindCSS with HSL tokens, Framer Motion, and the exact Inter and Material Symbols Outlined Google Fonts links. All module and lesson copy is preserved.

Module 1 starts expanded. Clicking a module opens it exclusively; clicking it again closes it. Includes height/opacity animation, rotating chevrons, staggered scroll reveals, and the globally tracked masked spotlight border. Reduced motion removes reveal translation and makes accordion transitions immediate. Native buttons provide keyboard operation, expanded state, labeled regions, and visible focus.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Preview at `http://localhost:4173/motionsites-results/apex-program-accordion/`. The Vite base is configured for this path. Publishable output is `dist/`, including `dist/index.html`.

On this host, use the existing Docker image from this project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The production build passed TypeScript and Vite. Chromium checked the actual `dist/` at the required subpath using the image's existing Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

- Desktop viewport: 1440 × 1000; mobile viewport: 390 × 844.
- Checked default state, all lesson counts, exclusive opening, close-all, Enter/Space operation, animated height, and chevron rotation.
- Checked overflow in every expanded state, spotlight pointer variables, and reduced motion.
- No browser console errors, page errors, or failed network requests in the final run.
- Both requested font families loaded successfully.
- `npm audit` found zero vulnerabilities; evidence: `dependency-audit.json`.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. These are full-page captures at the specified viewport sizes, after scrolling to reveal every row and returning to the top. Detailed evidence: `screenshots/browser-report.json`. Both screenshots were visually inspected.

## Limits and delivery

Google Fonts requires internet access; the links worked during verification. No image assets were requested. Browser coverage is Chromium at the two required viewports. This static section uses local interaction state. No deployment, push, external messages, agents, or other sessions were created. Ready means available for management-session review, not published.
