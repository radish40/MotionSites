# Synapse Dark Hero

Design ID **7**. A responsive, black hero page for Synapse, built from the complete requirements in `PROMPT.md`. The production output is in `dist/`, configured for **`/motionsites-results/7/`**. Nothing has been deployed or pushed.

React 19, Vite 6, Tailwind CSS 4, Motion (Framer Motion's `motion/react` API), and hls.js. `package-lock.json` pins the installed dependency tree.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the development/preview server at `/motionsites-results/7/`. The build produces `dist/index.html` and all local static assets.

The host used for this project has no Node/npm. The actual build used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/7:/work \
  -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install && npm run build'
```

For repeatable installation, substitute `npm ci` for `npm install`.

## Design and behavior

- Fixed glass navigation, gradient-bordered active Features link, disabled strikethrough Case Studies item, and gradient navbar CTA.
- Three integration badges, an 80px desktop headline, two-line testing/deployment copy, and two hero CTAs.
- Staggered fade-in-up animation through `motion/react`, respecting the reduced-motion preference.
- Memoized `VideoPlayer`, native HLS support where available and hls.js otherwise. The player cleans up listeners, playback, and its HLS instance on unmount. Video is muted, looping, autoplaying, and inline, with full opacity and no dark overlay. Its absolute container is 80vh high with bottom:35vh.
- Static, grayscale placeholder SVG partner logos at 40% opacity. Mobile navigation uses a menu; partner logos wrap into two rows.
- Navigation opens corresponding informational dialogs. Signup and contact CTAs open accessible native dialogs with email validation, Escape/backdrop dismissal, focus restoration, and a local preview completion state. These explicitly state that information is neither sent nor stored. No backend or real signup/contact service was specified.

## Assets

The required Mux HLS stream is used directly:

`https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8`

It returned HTTP 200, loaded its video segments, and played successfully in both browser checks. Internet access to Mux remains necessary for video playback. A loading/fallback poster is stored at `public/assets/video-poster.jpg`, obtained from the **same video** via `https://image.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A/thumbnail.jpg?time=2&width=1600`. This is a video frame only; the interface, typography, buttons, and logos are real DOM/SVG elements.

Inter regular and medium are hosted locally as TTFs, downloaded from Google Fonts/Google's font CDN. The prompt specifies no particular font. No runtime font service is required. Integration icons and placeholder company marks are inline SVGs.

The optional design reference `/home/opc/motionsites/assets/previews/7.webp` was absent. No other designs were read; fidelity was assessed against the written prompt and the supplied video. No reference extraction or substitute animation was needed.

## Browser validation

Run the checked-in Chromium verification against the **built dist files**:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/7:/work \
  -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script starts a temporary local HTTP server inside its container and closes it on completion. It uses the image's existing Chromium and playwright-core.

Verified at 1440×1000 and 390×844: real video playback, full video opacity, locally loaded font, no horizontal overflow, logos clear of the footer, no JavaScript errors, no failed requests, navigation dialogs, mobile menu, Escape dismissal, signup preview, and contact preview. Also verified rendering with reduced motion enabled.

Artifacts:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/checks.json` — recorded browser measurements and interaction results
- `result.json` — delivery status and limitations

Build succeeds. Vite reports a nonblocking bundle-size warning because the initial bundle includes the full HLS player. Chromium was tested; Safari/native-HLS and other browsers were not available for validation. Stream frames vary with playback time, so screenshots capture a moment in the actual animation. `ready` means prepared for review, not published.
