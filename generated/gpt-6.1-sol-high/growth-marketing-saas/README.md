# Growth Marketing SaaS

Design ID: `growth-marketing-saas`. Implements the UI Rocket / Vibe Design course landing page described in `PROMPT.md`: one fixed transparent navbar and one cinematic hero with an interactive glass dashboard and foreground grass.

Built with React, Vite, TypeScript, Tailwind CSS, framer-motion, lucide-react, and a shadcn-style Sheet using Radix Dialog primitives. The supplied video/image URLs remain remote. Inter, Instrument Serif, and Material Symbols load from the exact Google Fonts links in the prompt.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The required deployment base is `/motionsites-results/growth-marketing-saas/`. The production output is in `dist/`, including `dist/index.html` and fingerprinted JS/CSS. Serve that directory at the configured base path.

This host uses the available Docker image for Node and Chromium:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

The production build passed TypeScript checking and Vite bundling. Dependency installation reported zero vulnerabilities. The reproducible browser check serves the actual `dist/` under the configured subpath and uses the image's Chromium and playwright-core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 checks/browser.cjs
```

Results are recorded in `checks/browser-results.json`. Passed checks include desktop 1440×1000 and mobile 390×844, no horizontal overflow, no page script errors, no failed asset requests, both videos actively playing, grass loaded, all three fonts loaded, CTA scroll, chat submission by Enter and button, Shift+Enter multiline input, automatic conversation scrolling, email preview feedback, scroll parallax, reduced motion, video restart/fade, and mobile sheet Escape dismissal and navigation dismissal. Screenshots were visually inspected.

- `screenshots/desktop.png`: exact desktop viewport.
- `screenshots/mobile.png`: exact mobile viewport.
- `screenshots/desktop-full.png` and `screenshots/mobile-full.png`: full page views.
- `screenshots/mobile-menu.png`: open mobile sheet.

## Scope and limitations

Only the requested navbar and hero are implemented. Navigation scrolls to existing parts of the hero/dashboard; the hidden mobile chat target falls back to the visible dashboard. No additional content sections were invented. Brand and authentication links respect the required hosting subpath. `/auth` remains a destination for future integration; authentication, checkout, and a backend are outside this single-page build. Get course scrolls to the course preview. Chat uses local state and a canned response. The email form validates its input and explicitly reports that this is a preview and no email is stored. Social icons link to the named public platforms because no account-specific destinations were supplied.

No asset or font failures were observed. External media/fonts require network access and remain dependent on their providers. Screenshots capture particular frames of the looping videos. Validation used Chromium; other browser engines were not tested. No deployment, push, or external messaging was performed.
