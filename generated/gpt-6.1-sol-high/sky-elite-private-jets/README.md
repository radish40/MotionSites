# SkyElite Private Jets

Design ID: `sky-elite-private-jets`.

A responsive, full viewport hero built from PROMPT.md with React, TypeScript, Tailwind CSS, Lucide React, and Google Fonts Inter (400/500/600/700). The exact supplied CloudFront video uses autoplay, muted, loop, playsInline, and object-cover. Text and controls are real DOM elements.

## Build and run

With Node 22: `npm ci`, `npm run build`, then `npm run preview`.

Verified Docker build (this host has no Node):

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Serve all of `dist/` at `/motionsites-results/sky-elite-private-jets/`, the configured Vite base. `dist/index.html` and hashed JS/CSS are the static deliverable. No deployment was performed. package-lock.json records dependencies; node_modules is excluded.

## Verification

TypeScript and Vite production build passed. To reproduce Chromium checks using the existing image dependencies:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script temporarily serves dist under the configured base. Evidence:

- `screenshots/desktop.png`: 1440 × 1000.
- `screenshots/mobile.png`: 390 × 844.
- `screenshots/mobile-menu.png`: expanded menu.
- `screenshots/checks.json`: browser measurements.

Both viewports passed horizontal and vertical overflow checks, displayed the expected heading, loaded Inter, and played the supplied 1924 × 1076 video. readyState was 4; playback advanced; muted/loop/playsInline were confirmed. No script errors, console errors, or failed requests occurred. Menu open, close, and close-on-link-selection passed. CTA hover colors matched the prompt. Desktop and mobile screenshots were visually reviewed.

## Scope and limitations

The prompt specifies a hero only. Start returns to the hero. Story, Rates, Benefits and FAQ retain semantic fragment links; their content sections were not supplied. Discover and Book Now retain their specified button presentation. No destination or booking action was specified, so no additional flow or backend was invented. The mobile toggle uses useState, accessible labels and aria-expanded. Screens below 650px height reduce the upward offset to keep content usable.

The optional original reference `/home/opc/motionsites/assets/previews/sky-elite-private-jets.webp` was absent. The implementation follows the written prompt; no reference imagery was extracted or substituted. CloudFront returned HTTP 200 and the video and Google Fonts loaded in both checks. These remain external network dependencies; availability and autoplay policies can vary. Mobile verification used a Chromium viewport, not a physical phone. Checks cover the hero and its specified interactions.
