"""Serve the current homepage and its email submission API on one origin.

Run ./setup-backend.sh and ./build.sh first, then:
  python3 .design-sync/serve-preview.py --port 8801
"""

import argparse
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
venv = ROOT / ".venv"
python = venv / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
if python.is_file() and Path(sys.prefix).resolve() != venv.resolve():
    os.execv(str(python), [str(python), *sys.argv])
sys.path.insert(0, str(ROOT))
try:
    from backend.app import MAX_REQUEST_BYTES, Settings, create_app
    from waitress import serve
except ModuleNotFoundError:
    sys.exit("Run ./setup-backend.sh to install the backend dependencies first.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8801)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--check-mail-config", action="store_true")
    args = parser.parse_args()
    try:
        settings = Settings.load()
    except ValueError:
        parser.error("Invalid numeric SMTP configuration. Check .env against .env.example.")
    if args.check_mail_config:
        print("Mail configuration is complete (connection not tested)." if settings.ready()
              else "Mail configuration is incomplete. Fill in the SMTP settings in .env.")
        sys.exit(0 if settings.ready() else 1)
    preview = ROOT / ".design-sync/.cache/preview"
    if not (preview / "about/index.html").is_file():
        parser.error("Run ./build.sh first.")
    if not settings.ready():
        print("SMTP is not configured. Submissions will return unavailable, never a false success.", flush=True)
    print(f"ICARUS homepage and form API: http://localhost:{args.port}/", flush=True)
    serve(create_app(settings=settings), host=args.host, port=args.port, threads=6,
          max_request_body_size=MAX_REQUEST_BYTES, max_request_header_size=16384,
          connection_limit=100, channel_timeout=60, expose_tracebacks=False)
