# Max Reed Portfolio

Design ID: `max-reed-portfolio`. A responsive personal portfolio built from the supplied `PROMPT.md` using React, TypeScript, Tailwind CSS, Vite, and lucide-react. Includes the exact introductory copy, career timeline, testimonial, startup metric, software marquees, and contact details.

The production files are in `dist/`. The configured public base is **`/motionsites-results/max-reed-portfolio/`**. This project has not been deployed.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Visit the base path shown above. `npm run build` runs TypeScript checking followed by a Vite production build. Dependencies are pinned in `package-lock.json`; `node_modules` is excluded from version control.

The host used for this build has no Node installation, so the actual build used the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The checked production build runs at the actual nested base path in headless Chromium, using the image's existing `playwright-core` installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint node \
  louislam/uptime-kuma:2 browser-check.cjs
```

The checks cover 1440×1000 desktop, 390×844 mobile, and 768×1024 tablet viewports; responsive columns; horizontal overflow; desktop viewport fit; local font loading; all three videos decoding and playing muted in a loop; mail and telephone destinations; keyboard focus; marquee hover pause; reduced-motion behavior; browser errors; and failed HTTP responses.

- `screenshots/desktop.png`: full desktop capture.
- `screenshots/mobile.png`: full-page capture taken with the 390×844 viewport.
- `screenshots/browser-checks.json`: measured layout and media results.

The captured mobile page scrolls vertically as required by its single-column layout. The browser occasionally cancels a portrait-video range request with `net::ERR_ABORTED`; this is recorded separately from errors. All videos subsequently reach readyState 4 and play successfully. There are no script errors or HTTP error responses.

## Assets and behavior

All three supplied CloudFront MP4 files were downloaded successfully and bundled unchanged:

| Local asset | Original supplied filename |
| --- | --- |
| `public/assets/background.mp4` | `hf_20260507_150203_44a5bd32-516a-47ce-a077-8acbf9aa8991.mp4` |
| `public/assets/impact.mp4` | `hf_20260507_154543_d5b83fc1-9cea-44f3-b5e8-8f325935211a.mp4` |
| `public/assets/software.mp4` | `hf_20260507_153148_d7a3e1dd-e5d0-4ce6-8306-00d7522ecc44.mp4` |

Their common source directory is `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/`. Inter weights 300, 400, and 600 were retrieved through Google Fonts (`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap`) and bundled as local TTF files. Icons come from lucide-react with stroke width 1.5. The grain is the prompt's inline SVG noise, and the glass treatments use its supplied CSS. No production asset depends on an external request.

Both collaboration buttons and the email address open `mailto:hi@maxreed.com`; the phone opens `tel:+442078163`. Activating these links depends on the user's configured email/phone application; no message is sent by the website. Reduced-motion preferences pause the video backgrounds and marquees. Hovering over Daily Software pauses the scrolling rows.

## Limits

The original videos total approximately 25 MB and remain unchanged to preserve the supplied assets. Autoplay remains subject to browser and device policy. External email/phone applications were not launched during automated checks; their link destinations were verified. Browser checks used Chromium, not Safari or Firefox. At desktop heights below 740px, the layout allows vertical scrolling to keep the cards readable. `ready` in `result.json` means ready for review, not published.
