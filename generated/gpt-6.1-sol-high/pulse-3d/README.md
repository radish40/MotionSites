# Pulse 3D

Inner Circle is a single-screen, custom-gesture landing page built with Vite, React 19, TypeScript, Tailwind CSS v4, GSAP 3.15, and lucide-react. The required motion, @google/genai, express, and dotenv packages are installed. No persistence or credentials are needed.

Wheel and touch input drive one progress value from 0 to 3.5. A smoothed copy drives the two original video streams, staggered character exit, reveal tiles, rising rounded panel, and 32-line cylindrical manifesto. Navigation uses a cancellable 1200ms cubic animation. The background videos respond to pointer movement, and the partner marquee loops continuously. Native document scrolling is disabled.

## Run and build

With Node 22 available:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

The complete static output is in `dist/`. Vite's configured base is `/motionsites-results/pulse-3d/`; serve it under that path. The project has not been deployed or pushed.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/serve.cjs > /work/server.log 2>&1 & node scripts/browser-check.cjs'
```

The local validation server serves the actual production files, including MP4 byte ranges. Chromium uses the image's existing playwright-core installation. `screenshots/checks.json` records assertions and runtime/network failures. The checks cover desktop 1440×1000, mobile 390×844, original-video decoding, font loading, wheel and touch coefficients, navigation, cancellation, progress clamps, tile appearance and desktop hover, panel rise, video endpoint, mobile menu, document overflow, and script/request errors. Scrub endpoint checks wait for the animation to converge rather than assuming headless rendering maintains 60fps.

Required screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional screenshots cover tiles, manifesto, and mobile navigation. Screenshots were visually inspected against this project's reference; the page uses real DOM text and controls over the original videos.

## Assets and limits

- Both exact MP4 URLs specified in PROMPT.md returned HTTP 200 and are preserved locally as `public/assets/hero.mp4` and `drum.mp4`. Chromium decoded both at 1920×1080 (4.01s and 6.016s). No preview screenshot is used as a page background or extracted asset. Original URLs are retained in the component source and DOM metadata; `scripts/fetch-assets.py` provides their download procedure.
- Manrope weights 300–800 and Michroma 400 were downloaded from the specified Google Fonts stylesheet and self-hosted. The CSS uses the same font families and weights without requiring an external request at runtime.
- All five specified raw GitHub SVG URLs returned HTTP 404. The repository contents API also returned 404; its response is saved in `scripts/logo-recovery-response.txt`. Local SVG text wordmarks preserve the requested order and labels, but are visual approximations, not recovered original paths. Google and GitHub use inline SVG text wordmarks because the prompt references original path files without including them. Exact logo fidelity remains a limitation.
- The prompt asks to retain PROJECTS_DATA and EXPERTISE_DATA but does not supply their contents or source files. Both are retained as typed empty arrays, unused by the page; no extra content was invented.
- The original reference has a different aspect ratio from the required desktop/mobile captures. Videos retain the prescribed object-cover crop. Mobile manifesto lines retain the specified single-line drum geometry and clip within the screen.
- Validation uses Chromium in the supplied Linux image. Physical iOS/Safari devices were not tested. The fully obscured hero is hidden after the second panel reaches the top to avoid rendering its 64px blur unnecessarily; it reappears when reversing.

All implementation and deliverables are confined to this project. No agents, other designs, deployment, pushes, or external messages were used.
