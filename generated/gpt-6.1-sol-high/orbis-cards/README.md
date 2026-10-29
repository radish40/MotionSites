# Orbis Cards

A React + Vite + Tailwind implementation of the supplied Orbis Cards design (`orbis-cards`). Uses the specified Anton and Condiment Google Fonts, navy background, neon accent, exact liquid-glass CSS, responsive typography, and three original animated space characters with rarity scores.

The static build is in `dist/`. Its configured public base is `/motionsites-results/orbis-cards/`. No deployment or push was performed.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

On the provided Docker host:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Open the configured base path, not `/`, when using Vite. The lockfile is included; node_modules is ignored.

## Behavior and validation

The three chevrons open an accessible native dialog with the corresponding original video and score. Escape, the close button, and the backdrop dismiss the preview. “SEE ALL CREATORS” scrolls to the existing collection and focuses its first action; the prompt provides no separate creators destination. Reduced-motion preference pauses the background previews. Keyboard focus has a neon outline.

Production files were served from the actual required subpath and checked in headless Chromium through the image's existing Playwright installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Validated desktop 1440×1000 (three columns), mobile 390×844 (one column), and tablet 820×1000 (two columns): no horizontal overflow, fonts loaded, all three videos decoded and autoplayed muted and looped, all preview actions and Escape dismissal worked, collection action focused correctly, and reduced motion paused previews. No script errors or failed requests were observed. `npm run build` and `npm audit` pass with zero reported vulnerabilities.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png` (full-page mobile capture, viewport 390×844). Structured browser evidence: `screenshots/checks.json`.

## Assets and limits

All three exact supplied CloudFront MP4s returned HTTP 200 and were downloaded unchanged to `public/assets/`, then copied into the build. Source prefix:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/`

- `hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4` → `space-01.mp4`, rarity 8.7/10.
- `hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4` → `space-02.mp4`, rarity 9/10.
- `hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4` → `space-03.mp4`, rarity 8.2/10.

Google Fonts is loaded in `index.html` as requested and therefore needs network access; it loaded successfully in the browser checks. Videos need no external connection after download. Total original video payload is approximately 32 MB. The supplied Orbis-only reference was viewed for composition, with no extraction or screenshot used in the page. The implementation follows the prompt's solid background and DOM specification. Browser verification covers Chromium, not Safari or Firefox; autoplay remains subject to browser policy. Screenshot frames vary because the original videos animate. Ready means ready for review, not published.
