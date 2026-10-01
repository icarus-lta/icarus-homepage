#!/usr/bin/env bash
# Publish the complete site (static pages and same-origin APIs) to Cloudflare Pages.
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"
for dependency in node npm flock curl cmp git; do
  command -v "$dependency" >/dev/null || { printf 'Missing command: %s\n' "$dependency" >&2; exit 1; }
done

mkdir -p .design-sync/.cache
exec 8>.design-sync/.cache/build.lock
flock -n 8 || { printf 'Another build or deployment is running.\n' >&2; exit 1; }

[[ -d design-system/node_modules/esbuild ]] || npm ci --prefix design-system
[[ -d cloudflare/node_modules/wrangler ]] || npm ci --prefix cloudflare
npm run build:pages --prefix cloudflare

commit="$(git rev-parse HEAD)"
dirty=false
[[ -z "$(git status --porcelain)" ]] || dirty=true
(
  cd cloudflare/pages
  ../node_modules/.bin/wrangler pages deploy ../public \
    --project-name icarus-site --branch main --commit-hash "$commit" --commit-dirty "$dirty"
)

base=https://icarus-site-1iq.pages.dev
verify_file="$(mktemp)"
trap 'rm -f -- "$verify_file"' EXIT
verified=false
for attempt in 1 2 3 4 5 6; do
  verified=true
  for entry in 'news/ news/index.html' '_ds_bundle.js _ds_bundle.js' 'styles.css styles.css'; do
    read -r route local_file <<< "$entry"
    if ! curl -fsSL --max-time 15 -H 'Cache-Control: no-cache' \
      "$base/$route?verify=$attempt" -o "$verify_file" \
      || ! cmp -s "$verify_file" "cloudflare/public/$local_file"; then
      verified=false
      break
    fi
  done
  [[ "$verified" == true ]] && break
  sleep 2
done
[[ "$verified" == true ]] || { printf 'Pages deployment did not match the local build.\n' >&2; exit 1; }
curl -fsSL --max-time 15 "$base/api/config" | node -e '
let text = "";
process.stdin.on("data", chunk => text += chunk);
process.stdin.on("end", () => {
  const result = JSON.parse(text);
  if (result.ok !== true || result.available !== true || result.transport !== "cloudflare") process.exit(1);
});'
printf 'Deployment verified at %s\n' "$base"
