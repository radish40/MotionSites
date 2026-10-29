# LaunchEx Submissions

A React + Tailwind CSS implementation of the single Submissions section in `PROMPT.md`. Project ID: `launchex-submissions`.

The page uses the exact six category titles/subtitles, responsive column order, SVG chamfered borders, specified spacing/colors, inline autoplay video, and bottom gradient. Cards retain the requested `href="#"` placeholder and hover lift. No UI libraries, additional sections, or submission flows are added.

## Build and run

Requires Node 22 and npm, or the existing Docker image on this host. From this project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/launchex-submissions/`; mount `dist/` at that path.

For local preview:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
```

Open `http://localhost:4173/motionsites-results/launchex-submissions/`.

With Node/npm available directly, use `npm ci`, `npm run build`, and `npm run preview`.

## Verification

A real Vite production build succeeded. Chromium/Playwright checks ran against the built output at its configured subpath:

- Desktop 1440×1000 and mobile 390×844.
- Additional tablet 768×1000 and desktop breakpoint 1024×1000.
- Correct responsive ordering, six anchors and SVG polygons, expected video dimensions, loaded Inter fonts, and no horizontal overflow or content outside viewport bounds.
- Video advances while autoplaying, muted, looped, inline, with no controls; original CloudFront video worked in all four viewports.
- Desktop hover lifts by 2px; keyboard focus and Enter work; mobile category tap works.
- Local fallback video playback succeeds when the CloudFront request is deliberately blocked.
- No JavaScript errors, console errors, or unexpected failed network requests in normal browsing. Chromium's canceled MP4 range requests during seeking/page closure are recorded separately as `mediaAborts`.
- Dependency installation audit: zero known vulnerabilities.

Run the browser checks again with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

The test script uses `/app/node_modules/playwright-core` and `/usr/bin/chromium` from that image. It starts and stops its own preview server. Set `PLAYWRIGHT_PATH` if using another installed Playwright module.

Screenshots were visually inspected:

- `screenshots/desktop.png`: exact 1440×1000 viewport.
- `screenshots/mobile.png`: exact 390×844 viewport.
- `screenshots/mobile-full.png`: full mobile section, showing all six cards.
- `screenshots/browser-report.json`: recorded assertions, geometry, media state, and network observations.

For deterministic screenshots only, the test pauses the video at one second after verifying active playback; the page itself autoplays normally.

## Assets and limitations

The exact specified CloudFront video URL is the primary source. An unchanged downloaded copy in `public/assets/submissions.mp4` supplies an error fallback and is included in `dist/`.

Inter regular and semibold are bundled locally, with source URLs and the SIL Open Font License in `public/assets/`. TT Firs Neue was not supplied and no font URL was specified; `.font-firs` preserves the required font-family stack and renders using Inter. This is the only known typography limitation.

The mobile section naturally scrolls to display all categories. Category links intentionally use the exact placeholder destinations from the prompt. No deployment or push was performed. `ready` in `result.json` means ready for management-session review.
