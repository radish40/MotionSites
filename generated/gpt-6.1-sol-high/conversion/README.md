# Conversion

Fullscreen Zipwire.Dev hero built from `PROMPT.md` with React, TypeScript, Tailwind CSS, and Lucide React. Includes the supplied looping floral video, Qanelas/Inter typography, QR card, responsive navigation, staggered entrance animations, and animated mobile menu.

The project ID is `conversion`. The production base path is `/motionsites-results/conversion/`. `dist/` contains the complete static build; serve it at that path. This project has not been deployed or pushed.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

The host provides Node and Chromium through Docker. From this directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Open `/motionsites-results/conversion/` on the development or preview server. Dependencies are pinned in `package-lock.json`; `node_modules` is excluded from delivery.

## Validation

The actual TypeScript/Vite production build passed. Chromium checks ran against the built site at desktop 1440×1000 and mobile 390×844. The browser checks verify video playback, muted/loop configuration, QR image loading, actual loaded font faces, layout bounds, desktop navigation hashes, the CTA QR anchor, mobile menu toggling, link dismissal, exit-animation unmount, Escape, and focus return. Browser script errors, console errors, and HTTP errors are collected in `screenshots/browser-checks.json`.

Screenshots were visually reviewed. `screenshots/desktop.png` and `screenshots/mobile.png` capture the real video at two seconds for consistent comparison; `screenshots/mobile-menu.png` shows the expanded mobile navigation. Normal playback was verified before pausing for screenshots.

Reproduce browser checks after installing/building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173 > screenshots/preview.log 2>&1 & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/check.mjs'
```

## Assets and scope

All specified asset endpoints were reachable. The exact remote video and QR URLs are used, with copies in `public/assets/` as error fallbacks. `index.html` loads both required font stylesheets; local copies of Qanelas-Heavy and Inter 400/500/600/700 provide deterministic font rendering. Vite rewrites local resource paths for the required deployment subpath. Chromium may report canceled video range requests (`net::ERR_ABORTED`); these are preserved in the report and did not prevent playback. No external asset failure was observed.

Qanelas font source/credit: [Web Fonts](https://www.onlinewebfonts.com/fonts), supplied by [OnlineWebFonts](https://db.onlinewebfonts.com/c/3010f9da43a41a81d5daa32bd6edebc2?family=Qanelas-Heavy). Its supplied stylesheet specifies CC BY 4.0 attribution. Inter is supplied by Google Fonts.

The prompt supplies navigation hashes, but no Docs, Team, or Upgrade sections or download URL. Those links retain their exact hashes; Get It Today targets the supplied Try Now QR card. The language indicator is displayed as specified. No extra sections or backend services were added. Mobile checks use Chromium viewport emulation; physical-device Safari was not tested. `ready` means prepared for review, not published.
