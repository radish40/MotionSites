# Taskly

Responsive Taskly hero built from this project's PROMPT.md with semantic HTML, CSS, JavaScript, and Vite. Production output is in `dist/`, configured for `/motionsites-results/taskly/`. Nothing was deployed or pushed.

Includes sticky liquid-glass navigation, layered blue glow, Fustat headline and brand, Inter UI, rating badge, glass CTA, animated electric-blue orb, and five original grayscale SVG placeholder logos. Mobile uses a single column with collapsible navigation. Navigation opens compact informational dialogs; signup controls open a validated demo form. Details are neither sent nor stored. Native dialogs support keyboard focus containment, Escape, and focus restoration. Reduced motion pauses the video.

## Build

With Node 22:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/taskly/` on the preview server. Serve all of `dist/` together at that subpath.

The supplied host has no Node, so the build uses:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/taskly:/work \
  -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

Lockfile included; Vite pinned to 6.4.5. npm reported zero vulnerabilities. Dependencies are excluded from the handoff.

## Verification

The repeatable check script serves the built files at the required subpath and uses the Docker image's existing Playwright and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/taskly:/work \
  -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Passed desktop 1440×1000 and mobile 390×844: local fonts, advancing autoplay video, exact color filter and screen blend, no horizontal overflow, no console/script/HTTP errors, navigation dialogs, mobile menu, signup submission and confirmation, SignUp button, Escape dismissal, close button, and reduced-motion video pause. Screenshots were visually inspected.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/checks.json`

Screenshots show the complete page; mobile naturally scrolls. Verification covers Chromium only.

## Assets and limitations

Original video successfully downloaded from https://future.co/images/homepage/glassy-orb/orb-purple.webm to `public/assets/orb-purple.webm`. No asset reconstruction or reference extraction was needed. The authorized Taskly reference was inspected; it contains an isolated purple orb rather than a complete page layout.

Video retains autoplay, loop, muted, playsinline, screen blending, desktop scale 1.25, and the exact hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1) filter. A separate wrapper SVG luminance key removes black so the orb renders on white. Near-black edge transparency is approximate; source compression is visible in enlarged highlights. Mobile scale is 1.15 to fit the narrower composition.

Fustat Bold and Inter Regular/Medium/Semibold were downloaded from Google Fonts and are served locally. `public/assets/fonts-source.css` records the original URLs; `fonts.css` uses local files. All runtime assets are local. Five inline SVG placeholder logos and the Taskly mark/favicon were drawn for this page, as allowed by the prompt; company marks do not imply actual endorsements.

This is a static hero demonstration. No account service, billing, or backend is connected. Ready means ready for review, not published.
