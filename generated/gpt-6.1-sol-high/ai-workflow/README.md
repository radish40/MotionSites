# AI Workflow Hero

Design ID: `ai-workflow`. A single-screen LinkFlow hero implemented from `PROMPT.md`, using its exact `App.tsx` and `BoomerangVideoBg.tsx` components, copy, palette, spacing, font links, and CloudFront video.

Built with Vite 5, React 18, TypeScript, Tailwind CSS 3.4, and lucide-react. Menu transitions use CSS. The background captures the supplied video into canvases at a maximum width of 960px, then plays the frames forward and backward at 30fps.

## Build and run

With Node and npm:

```bash
npm ci
npm run build
npm run dev
```

Open `/motionsites-results/ai-workflow/` on the Vite server. `npm run preview` serves the production build. Vite's base is `/motionsites-results/ai-workflow/`; publishable files are in `dist/`, including `dist/index.html`.

The actual build used the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install && npm run build'
```

For subsequent reproducible builds, replace `npm install` with `npm ci`. The dependency lockfile is included; `node_modules` is excluded from delivery.

## Browser verification

The real production build was served under the configured subpath and checked using Chromium and Playwright from the same image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/verify.cjs'
```

The verification script starts its own temporary HTTP server and closes it after the checks. It does not require installed project dependencies once `dist/` exists.

- Desktop: 1440 × 1000; mobile: 390 × 844.
- Both viewports fit without horizontal or vertical overflow and render the correct heading.
- Video loaded at 3828 × 2164, duration 8.041667 seconds; the visible playback canvas is 960 × 543 on both viewports.
- Desktop navigation/account links update their supplied hashes; the primary navigation button uses the specified hover color.
- Mobile menu opens/closes, its navigation link closes the drawer and updates the hash, backdrop dismissal works, and body scroll locking resets.
- No JavaScript runtime errors occurred.
- Screenshots were captured after canvas playback began and visually inspected: `screenshots/desktop.png` and `screenshots/mobile.png`.
- Full machine-readable evidence: `screenshots/browser-report.json`.

## Assets and limitations

The CloudFront MP4 returned HTTP 206, and both the Text Pro stylesheet and its WOFF font returned HTTP 200. The Google Inter stylesheet returned HTTP 200; its fonts are unused by the specified font stack and therefore were not downloaded.

The exact Display Pro font stylesheet URL was blocked by Chromium with `net::ERR_BLOCKED_BY_ORB` on both viewports. The specified next font, Neue Haas Grotesk Text Pro, loaded successfully and supplies the rendered type. A direct retry of the Display Pro stylesheet also returned HTTP 403. The original font links and fallback order are retained. Assets remain externally hosted and require network access.

The supplied hero has no destination sections, account forms, demo, or video modal. Navigation anchors update the URL only. The supplied “Try it Live”, “Know More.”, and play buttons have no action handlers; this implementation preserves that behavior. No extra application flows were added.

The exact mobile design places dark green bottom text over the changing video, which can reduce contrast over darker frames. The supplied colors and layout are preserved. The exact canvas implementation stores frames in memory and does not add reduced-motion or pause controls. The supplied closed mobile drawer also lacks focus management/inert behavior; this is a fidelity build rather than an accessibility redesign.

`npm audit` reported one moderate and one high development dependency vulnerability (esbuild and Vite). Its offered fix changes Vite to a different major version, so the required Vite 5 stack is retained. Details are in `dependency-audit.json`.

Status `ready` means ready for review, not deployed. No push or deployment was performed.
