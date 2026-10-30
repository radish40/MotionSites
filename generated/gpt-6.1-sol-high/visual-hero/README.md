# Visual Hero

Design ID: `visual-hero`. A fullscreen **MicroVisuals** hero built with Vite, React, TypeScript, Tailwind CSS, GSAP, and lucide-react. The layout, text, glass treatments, original animated botanical asset, frame-array boomerang, fade-in, and pointer parallax follow `PROMPT.md`.

## Run and build

Use Node 22 with npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured base is `/motionsites-results/visual-hero/`. The complete static output is in `dist/`, including `dist/index.html`. No deployment was performed.

This host has no Node installation. The actual build used the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install && npm run build'
```

## Validation

A real Chromium browser loaded the production build at its configured subpath. Desktop **1440×1000** and mobile **390×844** passed with no page errors, failed requests, or horizontal overflow. The browser verified the visible Instrument Serif and Barlow fonts, original video decoding, canvas capture, forward/reverse playback, GSAP pointer movement, CTA hover/press styling, and mobile navigation open/close, Escape, and link selection.

- `screenshots/desktop.png` and `screenshots/mobile.png`: requested viewport captures.
- `screenshots/desktop-boomerang.png` and `screenshots/mobile-boomerang.png`: captured-frame playback.
- `screenshots/mobile-menu.png`: expanded mobile navigation.
- `screenshots/browser-checks.json`: measured validation results.

Reproduce using the image's installed Playwright and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/serve.cjs & SERVER_PID=$!; trap "kill $SERVER_PID" EXIT; node scripts/browser-check.cjs'
```

## Assets and fidelity

- `public/assets/hero.mp4` is the exact original CloudFront video specified in the prompt. Its MD5 `5d767cfbaf081d4c94c91ea103c946c7` matches the source ETag. The source URL remains in `src/App.tsx`; playback uses the local copy to avoid external media availability and CORS dependencies.
- The specified Google Fonts import remains at the top of `src/index.css`. Exact Google-provided Instrument Serif regular/italic and Barlow 300/400/500/600 files are also bundled locally. `google-fonts-original.css` records their source URLs and `fonts-local.css` defines local equivalents.
- The exact Dirtyline URL returns HTTP 404. Its requested declaration is retained. A related **Dirtyline 36Daysoftype 2022** file was recovered through `https://fonts.cdnfonts.com/css/dirtyline-36daysoftype-2022`; the stylesheet and font are archived under `public/assets/`. This is not verified as the exact requested font and is not substituted into the design. Dirtyline is unused in the requested visible markup, so its unavailable URL has no visual impact and is never requested during the checks.
- Only this design's supplied preview was inspected. It says “VisualStudio”; the implementation uses the explicitly requested “MicroVisuals”. The preview was not embedded or used as the page.
- The prompt's accidental `@font` / `-face` and `http://video.play()` / `http://performance.now()` formatting was normalized to valid CSS/JavaScript.
- On mobile, navigation collapses into an accessible menu, the title scales to fit, and bottom copy stacks above the two CTAs with a subtle contrast gradient. Reduced-motion preferences disable pointer parallax and transition animations.

## Scope and limitations

This deliverable is the requested hero section. The prompt specifies no routes, authentication, image-generation service, template data, or CTA click handlers. Navigation uses descriptive fragment URLs; the two CTA buttons implement the specified visual interactions without an invented application flow.

The original video is 3328×2492 and about six seconds long. Frame capture scales snapshots to 960 pixels wide and retains only one pass. Boomerang playback uses the captured canvas array at the requested 30fps; it never seeks `video.currentTime` in reverse. Frame count and resulting loop duration depend on decode performance. The software-rendered validation captured 22 desktop and 19 mobile frames, confirming both directions; smoothness on physical hardware and non-Chromium browsers was not measured.

`ready` in `result.json` means ready for review, not published. Dependencies are locked in `package-lock.json`; `node_modules` is excluded from the deliverable.
