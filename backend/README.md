# 문의·채용 이메일 접수

이 문서는 기존 Python/다음 SMTP 실행 방법입니다. Cloudflare 무료 플랜 배포용 백엔드와 설정은 [../cloudflare/README.md](../cloudflare/README.md)를 참고하세요. 프론트엔드는 `/api/config`에 따라 두 방식을 선택합니다.

수신 주소는 서버에서 `contact@icarus-airship.com`으로 고정합니다.
문의는 이름·이메일·제목·내용, 채용은 이름·이메일·연락처·지원 직무·동의 여부·추가 내용과 이력서/포트폴리오를 전달합니다.
메일에 답장하면 작성자가 입력한 이메일로 회신할 수 있습니다.

## 다음 스마트워크 연결

현재 사용 중인 다음 계정의 SMTP를 이용하므로 별도 메일 발송 서비스 가입이 필요하지 않습니다.
`.env.example`에 다음 서버 `smtp.daum.net`, 포트 `465`, 보안 `ssl`을 준비했습니다.

1. `contact@icarus-airship.com`이 연결된 다음 메일 계정으로 로그인합니다.
2. **환경설정 → IMAP/POP3 설정**에서 **IMAP/SMTP 사용함**을 선택합니다.
3. 계정의 2단계 인증을 설정하고, 홈페이지 전용 **앱 비밀번호**를 생성합니다. 일반 로그인 비밀번호를 사용하지 않습니다.
4. 저장소 루트의 `.env`에 다음 두 값을 직접 입력합니다. 채팅이나 Git에 비밀번호를 남기지 않습니다.

```dotenv
ICARUS_SMTP_USERNAME=다음_설정_화면에_표시된_로그인_아이디
ICARUS_SMTP_PASSWORD=발급받은_앱_비밀번호
```

SMTP 로그인 아이디는 스마트워크 수신 주소와 다를 수 있으므로 다음의 IMAP/POP3 설정 화면에 표시된 값을 사용합니다.
발신 주소 `ICARUS_MAIL_FROM=contact@icarus-airship.com`을 사용할 수 있는 계정이어야 합니다.
다른 발신 계정을 쓰더라도 수신 주소는 항상 `contact@icarus-airship.com`입니다.

처음 설치하는 환경에서는 아래처럼 설정 파일을 만든 후 편집합니다. 기존 `.env`는 덮어쓰지 않습니다.

```sh
test -f .env || (umask 077; cp .env.example .env)
./setup-backend.sh
python3 .design-sync/serve-preview.py --check-mail-config
./start-cloudflare.sh reload
```

`--check-mail-config`는 필수 값의 존재/형식만 확인하며 비밀번호를 출력하거나 메일을 발송하지 않습니다.
`reload`는 기존 Cloudflare 주소를 유지하면서 백엔드와 설정을 다시 읽습니다.
직접 실행 중인 서버라면 해당 프로세스를 다시 시작해야 합니다.
실제 메일함 도착 여부는 설정 후 문의/채용 폼으로 확인합니다.

