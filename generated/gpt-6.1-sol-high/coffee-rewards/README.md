# Coffee Rewards

Design ID: `coffee-rewards`. A warm, dark coffee profile for Dasha, implemented with vanilla HTML, CSS and JavaScript, bundled with Vite. The phone is 390×844 CSS pixels at 0.78 zoom, switching to 0.6 at viewport widths up to 440px. Includes the supplied looping video, product images, staggered entry animations and canvas/SDF-generated liquid glass displacement filters.

## Run and build

Requires Node 22.22+ and npm. Dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/coffee-rewards/`. `dist/` contains the complete static build, with all runtime assets served locally. Nothing was pushed or deployed.

On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

Real Chromium checks use the existing image's Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The script serves the built files temporarily on port 4173 inside the container. It checks desktop 1440×1000 and mobile 390×844, image decoding, video decoding and autoplay, phone dimensions, horizontal overflow, displacement filters, edit/save, achievements, shuffle feedback, close/reopen and reduced motion. Results are in `screenshots/checks.json`; review captures are `screenshots/desktop.png` and `screenshots/mobile.png`. Screenshots freeze the supplied video at one second for consistency. The normal page plays it continuously. Chromium reported no console/script errors or failed requests. The dependency install reported zero vulnerabilities.

## Assets and limitations

The exact video and four PNG product images from PROMPT.md downloaded successfully and are included locally. The video is an animated portrait; its original content is preserved. `scripts/make-poster.cjs` extracts its one-second frame for a local poster.

The project initially contained only TASK.md and PROMPT.md. The requested local laurel/trophy/shuffle PNGs and licensed Neue Haas Unica / Helvetica Now Display font files were absent. Attempts to retrieve the font CSS at the supplied image host returned 404. Decorative PNGs were recreated with canvas using `scripts/prepare-assets.cjs`; they are replacements, not the original assets. Both requested local font stylesheet paths exist with explanatory comments. Typography uses the specified system fallback stack; no unlicensed font files are bundled. Vite emits notices that those public font CSS URLs remain unchanged; both resolve successfully in the built site.

The profile actions are local UI interactions: edits last for the current page session; achievements opens the supplied totals; shuffle animates and explains that Latte remains the favorite, since no alternative drink dataset was specified. The 34px teaser has no invented content. No backend or persistence is included. SVG backdrop displacement is tested in Chromium; unsupported CSS falls back to the standard blur. Reduced-motion preferences disable entry animations and pause the video.

Ready means prepared for review, not deployed.
