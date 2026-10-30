# Innovation

Design ID: `innovation-landing`. A single-page Asme landing site built with React, TypeScript, Vite, Tailwind CSS, framer-motion, and lucide-react. Includes the five requested sections, original video assets, Instrument Serif, reusable liquid glass styling, scroll reveals, and requestAnimationFrame hero video fades.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/innovation-landing/`. Vite's base is configured for that path. The complete publishable static site is in `dist/`; `dist/index.html` is its entry point. No deployment or push has been performed.

The host's available Docker image can also run the build:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Assets

All five original CloudFront MP4s from PROMPT.md were downloaded without modification to `public/assets/` and bundled into `dist/assets/`. The mapping is:

| Local file | Original filename |
| --- | --- |
| hero.mp4 | hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4 |
| featured.mp4 | hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4 |
| philosophy.mp4 | hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4 |
| strategy.mp4 | hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4 |
| craft.mp4 | hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4 |

All originate at `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/`. No screenshot-based assets or substitutes were used. Instrument Serif is loaded through the exact Google Fonts CSS import requested in the prompt, requiring an internet connection. The optional original WebP preview was absent, so reference-image comparison was unavailable.

## Browser verification

The reproducible Chromium verification script serves the production build at the required subpath, checks 1440×1000 desktop and 390×844 mobile, saves viewport and full-page screenshots, and writes `screenshots/browser-checks.json`.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Checks cover video decoding/playback, Google font loading, horizontal overflow, signup focus and feedback, login/service dialogs, keyboard dismissal, manifesto and navigation anchors, pricing control, hero restart, and script errors. Screenshot evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, plus `desktop-full.png` and `mobile-full.png`.

## Scope and limitations

No backend, account provider, newsletter endpoint, pricing data, or brand social URLs were supplied. Signup validates email and explicitly reports that signup is not connected; it does not store or transmit email. Login and pricing explain their preview status. Service buttons show the supplied service descriptions. Instagram and Twitter link to their platform homepages. Manifesto, Explore more, Features, About, and globe controls navigate to the corresponding sections.

The mobile featured video uses a taller frame to keep the requested stacked overlay legible. The heading scales to stay on one line on small screens. Reduced-motion preferences disable reveal movement and smooth scrolling; background video remains as requested. Autoplay remains subject to browser/device policy. The bundled original videos total approximately 75 MB. This deliverable is ready for review, not deployed.
