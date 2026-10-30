# Veloce Finance

Design ID: `veloce-finance-landing`. A responsive landing page for **veloce**, implemented from this project's TASK.md and PROMPT.md with React, TypeScript, Vite, Tailwind CSS and Framer Motion. Includes the video hero, responsive animated header, three video-backed statistic cards, blur entrance effects and scroll-driven gradient text.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/veloce-finance-landing/`. Serve the output at that path. Nothing has been deployed or pushed. The lockfile is included; node_modules is excluded.

## Validation

The production build was served using Vite preview in a temporary Docker container and inspected using Playwright Core and Chromium 148. Browser checks are reproducible with `scripts/browser-check.cjs` and `scripts/fallback-check.cjs`; these use the image's `/app/node_modules/playwright-core`.

```sh
docker run -d --rm --name veloce-finance-check -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
docker exec veloce-finance-check node scripts/browser-check.cjs
docker exec veloce-finance-check node scripts/fallback-check.cjs
docker stop veloce-finance-check
```

Verified at desktop **1440×1000** and mobile **390×844**: production subpath loading, no horizontal overflow, no JavaScript or console errors, original media loading, muted inline autoplay, navigation, menu open/close, Escape dismissal, menu closing after navigation, and text fill at 0% and 100%. Browsers may pause videos outside the viewport; all four videos decode successfully. The separate fallback check deliberately blocks both media hosts and confirms the four videos and two badge images recover locally.

Screenshots:

- `screenshots/desktop.png` and `screenshots/mobile.png`: full-page captures after entrance animations.
- `screenshots/desktop-hero.png` and `screenshots/mobile-hero.png`: exact viewport captures.
- `screenshots/mobile-menu.png`: expanded navigation.
- `screenshots/desktop-text-fill.png` and `screenshots/mobile-text-fill.png`: filled gradient state.
- `screenshots/browser-report.json` and `screenshots/fallback-report.json`: machine-readable checks.

The full-page captures are taken at scroll position zero, so the final text is correctly gray there. The text-fill screenshots show its colored state.

## Assets and implementation notes

All four videos use the exact original CloudFront URLs in PROMPT.md. Both badge images use the exact Higgs image URLs. Identical source files have also been downloaded into `public/assets/` and copied into `dist/assets/` as error fallbacks. Badge fallbacks were obtained from the CloudFront PNG URLs encoded in the specified Higgs URLs. No screenshot extraction or substitute artwork was used. The optional project preview file was absent.

The requested Google Fonts CSS imports for Manrope and Inter are preserved and loaded successfully in Chromium. Inter is loaded on mobile once the mobile menu renders it. Helvetica, Helvetica Neue, Product Sans and SF Compact use the fallback stacks prescribed by the prompt; proprietary font binaries were not supplied. Brand gradient values are exactly `#B56939`, `#5C3779`, `#454BBB`; other interface colors use the prescribed navy and neutrals.

`@supabase/Bolt Database-js` is not a valid npm package identifier. The official `@supabase/supabase-js` package is installed instead and is unused by the UI, as requested. There is no backend or authentication configuration in the supplied design. Log in and Sign up lead to the app download badges. Home leads to the hero, About us to insights, and Faq to the final app-information text; no FAQ content was supplied. Store badges link to Google Play's veloce search and Apple's App Store landing page because no verified app listing URLs were supplied. No authentication, FAQ, or additional product sections were invented.

Screenshots are representative frames of the original looping videos. The prompt describes four areas but names three root content components; the header, hero, insights and final text are all implemented.
