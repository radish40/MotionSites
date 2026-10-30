# Apex SaaS

A responsive APEX landing page implemented from `PROMPT.md` with React, TypeScript, Tailwind CSS and Vite. Includes the floating glass navigation, revenue growth hero, original animated video, assurance row, and seamless brand marquee. Geist Sans weights 400, 500, 600 and 700 and all video assets are bundled locally. Icons use lucide-react.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production base is `/motionsites-results/apex-saa-s/`. Publishable files are in `dist/`, including `dist/index.html`. No deployment was performed.

The provided environment has no host Node/npm; the actual build command is:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

## Browser verification

Run the reproducible production browser check:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

This serves `dist/` under the required subpath in a temporary HTTP server and checks actual Chromium rendering at desktop 1440×1000 and mobile 390×844. It verifies no horizontal overflow, successful video decoding/playback and fade-in, font loading, marquee animation, all navigation buttons, Nova+ exploration, three CTA forms, mobile menu, and dialog closing through the close button and Escape. It records console errors and failed network requests. Screenshots are full-page captures with the requested viewport widths and heights; mobile content naturally scrolls.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/checks.json` — machine-readable browser evidence

## Assets and limits

The specified CloudFront MP4 returned HTTP 200 and was downloaded without alteration to `public/assets/apex-background.mp4` (12,047,303 bytes). Original source:

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260308_114720_3dabeb9e-2c39-4907-b747-bc3544e2d5b7.mp4

The optional `/home/opc/motionsites/assets/previews/apex-saa-s.webp` was absent. No reference image extraction or substitute artwork was used. Visual validation follows the written prompt and rendered screenshots; exact reference comparison is unavailable.

CTA dialogs provide local form validation and clearly disclose that this is an interactive preview. There is no supplied account, email, or scheduling backend, so no submissions are sent or stored. Navigation opens concise local information dialogs rather than linking to nonexistent pages. Reduced-motion preferences disable the marquee and CSS transitions. Video remains muted and loops.

Only this project was read and written. No agents, other sessions, messages, pushes, or deployments were created. The runtime model is controlled externally; no model switch was performed within the project.
