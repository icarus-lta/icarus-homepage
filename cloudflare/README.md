# Cloudflare 무료 플랜 배포

## 회사 도메인: Cloudflare Pages

`www.icarus-airship.com`은 Pages 프로젝트 `icarus-site`에 사용자 도메인으로 등록되어 있습니다.
가비아 DNS의 `www` CNAME 대상만 `icarus-site-1iq.pages.dev`로 바꿉니다.
가비아 네임서버 및 다음 메일 MX/SPF/DKIM 레코드는 그대로 유지합니다.
Cloudflare Pages의 인증서 상태가 활성화된 뒤 `https://www.icarus-airship.com/`을 확인합니다.

```sh
# 저장소 루트, Ubuntu/WSL
./deploy-pages.sh
```

Pages는 `scripts/build-pages.mjs`가 기존 Worker 코드를 `_worker.js`로 묶어
동일 출처 `/api/*`와 영상 구간 요청에 사용합니다. 정적 경로는 Pages가 직접 제공합니다.
운영 Pages의 `SITE_ORIGIN`은 `https://www.icarus-airship.com`입니다.
기존 `icarus-homepage` Worker는 매시간 D1 개인정보 만료 정리를 위해 유지합니다.
두 배포는 동일한 D1·KV를 공유합니다. Pages에는 기존 Worker의
`RESEND_API_KEY`, `SIGNING_SECRET`, `TURNSTILE_SECRET_KEY`가 운영 비밀값으로 등록되어 있습니다.
로컬에서 값을 다시 동기화해야 할 때는 Git에서 제외한 `cloudflare/.dev.vars`를 준비하고
`node cloudflare/scripts/sync-pages-secrets.mjs`를 실행합니다. 비밀값을 Git에 넣지 않습니다.

Pages 프로젝트는 Direct Upload 방식입니다. GitHub에 푸시한 뒤 `./deploy-pages.sh`를
실행해야 새 버전이 공개됩니다. 배포 후 홈·회사소개·소식·채용·문의·`/api/config`,
영상 Range 응답을 점검합니다. 실제 메일 발송 확인은 관리자가 브라우저에서 문의를
한 번 제출하고 다음 스마트워크 받은메일함을 확인합니다.

기존 미리보기 주소는 Workers Static Assets를, 회사 도메인은 Pages를 사용합니다. 문의·지원서 API는 양쪽에서 동일한 Worker 코드와 D1 + 비공개 KV를 사용하며 메일 발송은 Resend를 사용합니다. R2와 카드 등록이 필요 없습니다. 회사 수신함은 `contact@icarus-airship.com`이며 기존 Python/다음 SMTP 실행 방법도 유지합니다.

기존 미리보기 주소: https://icarus-homepage.icarus-airship.workers.dev

## 첨부파일과 무료 한도

- 이력서와 포트폴리오는 **PDF만 파일당 10MiB(화면 표기 10MB)** 받습니다. 선택 포트폴리오가 없으면 이력서만 전송합니다.
- 브라우저가 Turnstile 검증 후 작은 JSON으로 접수를 시작합니다. D1이 한도와 파일 용량을 원자적으로 예약합니다.
- 파일은 하나씩 원본 바이트를 `FixedLengthStream`으로 KV에 전송합니다. Worker에서 전체 파일을 버퍼링하거나 Base64로 변환하지 않습니다.
- 업로드와 PDF 검사는 별도 요청으로 처리해 요청별 CPU 사용량을 낮춥니다. 확장자, 실제 크기, `%PDF-` 시작 바이트를 검사하며 파일 내용 전체의 안전성을 검사하는 백신은 아닙니다.
- KV 반영이 지연되면 쓰기 완료 상태를 D1에 남기고 15초 간격으로 최대 5회 검증만 재시도합니다. 입력값을 유지하며 실패를 성공으로 표시하지 않습니다.
- 업로드 시도마다 고유 키를 사용하므로 중단된 이전 요청이 완료 파일을 덮어쓰지 않습니다. 파일 키는 접수 시각으로부터 24시간 뒤 자동 만료됩니다.
- Resend가 24시간 유효한 서명 URL에서 PDF를 가져와 실제 메일 첨부파일로 전달합니다. URL은 일반 브라우저 응답에 노출하지 않습니다.
- 메일 요청은 접수 ID를 멱등 키로 사용합니다. Resend API 접수 성공과 실제 받은메일함 도착은 구분해 검증합니다.

