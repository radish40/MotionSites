# Wealth Video Hero

Design ID: `wealth-video-hero`. A React and Tailwind CSS hero for **Aureon**, built with Vite. The deliverable is the static `dist/` directory, configured for `/motionsites-results/wealth-video-hero/`. Nothing has been deployed or pushed.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/wealth-video-hero/`.

On the provided host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

To preview with Docker:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work -p 4173:4173 --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
```

## Design and assets

- Black, full-height hero with the specified autoplaying, muted, looping, inline video. Its real video element uses `scale-150`, `origin-top-left`, and `object-left-top`.
- Transparent navigation, custom white SVG logo, glass tracking tag, responsive headline, white pill CTAs, and four-column glass card. Small screens use a collapsible menu and stacked feature rows.
- Exact supplied hero and feature copy is preserved, including the unfinished endings “with.” and “easy.” in the prompt.
- Original video downloaded successfully, unmodified, from:
  `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4`
- Local video: `public/assets/wealth-background.mp4` (approximately 23 MiB). Local poster: `public/assets/wealth-poster.jpg`, extracted from this video at two seconds by `scripts/poster.cjs`.
- Only this design's reference, `/home/opc/motionsites/assets/previews/wealth-video-hero.webp`, was inspected. No reference screenshot is rendered as the website, and no reference extraction or asset approximation was necessary.
- The prompt specifies no font or brand name. Aureon is an original wordmark; typography uses the Arial/Helvetica/system sans-serif stack. Icons and logo are inline SVG. No runtime third-party assets or fonts are required.

## Browser validation

Real Chromium checks run against the production build using the image's installed Playwright Core. To reproduce, start the preview server above, then:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp --network host -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Evidence:

- `screenshots/desktop.png`: 1440 × 1000 desktop.
- `screenshots/mobile.png`: full-page capture at a 390 × 844 mobile viewport.
- `screenshots/mobile-viewport.png`: exact 390 × 844 viewport capture.
- `screenshots/browser-checks.json`: recorded playback properties, interaction checks, browser errors and failed requests.

Checks cover video time progression and autoplay, navigation dropdown and feature anchors, all CTA and navigation dialogs, email entry and confirmation, Escape and close buttons, mobile menu, and horizontal overflow at 320, 390, 768, 1024, 1440 and 1920 pixels. Screenshots freeze the actual video at two seconds for repeatable visual comparison; normal playback continues in the website. CSS entrance and hover motion respects reduced-motion preferences. The final dependency install reported zero audit vulnerabilities.

## Scope and limitations

This is a hero design preview, not a connected financial product. Sign-in and account CTAs open local email dialogs; they send nothing and clearly identify the preview after submission. Company and Blogs open concise local information dialogs. No authentication, banking integration, account creation, or article service was requested or connected. The full original video is retained, so the media download is substantial. Playback was verified in desktop Chromium and a narrow Chromium viewport; physical iOS/Android devices and other browser engines were not tested.
