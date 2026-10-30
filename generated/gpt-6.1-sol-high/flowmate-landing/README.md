# FlowMate

A responsive landing page for the AI workflow automation platform, implemented from the complete local `PROMPT.md` specification. Project ID: `flowmate-landing`.

React 18, TypeScript 5.6, Vite 6, Tailwind CSS 3.4, Framer Motion 12, and Lucide React. Includes the 240px desktop sidebar, section tracking, responsive navigation, PPMondwest typography, local video with liquid-glass prompt and 50ms typewriter effect, six feature cards, and a five-card carousel with four-second rotation, manual controls, and reduced-motion support.

## Run and build

With Node 22:

```bash
npm ci
npm run dev
npm run build
npm run lint
```

The application base is `/motionsites-results/flowmate-landing/`. Open that path on the Vite development or preview server. The complete static output is in `dist/`, including `dist/index.html` and all media.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build && npm run lint'
```

## Browser verification

The browser script serves the real production build at its configured subpath, then uses the image's Chromium and Playwright Core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Desktop: 1440×1000. Mobile: 390×844. Full-page screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Machine-readable checks are in `screenshots/browser-checks.json`. Checks cover font/image/video loading, horizontal overflow, intro anchor, full typed prompt, video playback controls, sidebar IntersectionObserver, mobile navigation, carousel next/previous/dots/automatic rotation, dialog opening, local form confirmation, Escape dismissal, console errors, script errors, and failed HTTP responses.

## Assets and limitations

All eight prescribed assets (font, sunflower logo, video, five card images) were recovered from their original URLs and are served locally. The initial Python video request stalled; a subsequent curl request retrieved the original 13,142,404-byte MP4. No replacement imagery or screenshot extraction was needed. `asset-manifest.json` records original URLs and sizes. Integration marks are inline SVG illustrations; Lucide provides interface icons.

The optional FlowMate reference preview did not exist at the supplied path. Visual review therefore follows the written prompt; comparison against that preview was unavailable. Screenshots capture a moment in the looping video and carousel.

The prompt supplies no account, pricing, or community backend or external destinations. Those controls open an explicitly labeled local preview dialog; valid email input produces a confirmation for the current visit and sends no data. Authentication and workflow execution require a future backend. No deployment or push was performed.
