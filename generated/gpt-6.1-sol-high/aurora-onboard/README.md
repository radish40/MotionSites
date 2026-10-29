# Aurora Onboard

Aurora Sign Up is a responsive, two-column registration interface implemented from this project's PROMPT.md. The project index name is **Aurora Onboard**, and the design ID is `aurora-onboard`.

Built with React, TypeScript, Tailwind CSS v4, `motion/react`, and `lucide-react`. All application components and styles are in `src/App.tsx` and `src/index.css`; `src/main.tsx` only mounts the application. Desktop includes the exact supplied autoplaying video without an overlay, Aurora branding, animated hero content, and three registration phases. Mobile hides the hero. The form includes native required/email/password validation, an accessible password visibility toggle, and submission feedback.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

The development URL is `http://localhost:5173/motionsites-results/aurora-onboard/`. Vite's base is `/motionsites-results/aurora-onboard/`; publish the contents of `dist/` at that path. `dist/index.html` and its bundled assets are the completed static build. Dependency versions are preserved in `package-lock.json`.

This host uses the existing Docker image for Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible Chromium check serves the real production build at its configured subpath and checks desktop 1440×1000 and mobile 390×844:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Evidence:

- `screenshots/desktop.png` and `screenshots/mobile.png`: full-page screenshots of the initial interface, visually reviewed.
- `screenshots/checks.json`: browser observations and assertions, including viewport, font/video loading, overflow, native validation, password visibility, submission, social buttons, and login feedback.
- Production build and browser checks passed. No uncaught JavaScript errors, browser console errors, HTTP errors, or horizontal overflow in either required viewport.

## Assets and limitations

Inter is imported from Google Fonts with weights 300, 400, 500, 600, and 700. The video source is the exact CloudFront URL required by PROMPT.md. Both loaded successfully in Chromium; video playback was confirmed with readyState 4, nonzero playback time, and no media error. Chromium logged aborted video requests; playback nevertheless succeeded in both viewports. These external assets require network access.

This is a static interface without an authentication backend. Valid submission gives explicit preview feedback; Google, Github, and Log in buttons explain their preview availability. No account is created and credentials are not transmitted or stored. The remaining studio/profile phases are the specified visual steps.

Status `ready` means ready for management review. No deployment or push was performed.
