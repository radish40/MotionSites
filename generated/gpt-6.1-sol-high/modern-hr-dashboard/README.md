# Modern HR Dashboard

Talvex is a responsive HR dashboard built from this project's `PROMPT.md` and its own visual reference. Design ID: `modern-hr-dashboard`.

Uses React 18.3.1, TypeScript 5.5.3, Vite 5.4.2, Tailwind CSS 3.4.1, Recharts 3.8.1, and Lucide React 0.344.0. The requested Supabase dependency is included; this design uses local demonstration data and needs no credentials.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
```

Open `/motionsites-results/modern-hr-dashboard/` on the dev server. The production build is in `dist/`, including `dist/index.html`; all resource paths support that exact subpath.

The host used for this task provides Node through Docker:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Validation

The real TypeScript/Vite production build passed. Chromium was run with the image's installed Playwright Core against a temporary HTTP server serving `dist/` at the required subpath.

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp --shm-size=256m \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.cjs
```

See `browser-report.json` for individual assertions. Checks cover desktop 1440×1000, mobile 390×844, tablet 820×1180, compact desktop 1024×768, loaded images and font, horizontal overflow, desktop viewport fit, tablet card overlap, calendar event containment, Friday chart tooltip, timer start/pause/reset, task toggling, hardware accordion, active navigation, mobile menu, month navigation, notifications, and browser errors.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/tablet.png`. Mobile and tablet captures include the full scrollable page; the SVG glow is fixed to the browser viewport.

## Assets and fidelity

All six exact supplied Pexels photos are saved in `public/assets/` for reliable subpath delivery. Original URLs and download results are in `asset-report.json`; `scripts/download-assets.py` preserves the photo recovery process. No reference screenshot or screenshot fragment is used in the page.

The exact external Sofia Pro stylesheet remains linked in `index.html`, and its original response is saved as `public/assets/font-source.css`. The stylesheet supplies **Sofia Pro Regular**, while the prompt requires the universal CSS family name **Sofia Pro Medium**. The original Regular WOFF2 was downloaded from the stylesheet's URL and is registered locally under both names. This preserves the requested CSS names and avoids a system-font fallback; it does not claim to supply a separate Medium font file. One Python font request stalled; the same original WOFF2 was successfully recovered using curl (HTTP 200, 62,292 bytes). The final browser run loaded every asset without failed requests.

Font credit: [Online Web Fonts](https://www.onlinewebfonts.com/fonts), per the supplied stylesheet's CC BY 4.0 attribution notice. Photos: Pexels, at the original source URLs in `asset-report.json`.

## Scope and limitations

Navigation updates the selected tab; no additional application pages or backend were specified. Timer and task changes are session-local. Calendar month controls update the visible month label; the supplied sample days and meetings remain demonstration content. Small supporting detail dialogs provide feedback for icon controls. The yellow background, progress arc, and layout are real SVG/CSS/DOM; the activity graph uses Recharts with its Friday tooltip.

The reference uses different typography metrics from the supplied font; the implementation follows the supplied font asset. On compact screens calendar events are widened to keep titles and avatars readable.

Vite reports a non-blocking bundle-size warning (approximately 502 kB before gzip). `npm-audit.json` records three dependency findings (one moderate, two high) in the requested legacy build-tool versions and their dependencies. The exact requested Vite version was preserved. No deployment, push, or remote application changes were performed.
