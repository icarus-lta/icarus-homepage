#!/usr/bin/env bash
# Compile the homepage for the local preview server.
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"

for dependency in node npm flock; do
  command -v "$dependency" >/dev/null || { printf 'Missing command: %s\n' "$dependency" >&2; exit 1; }
done

mkdir -p .design-sync/.cache
exec 8>.design-sync/.cache/build.lock
flock -n 8 || { printf 'Another build is running.\n' >&2; exit 1; }

if [[ ! -d design-system/node_modules/esbuild ]]; then
  npm ci --prefix design-system
fi
npm run build --prefix design-system
node .design-sync/build-preview.mjs
printf 'Build complete: %s/.design-sync/.cache/preview/\n' "$PROJECT_DIR"
