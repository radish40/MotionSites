# Radial Diagram

A real React component implementing **Our Comprehensive Branding Approach** from `PROMPT.md`. Built with React 18, TypeScript, Tailwind CSS 3, Framer Motion 12, and Vite. The reusable component is `BrandingApproach` in `src/main.tsx`.

The dark section includes the two-line heading, Pexels portrait, ten animated glitch blocks, testimonial, and three-spoke SVG diagram. Entrance animations use the specified easing and once-only `useInView` trigger. Hovering or focusing a diagram label highlights its matching line; touch selects a label. The plus button replays the entrance animation. All content is real DOM/SVG.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/radial-diagram/` on the preview server. Production output is in `dist/`; Vite's configured base is `/motionsites-results/radial-diagram/`. The dependency lockfile is included; `node_modules` is excluded.

This host uses the provided Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The production build passed TypeScript checking and Vite bundling. The dependency installation reported zero vulnerabilities. Real headless Chromium checks used the built files at the configured subpath:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

- Desktop viewport: 1440 × 1000; mobile viewport: 390 × 844.
- Portrait and DM Sans loaded; all ten glitch blocks rendered; heading animation finished.
- Desktop hover and keyboard focus increased matching line opacity/stroke width and label weight.
- Mobile touch selected and highlighted the matching diagram label.
- The plus button successfully replayed the entrance animation.
- No JavaScript errors, console errors, failed requests, or HTTP errors occurred at the required sizes.
- No horizontal document overflow at 320, 390, 640, 768, 1024, 1280, 1440, or 1920 pixels.
- Screenshots were visually inspected: `screenshots/desktop.png` and `screenshots/mobile.png`. Mobile is a full-page capture from the requested viewport.
- Machine-readable results: `screenshots/browser-checks.json`.

## Assets and limits

The exact requested Pexels image was downloaded successfully from:
`https://images.pexels.com/photos/3778212/pexels-photo-3778212.jpeg?auto=compress&cs=tinysrgb&w=600`
It is served locally as `public/assets/portrait.jpeg`, without alteration.

The requested Google Fonts stylesheet remains linked in `index.html`: `https://fonts.googleapis.com/css?family=DM+Sans:500,400`. Its original response is retained in `public/assets/google-fonts-source.css`. The exact Google-hosted 400 and 500 font files were also downloaded successfully and registered locally, allowing the typography to render without depending on a live font service. Requested lighter/heavier weights use browser weight matching/synthesis, consistent with the prompt's two supplied font weights.

The provided `radial-diagram.webp` reference was inspected and contains only a dark frame, so the written specification is the visual authority. No reference pixels were used in the page. Validation covers Chromium, not other browser engines. This project has been built and checked locally; it has not been deployed.
