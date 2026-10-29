# Animated Cards

Design ID: `animated-cards`. A React + TypeScript + Tailwind CSS v4 scene on a pure black canvas, built with Vite. Five animated bank cards continuously rotate through a 3D cylinder with layered thickness, front/back faces, blurred reverse videos, metallic chips, embedded brand vectors, and damped mouse parallax. There are no background text layers or extra controls.

## Source fidelity

`src/App.tsx` preserves the supplied implementation exactly, after removing accidental `439:`–`536:` line-number prefixes. The original prose calls the carousel horizontal, but its explicit code moves cards vertically and rotates around X; this implementation follows the required exact code. The supplied SVG spells “wavebank”; the original comment calls it JWT. Both the vector and comment are preserved. No `index.css` code block was provided, so the stylesheet supplies Tailwind v4, the referenced `xs` breakpoint, JetBrains Mono, and viewport defaults.

The original five active CloudFront MP4 URLs remain in the source. All played in the browser checks. JetBrains Mono weights 300, 400, and 500 are bundled locally with their OFL license, eliminating the font stylesheet dependency. No animation library is used.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run dev
```

Open `/motionsites-results/animated-cards/` on the printed Vite address. For the production build, use `npm run preview` and the same path. The complete static artifact is `dist/`, with `dist/index.html` and subpath-compatible asset URLs.

On this host, Node and Chromium are available through the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` locks dependency versions. `node_modules/` is ignored and is not part of the delivery.

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The script serves only the build under its expected subpath using a temporary HTTP server, launches Chromium through the image's existing Playwright installation, captures desktop 1440×1000 and mobile 390×844, records media playback and font loading, collects script/network errors, and checks viewport overflow. A separate controlled animation-frame check advances 3,291 frames to verify all five carousel steps, exact wrapping, finite transforms, cursor tilt, and return to center on mouse leave. This deterministic frame check verifies motion logic, not wall-clock performance.

Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`
- `screenshots/verification.log` (successful production build and initial full-cycle verification)
- `screenshots/browser-run.log` (final browser run)

## Limits

Video playback requires access to the original CloudFront URLs. Chromium may abort and restart media range requests as it buffers; the report retains those events separately from media errors. Actual frame rate depends on GPU, screen refresh rate, and decoding ten simultaneous video elements. A sustained 60 fps hardware benchmark was not performed. Touch devices receive the continuous animation; the supplied code defines cursor parallax, without adding drag or swipe controls. No deployment or publishing was performed.
