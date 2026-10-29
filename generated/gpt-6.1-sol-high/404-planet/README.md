# 404 Planet

Design ID: `404-planet`. A NEXOVA space-themed 404 page built with React, Tailwind CSS and Lucide React, following `PROMPT.md`. Includes the prescribed Earth video, logo, Helvetica Now Var stylesheet, glowing 404, liquid-glass return link, responsive footer and staggered mobile navigation.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The Vite base is `/motionsites-results/404-planet/`. Open that path on the development or preview server. Publishable files are in `dist/`, including `dist/index.html`. Nothing has been deployed.

On this host, run the build in the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check starts a temporary Vite preview server and uses the image's Playwright Core and Chromium. It verifies the production build at its actual base path, desktop 1440×1000 and mobile 390×844, additional responsive widths, horizontal overflow, video decoding, font availability, menu toggle/Escape/backdrop dismissal, and newsletter validation. It records console errors, failed network requests and HTTP errors in `screenshots/browser-checks.json`.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-full.png` (complete scrollable page), and `screenshots/mobile-menu.png`. The video is paused at three seconds for repeatable captures; it autoplays and loops in normal use. To regenerate its poster from the supplied video, run `CREATE_POSTER=1 node scripts/check.mjs` inside the same image, then rebuild.

## Assets and scope

- The exact remote video URL is the primary source. `public/assets/earth.mp4` is an identical local fallback; `earth-poster.jpg` is extracted from that video.
- The exact requested external Helvetica Now Var stylesheet is linked in `index.html`; Helvetica, Arial and sans-serif remain fallbacks. `public/assets/font-source.css` records the returned provider stylesheet and its attribution information. Font provider: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts).
- The responsive footer naturally extends beyond one viewport on smaller screens so every supplied link remains accessible. Desktop fills a single viewport at the required size.
- Main-page and logo links target `/`. Product, footer and login links use descriptive host-root routes. The destination pages were outside the supplied design and are not implemented here. Social links target their respective platform homepages because brand profiles were not supplied.
- Newsletter input uses native email validation and honestly reports that signup is currently unavailable. No subscription backend or external messages are involved.
- Only this project's files were created. No agents, other sessions, deployment, push or messaging were used.
