# Mouse Trail CTA

Standalone implementation of **Partner with us**, using React 18, TypeScript, Tailwind CSS 3 and Vite. Design ID: `mouse-trail-cta`.

The white card uses the specified 40px corners, shadows, 192px vertical padding, responsive PP Mondwest heading, and portrait CTA. Pointer movement creates random animated thumbnails every 80ms; they rotate by up to ±10°, fade and shrink over one second, then disappear. The heading and CTA reveal once through an IntersectionObserver with a 0.1 threshold. Content stays above the trail. Keyboard focus and reduced-motion preferences are supported.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
# Open http://localhost:5173/motionsites-results/mouse-trail-cta/
npm run build
npm run preview
```

On the supplied host, use its existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`dist/index.html` and all required static assets are included. Vite's base is `/motionsites-results/mouse-trail-cta/`; serve `dist/` at that path. No deployment was performed. `package-lock.json` is included; `node_modules` is excluded.

## Browser verification

The reproducible browser script starts a temporary HTTP server, serves the actual production files at the required subpath, runs Chromium through the image's existing Playwright installation, and shuts down:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-checks.cjs'
```

Passed checks cover desktop 1440×1000, mobile 390×844, loaded custom fonts and portrait, heading sizes, rounded card, no horizontal overflow, keyboard focus, CTA hover and target, trail placement and dimensions, throttle, fade, scale, removal, reduced motion, and sticky reveal on scroll. No browser console errors, script errors, failed requests, or HTTP asset errors were observed. The dependency install reported zero audit vulnerabilities.

- [Desktop](screenshots/desktop.png)
- [Desktop with active mouse trail](screenshots/desktop-trail.png)
- [Mobile](screenshots/mobile.png)
- [Machine-readable browser results](screenshots/checks.json)

Screenshots were also visually reviewed.

## Assets and limitations

All working assets are local, including eight original 160×120 animated GIF motion studies. Their generator is `scripts/generate-assets.mjs`; after installing dependencies, `npm run assets` recreates the GIFs and converts the bundled source Mondwest OTF to WOFF2.

The prompt's two Webflow PP Neue Montreal URLs both returned **HTTP 403**. Those URLs remain in the font declarations as secondary sources; working local copies are first so the page makes no unsuccessful external requests. The WOFF copies were obtained from:

- `https://fonts.cdnfonts.com/s/100431/ppneuemontreal-book.woff`
- `https://fonts.cdnfonts.com/s/100431/ppneuemontreal-medium.woff`

PP Mondwest source: `https://raw.githubusercontent.com/magancodes/oximy-llm-sniffer/main/static/PPMondwest-Regular.otf`, converted to `public/PPMondwest-Regular.woff2`. An attempted alternative at `https://esm.sh/@wundercorp/loki-ui@0.4.0/dist/fonts/Mondwest-Regular.woff2` returned 404 and is not used. Font copyrights remain with their owners; no commercial font license is included.

The portrait is a locally saved square stock image from `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=85`. It is an illustrative stand-in, not a verified photo of Viktor Oddy; the prompt supplied no actual portrait.

No chat URL or email address was supplied. The CTA opens a prefilled `mailto:` project inquiry without a recipient. It requires a configured email client, and the user must enter the intended recipient. No message is sent automatically; OS email-client launch is outside the headless browser checks. Replace the href with the approved chat destination when available.

The trail is a mouse interaction and does not run during touch scrolling. Reduced-motion mode keeps the content visible and disables trail spawning.
