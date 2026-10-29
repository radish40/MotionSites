# ADHD Planner

A single-page landing site for **Drift**, implemented from this project's TASK.md and PROMPT.md. Design ID: `adhd-planner`.

Uses React, Vite, TypeScript, Tailwind CSS, and lucide-react. Includes the supplied video hero, floating animated navigation, cream About section, fixed-image feature section, sticky feature navigation, and IntersectionObserver card animations. The original media is stored in `public/assets/`; the requested Google Fonts import is in `src/index.css`.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vite uses `/motionsites-results/adhd-planner/` as its base. Visit that path on the development or preview server. Build output is `dist/`, including `dist/index.html` and all media.

This host uses Docker for Node tooling:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The browser check serves the real `dist/` output under the required base path using a temporary local HTTP server and Chromium through the image's installed playwright-core. It checks 1440×1000 desktop and 390×844 mobile, script errors, horizontal overflow while scrolling, media decoding, font loading, menu and dialogs, anchor navigation, card reveals, and desktop feature selection.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, plus feature-section captures. Detailed results: `screenshots/browser-checks.json`.

## Scope and limitations

This is the requested landing page, with no planner backend. Signup, contact, and mailing-list destinations were not supplied. Their buttons open dismissible notices that accurately explain the preview limitation and link to the features. FAQ opens a small accessible dialog. No addresses, subscriptions, or account creation are fabricated; no data is collected or sent. Native dialogs support Escape, focus containment, and focus restoration. Reduced-motion preferences disable smooth scrolling and transitions.

The four supplied MP4s and the exact supplied WebP image were downloaded successfully and are bundled locally (approximately 45 MB total). Google Fonts remain external, as requested; an offline visitor may receive system fallback fonts. Video autoplay depends on browser policy, although all videos are muted and playsInline. Mobile browsers may treat fixed backgrounds differently.

No deployment or push was performed. `ready` means available for review, not published.

Validation passed at both specified viewport sizes: no script errors or horizontal overflow, all four videos decoded, both fonts loaded, and interaction assertions passed. Chromium canceled some MP4 range requests (net::ERR_ABORTED); all media reached readyState 4 without media errors. These raw request events are retained in the check report.
