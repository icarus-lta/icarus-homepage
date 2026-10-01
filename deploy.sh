#!/usr/bin/env bash
# Build and deploy the homepage to Cloudflare Workers. Run in Ubuntu / WSL.
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"

for dependency in node npm flock curl cmp; do
  if ! command -v "$dependency" >/dev/null; then
    printf 'ERROR: Missing command: %s. Run this script in Ubuntu / WSL with Node.js and npm installed.\n' "$dependency" >&2
    exit 1
  fi
done

mkdir -p .design-sync/.cache
exec 8>.design-sync/.cache/build.lock
flock -n 8 || { printf 'Another build or deployment is already running. Try again shortly.\n' >&2; exit 1; }

if [[ ! -d design-system/node_modules/esbuild ]]; then
  npm ci --prefix design-system
fi
if [[ ! -d cloudflare/node_modules/wrangler ]]; then
  npm ci --prefix cloudflare
fi

npm run deploy --prefix cloudflare

# A successful Wrangler upload does not prove the URL being opened serves this
# build. Compare the published News page, JavaScript, and CSS byte for byte.
SITE_ORIGIN="$(sed -nE 's/^[[:space:]]*"SITE_ORIGIN":[[:space:]]*"([^"]+)".*/\1/p' cloudflare/wrangler.jsonc | head -n 1)"
[[ -n "$SITE_ORIGIN" ]] || { printf 'ERROR: SITE_ORIGIN is missing from cloudflare/wrangler.jsonc.\n' >&2; exit 1; }
VERIFY_FILE="$(mktemp)"
trap 'rm -f -- "$VERIFY_FILE"' EXIT
VERIFIED=false
for attempt in 1 2 3 4 5 6; do
  VERIFIED=true
  for entry in 'news/ news/index.html' '_ds_bundle.js _ds_bundle.js' 'styles.css styles.css'; do
    read -r route local_file <<< "$entry"
    if ! curl -fsSL --max-time 15 -H 'Cache-Control: no-cache' \
      "${SITE_ORIGIN}/${route}?verify=${attempt}" -o "$VERIFY_FILE" \
      || ! cmp -s "$VERIFY_FILE" "cloudflare/public/${local_file}"; then
      VERIFIED=false
      break
    fi
  done
  [[ "$VERIFIED" == true ]] && break
  sleep 2
done
[[ "$VERIFIED" == true ]] || { printf 'ERROR: Deployment finished, but %s does not match this build.\n' "$SITE_ORIGIN" >&2; exit 1; }
printf '\nDeployment verified at %s/news/\n' "$SITE_ORIGIN"
