#!/usr/bin/env bash
# Install server dependencies inside this repository, never into system Python.
set -Eeuo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"
if [[ ! -x .venv/bin/python ]]; then python3 -m venv .venv; fi
REQUIREMENTS_HASH="$(sha256sum backend/requirements.txt | cut -d ' ' -f 1)"
if [[ ! -f .venv/requirements.sha256 ]] || [[ "$(cat .venv/requirements.sha256)" != "$REQUIREMENTS_HASH" ]]; then
  .venv/bin/python -m pip install -r backend/requirements.txt
  printf '%s\n' "$REQUIREMENTS_HASH" > .venv/requirements.sha256
fi
