# Global CTA Footer

Design ID: `global-cta-footer`. Brand: **Highframe**.

A React + Vite landing page that selects a standalone desktop or mobile HTML page in a full-viewport iframe. The breakpoint is 768px. Built files use `/motionsites-results/global-cta-footer/` as their base path.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the base path printed above, including when using the Vite dev or preview server. `dist/index.html` is the entry point. Publish the complete `dist/` directory at the configured base path; no deployment has been performed.

The environment used for the real build has Node/npm inside Docker:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Implementation

- `src/App.jsx`: responsive iframe switcher, including changes when the viewport crosses the breakpoint.
- `public/desktop/index.html`: standalone desktop layout, inline CSS, navigation dropdowns, staggered reveal, flipped looping Ken Burns video, workflow preview, frosted footer and waitlist. The small bottom-left control opens the React + Babel dashboard position sliders.
- `public/mobile/index.html`: standalone mobile layout, inline CSS, menu, short video loop, floating glass preview, footer reveal, single-open accordion and waitlist.
- `public/assets/hero.mp4`: a local copy of the exact CloudFront video supplied in PROMPT.md. No video overlay or scrim is applied.
- `public/assets/dashboard-orchestrator.html`: original local workflow illustration created because the prompt references a separate dashboard file but supplies none. Identical copies are included at both requested iframe locations.
- Google Fonts supplies Hanken Grotesk, EB Garamond and desktop Material Icons Round. React 18 UMD, ReactDOM and Babel for the desktop development panel are vendored locally; the main wrapper uses React 19.
- `scripts/create-pages.py`: generates the two standalone pages, shared icons and inline styles/scripts. Run after changing that source, then rebuild.

## Verification

The production build was checked with real headless Chromium using the existing `playwright-core` in the Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

This script serves `dist/` temporarily under the exact publication path, runs desktop 1440×1000 and mobile 390×844 checks, exercises navigation, demo playback, dialog Escape dismissal, sliders, form validation and local submission, and verifies accordion exclusivity. It also tests switching and horizontal overflow at 767, 768, 860 and 1100px. Results are saved to `screenshots/browser-checks.json`.

`screenshots/desktop.png` and `screenshots/mobile.png` are full-page captures of the standalone pages at the required viewport sizes. Additional `*-viewport.png` files show the actual React iframe wrapper. Full-page captures use the standalone pages because browsers clip an embedded iframe to its visible viewport. Mobile footer content is scrolled into view before capture to trigger its IntersectionObserver reveals.

## Limits and asset provenance

This is a static design implementation. A signup/account service, email delivery, real company destinations, and a workflow backend were not provided. Waitlist forms validate emails and store a single entry in this browser's local storage; their confirmation explicitly says it is saved on this device. Demo buttons play the provided video in a native modal. Internal informational links show preview copy; social links open the corresponding service homepages because brand profiles were not supplied. The workflow preview is illustrative, with lightweight local controls.

The exact video and Google Fonts loaded successfully in Chromium during verification. Fonts continue to require network access; the video, dashboard and adjustment-panel libraries are local. Desktop Babel emits its expected development-use warning; the prompt explicitly requests this development overlay. Reduced-motion preferences disable CSS animations and transitions. No push, deployment, other project access, messages, or additional sessions were performed.
