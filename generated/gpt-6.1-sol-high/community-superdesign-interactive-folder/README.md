# Interactive Folder

Design ID: `community-superdesign-interactive-folder`.

React showcase built from `PROMPT.md`: a large purple RESOURCES folder, pink ARTSETS, cyan TUNES, charcoal MAILS, and the supplied footer copy. Click or tap to reveal spring-animated paper cards; hover over exposed cards to drift and enlarge them. Each folder has independent state.

## Implementation

React 18, TypeScript, Framer Motion 11, Lucide React, Tailwind CSS 3, and Vite 8. The requested clsx and tailwind-merge dependencies are included. Icons are bundled SVGs; the system sans-serif font stack requires no download. Folder geometry, colors, shadows, transforms, and springs follow the supplied code.

`src/Component.tsx` exports `InteractiveFolder` with `color` (default `#5227FF`), `size` (default `1`), `label`, `items` (maximum three visible nodes, with placeholder lines for missing items), and `className` props.

Integration fixes: labels render above both clipped flap halves so the full text is visible. Below 640px the hero scales down with extra top clearance, and variations wrap. Enter/Space toggle focused controls; aria-expanded reports state. Reduced-motion preference disables springs and drift. Paper scale resets on hover leave.

## Build and run

With Node 22.12+:

```sh
npm ci
npm run build
npm run dev
```

On this host, from the project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Publishable output is `dist/index.html` and `dist/assets/`. Vite base is `/motionsites-results/community-superdesign-interactive-folder/`; open that path on the development server. Dependencies are locked in `package-lock.json`. No deployment was performed.

## Verification

The production build passed TypeScript checking and Vite bundling. `build.log` records it, including non-fatal Framer Motion use client directive warnings in this client-only app.

`verify.mjs` serves the actual dist output under the required subpath and runs the image's existing Playwright/Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node verify.mjs > browser-checks.json'
```

Checks passed at desktop 1440×1000 and mobile 390×844: four controls, every folder opens/closes, no horizontal overflow, opened paper bounds inside the viewport, hover transform change and reset, Enter/Space activation, and no JavaScript, console, or HTTP errors. See `browser-checks.json`. `dependency-audit.json` records zero reported vulnerabilities.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-open.png`
- `screenshots/mobile-open.png`

Desktop closed and mobile opened captures were visually reviewed after fixes.

## Assets and limitations

The optional reference `/home/opc/motionsites/assets/previews/community-superdesign-interactive-folder.webp` was absent. Fidelity was assessed against the complete supplied prompt and source. No assets were extracted, substituted, or remotely loaded. Real DOM, SVGs, CSS shapes, and Framer Motion render the interface; screenshots are verification artifacts only.

Verification used Chromium desktop and mobile viewport/touch emulation. Physical devices and other engines were not tested. Ready means ready for review, not deployed.
