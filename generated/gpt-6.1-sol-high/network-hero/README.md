# Network Hero

A single-page Marketeam landing page built from `PROMPT.md` with React and Vite. Design ID: `network-hero`. Ready for review; not deployed.

The page includes the exact headline and 67-character color split, a configurable typewriter component, an eased count-up hook, four rotating gradient orbits, nine supplied avatars/icons, animated pill borders, hover fills, the David cursor, entrance animations, and a seamless 20-second partner ticker. Responsive layouts follow the 1280/1024/768/480px breakpoints. Reduced-motion preferences show the completed content immediately.

## Run and build

With Node 22 and npm installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/network-hero/`. Vite's base is configured to this exact path. The complete static build is in `dist/`, including `dist/index.html`.

On this host, Node and Chromium are supplied by the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script starts a temporary server for the production `dist/` build at the required subpath, checks desktop 1440×1000 and mobile 390×844 in Chromium, and saves `screenshots/desktop.png`, `screenshots/mobile.png`, and `browser-checks.json`. It validates the completed and incremental headline, final count, fonts/images, orbit motion, avatar/logo counts, hover fills, keyboard focus, mobile navigation hiding, console errors, failed requests, and horizontal overflow. Additional checks cover 320/480/768/1024/1280px and reduced motion. Click checks confirm the placeholder controls do not cause errors; they do not imply completed account or project flows.

## Assets and scope

All 16 supplied visual assets were downloaded unchanged to `public/assets/`. The supplied background is applied to `.app` with centered cover sizing. Inter 400/500/600/700 and Urbanist 600/700 were obtained from Google Fonts and self-hosted; Urbanist 500 is also included for the specified count typography. Runtime rendering requires no third-party asset requests. `asset-report.json` lists source URLs and retrieval results. The first Python urllib attempt received HTTP 403; curl retrieved every asset successfully.

The prompt supplies no navigation destinations, authentication, or project submission behavior. Navigation, Log In, Join Now, and Start Project are styled, focusable placeholder links; no additional product flows or backend were invented. No deployment or publishing was performed. The project index title remains Network Hero while the visible brand is Marketeam. The requested model was gpt-6.1-sol with high reasoning; model selection cannot be changed or independently verified from the project build.

`node_modules/` is intentionally excluded from delivery. Install from the included `package-lock.json` to rebuild. Vite 6.4.5 resolves the audit finding in the initial dependency version.
