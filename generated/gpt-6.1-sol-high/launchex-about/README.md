# LaunchEx About

A single About the Founders section implemented from `PROMPT.md` using React 18, Tailwind CSS 3, lucide-react, and Vite. Design ID: `launchex-about`.

Includes the exact copy, palette, card polygons, inset borders, text positions, desktop stagger, responsive grid, bottom fade, and external link hover lift. The three supplied images are stored locally and used as CSS backgrounds.

## Build and run

With Node.js 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/launchex-about/` with Vite preview. `npm run dev` starts development on port 5173 with the same subpath.

This host uses the existing Docker image for Node and Chromium:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --cache /tmp/launchex-npm-cache && npm run build'
```

Publishable files are in `dist/`, including `dist/index.html`. Mount the contents at `/motionsites-results/launchex-about/`, as configured in Vite. No deployment or push was performed. `package-lock.json` preserves dependency versions. Generated dependency directories are excluded and removed from the handoff.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node checks/browser-check.cjs'
```

Uses the image's existing playwright-core and Chromium. Starts an ephemeral HTTP server for the actual build at the required subpath and shuts it down after checking. Project node_modules are unnecessary to rerun this check once dist exists.

Passed checks:

- 1440×1000 desktop: three columns, 340px cards, exact 96px middle-card offset.
- 390×844 mobile: one column, 280px cards, full page scroll.
- 768×1024 tablet: two columns; 1024×900 small desktop: three staggered columns.
- No horizontal page overflow, script errors, failed requests, or HTTP errors.
- All three images decode at 1280×1280; local Inter fonts load.
- Keyboard focus is visible; link icon lifts 2px on hover.
- Link has the exact destination, target and rel attributes; clicking opens a new tab at the correct URL. The destination response was intercepted, so live external website availability was not assessed.

Evidence: `checks/browser-report.json`. Visually reviewed full-page screenshots: `screenshots/desktop.png` (1440×1000) and `screenshots/mobile.png` (390×1480, captured at a 390×844 viewport).

## Assets and limitations

The three WebP files in `public/assets/` are the exact Higgs assets specified in the prompt. Initial Python requests returned HTTP 403; curl retries of the same URLs succeeded. No substitute imagery was used. Source mappings are in `assets-manifest.json`.

No TT Firs Neue file or licensed source was supplied. `.font-firs` preserves the requested stack and uses the specified Inter fallback. Inter regular, medium, and semibold were downloaded from Google Fonts and bundled locally. Heading/stat glyphs may therefore differ from TT Firs Neue. All required runtime assets are local.

Production dependency audit: zero vulnerabilities. The initial full npm audit reported three development dependency findings (one moderate, two high); development tooling does not ship in the static build.

`ready` in `result.json` means ready for management-session review, not published.
