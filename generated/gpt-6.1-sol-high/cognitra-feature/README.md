# Cognitra Feature

Design ID: `cognitra-feature`. A single transparent, full-viewport section above the exact fixed video supplied in `PROMPT.md`. Includes the specified copy, Helvetica Now Var font import, responsive spacing, and reusable Framer Motion `FadeUp` component with per-word stagger.

Stack: React 18, TypeScript, Vite, Tailwind CSS 3, Framer Motion 12. Motion's internal packages are pinned to matching releases for reproducible builds.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/cognitra-feature/` on the preview server. Vite's base is configured for that exact path. `dist/` contains the complete static build; serve it at that path.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

The script serves the production files under the required subpath and uses the image's Playwright Core and Chromium. It checks desktop 1440×1000 and mobile 390×844: video autoplay and advancing playback, mute/loop/inline attributes, fixed positioning, transparent section, viewport height, completed word/subtext animations, script errors, and horizontal/vertical overflow. This design has no buttons, navigation, or other user controls.

Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/checks.json` (actual browser measurements and request failures)

Screenshots hold the video at 2 seconds after checking live playback, giving both sizes a consistent video frame. Chromium may report `net::ERR_ABORTED` for a video range request during seeking; successful decoding and advancing playback are checked independently.

## Assets and limitations

Both original asset URLs are used directly and loaded successfully during validation. The video is 1920×1080. The font stylesheet and font loaded in Chromium. External asset availability remains dependent on CloudFront and OnlineWebFonts; the supplied system font fallback stack remains in place.

Font source/attribution: [Web Fonts / OnlineWebFonts](https://www.onlinewebfonts.com/fonts), per the supplied stylesheet's attribution notice. Asset ownership and licensing are inherited from the supplied prompt; no replacement imagery is used.

Only this project was implemented. No deployment or push was performed. `ready` in `result.json` means ready for review, not published.
