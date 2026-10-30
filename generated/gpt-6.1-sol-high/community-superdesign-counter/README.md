# Counter

Design ID: `community-superdesign-counter`  
Page title: **Rolling Counter**

A working implementation of the React demo and reusable component in `PROMPT.md`. The counter starts at **1234.5**, adds **1.1 every two seconds**, and resets with the **Reset Counter** button. Framer Motion springs drive each digit through a mechanical rolling transition. The page preserves the supplied copy, white rounded card, gradient overlays, soft shadow, Lucide reset icon, and system sans-serif typography. Mobile sizing keeps the full demo within the viewport.

## Stack and source

React 18, TypeScript, Vite 6, Framer Motion 11, and Lucide React. Exact dependency versions are saved in `package-lock.json`.

- `src/Component.tsx`: reusable `RollingCounter`, with the supplied customization props.
- `src/App.tsx`: timer, reset action, and demo layout.
- `src/style.css`: supplied visual treatment and responsive adjustments.
- `public/favicon.svg`: local vector favicon.
- `dist/`: complete production output, including `dist/index.html`.

The supplied component was adjusted to render the decimal separately from the numeric component, keeping React hooks consistent when decimal places change. A small numeric tolerance prevents floating-point division from selecting the previous decimal digit. The counter has an accessible numeric label; the native reset button supports keyboard operation and a visible focus indicator.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

Without host Node, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
```

Open `http://localhost:4173/motionsites-results/community-superdesign-counter/`. The Vite base and generated assets use this required subpath. To serve the built files elsewhere, mount `dist/` at this path.

## Validation

The production build runs TypeScript checking before Vite bundling. Chromium checks run against `dist/` at the actual subpath using the existing image's Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Checks cover desktop **1440×1000** and mobile **390×844**, initial value, automatic increments, changing spring transforms, reset via click and Enter, visible keyboard focus, counter containment, horizontal overflow, browser errors, and failed resource requests. The desktop check also follows the transition to an integer and back to a decimal to verify automatic place detection.

Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`
- `build.log`

## Assets and limitations

No external image or font assets were specified in the original prompt. Fonts use the supplied system sans-serif approach, icons are bundled from Lucide, and animation is live DOM driven by Framer Motion. There are no remote asset requests.

The optional reference at `/home/opc/motionsites/assets/previews/community-superdesign-counter.webp` was absent. Visual implementation therefore follows the full supplied code and styling; a direct comparison with that preview was unavailable. No preview extraction or screenshot-based page reconstruction was used.

Vite reports ignored `use client` directives in the supplied dependencies; the build succeeds and browser checks verify the resulting client application. This is a positive-number demo as supplied; signed numbers and scientific notation are outside its scope. Screenshots capture a settled state, while browser checks validate motion separately. No deployment or push was performed.
