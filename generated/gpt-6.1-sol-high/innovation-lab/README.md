# Innovation Lab

Design ID: `innovation-lab`. A full-screen landing page for **VortxLab Creations**, built from `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS, Inter, and the ArrowRight icon from lucide-react.

The page includes the exact CloudFront background video, a custom four-quarter vortex SVG, octagonal controls, the supplied copy, responsive layout, and staggered entrance animations. Buttons have hover and keyboard-focus states. The brief defines no click destinations or actions; these remain presentation buttons without invented routes, dialogs, or social profiles.

## Run and build

With Node.js 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Development and preview use `/motionsites-results/innovation-lab/`. The production output is `dist/`, including `dist/index.html`. Vite uses the exact required base path; serve `dist/` at that path.

On the supplied host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`package-lock.json` pins the installed dependencies. Do not include `node_modules/` in a handoff.

## Browser validation

Run the reproducible check after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The check serves the actual production build at the required subpath in a temporary container and launches Chromium using the image's Playwright installation. It checks 1440×1000 desktop and 390×844 mobile layouts, document dimensions, responsive visibility, font loading, advancing autoplay video, hover behavior, button activation, keyboard focus, console errors, and failed requests.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-report.json`

Screenshots are captured after entrance animations, with the background temporarily paused at four seconds for reproducibility. The page itself continuously loops the video. Browser-cancelled media range requests during seeking or page closure are recorded separately from failed assets.

## Limits

The exact video and Google Fonts remain external runtime dependencies. Their availability is recorded in the browser report. The video is approximately 15.9 MB and is not bundled. No deployment or push was performed. `ready` in `result.json` means ready for review, not published.
