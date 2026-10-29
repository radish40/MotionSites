# Church Community

A three-phone showcase for **Christ Family Church**, implemented with React Native for Web, Expo Router, react-native-reanimated, and locally bundled Manrope Light, Regular, and Medium. The testimonial, landing, and sermon/events screens follow `PROMPT.md` using all nine original Framer assets.

The artboards are 375 × 812 inside 2px rounded frames. Desktop uses 40px padding, 48px gaps and horizontal scrolling where needed. Below 900px, phones stack with 20px padding, 32px gaps and proportional scaling. Reanimated provides 600ms phone entrances and 200ms menu entrances; text has configurable typewriter delay and speed.

## Run and build

Use Node 22 and npm:

```sh
npm ci
npm start
npm run build
```

The static output is `dist/`, with the Expo base URL set to `/motionsites-results/church-community/` in `app.json`. This project uses Expo Metro, so no Vite configuration is needed. Serve the output at that exact prefix.

On the supplied host, run within its existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

For a local static preview, `node scripts/serve.cjs` serves the configured subpath on port 4173.

## Browser validation

The reproducible browser check uses the provided container's Playwright Core and Chromium. Run both server and check in the same container:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/serve.cjs & server_pid=$!; trap "kill $server_pid" EXIT; npm run check'
```

Screenshots: `screenshots/desktop.png` (1440 × 1000 viewport) and `screenshots/mobile.png` (390 × 844 viewport). The additional `screenshots/mobile-full.png` shows all three stacked phones at 390px width; `screenshots/menu.png` shows the shared menu. Machine-readable check details are saved to `screenshots/browser-checks.json`.

Checks cover all three phone menus, closing, navigation to Home/About/Events, Join us, event details, sermon preview, returning to the screen, image loading, uncaught script errors, failed requests, and page overflow.

## Assets and limits

All nine original images are downloaded into `assets/`. Manrope is bundled from `@expo-google-fonts/manrope`; runtime assets do not depend on external image/font services. The page is an interactive design showcase. Join us and Learn more display the supplied service information. The supplied hero asset shows a person walking into a church, and the supplied sermon asset shows a Bible study table; these differ from the prompt’s image descriptions. The exact supplied files are preserved.

No registration backend, contact information, or sermon recording was provided; the sermon preview explicitly reports that no recording is available. Nothing has been deployed or pushed.

Reference for the static export setup: [Expo static rendering documentation](https://docs.expo.dev/router/web/static-rendering/).
