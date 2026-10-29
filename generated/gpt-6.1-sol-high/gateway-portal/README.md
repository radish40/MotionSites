# Gateway Portal

Design ID: `gateway-portal`. A React + TypeScript + Vite implementation of the Auragate landing experience specified in `PROMPT.md`. Browser title: **Step Into Wonder**.

The page includes a 160vh sticky intro, eased portal zoom and opacity transitions, smoothed mouse parallax, responsive hero typography, a seven-card frosted-glass arc carousel, and the responsive footer. Presentation uses inline React styles; Tailwind utilities appear only on the hero layout element. No UI libraries are used. Watch Demo animates the existing scroll experience. The menu links to page sections; carousel arrows and left/right keyboard keys cycle the quotes.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/gateway-portal/`. The Vite base is `/motionsites-results/gateway-portal/`; the complete static output is in `dist/`, including `dist/index.html`. Serve that directory at the configured subpath.

On this host, Node/npm and Chromium run inside the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For local viewing, add `-p 4173:4173` to a Docker run command and run `npm run preview -- --port 4173` inside it. Nothing has been deployed or pushed.

## Browser validation

The real production build was checked in headless Chromium using the image's installed `playwright-core`. To reproduce within a temporary container after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173 > checks/preview.log 2>&1 & preview_pid=$!; trap "kill $preview_pid" EXIT; sleep 1; node checks/browser.cjs'
```

`checks/browser.cjs` accepts an optional `BASE_URL` environment variable. Evidence is saved in `checks/browser-results.json`, `checks/build.log`, `checks/audit.json`, and `screenshots/`.

Checks cover desktop **1440×1000**, mobile **390×844**, page title, loaded display fonts, page overflow, navigation open/close, section navigation, intermediate portal scale/fade, demo scroll, next/previous quote changes, seven-step wraparound, and uncaught JavaScript errors. Desktop mouse parallax is also sampled. Screenshots include the initial hero (`desktop.png`, `mobile.png`), intermediate zoom, testimonials, and footer. The stable scrollbar gutter intentionally reserves 15px in this Chromium environment.

## Assets and limitations

- The exact requested portal URL is preserved and attempted: `https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781046673/image_1_ksxfzb.png`. Both HTTP and browser checks return **401**; the response says `cloud_name dy5er7kv5 is disabled`. A locally authored CSS arch and the supplied sky image provide a functional portal fallback. This cannot reproduce the missing original artwork. If the source becomes available, it automatically replaces the fallback.
- The exact supplied Higgs world-image URL works. Its unmodified downloaded response is bundled as `public/assets/world.webp`, used for the fallback arch and as a network-failure fallback behind the page.
- All three exact font stylesheet links from the prompt remain in `index.html`. The requested Mr Dafoe and Helvetica Now Display WOFF2 files were successfully downloaded from those same sources and are bundled locally. Unused Google font families remain unloaded by the browser as expected. Font credit: [Web Fonts](https://www.onlinewebfonts.com/fonts), as requested by the supplied font stylesheets; review upstream font licenses before public use.
- The prompt supplies no video, legal documents, or social-profile URL. Watch Demo shows the portal scroll sequence. Legal links point to the footer, and X links to the X homepage. These destinations require owner-provided content for production.
- The delivered status is ready for review with the disclosed portal-art limitation; it does not mean the site is online or that the unavailable original asset was recovered.