| 항목 | 프로젝트 제한 |
| --- | --- |
| 접수 시작 | UTC 하루 90건, 월 2,800건. 중단된 시작도 포함 |
| 동일 IP | 15분 동안 5건 |
| 첨부 | PDF 파일당 10MiB, 최대 2개 |
| 임시 저장 예약 | 200MiB. 3번의 시도가 겹쳐도 최대 600MiB |
| 업로드 시도 | 파일당 최대 3회, 하루 최대 540회 쓰기 |
| 서명 첨부 다운로드 | 접수당 최대 12회, 24시간 후 접근 만료 |
| 개인정보 정리 | 매시간 최대 12건의 만료 접수에서 입력 내용 제거 |
| 한도 계산용 최소 기록 | 최대 약 35일 |

KV Free는 저장 1GB, 하루 쓰기/삭제 각각 1,000회, 읽기 100,000회를 포함합니다. Free 한도 초과 시 작업이 실패하며 자동으로 유료 플랜으로 전환되지 않습니다. 동일 계정의 다른 KV 사용량은 합산됩니다. 이 프로젝트용 계정/네임스페이스 사용량을 함께 확인하세요.

일반 정적 파일은 Worker를 실행하지 않습니다. API와 MP4 구간 요청은 하루 10만 Worker 요청에 포함됩니다. PDF 지원을 유지하면서 DOC/DOCX 처리는 제거했습니다. 실제 테스트에서 큰 DOCX의 KV 범위 검사 CPU가 높게 측정되어, 사용자의 PDF 전용 요청을 반영했습니다.

## 검증

```sh
# 저장소 루트, Ubuntu/WSL, Node.js 22 이상
npm ci --prefix design-system
npm ci --prefix cloudflare
npm run check --prefix cloudflare
.venv/bin/python -m unittest discover -s backend/tests -v
```

`check`는 화면/타입 빌드, workerd/Miniflare 테스트, 실제 Wrangler HTTP 확인, 배포 dry-run을 수행합니다. 테스트는 외부 Turnstile/Resend 호출을 대역으로 대체하며 실제 메일을 보내지 않습니다.

PDF 10MiB 두 개의 업로드·다운로드 SHA-256 일치, Word 및 위장 파일 거부, 용량/동의/직무/출처/토큰 검증, 동시 접수 제한, KV 전파 지연과 중단 복구, 완료 파일 불변성, 만료 정리, 실제 프론트엔드 제출 함수를 검사합니다. 기존 Python 테스트도 유지합니다.

로컬 테스트 시간은 Cloudflare Free CPU 10ms 검증을 대체하지 않습니다. 배포 후 최대 크기 PDF를 반복 제출하고 `wrangler tail`의 `cpuTime`/`outcome`을 확인합니다. 실제 받은메일함 수신 및 24시간 후 만료도 별도 확인이 필요합니다.

## 계정과 저장소 설정

현재 `wrangler.jsonc`에는 연결된 계정/D1/KV/Turnstile의 공개 ID가 있습니다. 비밀키는 없습니다. 새 계정으로 이전할 때는 해당 값을 새로 설정합니다.

```sh
cd cloudflare
npx wrangler login --device --browser=false
npx wrangler d1 create icarus-forms --location apac
npx wrangler kv namespace create icarus-private-applications
# 출력된 D1 database_id와 KV id를 wrangler.jsonc에 반영
npx wrangler d1 migrations apply icarus-forms --remote
```

