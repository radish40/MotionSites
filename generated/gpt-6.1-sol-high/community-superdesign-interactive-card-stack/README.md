# Interactive Card Stack

React and TypeScript implementation of the supplied design. Four original Unsplash photographs form a centered, rounded card stack. Framer Motion provides spring transitions and drag physics; Lucide React supplies the reset icon.

Click, tap, or press Enter/Space on the top card to send it to the back. Drag farther than 180px to cycle; shorter drags spring back. Reset Animation restores the initial order and generates fresh rotations. Autoplay is disabled as requested. The reusable component also exposes autoplay, pause-on-hover, spring configuration, sensitivity, random rotation, and mobile-click-only props.

## Run and build

Requires Node 22 and npm. Run `npm ci`, then `npm run dev`. Run `npm run build` for production. Complete static output is in `dist/`, including `dist/index.html` and all four photographs. Vite uses `/motionsites-results/community-superdesign-interactive-card-stack/` as its base path.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

Serve `dist/` at the configured URL prefix. `npm run preview` also supports local preview at that prefix. Nothing has been deployed.

## Browser validation

The production build passed TypeScript compilation and Vite bundling. The Chromium check script serves the built files at the required URL prefix inside a temporary container:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Verified all four image loads, click order and full cycling, Enter and Space, reset, short-drag spring return, threshold drag cycling exactly once, mobile touch tap and drag, system dark mode, and reduced-motion interaction. No script errors, console errors, or failed HTTP responses occurred. No horizontal or vertical overflow occurred at 1440×1000 and 390×844. The additional 320px width check found no horizontal overflow.

- Desktop: `screenshots/desktop.png` (1440×1000)
- Mobile: `screenshots/mobile.png` (390×844)
- Detailed results: `browser-checks.json`

Both screenshots were visually reviewed.

## Assets and limitations

The four exact photo URLs from PROMPT.md were successfully retrieved and saved in `public/images/`; `asset-sources.json` records their sources. They are bundled locally, with no runtime image network dependency. No replacement photographs or screenshot-based page elements were used. The prompt specifies no external typeface; the page uses system sans-serif.

The optional reference file named by TASK.md was absent. Visual verification follows the supplied React and styling requirements; comparison with that preview was unavailable. Rotations intentionally vary on mount and reset. Mobile dimensions shrink to fit the viewport. The component corrects nested stacking and prevents a drag from triggering an extra click cycle. Keyboard access and reduced-motion handling are included.

Chromium was tested; other browser engines were not tested. Optional autoplay and mobile-click-only APIs are implemented but are not enabled or exercised by the showcase checks. Dependency versions are pinned in package-lock.json. node_modules is excluded from delivery.
