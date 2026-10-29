# Book Hero

Design ID: `book-hero`. The page is **Foliom — Book Marquee**, implemented from the complete HTML, CSS and JavaScript in `PROMPT.md`. This is a native static site with no runtime dependencies or framework. The project has not been deployed or pushed.

The original layout, copy, Lawrence typeface, diagonal 60-second marquee, layered paper construction, book dimensions, breakpoints and hover expansion are retained. The mobile navigation toggle opens the existing navigation and closes on Escape or link activation. Keyboard focus pauses and lifts books; reduced-motion preferences stop automatic scrolling. Duplicate marquee books are hidden from assistive technology. The repeated track uses equal trailing spacing to keep the loop continuous.

## Run and build

With Node 22:

```sh
npm ci
npm run build
npm run preview
```

Preview: `http://localhost:4173/motionsites-results/book-hero/`.

On this host, Node and Chromium are available in the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build && npm run check'
```

`dist/index.html` and `dist/assets/` are the complete static deliverable. Relative asset URLs work at `/motionsites-results/book-hero/`. `npm run preview` serves the built output at that exact subpath. No Vite is used because the supplied design is native HTML. `package-lock.json` is included; no `node_modules` is needed or included.

## Verification

`npm run check` uses the image's existing `/app/node_modules/playwright-core` and `/usr/bin/chromium`. It starts a temporary local server and checks the actual built files. On another machine, adapt those two paths to its Playwright and Chromium installations.

The checks cover 1440×1000 desktop and 390×844 mobile, local cover decoding, font loading, 48 rendered books, actual animation movement, hover pause, keyboard focus pause, mobile menu opening/closing, reduced motion, console/script errors, failed HTTP requests and document overflow. Evidence is saved in `screenshots/checks.json`.

- `screenshots/desktop.png` and `screenshots/mobile.png`: required page screenshots.
- `screenshots/desktop-hover.png`: expanded book on hover.
- `screenshots/mobile-menu.png`: open mobile navigation.
- `screenshots/asset-sheet.png`: visual inspection of the nine supplied remote images.

Screenshot capture freezes the real animation at one second for repeatability. The shipped page animates normally. Screenshots were visually inspected.

## Assets and limits

The initial project contained only `TASK.md` and `PROMPT.md`; none of `book-1.png` through `book-15.png` were supplied. All nine remote image URLs and the specified font were successfully downloaded. The site serves them locally and needs no external requests. Download provenance is in `assets/download-log.json` and `assets/curl-download-log.json`. A parallel curl request for book 22 timed out; a subsequent retry succeeded, and Chromium decoded every final asset successfully.

Visual inspection found nine supplied images matching missing local titles. These are reused without altering the supplied 16–24 sequence: book 4 → 23, 5 → 24, 7 → 22, 8 → 21, 9 → 20, 10 → 19, 12 → 18, 13 → 17, 15 → 16.

Six original artworks remain unavailable: **Shadows of the Archive**, **The Temple of Lost Suns**, **Serpent & Thorn**, **The Roommate Risk**, **The Bright Beyond**, and **The Stories We Keep**. Their clearly named `book-*-fallback.svg` files are replacement cover artwork using the prompt's titles and colors, with simple vector ornaments. They are not claimed to be original assets. Replace these references with the original PNGs if those become available. Exact artwork fidelity for those six covers is the remaining limitation.

Lawrence W00 Regular is sourced from [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), using the prompt's provided font endpoint. Its supplied attribution identifies CC BY 4.0; the original CSS notice remains in `assets/lawrence.css`.

The prompt's navigation and category links use `href="#"`; those destinations remain placeholders. The prompt defines a hero, not catalog/filter/account flows, so no extra application pages or invented actions are added. Book interaction is the specified lift/spacing/animation pause.

`ready` in `result.json` means ready for review, with these asset limitations recorded. It does not mean deployed.
