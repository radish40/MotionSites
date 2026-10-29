# Prisma Creative Studio

Design ID: `prisma-landing`. A three-section cinematic landing page built from `PROMPT.md`: inset video hero, Marcus Chen introduction, and four creative workflow cards.

React 18, Vite, TypeScript, Tailwind CSS 3, Framer Motion, and Lucide React. Almarai and Instrument Serif italic load through Google Fonts. The exact two supplied videos and three feature images are stored locally in `public/assets/`; JPEG loading posters were extracted from the videos in Chromium. Asset sources and download results are in `asset-report.json`.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/prisma-landing/`.

The available Docker image can build on this host without installing system software:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/` contains the complete static deliverable. Vite's base is `/motionsites-results/prisma-landing/`; serve `dist/` at that path.

For a local preview through Docker:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
```

## Validation

Production TypeScript and Vite build completed. Real headless Chromium checks use `/app/node_modules/playwright-core` in the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The check starts a temporary HTTP server with the required subpath and video range support, then closes it. It checks desktop 1440×1000, mobile 390×844, and tablet 768×1024; all navigation links and the hero CTA; expandable feature descriptions; loaded fonts and videos; reduced-motion video behavior; browser exceptions, failed requests, and horizontal overflow. Detailed evidence is in `browser-report.json`.

Full-page screenshots, captured at the required viewport widths:

- `screenshots/desktop.png`
- `screenshots/mobile.png`

Screenshots pause both videos at one second for reproducibility. The About paragraph intentionally starts dim and reveals characters as it moves through the viewport.

## Scope and limitations

Navigation and “Join the lab” use anchors within the three requested sections. “Learn more” expands each feature's description. No application backend, membership submission, or external inquiry destination was specified. Checklist wording was supplied for the requested topics where exact wording was absent from the prompt.

Google Fonts require an internet connection; system font fallbacks are configured. All supplied media downloaded successfully and is included in the static build; the original videos total approximately 33 MB. Reduced-motion visitors see video stills. No deployment or push was performed. `ready` in `result.json` means ready for review, not published.
