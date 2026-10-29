# Impact Ventures

Design ID: `impact-ventures`. A responsive, fullscreen **Atelier** agency hero, implemented from this project's `PROMPT.md` with React, Tailwind CSS, Lucide React icons, and Vite. The page uses the specified wording, Instrument Serif and Inter fonts, supplied video, responsive spacing, and animated mobile navigation.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/impact-ventures/`. Vite's base is set to that exact path. The deployable static output is `dist/`, including `dist/index.html` and the locally served video. `package-lock.json` pins dependencies.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The production build was served under the required subpath in a temporary local HTTP server and checked with the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

- Desktop: 1440 × 1000; mobile: 390 × 844.
- Video loaded at 1920px source width, autoplaying muted, looping and covering the viewport.
- Instrument Serif and Inter loaded successfully from Google Fonts.
- No horizontal overflow or browser script/console errors.
- Mobile navigation opens and closes through its buttons, Escape, and link selection. It includes focus containment, focus restoration, and staggered transitions.
- See Cases updates the project hash. Watch Reel opens the supplied video in fullscreen with native controls.
- Screenshots visually reviewed: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. Screenshots pause the video at two seconds for a repeatable frame; normal playback is automatic.
- Machine-readable browser results: `screenshots/browser-checks.json`. Chromium may cancel video range requests while seeking or closing a page; these are recorded separately and playback passed.
- Dependency audit: zero known vulnerabilities after updating Vite and PostCSS.

## Assets and scope

The original video was fetched successfully (HTTP 200) and copied unchanged to `public/assets/atelier-hero.mp4`:

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204103_f607742e-09da-4cf5-bb06-4e67b0a531de.mp4

The exact requested Google Fonts links remain in `index.html`; fonts require an internet connection. No failed font or video assets were observed in the final checks.

The brief defines a single hero section. Projects, Expertise, Studio, Insights, and Reach Out links reserve hash destinations; subsequent sections, case studies, and contact forms are outside this implementation. Watch Reel uses the supplied video because no separate reel asset was provided. Fullscreen support depends on the browser; a native-video-control fallback is included. Reduced-motion preferences disable menu transitions.

No deployment or push was performed. `ready` in `result.json` means ready for review.
