# Organic Odyssey

Design ID: `organic-odyssey`. Page title: **Synthetic Nature**. Brand: **Organic Visions**.

A full-screen cinematic hero built with Vite, TypeScript, React, Tailwind CSS, Framer Motion and lucide-react. It includes the prescribed character fades, subtitle and CTA entrance, responsive navigation, animated glass mobile menu, and liquid-glass controls. The CTA enters a clear view of the film; the close control or Escape returns to the introduction.

## Build and run

Node 22 is recommended. Install with `npm ci`, then run `npm run build`. The complete static output is in `dist/`. `npm run dev` starts development; `npm run preview` previews the production build. The configured base is `/motionsites-results/organic-odyssey/`.

On this host, use the existing container:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

No deployment or push was performed.

## Assets

- `public/assets/organic-realm.mp4` is the unmodified original video downloaded from the exact CloudFront URL in `PROMPT.md`. It is bundled locally so playback does not depend on that external host. The film is 3828 × 2164 and approximately 8.04 seconds; it autoplays muted, loops, plays inline and uses centered cover cropping.
- The exact Garamond and Google Fonts Geist stylesheet links are loaded in `index.html`. Font attribution: [Web Fonts / OnlineWebFonts](https://www.onlinewebfonts.com/fonts), CC BY 4.0 as stated by the supplied stylesheet. Geist is provided through Google Fonts. External font services remain a network dependency; system fallbacks are configured.
- Only this design's provided WebP reference was inspected for composition. No screenshot was used as webpage content, and no assets were extracted or approximated.

## Browser verification

The production output was served at its configured subpath inside a temporary Docker container and checked with real Chromium via Playwright. Reproduce with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script serves only this project's `dist/` and closes its server after verification. Evidence:

- `screenshots/desktop.png`: 1440 × 1000.
- `screenshots/mobile.png`: 390 × 844.
- `screenshots/mobile-menu.png`: open glass menu.
- `screenshots/browser-report.json`: video metadata, fonts, overflow, script errors, failed requests and interaction results.

Checks cover mobile menu opening, navigation closing, Escape closing, CTA entering the film, return control, actual playback and viewport overflow. Screenshots are captured at video time 1 second after text entrance animations finish for repeatability.

## Scope and limitations

This is the single hero requested in the prompt. The four navigation links retain their named URL fragments; no additional pages or destination content was specified or invented. The video is intentionally cropped on portrait screens using the prescribed `object-cover object-center`. Browser checks cover Chromium desktop and mobile emulation, not physical iOS Safari. Playback remains subject to browser autoplay policies. The source asset and design requirements were preserved; font metrics and viewport crop can differ across browsers.
