# Acreage Farming

A complete responsive agricultural website built with React 19, Vite 7, and Tailwind CSS v4. The project implements the supplied Acreage Farming prompt, including twelve sections, the actual looping Pixabay MP4 in both video sections, Google Fonts typography, scroll reveals, animated statistics, responsive navigation, and service card hover effects.

## Build and run

The published base path is `/motionsites-results/acreage-farming-hero/`. All media is bundled under that path in `dist/assets/`.

With Node 22 available:

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/index.html` and its accompanying assets are the complete static deliverable. No deployment or push was performed. `package-lock.json` records dependencies; `node_modules` is ignored and is not a deliverable.

## Interactions

Navigation links scroll to the corresponding sections; mobile navigation collapses after selection. Services, portfolio projects, and blog articles open accessible dialogs with focus handling and Escape dismissal. All Services and View All open the corresponding complete lists. Get Started prepares a validated inquiry, then presents an explicit email link. There is no backend and no claim that data has been submitted. The January 2024 event is retained as specified; its registration dialog explains that it has concluded and offers an inquiry about future events. No messages are sent automatically.

## Verification

`browser-check.cjs` runs headless Chromium through the image's installed Playwright Core against the actual production build. It covers 1440×1000 desktop and 390×844 mobile, font and image loading, actual video playback in view, counted statistics, scrolled navigation, mobile menu, service and project details, articles, event messaging, inquiry preparation, horizontal overflow, and browser errors.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run build && (npm run preview -- --port 4173 > preview.log 2>&1 &); node browser-check.cjs'
```

Final verification: **31/31 checks passed**, with no JavaScript or console errors and no horizontal overflow. Results: `browser-results.json`. Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and additional full-page captures. The full-page captures are produced after scrolling through sections to trigger their real IntersectionObserver animations. The MP4 may be paused automatically while offscreen; playback is checked while each video is visible. Chromium can abort/restart media range requests during scroll; these are recorded separately from JavaScript and console errors.

## Assets and limits

The requested Pixabay MP4 was successfully downloaded and is served locally (approximately 16.4 MB). All requested Unsplash photographs except the Yield Analysis image were recovered and are served locally. `asset-report.json` lists the original URLs and download results. The About inset uses the specified photograph at 600px to also supply its blog use.

The Yield Analysis URL returns HTTP 404. Initial retries timed out; final retries without the query and with alternate standard image parameters also returned 404. The card uses the landscape photograph already specified for this design, with CSS object-fit cropping. `asset-recovery.json` records this substitution; `restore_yield.py` reproduces the recovery attempts and local fallback. The optional Acreage reference WebP does not exist in this environment; no reference screenshot or video was used as the webpage.

Playfair Display and DM Sans load from Google Fonts as required, and require network access. Local serif/sans-serif fallbacks are configured. The source-provided fourth blog image depicts capsules; it is retained to honor the explicit asset requirement. Portfolio locations, contact details, agricultural claims, and editorial text are demonstration content, not independently verified business information. The site has no live registration service or social account integration. These are limits of the static demonstration, not hidden successful submissions.

Reduced-motion preferences disable decorative CSS transitions and reveal motion. The required ambient video remains muted. Dialogs support keyboard focus trapping, keyboard dismissal, and return focus to their trigger.
