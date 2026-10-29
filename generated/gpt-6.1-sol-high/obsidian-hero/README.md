# Obsidian Hero

Design ID: `obsidian-hero`. A fullscreen architecture studio landing page built from `PROMPT.md` with React 18, TypeScript, Vite, Tailwind CSS 3, and lucide-react. Real video, DOM text, CSS grid project cards, and an animated navigation overlay; no preview screenshot is used in the page.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

In the provided host environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable build is `dist/`, including `dist/index.html`. Vite's base and all local media paths support `/motionsites-results/obsidian-hero/`. Nothing has been deployed or pushed. The dependency lockfile is included; `node_modules/` is excluded from deliverables.

## Behavior

The muted background video autoplays inline and loops. Both desktop and mobile menu buttons open the same overlay, with timed link entrances and a fading backdrop. The overlay traps keyboard focus, supports Escape, and restores focus when closed. Our Projects focuses the project group. Navigation links target existing content on this single page; the prompt supplies no external portfolio, contact, or Enter destination. Project cards are presentation content rather than invented detail pages.

## Assets and attribution

All three specified media assets were successfully retrieved, without alteration, and saved locally:

- `public/assets/architecture.mp4`: [original CloudFront video](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260624_054830_07627566-fd88-4b82-9ee8-b5d78b1c4f36.mp4).
- `public/assets/craft.webp`: the exact first Higgs image proxy URL in `PROMPT.md` (source file `hf_20260624_052633_1cc62234-04fe-4fb5-905e-66254dd3c5db.png`).
- `public/assets/arcvault.webp`: the exact second Higgs image proxy URL in `PROMPT.md` (source file `hf_20260624_052653_54120660-1330-4f38-92ab-a6ba7ac15397.png`).

Lexend uses the exact required external stylesheet link in `index.html`. [Web Fonts](http://www.onlinewebfonts.com/fonts) / [Lexend stylesheet](https://db.onlinewebfonts.com/c/42dbf00de1681d38477679d3eadad56a?family=Lexend): provider attribution states CC BY 4.0. Font loading was verified in Chromium. The font remains an external dependency; media playback does not require the source CDN.

Only this design's reference `/home/opc/motionsites/assets/previews/obsidian-hero.webp` was viewed for visual comparison. No assets were extracted from the preview and no approximated replacement assets were necessary.

## Validation

A real TypeScript and Vite production build succeeded. The final install reported zero dependency audit vulnerabilities. Headless Chromium checks run against `dist/` served at the required subpath:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

The script uses the container's existing Playwright and Chromium, without adding project dependencies. It checks desktop 1440×1000 and mobile 390×844, page overflow, hero/card separation, image decoding, font loading, video playback and required attributes, project focus, menu open/close, keyboard focus containment, Escape, link dismissal, HTTP failures, and page script errors.

Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-menu.png`
- `screenshots/mobile-menu.png`
- `screenshots/browser-checks.json`

Chromium may cancel superseded MP4 range requests with `net::ERR_ABORTED`; the report lists these separately from failed asset requests and verifies actual video playback. Screenshots capture an instant of the looping video, so the background can differ between captures. Browser checks cover Chromium at the two required dimensions; physical mobile devices and other browser engines were not tested. The decorative Scroll cue follows the prompt, while the page itself has no scrolling.
