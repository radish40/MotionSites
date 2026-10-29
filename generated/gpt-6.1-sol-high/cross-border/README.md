# Cross-Border

Design ID: `cross-border`. A CARGOX GROUP logistics landing page built from `PROMPT.md`, inside a responsive iPhone 15 Pro frame. Includes the supplied video, logistics map and transport images, route animations, a menu overlay, contact form and footer.

Stack: React 18, TypeScript, Vite, Tailwind CSS, `motion/react` and lucide-react. The Barlow Condensed 800 font was downloaded from Google Fonts. All runtime assets are stored locally; the page makes no external font or image requests.

## Build and run

With Node.js 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/cross-border/` on the preview server. The Vite base is configured for this path. `dist/` contains the complete publishable static build, including `dist/index.html`.

The host used for this task has no Node.js. Build through the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`package-lock.json` records dependencies. `node_modules/` is ignored and is not part of the deliverable.

## Browser verification

Run the included Chromium/Playwright checks against the production build:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

The script serves only this build at the required subpath within its temporary container. Checks cover desktop 1440×1000 and mobile 390×844, real video playback, font and image loading, menu opening/closing and Escape, navigation, contact CTA, required field and email validation, submission feedback, scroll-to-top, browser errors, failed requests, and page/container horizontal overflow. Results are saved in `screenshots/checks.json`.

Required screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`. Additional screenshots show the menu, logistics section, and completed form at both sizes. The video is paused at two seconds only by the screenshot script, after verifying playback, for repeatable captures. Production video plays continuously.

## Assets and limitations

All five supplied media URLs in `PROMPT.md` were downloaded without substitution to `public/assets/`. Initial Python requests to the Figma assets returned 403; retrying with curl succeeded. The supplied video and Google Fonts download also succeeded. No unresolved asset failures were observed in Chromium.

The prompt supplies no form endpoint. The form validates locally and explains that requests must be emailed; it does not claim to transmit or store data. Email and telephone links use the supplied details. Social links point to the respective platform homepages because company profile URLs were not supplied. Services and Industries navigate to the logistics network; Company navigates to the company statistics, using only the requested sections.

Animations reveal once as the phone's internal content scrolls. The frame fits the available viewport while preserving its 393:852 aspect ratio. Menu focus is contained while open, and Escape returns focus to its toggle.

Status `ready` means ready for review. No deployment, push, external messages, other project access or agent delegation was performed.
