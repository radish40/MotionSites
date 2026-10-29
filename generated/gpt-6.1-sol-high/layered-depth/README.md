# Layered Depth

Design ID: `layered-depth`. A Qelora architecture studio landing page with exactly two sections, built with React, Vite, TypeScript, and Tailwind CSS for the base reset. All element styling is inline; there are no JSX CSS classes or animation libraries. Runtime dependencies are only `react`, `react-dom`, and the requested unused `lucide-react`.

The production site is in `dist/`, with its base path set to `/motionsites-results/layered-depth/`. This project has not been deployed or pushed.

## Run and build

With Node 22 and npm installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the displayed server URL with `/motionsites-results/layered-depth/` appended.

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The lockfile is included. `node_modules` is not part of the deliverable. Serve the contents of `dist/` under the configured base path; no backend is required.

## Implementation

`src/Hero.tsx` implements the fixed navigation, 768px responsive breakpoint, mobile dropdown, active navigation pills, English selector, layered wordmark and sculpture, bottom panels, and scroll parallax. The panel bottom follows `offset + scrollY * 0.5`; the sculpture translates by `-scrollY * 0.3`.

The bird system preloads all four clips and uses both state and refs: enter → idle1 ↔ idle2; scrolling past 10px plays leave, and returning to the top plays enter. Native video methods handle readiness, reset, pause, and playback. `src/Section2.tsx` implements the second video layer, headline, map pin, and subtext.

“Explore our approach” scrolls to Section 2. Navigation pills update selection, as specified; no additional sections or routes have been invented. The project CTA opens an email composer. Its address, `hello@qelora.studio`, is an implementation assumption because no contact destination was supplied; it is not verified.

## Assets and limitations

All eight supplied Cloudinary asset URLs were tested. They return HTTP 401 with `x-cld-error: cloud_name dy5er7kv5 is disabled`. This includes both background videos, all four bird clips, the sculpture, and the declared but unused logo. The original URLs remain in `src/assets.ts`; if the account is restored, the videos and sculpture will be requested automatically on page load.

The page currently uses original local SVG fallbacks for the landscape, sculpture, and architectural background. These are source assets, not screenshots. No replacement bird footage is fabricated. **The requested moving backgrounds and visible bird animation cannot be delivered or visually verified while the supplied Cloudinary account is disabled.** Screenshots show the fallback presentation, not the original video composition.

The initial Python fetches for the supplied Pexels photo and fonts returned HTTP 403. Retrying with curl recovered the exact CTA image and all three exact Zimula WOFF2 fonts. These are bundled locally for reliability. The two required font stylesheet links remain in `index.html`, and the required Reg import remains in `src/index.css`. Asset request details are in `asset-checks.json`.

Font source and attribution: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), Zimula Trial Med / Bd / Reg, supplied stylesheet license notice [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Photo: [provided Pexels asset](https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400).

## Browser verification

The reproducible browser check serves the actual production `dist/` at its configured subpath and uses the existing Docker image's Playwright and Chromium:

```sh
docker run --rm -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

`browser-checks.json` records the desktop 1440×1000 and mobile 390×844 results, interactions, loaded local fonts and photo, section count, horizontal overflow, uncaught JavaScript errors, and remote asset failures. Bird transition checks dispatch `ended` events to the real video elements: this verifies the state logic, not successful media decoding or visible playback. Scroll checks exercise the actual browser scroll position and parallax transform.

Screenshots:

- `screenshots/desktop.png` — desktop hero
- `screenshots/mobile.png` — mobile hero
- `screenshots/desktop-section2.png` — desktop second section
- `screenshots/mobile-section2.png` — mobile second section
- `screenshots/mobile-menu.png` — open mobile navigation

The build and local fallbacks are ready for review. Exact original media fidelity remains limited by the upstream Cloudinary failure.
