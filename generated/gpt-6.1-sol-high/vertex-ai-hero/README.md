# VertexAI Hero

A full-viewport React 19 + TypeScript + Vite implementation of the VertexAI hero in `PROMPT.md`. Project ID: `vertex-ai-hero`.

The supplied components, class names, CSS, SVG geometry, copy, fonts, video URL, responsive breakpoints, and hover effects are preserved. No overlay is added to the video. The page uses real DOM text and controls.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/vertex-ai-hero/` on the preview server. Vite's base is configured for this path; all generated local assets use it. The publishable output is `dist/`, including `dist/index.html`.

The host environment uses Docker for Node, npm, and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency lockfile is `package-lock.json`. `node_modules/` is excluded from version control.

## Browser verification

Run the reproducible checks against the built files:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

The script serves `dist/` under the required base path in a temporary container and uses the image's Playwright Core and Chromium. It checks desktop 1440 × 1000 and mobile 390 × 844, viewport dimensions, visible element bounds, overflow, font availability, autoplay, muted inline playback, advancing video time, wraparound looping, responsive navigation/footer, hover transforms, navigation hashes, button clicks, script errors, and asset responses.

Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`
- `screenshots/dependency-audit.json`

Screenshots capture the original video at three seconds for a consistent frame, after playback and looping checks. Pausing is confined to the screenshot script; the application video loops normally.

## Assets and limits

The original CloudFront MP4 and the exact Google Fonts import from the prompt are used directly. Both fonts and the 1920 × 1080, approximately 12-second video loaded during Chromium checks. No assets were extracted from a reference screenshot or substituted. Internet access to CloudFront and Google Fonts is required at runtime.

Chromium may cancel video range requests with `net::ERR_ABORTED` when navigating or seeking. The verification report records these separately as media cancellations; other request failures are treated as failures.

The prompt specifies a hero only: the Login, decoration, and footer buttons provide the supplied hover/click affordances, with no backend or additional screens. Navigation links retain the supplied fragment targets; no destination sections are specified. On mobile, the description wraps naturally beyond its four explicit source lines under the exact supplied CSS. Verification covers Chromium at the two requested sizes, not Safari or Firefox.

No deployment, push, external messages, or changes outside this project were performed. `ready` indicates readiness for management-session review, not publication.
