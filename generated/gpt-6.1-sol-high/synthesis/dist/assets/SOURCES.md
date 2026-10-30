# Synthesis asset sources

- `health-capital.mp4`: exact video specified in PROMPT.md, downloaded unchanged from https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260610_193933_20e7efd7-2d68-4946-a270-04cb7b9ab74b.mp4 (HTTP 200).
- `roobert-trial.woff2`: original font from https://db.onlinewebfonts.com/t/0ab46e1b2f236c9fad58c1e34cdecdf1.woff2. Provider stylesheet retained in `roobert-provider.css`; font credit: [Web Fonts](https://www.onlinewebfonts.com/fonts). This is the specified TRIAL font; no commercial licensing claim is made.
- `instrument-serif.ttf` and `instrument-serif-italic.ttf`: original Google Fonts files referenced by the specified Instrument Serif stylesheet; URLs retained in `instrument-provider.css`.

The exact external stylesheet links remain in index.html. Local font declarations follow those stylesheets so the requested faces can load even when third-party hosts are unavailable. Video is fetched from its local copy as a blob and decoded at runtime. No generated or substitute imagery is used. The provided Synthesis preview was inspected only as a visual reference; no image or video was extracted from it.
