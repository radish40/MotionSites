# Email Landing Page

Design ID: `email-landing-page`. A complete Aura landing page implemented from `PROMPT.md` using React 18, TypeScript, Vite, Tailwind CSS, motion/react v12, and lucide-react. The requested Supabase dependency is installed; no service credentials or backend are needed.

The page includes the exact CloudFront background video, Google Fonts Inter import, animated gradient headline, macOS menu strip, interactive inbox, liquid-glass triage and testimonial cards, monthly/yearly pricing, and final call to action. Pricing copy (including the Forma reference) follows the supplied prompt. Both specified `c3-noise` SVG definitions are preserved.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/email-landing-page/` on the Vite server. The production build uses that exact base path; publishable files are in `dist/`, including `dist/index.html`. Nothing has been deployed or pushed.

In the provided Docker environment, from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

The browser script starts a temporary HTTP server inside the container and uses its existing Playwright and Chromium. It writes `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/browser-report.json`.

## Validation

A real TypeScript and Vite production build passed. Chromium checks at desktop 1440×1000 and mobile 390×844 verify page overflow, billing prices, plan selection, download notice, mail search, compose preview, archiving, mobile navigation, mobile message reading, and horizontal pricing scrolling. Screenshots show the complete page after scroll animations are revealed. No page script errors were observed.

Inter loaded successfully. The specified CloudFront video reached readyState 4, reported a 1920-pixel source width, and played automatically. Chromium also reported aborted video range requests; playback still succeeded. The external font and video retain their original URLs and require network access.

## Preview boundaries

No download binary, checkout, sales destination, blog, documentation, or careers content was supplied. These controls open clear local preview notices. Compose saves only a preview confirmation; no messages are sent. Inbox changes are held in memory and reset on reload. Mobile hides the inbox sidebar and opens messages in a separate reader with a back button; pricing uses the required horizontal scroll-snap cards.
