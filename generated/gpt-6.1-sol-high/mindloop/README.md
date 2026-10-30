# Mindloop

Mindloop (`mindloop`) implements the supplied Velorah® hero design using React, Vite, and CSS. It includes the original full-screen looping video, Instrument Serif headings, Inter body text, responsive navigation, liquid-glass links, and staggered fade-rise animations. All displayed copy follows PROMPT.md.

## Run and build

Requires Node.js 22.12+ and npm. The lockfile is included.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured URL is `/motionsites-results/mindloop/`. The complete static output is in `dist/`, including `dist/index.html`; no runtime API or external asset requests are required.

On the provided host, build using the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The production build completed with Vite 8.3.5. Dependency installation reported zero vulnerabilities. Chromium browser checks ran against the actual `dist/` output at its configured subpath, using Playwright Core from the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

- Desktop: 1440 × 1000; mobile: 390 × 844.
- Video decoded at 1928 × 1076, advanced during playback, and had autoplay, muted, loop, and playsInline enabled at both sizes.
- Both local fonts loaded. Navigation was visible on desktop and hidden on mobile.
- Both journey links, desktop navigation, desktop hover scale, and keyboard focus passed.
- No horizontal overflow, browser script/console errors, or failed network requests.
- Screenshots were visually inspected: `screenshots/desktop.png` and `screenshots/mobile.png`.
- Detailed browser evidence is in `screenshots/checks.json`. Screenshots freeze the original video at two seconds for consistent capture; the delivered page plays continuously.

## Assets and limitations

- `public/assets/hero.mp4` is an unmodified local download of the exact prompt asset: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4 . It returned HTTP 200; no recovery or approximation was necessary.
- Instrument Serif and Inter were obtained from Google Fonts and bundled locally. The original Google Fonts CSS response is preserved in `fonts-source.css`; OFL licenses are included alongside the fonts. Only the regular styles used by this design are bundled.
- The optional reference `/home/opc/motionsites/assets/previews/mindloop.webp` was absent. Layout was implemented from the complete prompt; reference-image comparison was unavailable.
- This is the requested single hero. The prompt supplies no downstream destinations, so navigation and journey links target `#home`; no additional pages, signup flow, or backend are invented.
- Checks cover Chromium at the two required viewports, not physical devices or Safari/Firefox. Reduced-motion preferences disable entrance animations; autoplay remains as requested.
- No deployment or push was performed.
