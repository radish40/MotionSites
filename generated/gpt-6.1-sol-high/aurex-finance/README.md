# Aurex Finance

Design ID: `aurex-finance`. The page brand and document title are **LŪMEN // ÍNDEX**.

A single viewport hero built with React 18, TypeScript, Vite 5, Tailwind CSS 3, and lucide-react. It follows PROMPT.md: live floral video, Graphik display typography, Manrope UI typography, staggered entrance animations, percentage-based grid and node diagram, responsive wallet navigation, mobile menu, and chamfered information card. App is one React component, renders one section, and uses only the prescribed `menuOpen` state.

## Build and run

With Node 22/npm installed:

```bash
npm ci
npm run build
npm run dev
```

On this host, Node/npm are supplied by the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static build is in `dist/`. Vite's base is `/motionsites-results/aurex-finance/`; serve `dist/` at that URL. No deployment or push was performed. `package-lock.json` records the installed dependency versions. The favicon uses a local SVG and a Vite base-aware reference.

## Browser validation

The actual production files were served by a temporary HTTP server inside Docker and checked with Chromium and playwright-core from the existing image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The check script starts and stops its own server; the local npm dependencies are not required to run it after building.

- Production TypeScript check and Vite build passed.
- Required 1440×1000 desktop and 390×844 mobile checks passed, with no document overflow in either direction.
- Additional 640×1000, 768×1000, and 1024×1000 checks passed for the specified responsive visibility breakpoints and document bounds.
- Confirmed one section, exact title, desktop heading position (35px, 178px), shared CTA gutter, and responsive node/card visibility.
- Tested mobile menu opening, close button, and closing on nav selection. Wallet strip appears in the mobile overlay.
- Confirmed CTA hover color `#c8e8ff`.
- No browser console errors, uncaught script errors, or failed requests were observed.
- The exact video loaded at 1912×1080, readyState 4, unpaused, with advancing playback time. Graphik and the used Manrope font subset loaded successfully; unused language subsets remain unloaded normally.

Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-menu.png`, and detailed `screenshots/browser-checks.json`. Screenshots were visually inspected. Video animation means each screenshot captures a different moment.

## Assets and limitations

The video uses the exact CloudFront URL in PROMPT.md. The two font stylesheet links are preserved in the required order. All were available during verification. No assets were recovered, approximated, or extracted from the reference. The Aurex-only reference at `/home/opc/motionsites/assets/previews/aurex-finance.webp` was used for visual comparison, never as page content.

Graphik source and attribution: [Web Fonts / OnlineWebFonts](http://www.onlinewebfonts.com/fonts), whose supplied stylesheet states CC BY 4.0. Manrope is served by Google Fonts. External video and font availability remain dependent on their providers.

The prompt specifies presentation and menu interaction, but no destinations for desktop navigation, private banking CTA, or transparency report. These retain the prescribed presentation and hover states without inventing banking flows or additional sections. The wallet and member status are the static design content, with no wallet integration.

`npm audit` reported two development-tool vulnerabilities (Vite: high; esbuild: moderate) in the required Vite 5 dependency line. The suggested automated fix changes Vite to a different major version; the requested stack was retained. Details are saved in `screenshots/dependency-audit.json`. The deliverable is a static build; it does not run the Vite development server in production.

Verification used desktop Linux Chromium with a mobile viewport, not physical iOS/Android hardware. All writes stayed inside this project. No other design, agent, session, deployment, push, or messaging service was used.
