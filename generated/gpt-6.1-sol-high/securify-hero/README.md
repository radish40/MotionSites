# Securify Data Security

Design ID: `securify-hero`. A fullscreen React + TypeScript + Tailwind CSS hero built from this project's `PROMPT.md`. Includes the exact supplied SVG, lowercase copy, floating navigation pills, responsive staggered headlines, three statistics, bottom gradient, and looping background video. No deployment or push was performed.

## Run and build

Requires Node.js 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured public base is `/motionsites-results/securify-hero/`. Publishable files are in `dist/`, including `dist/index.html`. Open that base path when using the development or preview server. Dependencies are pinned in `package.json` and `package-lock.json`; `node_modules/` is ignored.

On this host, the build was run using the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Browser validation

The browser check serves the actual `dist/` output at its configured subpath with video range support. It uses Chromium and the existing image's `playwright-core`; no browser package is added to production dependencies.

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check:browser'
```

Verified desktop 1440×1000 and mobile 390×844: original remote video decoding and playback advancement, autoplay/muted/loop/inline attributes, loaded Readex Pro font, exact headline copy and sizes, mobile navigation/divider hiding, fragment links, button hover/click/keyboard focus, and no horizontal or vertical overflow. No page script errors, failed requests, or HTTP errors occurred in the normal runs. A separate test deliberately blocks the remote video and confirms the local copy plays. Dependency installation reported zero audit vulnerabilities after updating Vite and PostCSS.

Evidence:

- [Desktop screenshot](screenshots/desktop.png)
- [Mobile screenshot](screenshots/mobile.png)
- [Machine-readable browser results](screenshots/browser-checks.json)

Screenshots capture the original video at one second for a repeatable comparison; the live page plays continuously. Both images were visually inspected.

## Assets and limitations

The exact video URL specified in the prompt is the primary video source. A byte-for-byte download is stored at `public/assets/securify-background.mp4` as an error fallback. The video was reachable and decoded at 1928×1072 with a duration of approximately 7.04 seconds in Chromium. No replacement imagery or extracted preview fragments were used.

Readex Pro weights 300, 400, 500, 600 and 700 were downloaded directly from Google Fonts and are served locally to avoid runtime external font requests. `public/assets/readex-google.css` retains the source URLs; `Readex-Pro-OFL.txt` contains the font license. The rendered design uses weights 400 and 500; the other requested weights are declared and included. Vite rewrites all font URLs to the required public base.

The optional project preview `/home/opc/motionsites/assets/previews/securify-hero.webp` was absent. Composition follows the written prompt, without a preview comparison. Browser verification covers Chromium at the two requested viewport sizes; it does not claim coverage of every browser or device.

The prompt supplies no destination or signup behavior for “get started”; it remains a styled button with the requested hover behavior. Navigation links target existing hero content through local fragments. No additional pages, forms, dialogs, or product flows were invented. Only the video animates; CSS transitions are limited to the specified navigation and CTA hover colors.
