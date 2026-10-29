# Pixel Grid Hover

Design ID: `pixel-grid-hover`. A responsive Projects / Case Studies section built with React 18, TypeScript, Tailwind CSS 3, and Framer Motion 12. The implementation follows `PROMPT.md`: four photographic cards, diagonal 12 × 8 pixel dissolves, magnetic squares, floating parallax squares, entrance animations, and the repeating SVG logo marquee.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured URL is `/motionsites-results/pixel-grid-hover/`. `dist/` contains the complete static production build, including local images and fonts. Serve it at that path. The dependency lockfile is included; `node_modules/` is excluded.

This host uses the available Docker image for Node/npm:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The repeatable verification script serves the actual `dist/` at its configured subpath, launches Chromium using the image's existing Playwright installation, and checks desktop 1440 × 1000 and mobile 390 × 844:

```bash
docker run --rm -u 1000:1000 --shm-size=256m -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

It verifies four cards, 384 pixel blocks, responsive grid placement, loaded images and both font weights, no horizontal overflow, no browser errors or failed asset requests, marquee movement, desktop hover pause, pixel reveal/reset, magnetic pointer motion/reset, keyboard reveal, and CTA arrow motion. Full-page captures are `screenshots/desktop.png` and `screenshots/mobile.png`; `screenshots/desktop-hover.png` captures the dissolve. Machine-readable observations are in `screenshots/browser-checks.json`.

## Assets and scope

All four exact Pexels URLs from `PROMPT.md` were downloaded intact to `public/assets/`: photo IDs 7691249 (HeartX), 2559941 (Swave®), 5428003 (EduSpark), and 2800832 (Greenergy). DM Sans 400 and 500 were retrieved from the specified Google Fonts stylesheet; the original stylesheet is preserved as `public/assets/dm-sans-source.css`. Runtime uses local font files and images, with no external network dependency. SVG logos are rendered from the specified geometry.

The provided 640 × 472 WebP reference was inspected. It shows the floating squares on a blank field, with no visible card content, so the complete written specification is the basis for the section. No reference screenshot is embedded in the implementation and no replacement or extracted imagery was necessary.

The prompt supplies no contact destination or case-study navigation. The CTA implements its specified button and hover animation; plus signs remain visual elements. No invented links, dialogs, or contact workflow are added. Card effects also respond to keyboard focus. Mobile uses the specified single-column layout; pointer effects are tested on desktop. Verification covers Chromium only.

The project is ready for review, with no deployment or push performed.
