# FinFlow

FinFlow (`finflow`) is a single-page Fenvex landing page built with React, Vite, TypeScript, Tailwind CSS, and lucide-react. It implements the supplied PROMPT.md: desaturated video backdrop, desktop pill navigation, mobile dropdown, financial-flow hero, and six partner logos. The page lives in a single default-exported component in `src/App.tsx`.

The project started with only TASK.md and PROMPT.md, so minimal entry, CSS, Tailwind, TypeScript, and Vite scaffolding was created. The page's styling and interactions are in App.tsx. No additional feature packages were installed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/finflow/` on the development or preview server. Vite's base is configured for that exact path. The production output is `dist/`, including `dist/index.html`. The dependency lockfile is included; node_modules is ignored and is not part of the deliverable.

On the supplied host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

## Validation

A real TypeScript check and Vite production build passed. Chromium with the image's existing playwright-core tested the built static files at the configured subpath.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

Results are recorded in `screenshots/checks.json`:

- Desktop: 1440 × 1000; mobile: 390 × 844. Neither has horizontal or vertical overflow in the default closed-menu state.
- Additional widths 320, 640, 768, and 1024 passed horizontal overflow checks.
- Mobile menu opens and closes, with four links and two authentication buttons.
- All four desktop buttons accept normal pointer clicks.
- All six remote logo SVGs returned HTTP 200 and decoded successfully.
- The exact remote video returned HTTP 206, decoded at 3828px width, and played automatically, muted, with `saturate(0)`.
- No JavaScript page errors or failed network requests. One console resource error is the browser's automatic favicon request (404); no favicon was specified.
- Visually reviewed `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`.

The screenshot harness pauses the video at two seconds for reproducible captures; the page itself autoplays and loops. A small stacking fix on the navbar preserves its position while preventing the required negative hero margin from intercepting navigation clicks.

## Limits and asset notes

- The exact font family `ITC Avant Garde Gothic W02 Bk` is declared. No licensed font file or stylesheet was supplied, and no font faces were loaded in the browser. The specified sans-serif fallback is used on this host. A licensed font source would be needed to guarantee the named typeface on other machines.
- The exact Simple Icons URLs were preserved as `<img>` sources with no color filters. Those SVGs are monochrome by default, despite the prompt's description of native brand colors; external SVG images cannot inherit per-brand colors from the page. No replacement assets were substituted.
- The video and logos remain external resources and need network access. They all loaded successfully during validation.
- Navigation uses placeholder `#` anchors. Authentication and hero buttons are presentation-only because the prompt supplied no destinations or backend actions. The implemented stateful interaction is the requested mobile menu.
- No overlays, extra animation, deployment, push, or external messaging were added. `ready` means the local static build is available for acceptance, not published.
