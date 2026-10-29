# Luxury Focus

Design ID: `luxury-focus`. A single-page, cinematic jewelry experience titled **SCULPTED BY TIME**. Built with React 19, TypeScript, Vite 6, Tailwind CSS v4 through `@tailwindcss/vite`, lucide-react, and the requested motion dependency. The entire experience is implemented in `src/App.tsx`.

The 650vh journey smooths scroll progress at 0.05 and video seeking at 0.08, with a seek-in-progress guard. Editorial elements fade, rise and blur in staggered windows. The earrings sheet opens at 40–50%; the sculpture ring sheet opens at 90–100%. Quantity changes update prices, switching products resets quantity, and adding a piece provides local confirmation. The bag icon scrolls to the final sheet; each back button returns to its respective video section.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the provided Docker image from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The Vite base is `/motionsites-results/luxury-focus/`. The complete static build is in `dist/`, including `dist/index.html`. Serve the build at that path. No deployment was performed.

## Browser verification

`browser-check.cjs` starts an HTTP server inside a temporary container, serving the actual production build under its configured subpath, and drives the installed Chromium using playwright-core. Run:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

All 20 checks passed. No script errors or failed asset requests were observed. The machine-readable results are in `browser-report.json`. Checks cover 1440×1000 desktop and 390×844 mobile, horizontal overflow, hero visibility, both videos scrubbing, both product phases, quantity and price updates, quantity minimum, product reset, bag confirmation, bag navigation, back navigation, and script errors. Screenshots are in `screenshots/`: `desktop.png`, `mobile.png`, plus desktop product sheets and the mobile ring sheet.

## Assets and limits

All five media URLs are used exactly as supplied. Instrument Serif and Manrope load from the specified Google Fonts stylesheet. Network access to Cloudinary and Google Fonts is required; no frame sequence files were provided in this project.

The prescribed hero PNG URL displays a pink gemstone pendant on a rounded light background, despite the prompt labeling it an onyx ring. The prescribed URL and editorial copy are retained. The second panel’s prescribed ring image also shows a pink gemstone design rather than the sculpture described in its title. These content mismatches are recorded in `result.json`.

The bag is an in-memory interface demonstration with confirmation, as specified; no backend, checkout or persistence is provided. Collection, atelier and story navigation move through the experience; Contact opens a draft email to a demonstration brand address. No messages are sent by the application or this build process.
