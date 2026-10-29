# Modern Agency

Design ID: `modern-agency`. A three-section Axion Studio landing page built from this project's `PROMPT.md` using React 18, TypeScript, Vite, Tailwind CSS 3.4, `shaders/react`, and `lucide-react`. Uses the system font, exact supplied copy, shader parameters, partner SVG, two images, and two videos. No deployment or push was performed.

## Build and run

With Node 22/npm:

```bash
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/modern-agency/`. Vite's base is `/motionsites-results/modern-agency/`; `dist/` contains the complete static release, including media. `package-lock.json` preserves dependency versions.

This host uses the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

`browser-check.cjs` runs the production build through Chromium/Playwright at desktop 1440×1000 and mobile 390×844. It records script/console errors, failed requests, media decoding, shader readiness, horizontal overflow, contact and project dialogs, mobile menu opening/Escape dismissal, and the expanding project hover control. Video playback is checked while the cards are visible because Chromium pauses offscreen autoplay videos.

Reports: `browser-report.json`, `asset-report.json`, `build.log`, and `browser-check.log`. Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`.

To reproduce using Docker, first start the temporary preview:

```bash
docker run --rm -d --name modern-agency-preview -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
docker run --rm --network container:modern-agency-preview -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
docker stop modern-agency-preview
```

Chromium uses software WebGPU flags for the container. The actual shader stack is used; it is not a screenshot background. ChromaFlow is a pointer-driven effect per the package implementation. The shader reports ready at the correct 1440×1000 canvas size, but its orange response was not visually confirmed in headless software WebGPU: the capture remains nearly white after pointer movement. The exact requested component stack and parameters are present; hardware-accelerated browser review remains a limitation. `screenshots/shader-active.png` records this additional check. Browsers without WebGPU receive a CSS gradient fallback. See the package's [official React documentation](https://shaders.com/react).

## Assets and interaction scope

All four specified media URLs downloaded successfully and are served locally under `public/assets/`; source URLs and sizes are retained in `asset-report.json`. No external font is loaded. Initial Python downloads stalled; curl successfully retrieved the original files. The favicon is a small local AX SVG.

The prompt provides no booking service, journal page, case-study routes, or contact endpoint. To keep three sections, Journal points to the featured-work content, case-study controls open the supplied project video and description, and project/booking actions open a contact dialog. `hello@axion.studio` is an inferred mailto placeholder, not a verified or connected inbox; replace it before public launch. No messages were sent. The studio button links to the studio section. Partner certification text is reproduced as supplied, without claiming independent verification.

Vite reports a large bundle warning from the required shader library (approximately 2.8 MB JS before gzip). The build succeeds. Live clock uses Europe/London and updates every second. Reduced-motion CSS suppresses UI transitions; video and shader animation remain as requested. `ready` in `result.json` means ready for management review, not deployed.
