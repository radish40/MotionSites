# Digital Reality

Design ID: `digital-reality-hero`. A React functional component styled with Tailwind CSS v4, built with Vite. Implements the supplied PROMPT.md: a 600 × 800 cinematic portfolio card, exact remote background video, SVG film noise, Didot/Inter typography, glass message button, and footer.

The card keeps its inline 600 × 800 dimensions and scales proportionally on narrow screens. At 390 × 844, it occupies 366 × 488 with 12px horizontal margins. No gradient overlays are applied to the video.

## Build and run

From this project directory, using the provided Node 22 Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The static output is `dist/`, including `dist/index.html`. Vite uses `/motionsites-results/digital-reality-hero/` as its base. To preview locally:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
```

Visit `http://localhost:4173/motionsites-results/digital-reality-hero/`. Dependencies are locked in `package-lock.json`; `node_modules/` is ignored.

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

This serves the actual built output in a temporary container and checks Chromium at desktop 1440 × 1000 and mobile 390 × 844. Assertions cover video playback, font availability, no horizontal overflow, keyboard focus, desktop hover glow, and the contact button's mailto navigation. Detailed evidence is in `screenshots/browser-checks.json`. Screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`; the video is temporarily paused at 3 seconds for repeatable captures, after playback has been verified. The page normally plays continuously. Both screenshots were visually reviewed. Mobile touch devices do not maintain the desktop hover state.

Final build succeeds. Dependency install reports zero vulnerabilities. Final browser results contain no JavaScript exceptions, console errors, or HTTP errors. Mailto requests appear as `net::ERR_ABORTED` in headless Chromium because they hand off to an external application; the requested destination is verified with the Chrome DevTools Protocol. No email was sent.

## Assets, attribution, and limits

- The exact CloudFront MP4 from PROMPT.md is used directly and was verified playing. Video requires network access; no substitute or screenshot background is used.
- Global CSS imports Inter weights 100–500 from Google Fonts and Didot from the exact requested OnlineWebFonts URL. Both load successfully in browser checks. Identical font files are also stored in `public/fonts/` under separate fallback family names. `didot-source.css` and `inter-source.css` retain source metadata.
- Didot source attribution: [Web Fonts / OnlineWebFonts](https://www.onlinewebfonts.com/fonts), identified as CC BY 4.0 by its supplied CSS. Inter is by [Rasmus Andersson](https://rsms.me/inter/) under the SIL Open Font License. The font files retain their embedded metadata.
- The optional original reference WebP was absent at its specified path, so no pixel comparison or extraction was possible. Implementation follows the full written prompt; all visual content is genuine DOM/CSS/video.
- The prompt supplies the placeholder `your.name`, with no contact destination. Message and name actions use `mailto:hello@your.name`; replace this placeholder in `src/main.jsx` with the owner's address. Actual email delivery is outside browser validation and requires a configured mail client.
- Validation uses Chromium desktop and mobile viewport emulation, not a physical phone or Safari.

Ready means available for review. Nothing was deployed or pushed.
