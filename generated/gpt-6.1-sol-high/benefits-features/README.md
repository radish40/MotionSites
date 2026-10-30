# Benefits Features

Design ID: `benefits-features`. A React implementation of the supplied Benefits section using Tailwind CSS, `motion/react`, and `lucide-react`. Copy, colors, responsive layout, icons, accordion transitions, viewport entrances, autoplay video, and the eased 0–86% counter follow `PROMPT.md`.

## Run and build

Requires Node 22/npm. Install with `npm ci`, run with `npm run dev`, and build with `npm run build`. The Vite base is `/motionsites-results/benefits-features/`. The static output is in `dist/`, including `dist/index.html`.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

The production build completed successfully. Vite reports harmless ignored `use client` directives from Motion's dependencies.

Browser verification uses Chromium and the image's existing Playwright installation against the built output under its configured subpath:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Checks cover desktop 1440×1000 and mobile 390×844; default Connections state; switching to Sport Pacakge; closing the previous panel; keyboard activation; loaded Inter font; actual video playback; counter completion at 86%; no horizontal document overflow; and no JavaScript exceptions. Screenshots are full-page captures made at those viewport sizes: `screenshots/desktop.png` and `screenshots/mobile.png`. Machine-readable evidence is in `screenshots/browser-checks.json`.

## Assets and limits

- The video uses the exact required CloudFront URL. It returned HTTP 200 and played in both tested viewports with no media error. It remains externally hosted.
- The inline image retains the exact required Cloudinary URL in source. That URL returns HTTP 401 (`cloud_name dsdhxhhqh is disabled`). Retrying the asset without its version component also returned 401. The supplied reference `/home/opc/motionsites/assets/previews/benefits-features.webp` does not exist, so reference extraction was unavailable. No other design was accessed.
- On image failure, a small abstract green CSS illustration occupies the requested inline dimensions. This is an approximation, not a recovered original asset. Its implementation is `.inline-fallback` in `src/styles.css`. Exact image fidelity cannot be verified until the original is restored. The failed request is recorded in browser evidence.
- Inter is imported from Google Fonts as requested and loaded in browser checks. Google Fonts, Cloudinary, and CloudFront require network access.
- The Join Now! button has the prescribed appearance, hover and keyboard focus states. The prompt supplies no destination or signup behavior, so no route, form, or backend was added.
- The exact specified font sizes and column widths naturally wrap the desktop heading onto three lines at 1440px; the mobile heading takes two lines. No original visual preview was available for comparison.

All work remains local to this project; no push or deployment was performed. `ready` in `result.json` means available for management-session review, with the image limitation above.
