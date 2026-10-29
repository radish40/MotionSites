# Aetheris Voyage

Design ID: `aetheris-voyage-hero`

A two-section cinematic landing page implemented from `PROMPT.md`: the supplied full-bleed videos, liquid-glass navigation and cards, Instrument Serif italic / Barlow typography, word-by-word blur animation, and Framer Motion entrances. The video loop uses requestAnimationFrame fades, a 0.55-second fade-out lead, and a 100 ms restart delay, without native looping or video CSS transitions.

The stack is CDN-only: Tailwind, React 18.3.1, React DOM 18.3.1, Babel 7.29.0, and Framer Motion 11.11.17. Components are external `text/babel` scripts with window exports. No application dependencies or bundler are installed. The build uses Node's standard library and preserves relative resource paths for `/motionsites-results/aetheris-voyage-hero/`.

## Build

With Node available:

```sh
npm install --package-lock-only
npm run build
```

In the provided environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --package-lock-only && npm run build'
```

Publishable static output is in `dist/`, including `dist/index.html`. No deployment has been performed.

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

This runs Chromium through the image's existing Playwright library, serving only `dist/` at the required subpath. It checks desktop 1440×1000 and mobile 390×844, font loading, both background videos, native-loop disabled, a seek-and-restart loop, the liftoff modal and Escape dismissal, section navigation, horizontal overflow, and mobile card bounds. It records browser errors and request failures in `browser-report.json`.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/capabilities-desktop.png`
- `screenshots/capabilities-mobile.png`

The required screenshots and the desktop capabilities capture were visually reviewed. A mobile statistics-card clipping issue found in the first capture was corrected and verified again.

## Interactions and limits

Navigation links target the existing sections/cards. Claim a Spot and Start Your Voyage lead to Capabilities; no reservation backend was specified. View Liftoff opens an accessible native dialog playing the supplied hero video with native controls; Close, Escape, and backdrop dismissal stop playback.

External CDN scripts, Google Fonts, and both CloudFront video URLs require network access. Both supplied videos and the fonts loaded in the browser checks. The supplied Framer Motion build exports `window.Motion`; a compatibility assignment preserves that export before the prompt's `window.Motion = window.FramerMotion` alias. The pinned Framer Motion development build can emit the benign list-key warning mentioned in the prompt; it is retained and classified separately in the report. Browser media range requests may be canceled during player lifecycle/seek operations; the report preserves these events, and decoded playback is checked separately.

The final status `ready` means ready for review, not deployed. Work and artifacts are confined to this project.
