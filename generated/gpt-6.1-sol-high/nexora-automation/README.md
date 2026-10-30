# Nexora Automation

A React landing page implementing the Nexora Automation prompt: a single-viewport light hero, the original animated woodland video, Instrument Serif/Inter typography, Framer Motion entrances, and a custom DOM/SVG financial dashboard clipped at the viewport edge.

Project ID: `nexora-automation`  
Publication base: `/motionsites-results/nexora-automation/`  
Delivery: `dist/` (includes `index.html` and all local media).

## Build and run

Requires Node 22 and npm, or the provided Docker image. Dependencies are locked in `package-lock.json`.

```bash
npm ci
npm run build
npm run preview
```

On this host:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For development use `npm run dev` and open the configured publication base. The production build uses relative-to-base asset paths. React, TypeScript, Vite, Tailwind CSS, tailwindcss-animate, Framer Motion, Lucide React, and a local shadcn/ui Button implementation are used.

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script serves the real production build and runs Chromium with the image's existing Playwright installation. It checks desktop 1440×1000 and mobile 390×844, document bounds, video playback, font availability, navigation dialogs, demo form submission, close/focus restoration, mobile modal bounds, and reduced-motion behavior. It writes:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`

Both viewport checks passed, with no JavaScript page errors or HTTP errors. Chromium may cancel a local video range request when its preview dialog closes; these `net::ERR_ABORTED` entries are recorded in the report. Main-background playback was independently verified (1920px source width, readyState 4, playing).

## Assets and behavior

- `public/assets/nexora-background.mp4` is the exact original CloudFront video specified in `PROMPT.md`, downloaded successfully without alteration and served locally. No preview screenshot or reference video was substituted for the page or dashboard.
- Instrument Serif (regular and italic) and Inter load through the exact Google Fonts CSS import specified in the prompt. Both were verified in Chromium; they still require access to Google Fonts at runtime.
- The test environment lacks an emoji font. `sparkle-subset.ttf` is a 1.7 KB Google Fonts Noto Emoji subset containing the badge's ✨ glyph, styled gold using a semantic token. Its source CSS and OFL license are included alongside it.
- The optional reference file `/home/opc/motionsites/assets/previews/nexora-automation.webp` was absent. The page follows the complete written prompt; no reference extraction was needed.
- The dashboard is deliberately noninteractive, with real React content and a handcrafted cubic Bézier SVG chart. On phones it retains its desktop proportions and is cropped by the hero. The page has no scroll, as requested.
- Buttons and nav links open accessible native dialogs. The play button previews the supplied visual video (no separate product walkthrough was provided). The demo/contact form validates locally and clearly reports that no message has been sent; no backend, booking service, or pricing data was specified.
- The background pauses when reduced motion is requested; motion entrances also respect that preference.

No deployment, push, external messages, other projects, or agent sessions were used.
