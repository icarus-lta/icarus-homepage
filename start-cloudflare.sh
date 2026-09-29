#!/usr/bin/env bash
# Run in Ubuntu / WSL. Start: ./start-cloudflare.sh
# Also supports: status, reload (keep URL), restart (new URL), stop
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
ACTION="${1:-start}"
PREVIEW_UNIT=icarus-preview-8801.service
TUNNEL_UNIT=icarus-share-8801.service
LOCAL_URL=http://127.0.0.1:8801
STATE_DIR="$PROJECT_DIR/.design-sync/.cache"

case "$ACTION" in
  start|reload|restart|status|stop) ;;
  -h|--help|help)
    printf 'Usage: %s [start|status|reload|restart|stop]\n' "$0"
    printf 'start: build and start (reuse an active tunnel); restart: get a new tunnel.\n'
    exit 0 ;;
  *) printf 'Unknown action: %s\n' "$ACTION" >&2; exit 2 ;;
esac

fail() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }
command -v systemctl >/dev/null || fail 'Run this script inside Ubuntu / WSL with systemd.'
[[ -d /run/systemd/system ]] || fail 'systemd is not running. Start Ubuntu / WSL with systemd enabled.'
if (( EUID != 0 )); then
  exec sudo -- bash "$PROJECT_DIR/start-cloudflare.sh" "$ACTION"
fi

mkdir -p "$STATE_DIR"
exec 9>"$STATE_DIR/cloudflare-start.lock"
flock -n 9 || fail 'Another start/stop command is running. Try again shortly.'

active() { systemctl is-active --quiet "$1"; }
tunnel_url() {
  local invocation
  invocation="$(systemctl show "$TUNNEL_UNIT" -p InvocationID --value)"
  [[ -n "$invocation" ]] || return 0
  journalctl --no-pager -o cat -u "$TUNNEL_UNIT" "_SYSTEMD_INVOCATION_ID=$invocation" |
    sed -nE 's@.*(https://[a-z0-9-]+\.trycloudflare\.com).*@\1@p' | tail -n 1
}
stop_services() {
  for unit in "$TUNNEL_UNIT" "$PREVIEW_UNIT"; do
    if [[ "$(systemctl show "$unit" -p LoadState --value)" != not-found ]]; then
      systemctl stop "$unit"
      systemctl reset-failed "$unit" 2>/dev/null || true
    fi
  done
  : > "$STATE_DIR/cloudflare-url.txt"
}
show_logs() {
  journalctl --no-pager -n 20 -u "$PREVIEW_UNIT" -u "$TUNNEL_UNIT"
}
print_urls() {
  printf '\nLocal:   http://localhost:8801/\n'
  printf 'Public:  %s\n' "$PUBLIC_URL"
  printf 'Careers: %s/career/?lang=ko\n' "$PUBLIC_URL"
  printf '\nURL saved to: %s/cloudflare-url.txt\n' "$STATE_DIR"
  printf 'Check address: ./start-cloudflare.sh status\nStop sharing:  ./start-cloudflare.sh stop\n'
  printf '\nServices run in the background. Keep this PC and WSL running.\n'
}

if [[ "$ACTION" == stop ]]; then
  stop_services
  printf 'Local server and Cloudflare tunnel stopped.\n'
  exit 0
fi
if [[ "$ACTION" == status ]]; then
  for unit in "$PREVIEW_UNIT" "$TUNNEL_UNIT"; do
    printf '%s: %s\n' "$unit" "$(systemctl show "$unit" -p ActiveState --value)"
  done
  if active "$PREVIEW_UNIT" && active "$TUNNEL_UNIT"; then
    PUBLIC_URL="$(tunnel_url)"
    if [[ -n "$PUBLIC_URL" ]]; then
      printf '%s\n' "$PUBLIC_URL" > "$STATE_DIR/cloudflare-url.txt"
      print_urls
      exit 0
    fi
  fi
  printf 'No active share address. Run ./start-cloudflare.sh to start.\n'
  exit 1
fi

for dependency in node npm python3 cloudflared curl systemd-run; do
  command -v "$dependency" >/dev/null || fail "Missing command: $dependency (install it in Ubuntu / WSL)."
done
cd "$PROJECT_DIR"
bash "$PROJECT_DIR/setup-backend.sh"
bash "$PROJECT_DIR/build.sh"

if [[ "$ACTION" == restart ]]; then stop_services; fi
if active "$PREVIEW_UNIT" && [[ "$(systemctl show "$PREVIEW_UNIT" -p WorkingDirectory --value)" != "$PROJECT_DIR" ]]; then
  fail 'The running preview service belongs to a different checkout.'
fi
if [[ "$ACTION" == reload ]] && active "$PREVIEW_UNIT"; then
  # Recreate only our server unit so new code/config takes effect without changing the tunnel.
  systemctl stop "$PREVIEW_UNIT"
fi
if ! active "$PREVIEW_UNIT"; then
  # Never expose an unrelated process that happens to use the same port.
  python3 -c 'import socket; s=socket.socket(); s.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1); s.bind(("0.0.0.0",8801)); s.close()' ||
    fail 'Port 8801 is already in use by another process. Stop that server first.'
  systemctl reset-failed "$PREVIEW_UNIT" 2>/dev/null || true
  systemd-run --quiet --collect --unit="$PREVIEW_UNIT" \
    --property="WorkingDirectory=$PROJECT_DIR" --property=Restart=on-failure --property=RestartSec=3 \
    --property="Environment=ICARUS_TRUST_CLOUDFLARE_PROXY=true" \
    "$(command -v python3)" "$PROJECT_DIR/.design-sync/serve-preview.py" --port 8801
elif [[ "$(systemctl show "$PREVIEW_UNIT" -p WorkingDirectory --value)" != "$PROJECT_DIR" ]]; then
  fail 'The running preview service belongs to a different checkout.'
fi

ready=false
for ((attempt=0; attempt<15; attempt++)); do
  if curl --noproxy '*' -fsSI --max-time 2 "$LOCAL_URL/" 2>/dev/null | grep -qi 'X-Icarus-Preview: current-design-system'; then
    ready=true; break
  fi
  sleep 1
done
if [[ "$ready" != true ]]; then show_logs; fail 'Local server did not become ready.'; fi

if ! active "$TUNNEL_UNIT"; then
  systemctl reset-failed "$TUNNEL_UNIT" 2>/dev/null || true
  systemd-run --quiet --collect --unit="$TUNNEL_UNIT" \
    --property="WorkingDirectory=$PROJECT_DIR" --property=Restart=on-failure --property=RestartSec=5 \
    "$(command -v cloudflared)" tunnel --url "$LOCAL_URL"
fi

printf 'Waiting for the public Cloudflare address...\n'
deadline=$((SECONDS + 60))
while (( SECONDS < deadline )); do
  PUBLIC_URL="$(tunnel_url)"
  if [[ -n "$PUBLIC_URL" ]] && curl -fsS --max-time 5 -o /dev/null "$PUBLIC_URL/" 2>/dev/null; then
    printf '%s\n' "$PUBLIC_URL" > "$STATE_DIR/cloudflare-url.txt"
    print_urls
    exit 0
  fi
  sleep 2
done
show_logs
fail 'Public connection is not ready yet. Check ./start-cloudflare.sh status or retry with restart.'
