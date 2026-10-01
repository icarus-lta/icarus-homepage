# ICARUS LTA homepage

## Production website

The production site is live at <https://www.icarus-airship.com/> on Cloudflare
Pages, with <https://icarus-site-1iq.pages.dev/> as its Pages address. Its Pages
Function runs the same backend
implementation as the existing Worker, with the same D1 database, private KV,
Turnstile widget, and Resend delivery. The existing Worker remains active for its
hourly cleanup job and as a separate preview.

`www.icarus-airship.com` is active as a custom domain on the Pages project.
Gabia's `www` CNAME points to `icarus-site-1iq.pages.dev`; its nameservers and
mail records remain in place. HTTPS and the production pages/API were verified
on 2026-10-01. The apex domain redirects to the production `www` address.

To publish a new version from Ubuntu/WSL after committing it to GitHub:

```sh
./deploy-pages.sh
```

The script builds the frontend and shared backend, deploys Pages, and compares
the public assets and API configuration against the build. The project uses a
Direct Upload deployment; pushing to GitHub alone does not publish a new Pages
version. See [the deployment notes](cloudflare/README.md) for credentials and
domain verification.

The current bilingual homepage is built from the React components in
`design-system/`. It includes the main page, About, Careers, Newsroom, and Contact.

Career posts include sharing and application buttons in the header and a fixed
bottom bar. Each links to `/career/apply/?position=<role-id>&lang=ko` (or `en`).
The application page validates contact details, resume and optional portfolio
attachments, and consent. In production, contact inquiries and career
applications POST to the same-origin Cloudflare API, which delivers to
`contact@icarus-airship.com`. The Python/Daum SMTP backend remains available for
local operation; see [메일 접수 설정](backend/README.md).

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
The legacy GitHub Pages configuration publishes that root from `main`; the
production domain serves the React build through Cloudflare Pages. Current
source code is available on both `main` and `dev`.

## Cloudflare 무료 플랜으로 운영

상시 PC 없이 운영할 수 있도록 Workers Static Assets + Workers/D1/비공개 KV + Resend 배포 구성을 `cloudflare/`에 추가했습니다. 카드 등록 없는 무료 구성으로, 첨부파일은 PDF만 파일당 10MB까지 받습니다.
파일당 10MB 제한을 유지하며, 파일은 스트리밍으로 임시 저장하고 메일 서비스가 가져갑니다.
코드 검증과 실제 계정 배포 검증은 구분합니다. 설정 절차와 무료 한도는 [cloudflare/README.md](cloudflare/README.md)를 참고하세요.

```sh
npm ci --prefix design-system
npm ci --prefix cloudflare
npm run check --prefix cloudflare
```

기존 로컬 Python/다음 SMTP 서버도 계속 사용할 수 있습니다.

## Content and media

- Components and styles: `design-system/src/`
- Korean and English copy: `design-system/src/i18n/`
- Source images, fonts, and About videos: `static/`
- Build and local server: `.design-sync/build-preview.mjs`, `.design-sync/serve-preview.py`
- Flight-control media provenance: `static/about/CONTROL-MEDIA.md`

Both forms use same-origin API routes by default. In Python mode, the server loads
the private `.env` SMTP configuration; see [backend/README.md](backend/README.md).
Cloudflare mode uses server-side secrets and the separate deployment described in
[cloudflare/README.md](cloudflare/README.md).
