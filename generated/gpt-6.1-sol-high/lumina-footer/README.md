# Lumina

A React and TypeScript page with the requested immersive CloudFront video, Helvetica Regular, and liquid glass footer. Built with Tailwind CSS v4, `motion/react`, `lucide-react`, and Vite. The exact supplied glass CSS, font-face declaration, footer entrance animation, logo, and footer copy are included. The upper CTA uses the prompt's allowance for placeholder content and scrolls to the footer.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/lumina-footer/`. Nothing has been deployed or pushed.

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The script serves the real production build at its required subpath in a temporary container and runs installed Playwright Core with Chromium. It checks desktop 1440×1000 and mobile 390×844, video readiness and playback progression, font loading, footer link counts, CTA and home navigation, focus and hover, script errors, and horizontal overflow. Results are in `screenshots/browser-checks.json`. The screenshots `screenshots/desktop.png` and `screenshots/mobile.png` capture those exact viewport sizes after the CTA scrolls the footer into view. Both were visually reviewed.

## Assets and limits

- The original CloudFront MP4 is used directly at the exact specified `src`; browser playback was verified at 1280×720 source resolution, muted and looping. It remains dependent on the external host.
- The supplied Helvetica Regular WOFF2 loaded successfully in both browser checks. The exact remote font-face declaration remains intact.
- Chromium logged an aborted video network request while its media pipeline selected ranges. Playback still reached readyState 4 and time advanced on both viewports. This is preserved in the raw check report.
- The optional `/home/opc/motionsites/assets/previews/lumina-footer.webp` reference was absent. Implementation follows PROMPT.md; no reference extraction, substituted artwork, or screenshot-based page was used.
- The 13 footer navigation links are same-page placeholders. No destination pages were provided. Social links point to each platform's homepage, not invented Lumina accounts. Their labels and URLs were checked without opening external windows.
- Screenshots show one moment of an animated background and do not validate every video frame. Browser verification uses desktop Chromium with a mobile viewport; it is not a physical iOS device test.
