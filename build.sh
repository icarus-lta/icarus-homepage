#!/usr/bin/env bash
# Compile the homepage and refresh the files served by localhost / Cloudflare.
# Usage: ./build.sh (Ubuntu / WSL; no server restart required)
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"

for dependency in node npm flock; do
  if ! command -v "$dependency" >/dev/null; then
    printf 'ERROR: Missing command: %s. Run this script in Ubuntu / WSL with Node.js and npm installed.\n' "$dependency" >&2
    exit 1
  fi
done

mkdir -p .design-sync/.cache
exec 8>.design-sync/.cache/build.lock
flock -n 8 || { printf 'Another build is already running. Try again shortly.\n' >&2; exit 1; }

if [[ ! -d design-system/node_modules/esbuild ]]; then
  printf 'Installing dependencies from the lockfile...\n'
  npm ci --prefix design-system
fi

printf 'Building the current homepage...\n'
npm run build --prefix design-system
node .design-sync/build-preview.mjs

printf '\nBuild complete: %s/.design-sync/.cache/preview/\n' "$PROJECT_DIR"
printf 'If the server is running, refresh the page to see the changes.\n'
printf 'To start the local server and Cloudflare: ./start-cloudflare.sh\n'
