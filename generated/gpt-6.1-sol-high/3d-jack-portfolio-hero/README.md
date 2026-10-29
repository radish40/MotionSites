# 3D Jack Portfolio

Design ID: `3d-jack-portfolio-hero`  
Page title: `Jack -- 3D Creator`  
Publish base: `/motionsites-results/3d-jack-portfolio-hero/`

A React and TypeScript implementation of PROMPT.md using Tailwind CSS and Framer Motion. Includes the full-height portrait hero, magnetic pointer movement, two scroll-driven image rows, character-by-character About reveal, five services, and three sticky project cards. Kanit weights 300–900, the portrait, decorative images, and available supplied artwork are served locally. Lucide React is installed as specified; the supplied design does not require additional interface icons.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the full publish-base path printed above. The production output is `dist/`, including `dist/index.html`. No deployment has been performed.

The actual build in this environment uses the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Dependencies are pinned in `package-lock.json`. `build.log` records the completed TypeScript and Vite production build.

## Browser verification

The production files were served from the exact publish base inside a temporary Docker container. Chromium was driven by the image's installed `playwright-core`. Checks cover 1440×1000 desktop and 390×844 mobile, page title, local font loading, navigation, magnetic movement, opposite marquee movement, project scaling and sticky positioning, opening the first project preview, all three preview HTTP responses, image loading, horizontal overflow, console errors, and failed requests.

Evidence:

- `browser-checks.json`: measured browser results.
- `browser-run.log`: final browser run output.
- `screenshots/desktop.png` and `screenshots/mobile.png`: required hero screenshots.
- Additional About, Services, and Projects screenshots in `screenshots/`.
- `scripts/browser-check.cjs`: repeatable browser checks.
- `scripts/serve.cjs`: local production test server, port 4173.

To repeat the browser checks:

```bash
docker run --rm -d --name jack-portfolio-check -u 1000:1000 \
  -v "$PWD:/work" -w /work --entrypoint node \
  louislam/uptime-kuma:2 /work/scripts/serve.cjs
docker exec jack-portfolio-check node /work/scripts/browser-check.cjs
docker stop jack-portfolio-check
```

## Asset and destination limitations

- The exact supplied Celestia GIF URL returns HTTP 404: `https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif`. Its position remains in the tripled second marquee row as a locally generated SVG explicitly labeled “Preview unavailable.” The other 20 supplied GIFs are intact and animated. `asset-manifest.json` records each original URL and download outcome.
- The prompt provides no contact address. Contact links open an email composer with a project subject and leave the recipient blank. No message is sent by this site.
- The prompt provides no live-project website URLs. “Live Project” opens the corresponding supplied full-size project artwork in a new tab. Replace those href values with real destinations when available.
- Price links to the specified Services section; no prices were supplied.
- The original GIF assets make the production directory approximately 175 MB. Images are lazy loaded and repeated tiles reuse the same local URLs. No replacement stock imagery or preview screenshots are used as the page.
- Magnetic pointer movement is disabled for touch devices and reduced-motion users. Entrance transitions respect reduced-motion preferences. The required source GIF animations remain intact.

All project changes and artifacts are contained in this directory. No agents, additional agent sessions, pushes, deployment, or external messages were used.
