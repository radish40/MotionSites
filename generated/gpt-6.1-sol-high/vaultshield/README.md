# VaultShield

Fullscreen password-manager hero implemented from `PROMPT.md` using React, TypeScript, Tailwind CSS, Framer Motion, and Lucide React. Includes the original SVG mark, copy, colors, icons, video, hero entrance animation, CTA feedback, and mobile navigation sheet.

Production output: `dist/index.html`. Public base: `/motionsites-results/vaultshield/`. Nothing has been deployed or pushed.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/vaultshield/` on the running server.

The actual environment uses Docker because the host has no Node/npm:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules/` is ignored and is not part of the static deliverable; publish only `dist/`.

## Browser checks

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

The saved script starts a temporary in-container HTTP server for `dist/`, then uses the image's playwright-core and Chromium. Verification passed at 1440×1000 and 390×844:

- No horizontal overflow, script errors, or console errors.
- Original 1920×1080 MP4 decodes and autoplays muted and inline.
- Chromium CDP identifies rendered Helvetica Now Display Bold in the heading and Inter Regular in the paragraph.
- CTA hover reaches scale 1.04; button press feedback is implemented.
- Mobile sheet opens with five links, traps keyboard focus, and restores focus. Escape, backdrop, close button, and a nav link dismiss it.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-menu.png`. The test pauses the video at two seconds for repeatable captures; the app loops normally. Evidence is saved in `screenshots/checks.json` and `screenshots/browser-check.log`.

## Assets

The original CloudFront video URL in `PROMPT.md` downloaded successfully, unchanged, to `public/assets/vaultshield.mp4`.

The required OnlineWebFonts link remains in `index.html`, and the Google Fonts import remains in CSS. Exact font files were also downloaded from those providers and bundled locally for reliable rendering, including Inter weights 300–900. Provider CSS is saved in `font-source.css` and `inter-source.css`. Font credit: [Web Fonts / OnlineWebFonts](https://www.onlinewebfonts.com/fonts); its stylesheet specifies CC BY 4.0 attribution. Inter is supplied through Google Fonts.

Only this design's reference `/home/opc/motionsites/assets/previews/vaultshield.webp` was viewed. It is not embedded in the page. Layout, text, icons, buttons, and menu are real DOM. No asset recovery, extraction, or replacement artwork was necessary.

## Limits

The prompt specifies a hero without signup/sign-in destinations or pages for Plans, Install, News, and Help. Navigation uses named hash links; Vault points to the hero. The other destinations and signup/sign-in/Get It Free backend actions are unconfigured. No extra product features were added.

Chromium may cancel an initial MP4 range request while buffering/seeking (`net::ERR_ABORTED`), recorded in the checks; actual decode and autoplay passed. No external stylesheet failure occurred in the final check. Local font rendering was verified. Only Chromium was tested. The specified `object-cover` background naturally crops on mobile.

`ready` means ready for review, not published.
