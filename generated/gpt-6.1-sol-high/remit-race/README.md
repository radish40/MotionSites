# Remit Race

Design ID: `remit-race`. Page title: **NovaPay - One Globe, One Future**.

This project implements the native HTML, CSS and JavaScript supplied in `PROMPT.md`: three dark NovaPay phone panels, purple typography, a looping globe video, a globe replacing the letter O, glass cards with procedural SVG smoke, and the animated three-card carousel. The original text, dimensions, mobile wrapping rules and animation timing are preserved. All supplied media and fonts are bundled in `assets/`; their source URLs are recorded in its JSON manifests. No runtime external requests are needed.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run build
npm start
```

Open `http://localhost:4173/motionsites-results/remit-race/`. The dependency-free build copies the runnable page and assets to `dist/`. Relative resource URLs support the required `/motionsites-results/remit-race/` publishing path. No Vite or framework is used because the prompt specifies a complete native page.

On the provided host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --ignore-scripts --no-audit --no-fund && npm run build'
```

For local viewing with Docker, run the image with `-p 4173:4173` and the command `npm start`.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check uses the image's existing Playwright Core and Chromium, starts a temporary local HTTP server, and tests the actual `dist/` output at its required subpath. It verifies desktop 1440×1000 and mobile 390×844, all three panels, horizontal overflow, font and image loading, muted video playback, next/previous animation, both wrap directions, keyboard activation, and the rapid-click animation guard. It records browser exceptions, console errors, HTTP errors and request failures.

Artifacts:

- `screenshots/desktop.png`: desktop full-page capture.
- `screenshots/mobile.png`: full-page capture from the 390×844 viewport, showing all vertically wrapped panels.
- `screenshots/checks.json`: browser results and measured layout/media state.
- `result.json`: delivery manifest.

Chromium can cancel an initial MP4 fetch while selecting a byte range. These `net::ERR_ABORTED` events are retained separately as `mediaRequestCancellations`; successful decoded playback is asserted independently. The local server supports byte-range responses.

## Scope and limitations

This is the exact supplied visual showcase. The navigation labels and close symbol are presentational in the prompt; only carousel arrows have scripted behavior. The countdown is the supplied static text. The first card's sentence ends at “of” as in the source. No account creation, payments, live race data or additional flows were added. Phone frames intentionally clip their internal compositions; the page has no horizontal overflow at either required viewport.

All requested assets downloaded successfully and were loaded in Chromium. The bundled video is approximately 25 MiB. `ready` means ready for review, not deployed. No deployment or push was performed.
