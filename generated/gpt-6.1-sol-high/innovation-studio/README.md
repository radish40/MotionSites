# Innovation Studio

A full-screen Nexformo hero built from `PROMPT.md` with React, TypeScript, Tailwind CSS, Lucide React, and Vite. Includes the supplied background video at full opacity, Geist typography, a rotating circular badge, three crossfading slides, and an animated menu.

The carousel advances every five seconds; selecting a dot resets the timer. Studios, Labs, and Process select the corresponding slide. Hero calls to action open the studio menu. Connect and the contact details use email/telephone links. No additional pages were specified.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production build is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/innovation-studio/`; use that path when opening the local server. Dependencies are pinned by `package-lock.json`.

On this host, use the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The retained browser script serves the production files at the required subpath and uses the image's existing Playwright and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Checks cover desktop 1440×1000 and mobile 390×844: font loading, video readiness and autoplay, layout overflow, slide selection, timer reset, automatic rotation, menu navigation, scroll locking, Escape and restored focus, CTA behavior, close button, backdrop dismissal, browser errors, and asset failures.

Evidence:

- `screenshots/desktop.png` and `screenshots/mobile.png`: hero screenshots.
- `screenshots/desktop-menu.png` and `screenshots/mobile-menu.png`: menu screenshots.
- `screenshots/checks.json`: detailed machine-readable browser checks.

Both hero sizes were also visually reviewed. Reduced-motion preferences suppress CSS animation and transition durations; keyboard navigation includes menu focus containment and restoration.

## Assets and limitations

The video uses the exact supplied CloudFront URL, and Geist uses the exact supplied Google Fonts stylesheet. Both loaded during browser validation. They remain external dependencies and require network access. Chromium can cancel a video range request when replacing a range or closing a page; these cancellations are recorded separately from failed requests.

The design intentionally places white text directly over the unmodified video without an overlay. Screenshot frames vary because the background plays continuously. No deployment, push, external messaging, or additional designs were performed. `ready` in `result.json` means ready for review, not published.
