# AI Workflow Agents

Design ID: `ai-workflow-agents`. A single-screen Axon hero built with React, Vite and Tailwind CSS, following this project's `PROMPT.md`. It uses the supplied SVG logo, exact copy, Google Fonts (Instrument Serif regular/italic and Inter 400/500/600), and the supplied looping CloudFront video.

## Build and run

With Node 22/npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/ai-workflow-agents/` on the preview server. Vite's base is configured for this exact path. Complete static output is in `dist/`, including `dist/index.html`. No deployment has been performed.

On the provided Docker host:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.npm-home -e npm_config_cache=/work/.npm-cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

For a preview after installing dependencies and building:

```sh
docker run --rm -u 1000:1000 -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
```

Visit `http://localhost:4173/motionsites-results/ai-workflow-agents/`.

## Validation

The real production build succeeded. Browser verification serves `dist/` at the configured subpath, using the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Checks passed at 1440×1000 and 390×844:

- Correct page title, visible hero, responsive navigation.
- No horizontal or vertical document overflow.
- Instrument Serif and Inter loaded successfully.
- Video decoded at 1664×1248 and autoplayed muted; looping enabled.
- CTA click, desktop navigation feedback, home reset, CTA keyboard activation.
- Zero uncaught JavaScript errors and zero console errors.

Final screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Machine-readable observations: `screenshots/browser-checks.json`. Both screenshots were visually reviewed during implementation.

## Limitations and assets

No destination URLs, product detail copy, signup endpoint or contact address were supplied. Navigation and early-access controls display brief accessible coming-soon feedback within the hero. They do not submit or store data. No additional pages or backend are included.

The required Google Fonts and video remain external and require internet access. All loaded successfully during browser checks. Chromium recorded aborted intermediate video requests (`net::ERR_ABORTED`), while final media requests decoded and played successfully in both viewports. These events are preserved in the report. No font failures, media playback failures or console errors were observed.

The dependency lockfile is included. Generated dependency directories and npm caches are excluded from the handoff. `ready` in `result.json` means ready for review, not deployed.
