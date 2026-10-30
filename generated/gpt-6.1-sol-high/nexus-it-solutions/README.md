# Nexus IT Solutions

Single-viewport landing page implemented from this project's full PROMPT.md using React, TypeScript, Tailwind CSS, and Vite. Includes the original animated background, gradient heading, Akshar navigation and supporting copy, eight-span notched CTA, and trusted brand typography. Mobile navigation collapses into a toggle menu.

## Build and run

Requires Node.js 22 and npm. Run from this directory:

```bash
npm ci
npm run build
npm run dev
```

Production files are in `dist/`, including `dist/index.html`. The configured base is `/motionsites-results/nexus-it-solutions/`; open that full path on the dev or preview server. A dependency lock file is included and node_modules is ignored.

Without host Node/npm:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The check starts a temporary local server in the container and opens actual Chromium through the image's existing playwright-core. No deployment is performed.

Verified at 1440×1000 and 390×844:

- Production page loads at the required subpath with zero script errors or failed requests.
- No horizontal or vertical page overflow at either required viewport.
- Both Akshar and Inter load through the Google Fonts link in index.html.
- Original 1924×1076 video advances while playing, is muted and looping, and uses object-fit: fill.
- Mobile menu opens and closes on Home selection; keyboard focus is visible; desktop contact hover applies.
- CTA email draft link attributes and all eight corner spans are present.

Artifacts: screenshots/desktop.png, screenshots/mobile.png, and screenshots/browser-checks.json. Screenshots use the original video at two seconds for consistent captures; the delivered page autoplays continuously. Both screenshots were visually inspected.

## Assets and integration limits

Original video source:

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_065810_0098b193-498c-4d26-9abd-5db8bf4fb479.mp4

The download succeeded. Its unchanged contents are bundled in public/assets/nexus-background.mp4 and copied to dist/assets, avoiding a CloudFront runtime dependency. No overlay, cropping, screenshot background, or extracted substitute is used. Brand names are live text with a small inline vector Amazon smile. Fonts remain externally hosted by Google and require network access.

The optional reference at /home/opc/motionsites/assets/previews/nexus-it-solutions.webp does not exist. The page follows the written prompt; reference-image comparison was unavailable.

The prompt provides only a hero, with no team/news pages or contact recipient. Home and Solutions link to existing hero elements. Our Team and News retain section-fragment placeholders pending supplied destinations; no extra pages or editorial content were invented. Both CTAs open an email draft with a subject and empty recipient. A configured mail client and recipient entry are required. Browser checks validate link attributes, not external email delivery.

The mobile frame has a 680px minimum height to retain access to copy on unusually short displays. The requested 390×844 viewport fits without scrolling.

Ready means ready for review, not deployed. Nothing was pushed or deployed; no other designs were read.
