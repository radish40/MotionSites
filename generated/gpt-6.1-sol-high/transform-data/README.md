# Transform Data

Design ID: `transform-data`. A responsive, full-screen hero for Logoipsum, implemented from this project's complete `TASK.md` and `PROMPT.md`. Delivery status: **ready for review**, not deployed.

## Implementation

Vite 6.4.5, native JavaScript components, semantic HTML, and CSS. The prompt does not prescribe a framework. The page includes the specified copy, desktop typography and spacing, video background, navigation, announcement badge, and question composer. Mobile styles adapt the navigation and type sizes to a 390px screen.

`src/video.js` implements the custom video loop without CSS opacity transitions: 250ms requestAnimationFrame fades, cancellation of a previous fade, continuation from the current opacity, a fade-out guard at 0.55 seconds remaining, and a 100ms restart delay. The video is 115% of the viewport in both dimensions, horizontally centered and top anchored.

The composer supports a 3,000-character limit and counter, prompt selection, local file selection, Enter submission (Shift+Enter for a newline), and browser speech recognition where available. Features and mobile navigation open menus. Account, project, community, contact, and upgrade actions display explicit preview availability messages. There is no AI, authentication, billing, or upload backend; no selected file is transmitted. Microphone transcription depends on browser support and permission, and may use the browser's speech service.

## Build and run

All paths in the output target `/motionsites-results/transform-data/`. `dist/index.html` and its complete local assets are ready for static hosting at that path.

With Node 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For the reproducible browser check, using the image's existing Playwright and Chromium:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.cjs & node scripts/check.cjs'
```

The check server exists only inside the temporary container. It serves the built output at the required subpath and handles MP4 byte-range requests.

## Validation

- Production build passed; the dependency installation reported zero vulnerabilities.
- Chromium checks passed at desktop 1440×1000 and mobile 390×844.
- No JavaScript page errors, HTTP asset failures, or horizontal layout overflow.
- Verified video playback, 115% dimensions, intermediate fade opacity, full fade-out, restart near time zero, and return to full opacity.
- Verified empty submission feedback, input counting, 3,000-character limit, prompt selection, submission feedback, file selection, Features menu, Escape dismissal, login and upgrade dialogs, mobile menu, and unsupported-voice feedback.
- Visually inspected `screenshots/desktop.png` and `screenshots/mobile.png`. They show the genuine DOM page with the original video paused at three seconds for consistent capture; normal page playback remains enabled.
- Detailed measurements and video fade samples are in `screenshots/browser-checks.json`.

## Assets and limitations

The exact prompt video was downloaded successfully, unchanged, into `public/assets/transform-background.mp4` from:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4`

All requested weights (400, 500, 600, 700) of Fustat, Inter, Noto Sans, and Schibsted Grotesk were retrieved from Google Fonts and are served locally. `public/assets/fonts-source.css` preserves the source URLs; `fonts.css` references the sixteen downloaded TTF files. No external network requests are needed for normal page rendering.

The optional original reference `/home/opc/motionsites/assets/previews/transform-data.webp` was absent. No screenshot extraction or substitute background was used. The prompt refers to imported SVG paths but supplies no icon file; equivalent small SVG icons were authored in `src/icons.js`. The favicon is also authored locally. Exact icon-path and reference-frame comparison could not be performed.

Live microphone recognition was not exercised with physical hardware; its unsupported-browser branch was tested. Backend-dependent controls honestly describe their preview state. Autoplay restrictions in a user's browser may prevent background playback; the underlying neutral background remains visible.

All source, static output, assets, screenshots, and reports belong to this project only. No deployment or push was performed.
