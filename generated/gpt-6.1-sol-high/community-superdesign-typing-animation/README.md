# Typing animation

Design ID: `community-superdesign-typing-animation`

A responsive, typography-focused page branded Letterform. The headline reveals each of its 30 characters (including spaces) at a 50 ms interval. It includes a blinking caret, live progress indicator, character counter, and a keyboard-accessible replay button. Replaying cancels the previous timer. Reduced-motion preferences show the entire headline immediately.

Built with native HTML, CSS, and JavaScript. PROMPT.md specifies only the headline typing delay; it does not prescribe a framework, copy, font, or assets. All page content and decoration are real DOM/CSS/inline SVG. No preview screenshot is used in the page.

## Build and run

With Node 22/npm:

```sh
npm ci
npm run build
npm start
```

Open `http://localhost:3000/motionsites-results/community-superdesign-typing-animation/`.

On the provided Docker host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The build writes the complete static site into `dist/`, including `dist/index.html`. Relative resource URLs support the required publication subpath. There are no runtime dependencies, external asset requests, or node_modules to deliver. The included server is for local verification only.

## Verification

Real Chromium checks used `/app/node_modules/playwright-core` in the provided Docker image. With the server running in that container, run `node browser-check.cjs` there.

- Desktop: 1440 × 1000; mobile: 390 × 844.
- All 30 characters revealed; mean interval approximately 50 ms.
- Pointer replay, Enter-key replay, interruption/restart, reduced motion, progress completion, and local font loading passed.
- No page errors, console errors, failed HTTP responses, or horizontal overflow at either viewport.
- Screenshots were captured and visually inspected. Final evidence is in `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/browser-checks.json`.

## Assets and limitations

The optional design reference at `/home/opc/motionsites/assets/previews/community-superdesign-typing-animation.webp` was absent. Visual fidelity to that unavailable reference cannot be verified; the composition and copy are original interpretations of the supplied one-sentence prompt.

Manrope weights 600 and 800 were successfully downloaded from Google Fonts and stored locally as `assets/manrope-semibold.ttf` and `assets/manrope-extrabold.ttf`. The Google Fonts CSS response is retained in `assets/font-source.css` as provenance. The font license is `assets/OFL.txt`, retrieved from the Google Fonts Manrope repository. The logo and asterisk illustration are made in CSS/inline SVG; no stock image is required.

Browser timer scheduling can vary under load or in background tabs; the requested interval is 50 ms, measured in an active Chromium page. Reduced motion deliberately bypasses animation. No deployment or push was performed.
