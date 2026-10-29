# 3D Studio Pricing

Design ID: `3d-studio-pricing`.

A full-screen React hero with the supplied looping cinematic video, Google Fonts Geist, and a translucent three-column pricing card. Built with Vite, Tailwind CSS, and Lucide React. The cinematic fidelity switch supports pointer and keyboard input and retains its state during the session. The displayed studio rate remains the specified $3,180; the optional upgrade is labeled +$520.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/3d-studio-pricing/`. Vite uses this exact base path, and the production files are in `dist/`, including `dist/index.html`.

In the supplied environment without host Node:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible check serves the actual production build under its required subpath and uses the image's Chromium and Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Checks cover desktop 1440×1000, mobile 390×844, tablet 768×1024, and small desktop 1024×900. They verify no horizontal overflow or JavaScript errors, actual Geist font loading, autoplaying video, switch click and Space-key behavior, feature count, visible CTA, email draft content, and the 340px desktop card height. Screenshots and measured results are saved in `screenshots/`; the two required captures are `desktop.png` and `mobile.png`. The video is paused at three seconds only during screenshot capture for a consistent frame; production playback loops normally.

## Implementation notes and limitations

- The supplied MP4 remains at its exact CloudFront URL. Google Fonts uses the exact requested stylesheet. Both loaded during browser verification; their availability still depends on external services.
- Chromium reports canceled (`net::ERR_ABORTED`) media range requests during playback/seeking. The video decoded at 1440×1440, played on every checked viewport, and had no media error. These cancellations are recorded verbatim in the browser report.
- On screens below 768px, the stacked card grows to its content instead of using the prompt's 280/310px fixed height, which would clip its three columns. The required mobile viewport fits all content. Desktop keeps the specified 340px card height.
- The price suffix wraps at intermediate widths to prevent column overlap.
- “Start a brief” opens a prefilled email draft with the selected fidelity option. No recipient address was supplied, so the recipient remains blank; sending requires the user's configured mail application and a recipient.
- No deployment, push, external messages, or other project changes were performed.
