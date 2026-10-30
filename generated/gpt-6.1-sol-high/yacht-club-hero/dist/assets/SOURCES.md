# Asset sources

The three MP4 files are unmodified local copies of the exact Krea URLs specified in PROMPT.md, downloaded with curl on 2026-10-30. The original URLs remain in src/fleet.ts.

- ocean-eclipse.mp4: https://app-uploads.krea.ai/wan-videos/08006647-1c55-4823-b35d-e40d57c66bf8.mp4
- black-sovereign.mp4: https://app-uploads.krea.ai/wan-videos/91fd9932-6194-4d58-ada0-955692853019.mp4
- azure-horizon.mp4: https://app-uploads.krea.ai/wan-videos/95fb3282-d7cf-448e-9202-ef0662541c83.mp4

Instrument Serif regular and italic TTFs are the original Google Fonts files referenced by the Google Fonts CSS response (diagnostics/google-fonts-response.css). They are cached locally to avoid runtime font failures. Geist is bundled from @fontsource-variable/geist.

The exact Vimeo iframe URL is retained behind explicit `?media=original` opt-in only. Default mode does not mount the iframe or request Vimeo/Cloudflare. Both the embed and /config endpoint were attempted; the embed returned a connection-verification challenge, and the config endpoint returned PrivacyError. The supplied Ocean Eclipse video is used as the full-screen moving hero fallback. It is an approximation of the unavailable hero film, not a recovered copy. No reference image extraction was used: the specified reference WebP does not exist on this host.
