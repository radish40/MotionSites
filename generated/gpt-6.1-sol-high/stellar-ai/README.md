# Stellar AI

Design ID: `stellar-ai`. A Stellar.ai landing page implemented from this project's `PROMPT.md` using React, Tailwind CSS with its default theme, Lucide React, and Inter. All artifacts are contained in this project. Nothing has been pushed or deployed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vite is configured with base `/motionsites-results/stellar-ai/`. Serve the complete `dist/` directory at that path. The production entry point is `dist/index.html`.

This host provides Node/npm through the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

## Implementation

Includes the specified staggered animations, gradient heading, navigation, review badge, CTA, responsive tabs, original looping video, four conditional panels, and company wordmarks. Tabs cycle every four seconds and pause during panel interaction. Arrow keys, Home, and End operate the tab list. Reduced-motion preferences shorten entrance animations.

The setup wizard advances through four steps. Training displays 67% progress and four metrics. Testing displays 127/127 passing tests. Deployment offers a local success state. CTA and login dialogs support email validation, Escape, focus containment, and returning focus on close. All account, training, and deployment actions are frontend previews. No credentials or form data are sent or persisted, and no real deployment occurs.

## Assets and limitations

The original prompt video was successfully downloaded unchanged to `public/assets/stellar-workspace.mp4` (12.2 MiB):

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4

Chromium confirmed playback at 1756×1176, approximately 10.04 seconds. Inter 400/500/600/700 is imported from Google Fonts as requested; the same original font files are also bundled locally for reliable rendering. `public/assets/inter-google.css` records the source declarations. An initial Python font download stalled; curl successfully retrieved the original files.

Company marks use live text and vector/CSS motifs based on the prompt. No official logo files were supplied, so these marks are typographic approximations.

The optional reference `/home/opc/motionsites/assets/previews/stellar-ai.webp` was absent. The implementation follows the written prompt; comparison with the unavailable reference is not possible. No screenshot-based page reconstruction or extracted reference assets were used.

## Verification

The actual production build passed. Playwright Core and system Chromium checked desktop 1440×1000 and mobile 390×844 against the production preview:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run build && node scripts/browser-check.cjs'
```

The script starts and stops its own local preview server. Final checks passed for video playback, layout overflow, all four panels, setup progression, deployment preview, automatic cycling, keyboard tabs, navigation, email form submission, and dialog dismissal. All four mobile cards fit within the 400px media container. There were no page, console, or HTTP errors in the final run.

Artifacts:

- `screenshots/desktop.png`: full page captured at 1440×1000 viewport.
- `screenshots/mobile.png`: full page captured at 390×844 viewport.
- `screenshots/panel-train.png`, `panel-testing.png`, `panel-deploy.png`: panel details.
- `screenshots/browser-checks.json`: machine-readable browser results.

The actual video is paused at one second only for deterministic screenshots; playback is verified before capture. Verification covers Chromium at the specified sizes, without physical-device or other browser-engine checks. The Google Fonts import remains external, with local fonts available as fallback. No backend is configured or required.