공식 안내:
- [Daum SMTP 서버·포트·앱 비밀번호](https://cs.daum.net/m/faq/site/43/cat/9234/faq/24094)
- [IMAP/POP3 사용 설정](https://cs.daum.net/faq/service/43/category/9234/detail/24081)
- [2단계 인증과 앱 비밀번호 안내](https://hanmail-notice.daum.net/list/907)

## 실행과 배포

Python 3.10+, Node.js와 npm을 사용합니다. 백엔드는 Flask + Waitress로 실행합니다.

```sh
./setup-backend.sh
./build.sh
python3 .design-sync/serve-preview.py --port 8801
```

동일한 서버가 프론트엔드와 `/api/contact`, `/api/applications`를 함께 제공합니다.
기본 바인딩은 `127.0.0.1`이며 Cloudflare 공유 스크립트와 함께 동작합니다.
다른 서버에 배포할 때도 빌드로 생성되는 `.design-sync/.cache/career-roles.json`이 필요합니다.
새 공고를 추가하고 다시 빌드하면 API도 최신 직무 목록을 읽습니다.

GitHub Pages 등 정적 호스팅만으로는 이 Python 백엔드가 실행되지 않습니다.
실서비스에서는 항상 실행되는 Python 서버와 HTTPS 역방향 프록시를 사용하고 `/api/*`를 같은 서버로 연결해야 합니다.
현재 PC/WSL과 임시 Cloudflare 터널을 끄면 접수도 중단됩니다.

`ICARUS_TRUST_CLOUDFLARE_PROXY=true`는 로컬 cloudflared 뒤에서만 사용합니다.
공유 스크립트가 이 값을 설정하며, loopback 요청에서만 `CF-Connecting-IP`를 신뢰합니다.
다른 프록시에 배포할 때는 기본값 `false`를 유지하고 해당 프록시의 접속 제한을 설정합니다.

## 접수 동작

- 필수 입력, 길이, 이메일, 연락처, 허용된 직무, 개인정보 동의를 서버에서도 검증합니다.
- 이력서와 포트폴리오는 PDF만 각각 10 MiB까지 허용합니다. 확장자와 기본 파일 형식을 함께 확인하며 파일을 실행하지 않습니다.
- 최종 이메일은 기본 30,000,000바이트까지 허용합니다. 첨부파일은 이메일 인코딩으로 커지므로 실제 SMTP 서비스의 제한에 맞춰 `ICARUS_MAIL_MAX_BYTES`를 조정할 수 있습니다. 초과 시 사용자에게 파일 크기를 줄이라는 안내를 표시합니다.
- SMTP TLS 인증 후 메일 서버가 메시지를 수락해야 성공 응답을 돌려줍니다. 메일함 도착/스팸 분류까지 보장하는 응답은 아닙니다.
- 잘못된 요청, 전송 실패, 설정 누락에서는 입력과 첨부파일을 화면에 유지합니다.
- 동일한 접수 번호의 재시도는 한 프로세스에서 1시간 동안 중복 발송을 방지합니다. SMTP 수락 후 연결이 끊긴 경우나 서버 재시작을 넘는 중복까지 보장하지는 않습니다.
- IP당 15분에 5회, 서버 전체 시간당 60회의 시도를 허용합니다. 여러 프로세스로 확장할 때는 외부 공유 제한/중복 저장소가 필요합니다.
- API는 임의 수신 주소를 받지 않으며 다른 웹사이트의 브라우저 요청을 허용하지 않습니다.
- 지원서 원본을 DB나 공개 파일 경로에 저장하지 않습니다. 업로드 파서/HTTP 서버는 처리 중 OS 임시 파일을 사용할 수 있으며, 요청 종료 시 닫습니다. 실제 보관처는 수신 메일함입니다.
- 첨부 형식 검사는 악성코드 검사를 대체하지 않습니다. 수신 메일 서비스의 파일 검사를 함께 사용합니다.

## API 계약

두 경로 모두 `POST multipart/form-data`, `X-Icarus-Form: 1`, UUID 형식의 `X-Submission-ID`를 사용합니다.
성공 응답은 `{ "ok": true, "submissionId": "..." }`입니다. 같은 폼을 재시도할 때 접수 번호를 유지하고 수정하면 새 번호를 생성합니다.
문의 필드는 `name`, `email`, `subject`, `message`, `language`입니다.
채용은 `name`, `email`, `phone`, `position`, `language`, `consent`, `resume`이 필수이며 `portfolio`, `portfolioUrl`, `message`는 선택입니다.
`website`는 비워둬야 하는 스팸 방지 항목입니다.

## 검증

```sh
.venv/bin/python -m unittest discover -s backend/tests -v
./build.sh
```

테스트는 문의/지원서 검증, 파일/용량, 고정 수신 주소, 실패 시 오류 응답, 재시도/중복/동시 제출,
요청 제한, 비공개 경로 차단, 동영상 Range 응답과 실제 로컬 TLS SMTP 통신을 확인합니다.
SMTP 통신 테스트에 `openssl`이 필요하며 외부로 테스트 메일을 보내지 않습니다.
