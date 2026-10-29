# Portal

Password manager landing-page hero from `PROMPT.md`, implemented with React 18, TypeScript, Vite, Tailwind CSS 3, Framer Motion, and Lucide React. Project ID: `portal`. Release base: `/motionsites-results/portal/`.

Includes the specified SVG logo, wording, fonts, colors, original looping video, entrance animations, CTA hover/tap animations, and animated mobile menu. The sheet supports Escape, backdrop dismissal, focus trapping/restoration, and closing when resized to desktop.

## Build and run

With Node 22 and npm, run `npm ci`, then `npm run dev` or `npm run build`. Use `npm run preview` to serve the production build. Open `/motionsites-results/portal/` on the printed local address. Output is in `dist/`, including `dist/index.html`, bundles, and video. The dependency lockfile is included; node_modules is excluded.

Actual successful build:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/portal:/work \
  -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install && npm run build'
```

## Verification

The built files were served at the configured subpath and checked with Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/portal:/work \
  -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.cjs
```

Passed at 1440×1000 and 390×844: no runtime script errors or horizontal overflow; original video loaded and playing; Helvetica Now Display Bold and used Inter font faces loaded. Desktop CTA hover was checked. Mobile menu displayed five links and both CTAs, and dismissed using Escape, backdrop, a link, and its close button. Focus returned to the trigger.

Screenshots were visually inspected:

- [Desktop](screenshots/desktop.png)
- [Mobile](screenshots/mobile.png)
- [Mobile menu](screenshots/mobile-menu.png)
- [Browser check report](screenshots/browser-checks.json)

## Assets and limits

The exact CloudFront MP4 from the prompt downloaded successfully, unmodified, to `public/assets/portal-background.mp4` and is included in `dist/assets/`. No preview extraction or screenshot-based page content was used. Only the Portal reference was viewed for composition.

The specified heading stylesheet remains in `index.html`; the Google Fonts import remains in `src/index.css`. Both loaded successfully and still require internet access. Heading font source: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts); the supplied stylesheet identifies CC BY 4.0.

Chromium recorded three `net::ERR_ABORTED` video requests during media range loading or page teardown. Actual video dimensions and playback were verified on both viewports. Unused Inter subsets/weights remain unloaded normally.

Below 480px, the heading and inline icons are slightly smaller (17px icons) to preserve the nowrap first line without clipping at 390px. Desktop retains the specified 48px maximum heading and 24px icons.

Navigation destinations and account/download actions were unspecified. Links are same-page placeholders and CTAs are presentation controls; no account service or additional pages were invented. Mobile menu interactions work.

Ready for review; not deployed or pushed.
