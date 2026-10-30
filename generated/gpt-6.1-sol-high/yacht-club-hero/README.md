# Yacht Club

Design ID: `yacht-club-hero`. A single-page luxury sailing experience built with React 19, Vite, TypeScript, Tailwind CSS v4, GSAP, and motion/react. Real video backgrounds, serif hero typography, an 80-element liquid cursor pool, a staggered off-canvas menu, and an animated three-vessel fleet viewer are implemented as live DOM components.

## Run and build

Requires Node 22 and npm. Run `npm ci`, then `npm run dev`. Run `npm run build` to create the complete static site in `dist/`. The configured public base is `/motionsites-results/yacht-club-hero/`. The dependency lockfile is included; node_modules is excluded from deliverables.

On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

`scripts/verify.cjs` runs real Chromium using `/app/node_modules/playwright-core` in the supplied Docker image. Start `npm run preview -- --port 5173` in the same container before running `node scripts/verify.cjs`. It checks the built static site at 1440×1000 desktop and 390×844 mobile in separate touch/mouse contexts.

Default-mode evidence records every network request, console error, page error, CSP violation event, and Chromium security log entry. Checks cover zero Vimeo/Cloudflare requests, no iframe, advancing fallback playback, all three exact vessel detail movie clocks, desktop hover playback/specifications, mobile touch controls, GSAP menu/Join/Escape controls, ripples, fonts, and layout overflow. SHA-256 comparisons confirm the three fleet assets are unchanged in source and dist. Normal media requests may be aborted when a video unmounts.

Screenshots in `screenshots/` include `desktop.png`, `mobile.png`, menu/fleet states, and all three vessel detail views on both devices. `screenshots/browser-report.json` contains the reproducible browser evidence and playback clock samples. Original-mode evidence is recorded separately and is not part of the default-mode clean-console assertion.

Final local validation: the production build and all **59 browser checks** passed. Both default viewports made zero Vimeo/Cloudflare requests and recorded zero CSP violations, security-log entries, console errors, or page exceptions. The fallback and all three detail movies advanced; desktop hover and mobile touch controls passed. All three fleet movie hashes match their pre-repair values in source and dist. The local favicon reuses the existing sail mark and removes a missing-icon 404. No server policy or error checker was weakened.

## Assets and limitations

The three exact fleet videos were successfully downloaded and are served locally. Instrument Serif is imported from a local stylesheet containing the original Google Fonts regular and italic files; this preserves the Google Fonts typeface while avoiding a hanging external CSS request. Geist is bundled from the specified fontsource package. Asset provenance is in `public/assets/SOURCES.md`.

The supplied Vimeo embed returned a connection-verification restriction, and its playback-config endpoint returned PrivacyError. **Default mode mounts no Vimeo iframe, installs no Vimeo message listener, and makes no Vimeo/Cloudflare challenge requests.** The moving hero uses the supplied local Ocean Eclipse fleet video. This remains an approximation of the missing original background; original playback has not been recovered or claimed.

Explicit original-media opt-in: open `/motionsites-results/yacht-club-hero/?media=original`. Only this exact query value mounts the original iframe with its unchanged source:

```text
https://player.vimeo.com/video/1184061018?background=1&autoplay=1&loop=1&byline=0&title=0
```

Opt-in preserves the existing Vimeo `ready` subscription and `play`/`timeupdate` visibility behavior. The local fallback remains underneath. This mode deliberately requests the unavailable third party and may log its challenge/CSP failures; it does not imply original playback. Tests verify the exact iframe URL/request and use a clearly labeled synthetic message to check the retained event handler, not to claim actual video playback. The specified reference WebP was absent, so exact visual/animation comparison against it was unavailable. No screenshot is used as a page background.

Home and Our Fleet switch the specified app views; Join opens the navigation. The other required navigation labels are present and dismiss the menu; no unspecified destination pages or membership backend were added. Social links are platform root links because no club handles were supplied. View presents the selected vessel's supplied video and specifications.

The project is prepared for review only. It has not been pushed or deployed. The management hold remains until management independently checks the fixed public build. Local validation does not release that hold.
