# Travel Explorer

Design ID: `travel-explorer`. The app title and brand are **Roam Beyond Borders**.

This React 18, Vite, TypeScript, Tailwind CSS, and lucide-react implementation follows `PROMPT.md`: a white canvas, a 340 × 740 iPhone frame and Dynamic Island, a full-bleed video welcome screen, and a dark Explore screen with horizontal destination cards and staggered entrances. Both screens use React state.

## Run and build

With Node 22 and npm installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured base is `/motionsites-results/travel-explorer/`. Open that path on the local Vite server. `dist/index.html` and the complete static assets are ready for review; nothing has been deployed.

The build was executed using the provided Docker image because the host does not have Node:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules` is excluded from delivery; run `npm ci` to restore it.

## Validation

A real production build passed TypeScript checking and Vite compilation. Chromium checks used the image's existing Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && node scripts/check.cjs'
```

Checks passed at desktop **1440 × 1000** and mobile **390 × 844**:

- Exact phone dimensions, centered layout, and no page overflow on either screen.
- Muted background video autoplay and successful image and font loading.
- Welcome CTA, horizontal card scrolling, destination search, category filters, empty results, and View all reset.
- Navigation controls, informational notification/saved/profile messages, and return to welcome.
- Zero uncaught JavaScript errors or failed network requests.

Screenshots were also visually inspected:

- `screenshots/desktop.png` and `screenshots/mobile.png`: welcome screen.
- `screenshots/desktop-explore.png` and `screenshots/mobile-explore.png`: Explore screen.
- `screenshots/browser-checks.json`: machine-readable browser results.

## Assets and limitations

The exact supplied video, avatar, and four destination images are copied into `public/assets/` and included in `dist/assets/`. The required font stylesheet URLs remain in `index.html`; local copies of Nomada Didone and Inter provide reliable rendering. `public/assets/sources.json` records source URLs. Font source credit: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts); Inter is supplied through Google Fonts. The upstream font stylesheet and its attribution text are preserved in `public/assets/nomada.css`.

All supplied assets downloaded successfully. The supplied Norway image visibly depicts urban architecture (including a colosseum) rather than Norwegian fjords; the specified asset is retained without substitution.

This is a two-screen app mockup with local data. Search matches the four destination names and descriptions. Europe includes Ireland, Norway, and Iceland; Quick Escapes includes Ireland and Norway; South America shows an empty state because no supplied destination is in that region. Notifications, saved destinations, and profile are informational mockup controls; there is no account service, booking flow, persistence, or notification backend.
