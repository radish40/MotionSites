# Lodge Booking App

WoodNest is a luxury cabin booking showcase built from this project's `PROMPT.md`. Three phone mockups present featured lodges, a cabin landing page, and a reservation form. Desktop frames are 380 × 780 pixels; mobile frames stack with the specified responsive dimensions.

React, TypeScript, Vite, Tailwind CSS, and lucide-react power the app. Inter loads from Google Fonts and General Sans from Fontshare. All five supplied cabin media files are stored locally in `public/assets/` and included in the production build. The interface includes animated ambient liquid shapes, frosted glass, looping video, staggered entrances, and reduced-motion support.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured base URL is `/motionsites-results/lodge-booking-app/`. Open that path on the development or preview server. The complete production site is in `dist/`, including `dist/index.html`. Serve it under that base path.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible Chromium check serves the actual `dist/` build at its configured subpath. It checks 1440 × 1000 and 390 × 844 viewports, horizontal overflow, image loading, video decoding, script errors, menu navigation, lodge selection, both date pickers, month navigation, both time pickers, the confirmation, and Book Now.

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 checks/browser.cjs
```

Results are recorded in `checks/browser-report.json`. Screenshots are in `screenshots/desktop.png` and `screenshots/mobile.png`, with additional reservation confirmation captures. The mobile screenshot captures the complete stacked page; each phone's content can scroll independently.

## Interaction and limitations

Reserve on a lodge selects it in the booking phone. Book Now brings that phone into view. The pencil changes the selected lodge and nightly rate. Calendars update arrival/departure dates while maintaining a positive stay duration. Menus expose the specified links; Locations and Rooms bring the lodge listing into view, while Experiences and Contact open informational panels.

Reservation confirmation is a local showcase interaction; it does not save a booking, collect payment, or contact a service. Initial dates intentionally match the prompt (February 11 and March 25, 2026). Selections reset on reload. Font delivery requires network access; local cabin media does not. Muted autoplay depends on browser policy. No deployment or push was performed.

The completed check passed at both required sizes with no script errors or horizontal overflow. All supplied media and both fonts loaded. Chromium recorded two cancelled (`net::ERR_ABORTED`) background-video range requests during media updates; the corresponding videos decoded and played successfully. The raw browser report preserves these observations under `assetFailures`; the check script separates these media cancellations from load failures on subsequent runs.
