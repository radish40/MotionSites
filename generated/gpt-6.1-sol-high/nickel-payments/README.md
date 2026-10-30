# Nickel Payments

A responsive landing-page hero built from this project's `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS, and shadcn/ui-style components (Radix primitives and the CVA Button). Includes the specified floating navigation, orange gradient buttons, original headline and description, and original animated video.

## Build and run

Requires Node 22/npm, or the provided Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/` is the complete static delivery, including local video and fonts. The configured publication base is `/motionsites-results/nickel-payments/`. For local development use `npm run dev` and open that path. For production preview use `npm run preview`.

## Verification

The actual production build passed TypeScript and Vite compilation with no unresolved asset warnings. Chromium checks used the supplied Docker image's Playwright installation. Reproduce after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.cjs & server_pid=$!; node scripts/check.cjs; check_status=$?; kill "$server_pid"; exit "$check_status"'
```

- Desktop viewport: 1440 × 1000; mobile viewport: 390 × 844.
- No browser script errors, failed HTTP asset responses, or horizontal overflow.
- Local Inter loaded at both sizes. Desktop video decoded and played automatically; video is hidden on mobile as required.
- Products and Company dropdowns, pricing/accountant/login links, hero CTAs, email validation and preview submission, dialog dismissal, and mobile navigation checked.
- Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`; machine-readable results: `screenshots/checks.json`. Full-page screenshots include the extra vertical space implied by the prompt's navbar plus hero minimum height.

## Assets and limitations

- Video: downloaded without alteration from the exact CloudFront URL in `PROMPT.md` to `public/assets/hero.mp4` (8,689,875 bytes). All animation is the supplied video; the page's text and controls are real DOM.
- Inter: downloaded from Google Fonts at weights 400, 500, 600, and 700; original font-face source recorded in `public/assets/inter-source.css`. Served locally, with no runtime third-party requests.
- The optional `/home/opc/motionsites/assets/previews/nickel-payments.webp` reference did not exist. Composition follows the full written prompt, and no reference extraction or approximate replacement assets were needed.
- The prompt specifies no service endpoints. CTA and navigation dialogs are local, accessible demonstrations: they never send/store email, authenticate users, or claim a request was delivered. These limits are disclosed inside the dialogs.
- No deployment, push, other project work, or agents were used. `ready` means ready for review, not published.
