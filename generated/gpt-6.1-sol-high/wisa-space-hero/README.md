# WISA Space

An original, runnable creative workspace concept. **This is not a faithful recreation of the unavailable original design.** Catalog ID: `wisa-space-hero`.

## Provenance and authorized interpretation

`TASK.md` and `PROMPT.md` were read in full. The original import contains only `Google AI Studio app – no prompt text`; the designated WISA Space preview does not exist. Management explicitly authorized an original concept based on the catalog brief: “WISA Space; Hero Section; concise modern layout, prominent brand and core feature entry points.” React + TypeScript + Vite and responsive styling were explicitly selected in that authorization.

`PROMPT.md` remains byte-identical. SHA-256: `206873a7aefe7375afc01f279b668e410ee101790275122cfc60efdf4004b824`.

Layout, copy, branding treatment, colors, typography, motion, native SVG planet illustration, and interactions are original interpretations. No other generated design or image was read or reused. There was no recoverable original asset to extract. The page also identifies itself as an original concept in its footer and About dialog.

## Implementation

- React 19, TypeScript 5.8, Vite 6; exact resolved dependencies in `package-lock.json`.
- Responsive hero with real DOM text, three feature entry points, native SVG illustration, CSS orbit motion, and reduced-motion support.
- A single local workspace with a name, auto-saved notes, idea cards, and inspiration entries. Items can be added and removed. Creating a space sets the name of this one workspace and retains existing contents.
- Native modal dialogs with Escape close, focus return, labeled forms, and keyboard navigation between tool tabs.
- No account, external AI, API, cloud sync, tracking, or external asset/font requests. Data is saved in this browser's localStorage. A storage failure displays a session-only persistence notice.
- System Arial/Helvetica and Georgia fonts, with generic fallbacks. No font downloads are required.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run dev
```

Visit the dev server at `/motionsites-results/wisa-space-hero/`. For the built site, run `npm run preview` and visit the same subpath. `dist/index.html` and its local assets are ready for static hosting at that path. Nothing has been deployed.

This host has no Node/npm; the actual build used the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

The dependencies directory is excluded and removed from the delivery; restore it with `npm ci`.

## Browser validation

A repeatable check serves the real `dist/` files at their configured subpath and drives the image's installed Chromium with Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/check-browser.cjs
```

Desktop **1440×1000** and mobile **390×844** checks passed: page render, space naming, notes surviving refresh, canvas and collection add/remove, persisted entries, all feature entry points, About dialog, Escape close, focus return, keyboard tab navigation, and no horizontal page overflow. Desktop section navigation also passed. No browser script/console errors, HTTP errors, or failed requests were observed. Screenshots use reduced motion for repeatability; normal browsing animates the planet and label.

Artifacts:

- `screenshots/desktop.png` — actual desktop full-page screenshot.
- `screenshots/mobile.png` — actual mobile full-page screenshot.
- `screenshots/desktop-workspace.png` and `screenshots/mobile-workspace.png` — interactive workspace screenshots.
- `screenshots/browser-report.json` — machine-readable browser check results.

Screenshots were visually inspected. Verification was performed in Chromium only; no claim is made about original visual fidelity, external services, cross-browser coverage, or a full accessibility audit. Clearing browser storage removes workspace data. The canvas is a local idea-card board, without drag-and-drop or remote collaboration.

## Delivery

`result.json` records `ready` for management review of this authorized concept interpretation. It does not indicate deployment or recovery of the original design. Source, lockfile, built static files, browser checks, and screenshots are all contained in this project.
