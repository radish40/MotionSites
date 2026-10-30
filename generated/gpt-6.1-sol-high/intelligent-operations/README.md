# Intelligent Operations

Design ID: `intelligent-operations`. The page is branded NovaAI and uses the title **NOVA_AI — Today AI Aligns With Bold Dreams**.

Implemented with React, TypeScript, Vite, Tailwind CSS and lucide-react. Includes the prescribed copy, Inter 400/500/600/700 from Google Fonts, fixed video background, staggered IntersectionObserver reveals, responsive glass UI, 80vh spacer and capability section. All content remains real DOM.

## Run and build

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vite base is `/motionsites-results/intelligent-operations/`. The complete static deliverable is `dist/` including `dist/index.html`. A dependency lockfile is included; node_modules is ignored.

On the supplied host, use the existing container image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Assets and motion

The exact CloudFront MP4 and Higgs portrait URLs are preferred in production. `public/hero.mp4` and `public/mitha.webp` are byte-for-byte downloads of those required URLs and serve as error fallbacks. `public/hero-poster.jpg` is extracted from the same video at 0.001 seconds, after seeking, to ensure a decoded first frame. No reference screenshot is used in the webpage. Only the supplied design's WebP reference was viewed.

Video does not autoplay or loop. Page progress uses lerp 0.12, with a paused-video seek fallback. After loadeddata and a 300ms yield, the offscreen extractor downloads the same video into a blob to avoid repeated remote range requests, and caches up to 90 ImageBitmaps at maximum width 960. Canvas uses centered object-cover cropping and DPR capped at 2. Poster/video/canvas crossfade over 500ms. Frames are released on unmount. Cache preparation time depends on browser decoding speed; seek fallback remains active until it finishes.

## Browser validation

The production build is served by `scripts/serve.cjs` under the actual required subpath. `scripts/check.cjs` uses Chromium and playwright-core from the supplied Docker image. It checks desktop 1440×1000 and mobile 390×844, horizontal overflow, font/image loading, scroll frames, responsive navigation, reveal states, home and consultation anchors, and JavaScript errors. Both viewports verified 90 cached frames and scroll progression from frame 0 to frame 89, with no horizontal overflow or JavaScript errors. Detailed observations are in `screenshots/browser-checks.json`. `scripts/fallback-check.cjs` intentionally blocks the remote video and portrait, verifies local mirrors, paused video seeking to its final second, the 2px capability-chevron hover movement, and the demo anchor. Its evidence is in `screenshots/fallback-checks.json`.

Required screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional capability screenshots show the second section at both sizes. `scripts/poster.cjs` reproduces poster generation when serving `public/` via `SERVE_DIR=public`.

## Scope and limitations

No external booking URL, demo application or separate destinations for Projects/About/Blog were specified. Navigation therefore uses relevant in-page section anchors, consultation links target the Mitha card, and the demo link scrubs back to the video spacer. The booking pill targets the contact card; it does not claim to schedule an appointment. No backend or additional product flow was invented.

CloudFront media requests may appear as `net::ERR_ABORTED` when Chromium replaces a media range request or closes a page; these are preserved in the browser report. Google Fonts requires network access. Local video/portrait mirrors and a local poster are packaged. No deployment or push was performed.
