#!/bin/sh
set -eu
npm run preview -- --port 5173 > screenshots/preview.log 2>&1 &
server_pid=$!
trap 'kill "$server_pid"' EXIT
node scripts/browser-check.cjs
