# Sentinel AI

A full-screen Sentinel AI security landing page, implemented from this project's `PROMPT.md` with React, Vite, TypeScript, Tailwind CSS, a shadcn-style Radix/CVA Button, and the original interactive Spline scene. The page uses Sora, the specified dark theme, green accents, bottom-left hero copy, staggered entrance animations, and responsive navigation with no mobile menu.

## Run and build

Requires Node 22 and npm. Install with `npm ci`, run with `npm run dev`, and build with `npm run build`. The lockfile pins the resolved dependencies. The static output is `dist/`, configured for `/motionsites-results/sentinel-ai-hero/`.

The host environment can use its existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Assets

The original scene is loaded from `https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode`. An unmodified copy is included at `public/assets/scene.splinecode` and used if the remote scene reports a load error. Google Fonts is loaded using the exact Sora link requested by the prompt. Unmodified Sora weights 300–700 are also served locally from Google's fonts.gstatic.com files, with their SIL Open Font License in `public/assets/fonts/OFL.txt`, so delayed font requests do not change the layout. The favicon is a small project-local SVG.

The optional visual reference `/home/opc/motionsites/assets/previews/sentinel-ai-hero.webp` was absent. No screenshot extraction, substitute scene, or approximation asset was used. All text and controls are real DOM elements; the background is live WebGL.

## Validation

The production build passed TypeScript checking and Vite compilation. Final Chromium checks passed at both required viewport sizes with Sora and Spline loaded, no horizontal or vertical overflow, zero script/console errors, and zero failed requests. Desktop navigation changes the URL hash, CTA controls receive pointer clicks and keyboard focus, and mobile navigation is hidden as required. Browser validation serves the actual `dist/` at the configured subpath in temporary Docker, using Chromium and the image's installed `playwright-core`:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/check-browser.cjs
```

The script checks desktop 1440×1000 and mobile 390×844, scene initialization, canvas dimensions, font loading, overflow, responsive navigation, keyboard focus, button hover/click behavior, navigation hash changes, script errors, and failed requests. It writes `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/browser-checks.json`. The validation browser freezes JavaScript animation frames after scene initialization to stabilize the animated WebGL frame for interaction inspection and screenshots; the delivered page remains animated. Software WebGL made unpaused screenshot capture time out during initial attempts.

## Scope and limitations

The source prompt supplies no booking destination, quote workflow, project pages, or section contents. Accordingly, its plain CTA buttons retain their specified presentation and hover/press interactions, and its navigation links use the specified hashes; they do not submit requests or open invented pages. Connecting those controls requires real destinations/content from the owner.

Spline requires WebGL and supports pointer interaction where the foreground does not capture clicks. Google Fonts and the live scene depend on network access. The large lazy-loaded Spline runtime produces Vite's advisory chunk-size warning. No deployment or push was performed.
