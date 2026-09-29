# ICARUS LTA homepage

The current bilingual homepage is built from the React components in
`design-system/`. It includes the main page, About, Careers, Newsroom, and Contact.

Career posts include sharing and application buttons in the header and a fixed
bottom bar. Each links to `/career/apply/?position=<role-id>&lang=ko` (or `en`).
The application page validates contact details, resume and optional portfolio
attachments, and consent. Contact inquiries and career applications now POST to
the Python backend, which emails `contact@icarus-airship.com`. Applications include
the resume and optional portfolio as attachments. SMTP credentials stay on the
server; a missing configuration or failed delivery never shows a success screen.
See [메일 접수 설정](backend/README.md) for Daum Smart Work setup.

## Build and run locally

From the repository root, using Node.js and npm:

```sh
./build.sh
./setup-backend.sh
python3 .design-sync/serve-preview.py --port 8801
```

컴파일만 하려면 Ubuntu 터미널에서 다음 명령을 실행하세요.

```sh
cd /root/icarus-homepage
./build.sh
```

Windows PowerShell에서도 실행할 수 있습니다.

```powershell
wsl -d Ubuntu -u root -- bash /root/icarus-homepage/build.sh
```

`build.sh`는 필요한 의존성이 없으면 설치한 뒤 디자인 시스템과 전체 페이지를
빌드합니다. 서버가 이미 실행 중이라면 브라우저를 새로고침하면 로컬과
Cloudflare에 최신 변경이 반영됩니다. 이 스크립트는 서버를 시작하거나 재시작하지
않으며, `start-cloudflare.sh`도 동일한 빌드 스크립트를 사용합니다.

Open <http://localhost:8801/> or <http://localhost:8801/about/?lang=ko>.
Use `?lang=en` for English. After changing source files, run `./build.sh`
and reload the page. The local server disables caching, and the build
versions the CSS and JavaScript URLs.

The build uses only repository files and the locked npm dependencies. Its static
output is `.design-sync/.cache/preview/`, including local fonts and video assets.
`output/` contains optional local design studies and screenshots and is not
required to build or run the site.

## Share through Cloudflare

### 실행 파일로 시작하기 (현재 Ubuntu / WSL 환경)

Ubuntu 터미널에서 아래 명령을 실행하면 최신 소스를 빌드하고 로컬 서버와
Cloudflare 터널을 백그라운드로 시작한 뒤 공유 주소를 표시합니다.

```sh
cd /root/icarus-homepage
./start-cloudflare.sh
```

Windows PowerShell에서는 한 줄로 실행할 수 있습니다.

```powershell
wsl -d Ubuntu -u root -- bash /root/icarus-homepage/start-cloudflare.sh
```

```sh
./start-cloudflare.sh status   # 실행 상태와 현재 공유 주소
./start-cloudflare.sh reload   # 주소를 유지하며 백엔드·메일 설정 반영
./start-cloudflare.sh restart  # 최신 빌드 후 두 서버 재시작 (주소 변경)
./start-cloudflare.sh stop     # 두 서버 종료
```

현재 환경에 설치된 Node.js, npm, Python 3, cloudflared, curl, systemd를 사용합니다.
일반 사용자로 실행하면 서비스 관리를 위해 sudo를 사용합니다.
그냥 다시 실행하면 기존 터널을 재사용하며 최신 소스만 다시 빌드합니다.
현재 주소는 `.design-sync/.cache/cloudflare-url.txt`에도 저장됩니다.
터미널 창을 닫아도 백그라운드 서비스는 유지되지만 PC 또는 WSL을 종료하면
공유도 중단되므로 다음 사용 시 스크립트를 다시 실행하세요.
부팅 시 자동 시작하도록 설정하지는 않습니다.
로그는 `journalctl -u icarus-share-8801.service -n 50 --no-pager`로 확인합니다.

### Manual start

With the local server running and `cloudflared` installed, run
`cloudflared tunnel --url http://127.0.0.1:8801`.

Open the HTTPS `trycloudflare.com` address printed by the command. It serves the
same build as localhost; rebuilding updates both. This is a temporary review
URL: the server and tunnel must remain running, and restarting the tunnel can
change the address.

For a separate static deployment, serve `.design-sync/.cache/preview/` as the
website root and proxy `/api/contact` and `/api/applications` to this backend.
Static hosting (including GitHub Pages) alone cannot send email. The build command is:

```sh
npm ci --prefix design-system && npm run build --prefix design-system && node .design-sync/build-preview.mjs
```

The repository-root `index.html` and `partials/` are the legacy HTMX homepage.
The existing GitHub Pages configuration publishes that root from `main`; the
current React work is on `dev`.

## Content and media

- Components and styles: `design-system/src/`
- Korean and English copy: `design-system/src/i18n/`
- Source images, fonts, and About videos: `static/`
- Build and local server: `.design-sync/build-preview.mjs`, `.design-sync/serve-preview.py`
- Flight-control media provenance: `static/about/CONTROL-MEDIA.md`

Both forms use same-origin API routes by default. The running server must load
the private `.env` SMTP configuration. See [backend/README.md](backend/README.md)
for setup, tests, and deployment requirements.
