# Rocket Pricing

Design ID: `rocket-pricing`. A real React pricing section built directly from `PROMPT.md`. Includes both exact plans, responsive cards, staggered Framer Motion reveals, cursor-following masked spotlight borders, animated button text, and keyboard focus styling.

## Stack

React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, clsx and tailwind-merge. `cn()` is exported from `@/lib/utils`. Semantic HSL colors and the specified landing tokens are configured in Tailwind. The build base is `/motionsites-results/rocket-pricing/`.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

In the supplied environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static deliverable is `dist/`, including `dist/index.html`. Serve it at `/motionsites-results/rocket-pricing/`. No deployment was performed.

## Assets

Inter regular/medium and the Google Material Symbols Outlined check/close subset are bundled locally. The original Google Fonts CSS responses, including exact download URLs, are retained in `public/fonts/*-source.css`. No external font requests are needed at runtime. Font retrieval through Python stalled; downloading the same original assets with curl succeeded. No substitute fonts or extracted screenshot assets are used.

The project-specific reference `/home/opc/motionsites/assets/previews/rocket-pricing.webp` was visually inspected for composition. The page uses actual DOM text, links, CSS, and animation; the reference image is not included in the runtime.

## Validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

This serves the built files temporarily, checks Chromium at desktop 1440×1000 and mobile 390×844, verifies the two-column/stacked layouts, all ten features and included/excluded icons, local font loading, horizontal overflow, spotlight pointer updates/reset, button hover animation, keyboard focus, both signup links on both viewport sizes, script/console errors, and failed asset requests. It scrolls each card to exercise viewport reveals before capturing full-page screenshots.

Production build and browser checks passed with no script/console errors, failed requests, or horizontal overflow. Dependency audit reported zero vulnerabilities.

Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/checks.json`. Screenshots were also visually inspected. The mobile screenshot is full-page from a 390×844 browser viewport.

## Scope and limitations

Both links intentionally retain the required absolute `/auth?mode=signup` destination. Authentication is outside this pricing-only project. Browser checks intercept that destination to verify navigation; they do not claim an authentication service exists. Static screenshot artifacts show the completed animation state; use the running page to inspect motion. Validation uses container Chromium, not physical mobile devices or additional browser engines. No deployment, push, other design, or sub-agent work was performed.
