# xPortfolio Hero

Design ID: `x-portfolio-hero`. Brandly is a single-screen brand design agency hero built with React, Tailwind CSS (default theme), Lucide React, and Vite. The page uses real DOM text and controls over the specified fullscreen MP4, with Anton headings and Inter body type. No scripted or CSS entrance animations are used; the background video plays continuously.

## Build and run

Requires Node 22/npm, or the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The complete publishable site is in `dist/`, including `dist/index.html`. Its configured base is `/motionsites-results/x-portfolio-hero/`. No deployment has been performed. `package-lock.json` pins dependencies; `node_modules/` is excluded.

For local development, run `npm ci` followed by `npm run dev`. For the production build, use `node scripts/serve.cjs` and visit `http://localhost:4173/motionsites-results/x-portfolio-hero/`.

## Browser validation

A real production build was served within a temporary Docker container and checked with Playwright Core and Chromium 148. Checks cover desktop **1440 × 1000** and mobile **390 × 844**:

- Viewport-sized document with no horizontal or vertical overflow; all six brand cards visible.
- Original MP4 decodes at 1924 × 1076; autoplay, muted, loop, and inline playback verified.
- Anton and Inter font faces load successfully.
- No JavaScript exceptions, failed requests, or HTTP error responses.
- All five desktop navigation panels open and close; CTA enquiry, sign-up dialog, local demo login, and Escape dismissal work.
- Desktop and mobile screenshots were visually inspected. The video is paused at two seconds only during screenshot capture for reproducible framing.

Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/checks.json`. To reproduce, start `scripts/serve.cjs`, then run `node scripts/check.cjs` inside the image (the script uses its preinstalled `/app/node_modules/playwright-core`). `scripts/font-check.cjs` is an additional font diagnostic.

## Assets and limits

The video was downloaded without alteration from the exact supplied source:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_102305_3a7cab3b-7a86-46e8-a0f9-6937f035b087.mp4`

It is bundled as `public/assets/brandly-background.mp4` so playback does not depend on the remote CDN. Google Fonts is linked in `index.html` as requested. The same Google Fonts Anton 400 and Inter 300/400/500/600/700 files are also bundled with a local stylesheet for dependable rendering. Both Google Fonts and local font requests returned HTTP 200 during verification. Vite emits an informational warning that the public font stylesheet is resolved at runtime; the stylesheet and font files are present in the production output and verified in Chromium.

The optional original reference `/home/opc/motionsites/assets/previews/x-portfolio-hero.webp` was absent. Composition follows `PROMPT.md`; no screenshot extraction or asset reconstruction was needed. Descriptive paragraphs and brand symbols were not fully specified, so short agency copy and six distinct Lucide symbols complete those elements. Mobile spacing/type sizes are adapted to retain the complete hero in one viewport.

Navigation opens compact informational dialogs within the single screen. Account and enquiry forms are explicitly labeled local demos, with no backend, submission, persistence, or real account creation. Social links point to the named platforms' homepages because no agency profiles were provided. No social messages were sent. Validation was performed in Chromium at the two requested viewports; other browsers and extreme viewport sizes were not tested.
