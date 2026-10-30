# Terra Geo Map

Terra geo-mapping SaaS hero, implemented from this project's TASK.md and PROMPT.md. Design ID: `terra-geo-map`.

React, Vite, and lucide-react provide the responsive navigation, menu icons, and DOM-based hero. The design includes Inter, primary blue `#2E7DF3`, the Product Hunt badge, gradient builder text, the specified SVG selection outline, and the supplied looping video. The heading retains the explicitly requested inline `letter-spacing: -0.2em`.

## Build and run

Requires Node 22/npm, or the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is in `dist/`, including `dist/index.html`. Vite uses base `/motionsites-results/terra-geo-map/`. Serve that directory at the configured path. With Node installed, `npm ci && npm run dev` starts development; `npm run preview` previews the production build. Dependencies are recorded in `package-lock.json`; node_modules is excluded.

## Verification

The real production build passed. Chromium checks use the built output at the configured subpath, with a local HTTP server and byte-range video serving:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 /work/scripts/browser-check.cjs
```

Verified desktop 1440×1000 and mobile 390×844: fonts load, video decodes and autoplays muted, no horizontal overflow, no console/script errors, and no failed requests. Checked desktop dropdown opening/Escape dismissal, mobile Menu/X and submenu toggling, Login/Sign Up dialogs, form validation flow, and CTA preview scrolling/video controls. The login form uses native email validation. Dialogs support Escape, backdrop dismissal, focus containment, and focus return.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png` are exact viewport captures; `*-full.png` captures the complete page. `screenshots/browser-checks.json` contains measured results. Screenshots capture the video near two seconds; the live video continuously animates.

## Assets and scope

- Original video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_092310_5c71bab5-63cd-4a95-9390-cc6a1189d553.mp4
- Saved unchanged as `public/assets/terra-demo.mp4` (1764×1176). It displays at its original 3:2 proportions without cropping.
- Inter is downloaded from Google Fonts; original URLs are preserved in `public/assets/inter-source.css`. Local weights 400, 500, 600 (specified semibold), and 700 are bundled. No runtime external font or video requests are required.
- Globe and trophy are the requested Unicode emoji; appearance depends on the platform's emoji font.
- The optional project reference `/home/opc/motionsites/assets/previews/terra-geo-map.webp` was absent. No preview imagery was extracted or used. Implementation follows the written specification.
- This is a static landing-page preview. CTA and Examples reveal the supplied product video. Login/Sign Up demonstrate a local email flow with an explicit preview notice; there is no authentication service, account creation, pricing service, or email transmission.

No deployment or push was performed. `ready` in result.json means ready for review, not published.
