# NexaCore Process

A complete, responsive implementation of this project's `PROMPT.md`: React + TypeScript + Tailwind CSS v3, built with Vite. The page contains the specified `ServiceCard` and `TrustedSection` components, exact service copy, inline SVG icons, Mazzard H typography, original background and card assets, gradient heading, and bottom white fade. Card hover state uses React `useState<boolean>` and 500ms transitions. Keyboard focus and touch reveal the same card action; reduced-motion preferences shorten transitions.

## Build and run

The public base path is `/motionsites-results/nexacore-process/`. All publishable files are in `dist/`, including `dist/index.html`. No deployment was performed.

With Node 22/npm installed:

```bash
npm ci
npm run build
npm run preview
```

Open the preview server at `/motionsites-results/nexacore-process/`.

On this host, build using the provided Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` locks dependencies. `node_modules/` is excluded in `.gitignore`.

## Browser verification

Run the included verification script inside the supplied image, which provides Chromium and playwright-core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

The script starts a temporary HTTP server for the actual `dist/` output at the required subpath, checks it, and closes the server and browser. Verified in headless Chromium:

- Desktop 1440×1000: four columns; hover enter/leave, keyboard focus, Tab to the revealed action, and anchor click.
- Mobile 390×844: one column; touch reveal and anchor click.
- Tablet 768×1024: two columns; hover reveal and anchor click.
- All sizes: four service cards, both font weights loaded, no broken images, no horizontal overflow, no uncaught script errors, no HTTP errors, and no failed requests.
- TypeScript and production Vite build passed; npm installation reported zero vulnerabilities.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/desktop-hover.png`, and the machine-readable `screenshots/browser-report.json`. Screenshots capture the full page at the requested viewport widths and heights. Desktop, mobile, and hover captures were visually reviewed against this design's own reference.

## Assets and limits

All five supplied assets returned HTTP 200 and were saved unmodified in `public/assets/`: the background, card glow image, bullet SVG, and both Mazzard H WOFF2 fonts. `asset-report.json` records original URLs, response content types, and byte counts. The components use the local copies and Vite's configured base path; the font declarations retain the supplied remote fallback formats. No asset recovery, screenshot extraction, generated replacement art, or icon library was needed. The design reference was inspected only for comparison and is not part of the rendered page.

The “Learn more” links retain `href="#"` exactly as requested; the prompt supplies no destination pages. Validation covers Chromium, including mobile emulation, rather than physical devices or other browser engines. The implementation uses real DOM content and controls. `ready` in `result.json` means ready for review, not deployed.
