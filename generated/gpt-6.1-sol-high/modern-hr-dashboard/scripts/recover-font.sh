#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
curl --fail --location --max-time 40 --retry 1 --user-agent 'Mozilla/5.0' \
  'https://db.onlinewebfonts.com/t/060e116a70e3096c52db16f61aaab194.woff2' \
  --output public/assets/sofia-pro-regular.woff2
