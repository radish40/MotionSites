# Talent Collective

Design ID: `talent-collective`. A single viewport team portrait page for **Kollektiva**, implemented from this project's `PROMPT.md` with Vite, React 18, TypeScript, Tailwind CSS 3, and Geist (300/400/500).

The page contains the exact eight supplied profiles and image URLs. Selecting an avatar updates the portrait, biography, name, and role. Backgrounds crossfade over 700 ms; biography and name animate over 500 ms; the active dot fades over 300 ms. Mobile uses a scrollable avatar row and a two-item footer. There is no autoplay.

## Run and build

With Node 22.12+ and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured base URL is `/motionsites-results/talent-collective/`. Open that path on the dev or preview server. The publishable static output is `dist/`, including `dist/index.html`.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

After building, run the included Playwright script against the production files:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint node \
  louislam/uptime-kuma:2 scripts/check.cjs
```

The script runs a temporary HTTP server inside the container and closes it after checking. It verifies 1440×1000 desktop and 390×844 mobile layouts, eight loaded images and background layers, all eight avatar selections, name updates, active state, CSS animation timing, keyboard selection, WhatsApp hover, mobile footer visibility, avatar scrolling, no autoplay during observation, request failures, script errors, and horizontal overflow.

Artifacts:

- `screenshots/desktop.png`: default Andrei selection at 1440×1000.
- `screenshots/mobile.png`: default selection at 390×844.
- `screenshots/checks.json`: browser check results.
- `package-lock.json`: reproducible dependency lockfile.

The production build and browser checks passed. All eight images and the Google font loaded; no failed network requests or browser script errors were recorded. Both screenshots were visually reviewed. Dependency installation reported zero known vulnerabilities after updating the build tools.

## Assets and limits

Images use the original `images.higgs.ai` URLs for both backgrounds and thumbnails. Geist uses the Google Fonts links specified in the prompt. These external services require network access; no replacement portraits or extracted reference assets were necessary. The supplied Talent Collective reference was viewed for comparison only and is not rendered by the application.

Names and portraits preserve the exact prompt mapping. The WhatsApp anchor intentionally uses `href="#"`, as specified; no contact number was supplied. Browser checks used containerized Chromium and do not imply testing on physical phones or other browser engines. No deployment or push was performed.
