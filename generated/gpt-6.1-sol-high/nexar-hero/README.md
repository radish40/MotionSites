# Nexar

A responsive project dashboard built from `PROMPT.md` with React 18, TypeScript, Tailwind CSS 3, Vite 5, and Lucide React. The page uses the supplied landscape video, original crew avatars, yellow sprint artwork, and Instrument Serif regular and italic. All media and fonts are bundled locally. The Google Fonts links requested by the prompt remain in `index.html`.

The dashboard includes the white pill navigation, Solo/Crew switch, project selector, productivity score, editable sprint metrics, three animated task cards, fast commands, and audio input. The layout switches from three columns to a vertical mobile layout. The critique card keeps its two-degree rotation, and content fades up with staggered delays.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/nexar-hero/` for the production preview. The Vite base is `/motionsites-results/nexar-hero/`; all published files are in `dist/`, including `dist/index.html`.

This host has no Node/npm, so the actual build used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Verification

The production build was opened in real Chromium with Playwright. Reproduce the checks using the installed container image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build && (npm run preview -- --port 4173 > preview.log 2>&1 &); node scripts/browser-check.cjs && node scripts/width-check.cjs > width-report.jsonl'
```

`browser-report.json` records desktop 1440×1000 and mobile 390×844 checks, media playback, missing images, console errors, page errors, network failures, and interaction results. `width-report.jsonl` records additional responsive checks. Screenshots are `screenshots/desktop.png` and `screenshots/mobile.png` (full page). They were also visually inspected.

Verified interactions: mode toggle, notifications, project selection, session dialog, local review brief, scheduled call details, adding and opening commands, metric editing, navigation views, and mobile dialog dismissal. The denied/unavailable microphone path was verified. A real microphone and granted-permission recording were not available in the test environment.

## Assets and limitations

- The Higgs image proxy returned HTTP 403. The exact original PNGs were recovered directly from the CloudFront URLs embedded in the supplied image URLs. No substitute photos or page screenshot was used. See `asset-report.json` for sources.
- The supplied video was downloaded unchanged and is bundled locally, with autoplay, loop, muted, and playsInline. Instrument Serif was recovered from Google Fonts and bundled to avoid runtime dependence on the font service.
- The optional reference `/home/opc/motionsites/assets/previews/nexar-hero.webp` was absent. Visual verification therefore used the written design requirements.
- A vector star renders the command heading reliably where the container lacks an emoji font.
- The prompt's dependency name `@supabase/Bolt Database-js` is not a valid npm package name. The standard `@supabase/supabase-js` version 2.57.4 is installed instead; no database connection is needed by this dashboard.
- State is local to the current page session. Session entry opens a local planning state; AI review prepares an explicitly labeled local brief. Fast commands expose their intended action and connection requirements. There is no connected meeting provider, AI backend, project database, or PDF automation service. No credentials were supplied.
- Microphone input uses the browser's actual `getUserMedia` API and stops tracks when toggled off. Permission and a secure origin are required. Audio is not uploaded or transcribed.
- npm reported two dependency advisories during installation (one moderate and one high) within the requested Vite 5 dependency family. Dependencies remain within the prompt's requested stack.

No deployment or push was performed. `ready` in `result.json` means ready for review.
