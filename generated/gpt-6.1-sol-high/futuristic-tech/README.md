# Futuristic Tech

Design ID: `futuristic-tech`. A full-viewport cinematic hero for **axentra**, implemented from the complete `PROMPT.md` using React 18, TypeScript, Tailwind CSS 3, Vite, and lucide-react. The page includes the exact headline and supporting copy, liquid-glass desktop navigation, the animated mobile menu, and the supplied looping video.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
```

The Vite base is `/motionsites-results/futuristic-tech/`. Open that path on the development or preview server. `npm run build` performs TypeScript checking and produces the complete static site in `dist/`.

The environment used for the verified build has Node and Chromium in Docker:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

No deployment or push has been performed. `node_modules/` is excluded and removed from the handoff; `package-lock.json` is included.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

This script serves the actual `dist/` build at the required subpath and uses the image's existing playwright-core and Chromium. It checks desktop **1440×1000** and mobile **390×844**, video playback/muting/looping/inline mode, Inter availability, viewport overflow, the motion CTA, waitlist dialog, and menu opening, Escape, link dismissal, and backdrop dismissal. All 17 assertions pass. There are no JavaScript exceptions, console errors, or HTTP asset errors. The npm dependency audit reports zero vulnerabilities.

Artifacts:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`
- `screenshots/browser-checks.json`

The screenshots show the actual rendered page with the film paused at three seconds for reproducibility; normal page playback autoplays and loops. The poster is a frame extracted from this same film. Chromium reports canceled video byte-range requests (`net::ERR_ABORTED`) during deliberate seeking and page cleanup; actual playback and subsequent restart both pass.

## Assets and scope

The provided video was downloaded unchanged into `public/assets/hero.mp4` from:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260525_052706_d2e390fd-1846-4fe7-a4d8-8d2f1c875358.mp4`

Video source responded HTTP 200 and Chromium decoded it at 1920×1080. The local copy avoids a runtime dependency on CloudFront. Google Fonts Inter is imported using the requested URL and weights 400, 500, 600, 700; it loaded in browser checks. Font loading still requires external network access; sans-serif is the fallback. Icons come from lucide-react. The small favicon is native SVG text.

The brief supplies only this hero, with no destination pages or waitlist service. Navigation links update corresponding same-page fragments and dismiss the mobile menu. “Join the wait” displays a dismissible “Waitlist registration is coming soon” dialog; it does not collect or transmit data. “See it in motion” restarts and plays the supplied film. No backend, extra sections, or signup service is included.

`ready` in `result.json` means ready for management-session review, not live deployment.
