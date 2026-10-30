# Dark Portfolio Hero

Design ID **15**. A Next.js 14 App Router + TypeScript portfolio hero for Michael Smith, with Tailwind CSS v3 theme tokens, GSAP entrance animations, Framer Motion loading transitions, and the specified Mux video. Static output is in `dist/`, configured for `/motionsites-results/15/`.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
# Open http://localhost:3000/motionsites-results/15/
npm run build
```

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -e NEXT_TELEMETRY_DISABLED=1 \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`next build` generates a static export; `scripts/finalize.mjs` copies it into `dist/`. Serve that directory at the configured subpath. No Next.js server is required for the exported page. Dependencies are pinned in `package-lock.json`; `node_modules` is excluded from delivery.

## Implemented behavior

The loader counts 000–100 over 2.7 seconds, cycles Design/Create/Inspire at 900ms intervals, waits 400ms, then exits over 600ms. Page opacity fades in and GSAP reveals the name and blurred content. Creative/Fullstack/Founder/Scholar rotate every two seconds. The navbar, buttons, blue gradient rings, scroll dot, video overlays, and responsive typography follow the prompt. The logo intentionally retains the specified **JA** initials alongside Michael Smith's name.

The prompt provides no work entries, resume document, or email address. Work/See Works and Resume open small, dismissible panels that explicitly state the missing content. Contact buttons open an email draft with subject “Hello Michael” and an empty recipient; no address is invented. These destinations require owner-supplied content for production use. The scroll marker returns to the top of the sole hero section.

## Assets and recovery

- Video: the exact supplied `https://stream.mux.com/Gs3wZfrtz6ZfqZqQ02c02Z7lugV00FGZvRpcqFTel66r3g.m3u8`. Native HLS is used where supported; hls.js provides Chromium playback. This remains an external network dependency.
- The corresponding Mux `thumbnail.avif?time=2&width=1920` endpoint returned HTTP 404. The same video's `thumbnail.jpg?time=2&width=1920` endpoint returned HTTP 200. Its isolated background frame is preserved as `public/assets/hero-source.jpg` and converted to `hero-poster.avif` using Sharp, quality 65. Recovery is reproducible with `node scripts/prepare-assets.mjs`. This is a video frame fallback, not a screenshot of a page. The only approximation is JPEG-to-AVIF re-encoding of that frame.
- Google Fonts Inter regular and Instrument Serif regular/italic were downloaded from Google Fonts and are served locally. Source URLs are preserved in `font-source.css`; actual font files are in `public/fonts/`. The CSS exposes `--font-body` and `--font-display`.
- The optional `/home/opc/motionsites/assets/previews/15.webp` reference was absent. No other design or preview was read.

## Verification

A real production build passed, including Next.js TypeScript checks. `build.log` records the result. Chromium 148 was run against **dist** served at the required subpath, using the image's Playwright installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work \
  --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Both required viewports passed: desktop 1440×1000 and mobile 390×844. Checks cover loader dismissal, exact heading, font availability, role cycling, work/resume controls, close button/Escape, contact hrefs, Home navigation, hover, and horizontal overflow. Both video elements reached readyState 4 and played with advancing time. There were zero JavaScript errors and zero failed network requests. Email client delivery is outside browser verification; only the mailto targets were checked. Native Safari HLS was not tested.

Screenshots were visually inspected:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/loading.png`

Machine-readable evidence: `screenshots/browser-report.json` and `browser-check.log`.

`dependency-audit.json` records npm's audit: 1 critical and 2 high findings in the requested Next.js 14 dependency tree and Sharp conversion tooling. npm recommends a Next.js major upgrade for framework findings; the requested Next.js 14 stack is preserved. This deliverable is a static export and does not run the Next.js request server. The audit remains a dependency limitation for future maintenance.

Status **ready** means built and ready for management review. Nothing was deployed or pushed.
