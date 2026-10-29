# Wellness Devicex

Design ID: `wellness-device`. Page brand: **Measured**.

A single viewport React + Vite + Tailwind CSS + TypeScript hero, implemented from this project's TASK.md and PROMPT.md. Features the exact geometric logo, responsive frosted glass navigation, Instrument Serif heading, layered supplied imagery, parallax grid, and a canvas-generated cursor mask revealing a muted looping video in the bottom 60% of the viewport. The mobile fullscreen menu includes staggered animations, scroll locking, Escape dismissal, focus containment and focus restoration.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/wellness-device/` on the preview server. Vite's base is fixed to this required publication path. The complete static output is in `dist/`, including `dist/index.html`, all imagery, video, and local Google font copies. No deployment was performed.

The available Docker environment can build without host Node:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

The verification script serves the actual production build at its publication subpath using a temporary HTTP server with video range support, then runs Chromium via the image's existing playwright-core. It checks desktop 1440×1000 and mobile 390×844, image loading, video autoplay/mute/loop and time progression, heading fonts and responsive sizing, page overflow, canvas mask center/outside alpha, bottom-60% clipping, grid motion, mobile menu open/close/Escape/selection, reservation-button dismissal and body locking. Script errors, browser console errors, failed requests and HTTP failures are captured. Final results are in `screenshots/browser-report.json`.

Screenshots:

- `screenshots/desktop.png` — desktop with the cursor spotlight over the product.
- `screenshots/mobile.png` — closed mobile menu.
- `screenshots/mobile-menu.png` — fullscreen mobile navigation.
- `screenshots/desktop-top-hover.png` — cursor in the upper region.

## Asset provenance and limitations

All three supplied asset URLs downloaded successfully. Their bytes are preserved locally as `public/assets/background.webp`, `overlay.png` and `front.mp4`. **The supplied still images depict a terrarium with miniature characters, rather than the wearable on a wrist described in the prompt.** The implementation intentionally preserves the exact requested assets. This content discrepancy remains visible in the final screenshots.

The exact Google Fonts links remain in index.html. Inter weights 300–700 and Instrument Serif regular/italic are also stored locally, with a local stylesheet loaded afterward for reliable rendering. The final browser run reported no failed font or asset requests.

**No Helvetica Neue Roman woff/woff2 files or licensed download source were supplied.** The hero wrapper has the requested `.font-helvetica-neue` class and a local `@font-face` declaration. On systems without Helvetica Neue, it falls back to Inter. To finish this font requirement with licensed files, place them in `public/fonts/` and extend that declaration's `src`. No different font has been mislabeled as Helvetica Neue.

The prompt specifies only a hero and no destination pages, content sections, checkout, or reservation service. Desktop navigation and reservation controls therefore have no external destination; mobile choices dismiss the menu. No unrequested sections or backend were invented.

Canvas-to-data-URL masking follows the specified implementation. Its frame rate depends on screen size and device performance. Touchscreens show the static composition and mobile menu; the reveal follows a mouse or pen cursor.

`ready` in result.json means ready for review of these build artifacts, including the disclosed limitations; it does not mean deployed.
