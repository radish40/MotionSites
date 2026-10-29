# Nimbus Security

Design ID: `nimbus-security`. Static responsive security section built from the complete local `PROMPT.md`, using HTML, CSS, minimal JavaScript, and Vite `^5.4.2` (locked to 5.4.21).

The exact supplied heading, descriptions, terminal/API panels, compliance badges, binary pattern, and capacity table use real DOM and CSS. IBM Plex Sans and IBM Plex Mono, weights 400 and 500, come from Google Fonts with both required preconnects. No bitmap assets are required. This design's reference WebP was inspected for composition only; no reference pixels are used. The prompt specifies no animation or interactive controls.

## Build and run

With Node/npm:

```sh
npm ci
npm run build
npm run dev
```

In this environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/` is the completed static build. Serve its contents at `/motionsites-results/nimbus-security/`. Vite rewrites bundled assets to that prefix. Local preview:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run preview'
```

Open `http://localhost:4173/motionsites-results/nimbus-security/`.

## Validation

The real production build passed. Chromium loaded `dist/` over HTTP under the required publication prefix. Checks passed at 1440×1000, 390×844, 820×1000, and 821×1000:

- Three desktop columns and stacked cards at/below 820px.
- No horizontal page overflow.
- All three cards present and reachable by scrolling.
- IBM Plex Sans and Mono loaded successfully.
- No JavaScript errors, console errors, or failed asset requests on the final run.
- Zero interactive controls, as specified; no control interactions apply.

Both screenshots were visually inspected. An initial missing favicon request was resolved using an empty inline favicon before the final checks.

Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/browser-checks.json`. Reproduce after building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

## Limits

Google Fonts requires internet access; system fallbacks are configured. No font or visual asset recovery was necessary. Validation used Chromium, not Safari or Firefox. The supplied breakpoint keeps three columns at 821px; that dense presentation is preserved.

`dependency-audit.json` records one moderate and one high development-tool dependency finding in esbuild/Vite. The requested Vite 5 range is retained; npm's suggested fix changes the major version. These packages are not production runtime dependencies in `dist/`. `node_modules/` is excluded by `.gitignore`; the dependency lockfile is retained.

Status `ready` means ready for review. Nothing was deployed or pushed.
