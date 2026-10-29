# Creative Studio

A full-screen, responsive creative studio hero built from `PROMPT.md` with React 18, Tailwind CSS 3, Framer Motion, Lucide React, and Inter Semibold. Includes the supplied looping video, staggered entrance animations, three impact statistics, and a full-screen navigation menu with keyboard focus management and Escape dismissal.

The production base is `/motionsites-results/creative-studio/`. The deliverable is `dist/`, including `dist/index.html`; no deployment has been performed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the base path shown above on the development or preview server.

This host uses the available Docker image instead of a host Node installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

The browser check serves the actual production output at its configured subpath, using Chromium and Playwright Core from the Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The check validates desktop 1440×1000 and mobile 390×844, loaded fonts, active video playback, viewport overflow, navigation menu opening, close button, Escape dismissal, menu link navigation, CTA destination, failed requests, and browser script errors. It also measures heading/description separation at intermediate widths.

- `screenshots/desktop.png`: desktop production screenshot.
- `screenshots/mobile.png`: mobile production screenshot.
- `screenshots/browser-report.json`: browser measurements and check results.

## Assets and limits

The exact video specified in the prompt was downloaded from:
`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4`

It is served locally as `public/assets/studio-background.mp4` (approximately 21 MB). Inter 600 was retrieved through Google Fonts and is served locally as `public/assets/inter-semibold.ttf`. No live external asset requests are needed at runtime.

The prompt supplies no destination pages or contact address. Navigation links point to the corresponding existing hero content; “Work With Us” opens an email draft using `mailto:` without inventing a recipient. A production contact address can be supplied later.

The specified heading clamp is preserved at the required desktop and mobile sizes. At widths below 360px and from 768–809px, a small font-size adjustment keeps the heading inside the viewport with the required fixed-width description.

Vite emits non-fatal notices about ignored Framer Motion `use client` directives in this client-only build. The build completes successfully.