D1 바인딩은 `DB`, KV는 `UPLOADS`입니다. SQL은 실제 원격 D1 마이그레이션과 호환되는 별도 WHEN 트리거를 사용합니다. 파일 KV 키에는 절대 만료 시각을 지정하므로 Cron이 중단되어도 자동 만료됩니다.

## Resend와 가비아 DNS

현재 Resend에 등록한 도메인은 `icarus-airship.com`, 발신 주소는 `website@icarus-airship.com`입니다. 수신함은 기존 `contact@icarus-airship.com`이며 Reply-To는 지원자/문의자의 이메일입니다.

가비아 DNS 관리툴에서 다음 레코드를 추가합니다. TTL은 600초로 설정합니다. DKIM 값은 Resend 화면에서 복사합니다. 호스트에 `.icarus-airship.com`을 붙이지 않습니다.

| 타입 | 호스트 | 값 |
| --- | --- | --- |
| TXT | resend._domainkey | Resend의 계정별 DKIM 공개키 값 전체 |
| CNAME | rsend | rsend-apne1.forge.rmta.net. |
| CNAME | send | send.forge.rmta.net. |
| TXT | _dmarc | v=DMARC1; p=none; (기존 정책이 없을 때) |

현재 계정의 Resend 화면에 나온 CNAME 방식입니다. 다른 지역/계정에서는 제공 레코드가 달라질 수 있습니다. `send` CNAME에는 같은 호스트의 MX/TXT를 중복 등록하지 않습니다. 기존 `_dmarc`가 있으면 유지하며 중복 정책을 만들지 않습니다.

**다음 스마트워크의 `@` MX 레코드 `aspmx.daum.net`과 `alt.aspmx.daum.net`은 변경하지 않습니다.** Resend의 Enable Receiving도 켜지 않습니다. 가비아에서 저장한 뒤 Resend에서 인증을 완료합니다.

## 비밀값과 배포

Managed Turnstile은 현재 Workers 주소와 회사 도메인을 허용합니다. `SITE_ORIGIN`은 실제 접속 주소와 정확히 일치해야 합니다.

로컬 비밀값은 Git에서 제외된 `cloudflare/.dev.vars`에 저장합니다. 파일 권한은 600으로 설정하며 프론트엔드 빌드에 포함하지 않습니다.

```sh
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put SIGNING_SECRET
npx wrangler secret put TURNSTILE_SECRET_KEY
npm run deploy
# 처음에 비밀값까지 함께 배포할 때:
# npm run deploy -- --secrets-file .dev.vars
```

`SIGNING_SECRET`은 32바이트 이상의 무작위 비밀값입니다. SMTP 비밀번호를 재사용하지 않습니다. 배포는 기존 서버 비밀값을 유지합니다.

회사 도메인 연결은 기본 주소 검증 후 별도로 진행합니다. `SITE_ORIGIN`과 Turnstile 허용 호스트를 함께 맞춥니다. Cloudflare로 DNS를 이전한다면 기존 다음 메일 MX/SPF/DKIM을 보존해야 합니다.

## 이전 및 로컬 개발

`src/core.js`는 플랫폼과 무관한 입력 검증과 메일 작성을 담당합니다. KV 연결은 `storage.js`, 파일 처리는 `files.js`, 실행 환경과 D1은 `worker.js`에 분리했습니다. 프론트엔드는 `/api/config`를 읽어 Python에서는 multipart, Cloudflare에서는 스트리밍 제출을 선택합니다.

```sh
npm run build
npx wrangler d1 migrations apply icarus-forms --local
npm run dev
```

공식 근거: [Workers 제한](https://developers.cloudflare.com/workers/platform/limits/), [KV 요금](https://developers.cloudflare.com/kv/platform/pricing/), [KV 일관성](https://developers.cloudflare.com/kv/concepts/how-kv-works/), [Resend 도메인](https://resend.com/docs/dashboard/domains/introduction), [가비아 DNS](https://customer.gabia.com/faq/detail/3041/3040).
