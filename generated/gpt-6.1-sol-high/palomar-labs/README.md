# Palomar Labs

Standalone recreation of the Palomar marketing landing page, design ID `palomar-labs`. Built with React, TypeScript, Vite, Tailwind CSS, and the specified Lucide icons. `src/App.tsx` contains Navbar, Hero, and TrustedBy. The page contains only the fixed navigation and full-viewport landscape video hero.

The exact CloudFront video and both font stylesheet URLs from PROMPT.md are preserved. No image substitute, extracted reference assets, video overlay, additional sections, or extra marketing copy are used. The supplied Palomar reference was inspected only for visual comparison.

## Build and run

With Node.js 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

The configured base is `/motionsites-results/palomar-labs/`. Open that path on the preview server. The complete publishable output is `dist/`, including `dist/index.html`. No deployment was performed.

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Browser verification

The repeatable check starts a temporary HTTP server that serves the actual production build at its configured subpath and uses the image's Chromium and Playwright:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/check-browser.cjs
```

Verified at desktop 1440×1000 and mobile 390×844:

- No JavaScript runtime errors or horizontal overflow.
- Original 1920×1080 video actively playing, muted, looping, inline, with cover sizing and bottom alignment.
- Helvetica Neue Light and all five display font families loaded successfully.
- Mobile hamburger toggle, all four menu selections, body scroll lock and restoration, Escape dismissal, and desktop resize cleanup.
- Scrolled navigation background, blur, and shadow, including full-screen mobile menu coverage after scrolling.
- Desktop Solutions remains a button without a dropdown, as required.

Screenshots were visually inspected: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. Machine-readable browser observations and asset responses are in `screenshots/browser-checks.json`.

## Limits and asset observations

All required external assets were available in Chromium: font stylesheets and font files returned HTTP 200; video range requests returned HTTP 206. Chromium recorded some canceled video range requests (`net::ERR_ABORTED`) while changing pages/streams; video decoding and advancing playback passed on both target viewports. Unloaded entries in the font report are unused language subsets; each required family's used subset loaded.

The page intentionally depends on the specified external asset hosts. Video frames change over time, so screenshot landscape details differ from a still reference. Only Chromium was exercised; Safari and physical mobile devices were not tested. Link destinations were not supplied in the prompt, so navigation/CTA anchors use `#`; mobile selections still close the menu. The desktop Solutions button intentionally has no dropdown.

Dependencies are locked in `package-lock.json`; the final install audit reported zero vulnerabilities. `node_modules` is not included in the deliverable. Ready means ready for review, not deployed.
