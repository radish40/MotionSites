# Orbit Engineers

Design ID: `orbit-engineers` · Brand: **WE ARE ORBIT ENGINEERS**

A single-page, three-scene space engineering consultancy landing page implemented from this project's `PROMPT.md`. React manages the active section; Tailwind CSS styles the responsive layouts; Framer Motion provides cinematic entrance/exit transitions; Lucide supplies ChevronDown and ArrowRight. The original three MP4s and Google Fonts Inter weights 300–700 are stored locally.

## Build and run

Requires Node 22 and npm, or the available Docker image. Run commands from this directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

The publishable static site is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/orbit-engineers/`; serve the output at that exact URL prefix.

For a local interactive preview:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run preview -- --port 4173'
```

Open `http://localhost:4173/motionsites-results/orbit-engineers/`.

## Interaction

- Scroll to explore opens the mission scene. Next and Begin Your Mission open the service scene.
- Back returns to the mission; Back to top and the brand button return to the introduction.
- Desktop Industries and Insights open the mission; Projects opens the service. These reuse the specified three sections because no additional destinations were provided.
- Reach Out uses `mailto:hello@orbit.engineers`. This fictional placeholder is not a verified business inbox; the email client's delivery behavior is outside this static site.
- Wheel scrolling does not switch scenes. Navigation controls work with keyboard focus and Enter. Reduced-motion preference shortens text transitions and disables bouncing.

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check'
```

The check runs headless Chromium through the image's existing `/app/node_modules/playwright-core`. It serves the production `dist/` under the required prefix using a temporary HTTP server with MP4 range support, then closes the server and browser.

Evidence:

- `screenshots/desktop.png` — 1440 × 1000 introduction.
- `screenshots/mobile.png` — 390 × 844 introduction.
- `screenshots/desktop-section-1.png`, `desktop-section-2.png`, `mobile-section-1.png`, `mobile-section-2.png` — remaining scenes.
- `screenshots/browser-report.json` — video readiness/playback/opacity, font loading, section transitions, primary navigation, keyboard activation, viewport bounds, and browser/request errors.
- `build.log` — successful production build. Framer Motion's upstream `use client` directives produce benign Vite warnings in this client-only application.

## Assets and implementation notes

The exact CloudFront video URLs and Google Fonts stylesheet are preserved in `PROMPT.md`; local copies are in `public/assets/`. No runtime external asset request is needed. All supplied videos and the Inter font downloaded successfully. The prompt did not provide logo, line, or dot image URLs, so small original SVG assets implement these decorations. No preview screenshot is used as a page asset.

Motion's transitive packages are pinned using npm overrides to the matching 12.23 series to avoid an incompatible later `motion-dom` export. All dependency versions are locked in `package-lock.json`; `node_modules` is excluded from submission.

This is a fictional consultancy presentation with no backend. Browser checks cover Chromium at the two requested viewports; they are not a claim of physical-device or all-browser testing. The three videos play simultaneously as specified and total approximately 23 MB. Playback remains subject to browser media policies. No deployment or push was performed.
