# Bloom

Design ID: `bl`. A native HTML, CSS, and JavaScript implementation of the complete design in `PROMPT.md`. The supplied copy, SVG marks, lavender accents, glass cards, serif typography, and 500vh scroll sequence are preserved. Three supplied videos are scrubbed through a double-buffered canvas, with cursor parallax, staggered feature cards, three mission statements, and a final email form.

All videos and fonts are bundled in `assets/`; runtime requires no external services. Asset origins and download results are in `asset-report.json`. The output uses relative resource URLs and supports `/motionsites-results/bl/`.

## Build and run

With Node 22:

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/bl/`. `dist/` contains the complete static deliverable, including `dist/index.html`. There are no npm dependencies; `package-lock.json` is retained.

On this host, use the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For a local preview from Docker, add `-p 127.0.0.1:4173:4173` and run `npm run preview` instead.

## Validation

The reproducible Chromium check uses the existing Playwright installation in the provided image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

It starts a temporary local HTTP server with byte-range video support, opens the actual built files at the required subpath, and checks 1440×1000 desktop and 390×844 mobile. It covers video decoding and the initial canvas frame, fonts, horizontal overflow throughout the sequence, CTA scrolling, three feature cards, all mission statements, navigation and contact deep links, email validation, successful submission state, and mobile menu opening, closing, and Escape dismissal. Both viewport checks passed, with no script errors, HTTP errors, or failed asset downloads. Expected video range cancellations during seeking/reload are recorded separately. Detailed results are saved in `browser-checks.json`.

Required screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`. Additional screenshots show the features, mission, contact success, and mobile menu.

## Implementation details and limits

Navigation links in the supplied source had no targets; they now address corresponding stages of the same scroll experience. The mobile menu stacking, close control, keyboard focus, and ARIA state are handled. Initial canvas rendering waits for decoded video data; actual video errors show the supplied error state. Intermediate desktop widths use flexible feature card columns to avoid overflow.

The email form reproduces the prompt's local success state. It does not store subscriptions or send email; no backend was supplied. The supplied success copy is preserved. The three videos total about 19 MB, so first load depends on connection speed. Video scrubbing and glass blur performance depend on the device. Browser validation uses desktop Chromium and a mobile viewport, not physical iOS or Android hardware.

Status `ready` means ready for management review. Nothing has been deployed or pushed.
