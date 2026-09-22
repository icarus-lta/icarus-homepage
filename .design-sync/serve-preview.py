"""Serve the current React homepage preview without stale browser caches.

Build first from the repository root:
  (cd design-system && npm run build) && node .design-sync/build-preview.mjs
Run:
  python3 .design-sync/serve-preview.py --port 8801
"""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("X-Icarus-Preview", "current-design-system")
        super().end_headers()

    def send_head(self):
        # Revalidate files even when an older server left conditional cache entries.
        if "If-Modified-Since" in self.headers:
            del self.headers["If-Modified-Since"]
        return super().send_head()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8801)
    args = parser.parse_args()
    preview = Path(__file__).resolve().parent / ".cache" / "preview"
    if not (preview / "about" / "index.html").is_file():
        parser.error("Build the current homepage with .design-sync/build-preview.mjs first.")
    server = ThreadingHTTPServer(("0.0.0.0", args.port), partial(PreviewHandler, directory=str(preview)))
    print(f"Current ICARUS homepage: http://localhost:{args.port}/", flush=True)
    server.serve_forever()
