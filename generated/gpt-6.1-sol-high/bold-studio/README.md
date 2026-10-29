# Bold Studio

Design ID: `bold-studio`. Page brand: **VANGUARD**.

A single viewport creative agency hero built with React, TypeScript, Tailwind CSS and Vite. Includes the specified CloudFront video, PODIUM display type, Inter, Lucide icons, staggered entrance animations, responsive navigation, mobile menu and agency statistics.

## Run and build

With Node 22/npm available:

```sh
npm ci
npm run dev
npm run build
```

The Vite base is `/motionsites-results/bold-studio/`. Publish the contents of `dist/` at that path. `dist/index.html` is the built entry point. Dependencies are locked in `package-lock.json`; `node_modules` is excluded.

In the supplied environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v /home/opc/motionsites/generated/gpt-6.1-sol-high/bold-studio:/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

A real production build passed TypeScript and Vite. Chromium/Playwright checked the production files served under their configured subpath at 1440×1000 and 390×844. Both had matching document/viewport dimensions, loaded display and body fonts, and playing video (`readyState: 4`, no media error). Mobile menu opening, close button and navigation link dismissal passed. No JavaScript errors or failed network requests were recorded.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. Raw evidence: `browser-checks.json`.

To repeat the browser verification in the supplied image (after building):

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v /home/opc/motionsites/generated/gpt-6.1-sol-high/bold-studio:/work -w /work --entrypoint node louislam/uptime-kuma:2 check.cjs
```

## Assets and limits

The required video and fonts remain external and require network access. All loaded successfully during browser verification. Display font source/credit: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts); its hosted CSS includes author and license information. Inter is served by Google Fonts.

This is the requested single hero, with no routing or portfolio sections. Navigation uses anchors within the hero. Contact buttons use the demo address `hello@vanguard.studio`; no actual inbox or email delivery is configured or verified. Short viewports allow vertical scrolling so content stays accessible. Reduced-motion preferences disable entrance motion. No deployment or push was performed.
