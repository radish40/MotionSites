# Stillmind

Design ID: `stillmind`. The page brand is **Lumora**, as specified in [PROMPT.md](PROMPT.md). This is a fullscreen cinematic mindfulness hero built with React, TypeScript, Tailwind CSS, Lucide React, and Vite.

The complete app is in `src/App.tsx`; all styling and animation are in `src/index.css`. It includes the four specified looping video backgrounds, animated transparent train overlay, liquid glass controls, scene crossfades with a one-second click cooldown, Deep Woods hero color transition, responsive navigation, and the email form. There are no additional pages or sections.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured base is `/motionsites-results/stillmind/`. Open that path on the dev/preview server. The deployable static output is `dist/`, including `dist/index.html`. Serve the directory at the configured subpath.

On this host, Node and Chromium are provided by the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

`package-lock.json` records dependencies. `node_modules/` is ignored and is not a deliverable.

## Browser verification

Run the actual built site with Chromium and Playwright supplied by the image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The check script starts a temporary HTTP server with byte-range media support, visits the configured subpath, and closes the browser and server when complete. It checks video decoding/playback, fonts and overlay, all four scene controls, crossfade cooldown, Deep Woods text color, form validation and confirmation, mobile navigation, keyboard focus and Escape, runtime errors, and layout overflow.

Primary screenshots:

- [Desktop, 1440 × 1000](screenshots/desktop.png)
- [Mobile, 390 × 844](screenshots/mobile.png)
- [Deep Woods](screenshots/deep-woods.png)
- [Mobile navigation](screenshots/mobile-menu.png)

Detailed results are in `screenshots/browser-report.json`; handoff metadata is in `result.json`.

## Assets and scope

All four exact MP4s and the exact PNG from the prompt were downloaded successfully and are included in `public/assets/` and the production build. Original asset URLs are preserved in `PROMPT.md`. The required Google Fonts links are in `index.html`; matching regular and italic Instrument Serif files are also bundled locally so the design can render without third-party font access. The downloaded Google font stylesheet is retained as provenance.

The videos total approximately 77 MB. They intentionally all autoplay and preload, matching the prompt; first loading time and resource use depend on the visitor's connection and device. Reduced-motion preferences disable the train bob and shorten interface transitions.

The email form validates an email and displays a local acknowledgement. It does not transmit, persist, or register email addresses; no signup backend was specified. Navigation links focus the relevant content within this single-screen layout, and Get Started focuses the email input. Nothing has been pushed or deployed. `ready` in `result.json` means ready for review only.
