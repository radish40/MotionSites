# Product Studio

Design ID: `product-studio`. KineticForge's two-section landing page, built from `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS, and the lucide-react Atom icon. Browser title: **Kinetic Forge**.

## Build and run

With Node 22/npm: run `npm ci`, then `npm run build`. Use `npm run dev` for development, or `npm run preview` to inspect the production build. Open `/motionsites-results/product-studio/` on the server. Vite's base path is configured for that location; the complete static build is in `dist/`.

On this host:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` preserves dependency versions. Dependencies are excluded from delivery and can be reinstalled with `npm ci`.

## Implementation

Two fixed, stacked background videos crossfade over 700 ms when section two reaches an IntersectionObserver threshold of 0.15. The second video resets on entry; the hero resumes on exit. The original text, client marks, typography, spacing, responsive classes, font stylesheet, and video URLs are retained.

The animated mobile menu includes staggered links, body scroll lock, Escape dismissal, keyboard focus cycling, and scroll restoration on desktop resize. Navigation links target the studio, expertise, partners, and consultation text in the two sections. “Learn more here” targets the consultation paragraph. No external destination or contact address was supplied.

## Validation

TypeScript compilation and the Vite production build passed. The locked installation reported zero dependency vulnerabilities. The actual `dist/` output was served at its configured subpath and tested in Chromium at **1440 × 1000** and **390 × 844**.

All 23 browser assertions passed: both crossfade directions, actual video playback/decoding, font loading, desktop navigation, mobile links, menu scroll lock, Escape, desktop resize, title, section count, and no horizontal overflow. The final run had no uncaught script errors, browser console errors, or HTTP asset errors.

To rerun browser validation after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Evidence is saved in `screenshots/checks.json`, with `desktop.png`, `mobile.png`, `desktop-studio.png`, `mobile-studio.png`, and `mobile-menu.png` in the same folder. Desktop and mobile hero/studio screenshots were visually inspected. Captures pause video at two seconds for reproducibility; the live site uses automatic looping playback.

## Assets and limits

Helvetica Now Var loaded successfully. Both supplied videos decoded at 1920 × 1080 with readyState 4. All three external assets require network availability. The browser recorded some `net::ERR_ABORTED` video range requests during seeking/resetting; both videos loaded and played successfully. Those events are retained in the raw report.

The supplied videos include light gray frames; the prompt specifies no extra dark overlay. Autoplay remains subject to browser policy, using the requested muted/playsInline attributes. Validation used Chromium. No deployment or push was performed. Status `ready` means ready for management-session review.
