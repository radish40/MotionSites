#!/bin/sh
# Recover the exact supplied font: original server returns HTTP 200 without
# Access-Control-Allow-Origin, so direct @font-face use is blocked by Chromium.
set -eu
mkdir -p assets
curl --fail --location --max-time 60 \
  'https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2' \
  --output assets/OggText-Medium.woff2
sha256sum assets/OggText-Medium.woff2
