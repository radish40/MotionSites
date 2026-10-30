# Synth Mode

Design ID: `synth-mode`. Page title: **LGPSM — Future Forward Fashion**.

A React 19, Vite, TypeScript, Tailwind CSS v4 and lucide-react implementation of `PROMPT.md`. Desktop uses the original two full-bleed portraits, the specified canvas mask gradient, 0.1 cursor easing and 0.06 grid parallax. Mobile uses the bordered static portrait below the hero. All specified catalog, collection and journal copy is included. Shopping supports add, remove, item count, three-second notifications and the specified checkout confirmation.

The production output is `dist/`, with Vite base `/motionsites-results/synth-mode/`. No deployment was performed.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
```

Use the configured subpath when opening the dev server. In the supplied host environment, build using the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` preserves the installed dependency versions. `node_modules` is excluded from deliverables.

## Browser validation

The browser harness serves the real production `dist/` at the required subpath inside a temporary container and uses its existing Chromium and playwright-core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

Checks cover desktop 1440×1000 and mobile 390×844; page title and font loading; desktop viewport height and horizontal overflow; mobile horizontal overflow, static media and drawer bounds; live canvas mask updates; all drawer content; add/remove and empty bag; checkout reset and confirmation; backdrop and Escape dismissal; and browser errors. The report is `screenshots/browser-report.json`. Required captures are `screenshots/desktop.png` and `screenshots/mobile.png`; additional captures show the reveal, catalog and complete mobile page.

## Asset provenance and limits

Both exact image URLs from the prompt initially returned HTTP 403 to Python's default user agent. Retrying those same URLs with `Mozilla/5.0` recovered both original 1920×960 WebP responses. They are stored unchanged in `public/assets/base.webp` and `public/assets/reveal.webp`. Their full source URLs are recorded in `public/assets/sources.json`; `scripts/recover-images.py` reproduces recovery. No reference screenshot extraction or generated substitute was needed. The supplied Synth Mode preview was used only for visual comparison.

The exact Google Fonts stylesheet URL remains imported. All requested families and weights were also downloaded directly from Google Fonts and cached locally, because the initial browser font check did not confirm loading. The local faces provide reliable rendering; `scripts/recover-fonts.py` reproduces the cache from `public/assets/google-fonts.css`. Orbitron and Plus Jakarta Sans are explicitly loaded and checked by the browser harness. Michroma and Chakra Petch are available but unused, as requested.

Checkout implements the specified client-side toast, bag reset and drawer close. It has no payment or order backend. Bag state lasts for the current page session. The mandated full-resolution canvas-to-data-URL mask runs each desktop animation frame; performance was checked in Chromium here, not across all browsers or hardware. Mobile intentionally scrolls to show its separate campaign image.
