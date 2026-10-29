# Kova Testimonial

A standalone Kova testimonial section implemented from `PROMPT.md` using React 18, TypeScript, Tailwind CSS 3, and Framer Motion. Project ID: `kova-testimonial`.

Preserves the supplied copy, colors, desktop 3:2 grid, responsive spacing, Cooper fonts, SVG arrow, square video, and individual scroll-triggered FadeUp animations. No other page sections are included.

## Build and run

With Node.js 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/kova-testimonial/` on the preview server. Vite's base matches this path. Publishable static output is in `dist/`, including `dist/index.html`. No deployment was performed.

On the provided host without Node/npm:

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.npm-home -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --cache /work/.npm-cache && npm run build'
```

The dependency lockfile is included. Dependencies and temporary caches are omitted from the delivery.

## Validation

TypeScript checking and the Vite production build passed. The built output was served at its configured subpath and tested in Chromium using Playwright. Reproduce after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.browser-home -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Checks passed at desktop 1440×1000 and mobile 390×844:

- Both supplied Cooper font faces loaded.
- Heading and quote sizes, desktop columns, and mobile stacking match the prompt.
- Video loaded and autoplayed muted with loop, playsInline, square dimensions, and no media error.
- Button hover color, keyboard focus, Enter, and Space work without errors.
- No horizontal overflow, page errors, console errors, or failed requests.
- At an additional 390×400 viewport, the offscreen video remained hidden until scrolling into view. Animations stayed visible after subsequent scrolling.

Evidence: `screenshots/browser-report.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`. Screenshots are full-page captures using the specified viewports. For consistent captures only, the checker pauses the supplied video at 1.5 seconds after verifying autoplay. The delivered page plays it normally. Both screenshots were visually reviewed.

## Assets and limitations

Both exact OnlineWebFonts stylesheet links remain in `index.html`, and the exact CloudFront URL remains on the video element. These assets loaded successfully during browser validation. They require network access and remain dependent on their providers. No substitute imagery or fonts were used. Font provider: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts); fonts: Cooper BT W01 Light and Cooper BT W01 Medium.

The prompt specifies an “All Stories” button without a destination or click behavior. Its visual, hover, and keyboard states are implemented; it does not navigate or open additional content.

`ready` in `result.json` means available for review, not deployed.
