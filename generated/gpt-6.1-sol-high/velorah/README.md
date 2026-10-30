# Velorah

A single cinematic hero built from `PROMPT.md` with React, Vite, TypeScript, Tailwind CSS and a local shadcn/ui Button component (Radix Slot + class-variance-authority). The index name is **Velorah**, ID **velorah**.

The page uses the original fullscreen video, Instrument Serif display typography, Inter 400/500, the specified HSL theme, liquid glass buttons and staggered fade-rise animations. There are no image overlays or screenshots used as page content. The mobile layout hides the navigation links and uses the prompt's 90px hero padding; larger screens use 128px top / 160px bottom padding.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/velorah/` on the development or preview server. Vite's base is fixed to this required publishing path. `dist/index.html` and all runtime assets are included in `dist/`.

The build was executed in the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work \
  --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install && npm run build'
```

Use `npm ci` for subsequent installations from the committed lock file. `node_modules` is excluded from deliverables and can be recreated with that command.

## Assets

- `public/assets/velorah.mp4` is a byte-for-byte local download of the supplied [CloudFront MP4](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4). The source returned HTTP 200. It is served locally to remove runtime dependency on the CDN.
- Fonts were retrieved from [Google Fonts](https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap). `google-fonts-original.css` preserves the original source URLs; `fonts.css` uses local copies. Font 0 is Instrument Serif italic, font 1 is Instrument Serif regular, fonts 2 and 3 are Inter 400 and 500. The prompt's “Instrumental Serif” is interpreted as **Instrument Serif**, matching its explicit family declarations.
- `favicon.svg` is a small locally authored V monogram.
- The optional Velorah reference preview was not present at the specified path. No reference extraction or substitute visual assets were needed.

## Behavior and scope

Navigation uses working anchors within the single hero and updates the selected link. Both “Begin Journey” buttons return to the hero, focus its heading and replay its entrance animation. The prompt supplies no secondary pages, contact address or journey destination; these controls do not initiate an invented external flow. No extra sections, forms or services were added.

Keyboard focus indicators are available. Reduced-motion preferences disable the entrance animations and smooth scrolling. The muted video remains looping as explicitly required.

## Verification

Production TypeScript compilation and Vite build passed. Chromium / Playwright checked the production build at the exact subpath, using 1440×1000 desktop and 390×844 mobile viewports:

- Original video decoded at 1924×1076 and its playback time advanced. Autoplay, loop, muted and playsInline attributes verified.
- Instrument Serif and Inter loaded successfully.
- All five desktop navigation anchors and both journey buttons checked; heading focus verified after each CTA.
- Mobile navigation links hidden as specified.
- No horizontal or vertical overflow at either required size.
- No JavaScript errors, console errors, failed requests or HTTP asset errors.
- Reduced-motion animation behavior checked.

Screenshots capture the original video's frame at 4 seconds for consistency:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json` contains measured results.

Re-run the browser checks after installing dependencies and building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work \
  --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

The script starts and stops its own container-local HTTP server, using the image's `/app/node_modules/playwright-core` and `/usr/bin/chromium`. It does not publish a host port.

Limitations: verified in Chromium, including its mobile viewport simulation; physical iOS/Safari devices were not tested. Video autoplay ultimately depends on browser policy. The local video is approximately 14 MB. `ready` means ready for review; nothing was pushed or deployed.
