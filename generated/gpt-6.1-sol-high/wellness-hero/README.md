# Wellness Hero

Design ID: `wellness-hero`. A single-screen Aurai landing page built with React, Vite, Tailwind CSS, and lucide-react. The page uses the original looping video, Askan Light heading font, Inter UI font, glass navigation, responsive feature pills, and email form from `PROMPT.md`.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production base URL is `/motionsites-results/wellness-hero/`. Publishable files are in `dist/`, including `dist/index.html`. No deployment was performed.

The build used this available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

The real production build passed. Chromium browser checks used the production files at the required URL prefix, at desktop 1440×1000 and mobile 390×844. Both passed:

- No horizontal or vertical viewport overflow.
- Original video loaded at 3828×2164, autoplayed, advanced, and had muted/loop enabled.
- Desktop video focal point was center; mobile focal point was 80% center. Tablet uses right center via the md breakpoint.
- Askan Light and Inter loaded successfully.
- Menu opened, its Story link closed it, and Join the list focused the email input.
- Valid submission showed an alert containing the submitted email; malformed email failed native validation.
- No page script errors or failed HTTP asset requests.

Screenshots were visually reviewed: `screenshots/desktop.png` and `screenshots/mobile.png`. Raw browser results are in `screenshots/checks.json`. To repeat checks using the provided container:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

## Assets and limitations

The original CloudFront MP4 and the exact supplied Askan Light and Google Fonts Inter fonts were downloaded unchanged and bundled locally; no reference-image extraction or substitute imagery was needed. Source font stylesheets and attribution are retained in `public/assets/`, including `CREDITS.txt`. The single provided Wellness Hero preview was used only for visual comparison.

The email form uses the requested browser alert and does not send or store submissions. Navigation targets elements within the single hero. The desktop hamburger also exposes the three navigation links in a matching glass dropdown, while mobile uses the specified mobile menu. Screenshots show a frame of the live video, so the exact frame varies between runs. Browser validation was performed in Chromium, not Safari or Firefox.
