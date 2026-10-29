# LearnHub

LearnHub (`skills-lea`) implements the three-phone learning app showcase in `PROMPT.md`, using React 18, Vite, TypeScript, Tailwind CSS 3, lucide-react, and Space Grotesk weights 300–700.

The deliverable is `dist/`, including `dist/index.html`. Its public base is `/motionsites-results/skills-lea/`. All supplied videos, imagery, avatar, and Google Fonts files are bundled locally. Original URLs and download results are in `asset-manifest.json`.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/skills-lea/` on the local Vite server. Serve the complete `dist/` folder at that same subpath when hosting.

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The lockfile is included. `node_modules/` is excluded from delivery.

## Browser verification

The production build was checked using Chromium and the image's installed Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

This serves `dist/` temporarily inside the container, checks interactions and media, saves evidence, and shuts down.

All 28 checks pass. Coverage includes six autoplaying, decoded videos; image and font loading; phone arrangement; filters; search and empty results; calendar defaults, 42 cells, month navigation, and day selection; clipboard sharing; lesson preview; Home reset; and mobile forward/back navigation. No script errors, failed asset responses, or document horizontal overflow were found. Overflow checks also cover 768px and 1024px.

- `screenshots/desktop.png`: 1440 × 1000 viewport.
- `screenshots/mobile.png`: full-page capture from a 390 × 844 viewport.
- `browser-checks.json`: assertions and video playback evidence.
- `result.json`: delivery status.

Screenshots display poster frames captured at a fixed point from each video for consistent capture; normal browsing autoplays and loops them. Posters are frames from the supplied videos. To regenerate posters after building, run `node scripts/capture-posters.cjs` inside the container, then rebuild.

## Scope and limitations

This is a frontend showcase using local state, without backend persistence. Course arrows connect to the schedule; the lesson arrow opens its supplied video preview. Share copies the schedule URL; unsupported clipboard environments display the URL for manual copying.

The calendar preserves the prompt's unusual weekday label order. Its initial selection is August 16, 2024. Mobile phone screens scroll internally to reveal all content; the third phone's lesson card requires scrolling at the 650px phone height. The onboarding heading uses 36px on narrow screens to retain three lines, and 42px on desktop. Intermediate widths wrap phones to prevent horizontal overflow.

Original media quality is retained, making the static build approximately 68 MB. All assets downloaded successfully, with no remaining external runtime asset dependencies. Muted autoplay remains subject to browser policy. Ready means available for review; this project has not been pushed or deployed.
