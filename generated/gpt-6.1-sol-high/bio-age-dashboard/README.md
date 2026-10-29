# Bio-Age Dashboard

Design ID: `bio-age-dashboard`. VELVION dashboard implemented from the supplied prompt with Vite, React 18, TypeScript, Tailwind CSS 3, Lucide React and Inter weights 300–900.

## Build and run

With Node 22: `npm ci`, then `npm run dev` or `npm run build` and `npm run preview`. Open `/motionsites-results/bio-age-dashboard/`. Vite uses that exact base; publishable files are in `dist/`, including `dist/index.html`.

This host has no Node/npm. The production build was run in the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The dependency lockfile is retained. Install dependencies to restore `node_modules`, which is excluded from the deliverable.

## Implementation

All six exact supplied visual assets are downloaded in `public/assets/`: logo, avatar, rotating age artwork, two card backgrounds and background MP4. The Google Fonts import is retained with local Inter copies for resilience. No preview screenshot is used as a page asset.

Includes the requested video fade, artwork rotation, duplicated 61-tick ruler, IntersectionObserver entrances, 40-step count-up to 28 in 1.8 seconds, and subsequent six-second increments. Health recommendations expand on desktop hover or toggle by tap and keyboard. The help control offers contextual text and Escape dismissal. Reduced-motion preferences pause decorative CSS loops and suppress entrance transitions.

## Browser verification

Real production compilation passed TypeScript and Vite. Chromium checks use the installed Playwright Core package and a temporary local HTTP server supporting video byte ranges:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

The server closes on completion; nothing is deployed.

- Desktop 1440 × 1000 and mobile 390 × 844 checked at the production subpath.
- No script/console errors, HTTP failures, or horizontal overflow, including expanded states.
- Images and Inter loaded; video unpaused and decoding at readyState 4.
- Desktop hover expansion/collapse, keyboard expansion, mobile tap expansion/collapse, help toggle/Escape and continuing age increments verified.
- Desktop, mobile and expanded desktop screenshots visually reviewed. Mobile capture scrolls first to trigger all IntersectionObserver entrances.

Evidence: `screenshots/checks.json`, `screenshots/desktop.png`, `screenshots/mobile.png`, plus `desktop-expanded.png` and `mobile-expanded.png`.

## Limitations

Activity, insight and action panels are presentation cards with decorative arrows; no separate destinations or data integrations were specified. Content is the supplied demo data. The age continues incrementing as requested while the badge and recommendation retain their exact static wording.

Chromium canceled/replaced some MP4 range requests (`net::ERR_ABORTED`) while successfully playing the video; the raw events remain in the report. No unresolved missing assets. Video frames naturally vary between screenshots. Only Chromium was tested. Nothing was pushed or deployed. Status `ready` means ready for management-session review.
