# Contact Cybernetic

Design ID: `contact-cybernetic`. A Mainframe® contact hero implemented from `PROMPT.md` with React, Tailwind CSS v4, Motion (`motion/react`), and Lucide icons. Includes the exact supplied video, Inter typography, typewriter headline, desktop mouse scrubbing, mobile playback and navigation, multi-select services, and animated inquiry feedback.

## Build and run

Requires Node 22 and npm. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/contact-cybernetic/`. Vite's base is configured for that exact publishing path. The complete static deliverable is `dist/`, including `dist/index.html`.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

The check serves the real production files at the required subpath and uses the image's existing Playwright and Chromium. It checks desktop 1440×1000 and mobile 390×844: completed typewriter, native desktop video seeking, mobile autoplay, multi-select and deselection, inquiry URL, menu stacking and closing, browser errors, and horizontal overflow. It also checks the bundled video and font fallback with external network requests blocked.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png` (exact viewport sizes), `screenshots/mobile-full.png`, `screenshots/mobile-menu.png`, and `screenshots/browser-checks.json`. The primary screenshots show Brand and Digital selected. `build.log` records the production build.

## Assets and limitations

- The supplied CloudFront video is the primary source. Its identical downloaded copy in `public/assets/cybernetic.mp4` is used if the remote source errors. Verified source: 3840×2160, duration approximately 4.04 seconds.
- Inter is imported from Google Fonts. Downloaded Google Fonts files are also bundled locally so typography works without external access. No font or video requests failed during the normal browser checks.
- The prompt provides no destination pages for Labs, Studio, Openings, or Shop; these links return to the hero. Get in touch targets the service selector.
- No contact address or submission endpoint was provided. Let's Go opens an email draft containing the selected services; the recipient is intentionally empty. It sends nothing automatically.
- Mobile playback remains subject to browser autoplay policies. The tested Chromium environment allowed muted inline playback.
- Vite reports nonfatal warnings about Motion's package-level `use client` directives; the production build succeeds and browser checks pass.
- This is a static hero implementation. No deployment, push, backend, or message sending was performed.
