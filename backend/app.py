"""Same-origin forms and static site. SMTP secrets and uploads never enter the build."""

from collections import defaultdict, deque
from dataclasses import dataclass
from datetime import datetime, timezone
from email.message import EmailMessage
from email.policy import SMTP
from email.utils import formataddr, format_datetime, make_msgid
import hashlib
import io
import ipaddress
import json
import logging
import os
from pathlib import Path
import re
import smtplib
import ssl
import threading
import time
from urllib.parse import urlsplit
import uuid
import zipfile

from dotenv import dotenv_values
from flask import Flask, abort, jsonify, redirect, request, send_from_directory
from werkzeug.exceptions import HTTPException

ROOT = Path(__file__).resolve().parents[1]
RECIPIENT = "contact@icarus-airship.com"
MAX_FILE_BYTES = 10 * 1024 * 1024
MAX_REQUEST_BYTES = 2 * MAX_FILE_BYTES + 128 * 1024
EMAIL_PATTERN = re.compile(r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}\Z")
logger = logging.getLogger(__name__)


class FormError(Exception):
    def __init__(self, code, status=400, field=None):
        self.code, self.status, self.field = code, status, field


@dataclass(frozen=True)
class Settings:
    host: str = ""
    port: int = 587
    security: str = "starttls"
    username: str = ""
    password: str = ""
    sender: str = RECIPIENT
    max_mail_bytes: int = 30_000_000
    trust_cloudflare: bool = False

    @classmethod
    def load(cls):
        # No shell evaluation or variable interpolation in secrets.
        env = {**dotenv_values(ROOT / ".env", interpolate=False), **os.environ}
        return cls(
            host=(env.get("ICARUS_SMTP_HOST") or "").strip(),
            port=int(env.get("ICARUS_SMTP_PORT") or "587"),
            security=(env.get("ICARUS_SMTP_SECURITY") or "starttls").strip(),
            username=(env.get("ICARUS_SMTP_USERNAME") or "").strip(),
            password=env.get("ICARUS_SMTP_PASSWORD") or "",
            sender=(env.get("ICARUS_MAIL_FROM") or RECIPIENT).strip(),
            max_mail_bytes=int(env.get("ICARUS_MAIL_MAX_BYTES") or "30000000"),
            trust_cloudflare=env.get("ICARUS_TRUST_CLOUDFLARE_PROXY", "false") == "true",
        )

    def ready(self):
        return bool(self.host and self.username and self.password
                    and self.security in {"starttls", "ssl"}
                    and 1 <= self.port <= 65535 and self.max_mail_bytes > 0
                    and EMAIL_PATTERN.fullmatch(self.sender))


def send_email(settings, message):
    """Return only after the fixed recipient's SMTP server accepts DATA."""
    context = ssl.create_default_context()
    client = None
    try:
        if settings.security == "ssl":
            client = smtplib.SMTP_SSL(settings.host, settings.port, timeout=20, context=context)
        else:
            client = smtplib.SMTP(settings.host, settings.port, timeout=20)
            client.ehlo()
            client.starttls(context=context)
            client.ehlo()
        client.login(settings.username, settings.password)
        refused = client.send_message(message, from_addr=settings.sender, to_addrs=[RECIPIENT])
        if refused:
            raise smtplib.SMTPRecipientsRefused(refused)
    finally:
        # A dropped QUIT response after accepted DATA must not turn success into failure.
        if client is not None:
            client.close()


class SubmissionGuard:
    """Bounded process-local rate limits and one-hour duplicate suppression."""
    def __init__(self):
        self.lock = threading.Lock()
        self.attempts = defaultdict(deque)
        self.deliveries = {}

    def limit(self, address):
        now = time.monotonic()
        with self.lock:
            for key in list(self.attempts):
                cutoff = now - (3600 if key == "global" else 900)
                while self.attempts[key] and self.attempts[key][0] <= cutoff:
                    self.attempts[key].popleft()
                if not self.attempts[key]:
                    del self.attempts[key]
            if len(self.attempts["global"]) >= 60 or len(self.attempts[address]) >= 5:
                raise FormError("rate_limited", 429)
            self.attempts["global"].append(now)
            self.attempts[address].append(now)

    def reserve(self, key, fingerprint):
        now = time.monotonic()
        with self.lock:
            self.deliveries = {k: v for k, v in self.deliveries.items() if now - v[2] < 3600}
            prior = self.deliveries.get(key)
            if prior:
                if prior[0] != fingerprint:
                    raise FormError("submission_changed", 409)
                if prior[1] == "sending":
                    raise FormError("submission_in_progress", 409)
                return False
            if len(self.deliveries) >= 1000:
                raise FormError("busy", 503)
            self.deliveries[key] = (fingerprint, "sending", now)
            return True

    def finish(self, key, success):
        with self.lock:
            if success:
                self.deliveries[key] = (self.deliveries[key][0], "sent", time.monotonic())
            else:
                self.deliveries.pop(key, None)


def field(name, maximum, required=True, multiline=False):
    value = request.form.get(name, "").strip()
    if len(value) > maximum or (required and not value):
        raise FormError("invalid_field", field=name)
    if any(ord(c) < 32 and (not multiline or c not in "\r\n\t") for c in value) or "\x7f" in value:
        raise FormError("invalid_field", field=name)
    return value


def attachment(name, required=False):
    upload = request.files.get(name)
    if upload is None or not upload.filename:
        if required:
            raise FormError("required_file", field=name)
        return None
    filename = upload.filename.replace("\\", "/").rsplit("/", 1)[-1]
    if not filename or len(filename) > 180 or any(ord(c) < 32 or ord(c) == 127 for c in filename):
        raise FormError("invalid_file", field=name)
    suffix = Path(filename).suffix.lower()
    allowed = {".pdf", ".doc", ".docx"} if name == "resume" else {".pdf"}
    if suffix not in allowed:
        raise FormError("invalid_file", field=name)
    data = upload.read(MAX_FILE_BYTES + 1)
    if len(data) > MAX_FILE_BYTES:
        raise FormError("file_too_large", 413, name)
    if not data:
        raise FormError("required_file", field=name)
    mime = "application/pdf"
    valid = data.startswith(b"%PDF-")
    if suffix == ".doc":
        valid = data.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1")
        mime = "application/msword"
    elif suffix == ".docx":
        mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        try:
            # Inspect container names only; never extract/decompress uploaded documents.
            with zipfile.ZipFile(io.BytesIO(data)) as archive:
                names = set(archive.namelist())
                valid = {"[Content_Types].xml", "word/document.xml"} <= names
                valid = valid and not any(n.lower().endswith("vbaproject.bin") for n in names)
        except (zipfile.BadZipFile, ValueError):
            valid = False
    if not valid:
        raise FormError("invalid_file", field=name)
    return filename, mime, data


def create_app(settings=None, mailer=send_email, preview=None, roles_path=None):
    settings = settings if settings is not None else Settings.load()
    preview = Path(preview or ROOT / ".design-sync/.cache/preview").resolve()
    roles_path = Path(roles_path or ROOT / ".design-sync/.cache/career-roles.json")
    app = Flask(__name__, static_folder=None)
    app.config.update(MAX_CONTENT_LENGTH=MAX_REQUEST_BYTES,
                      MAX_FORM_MEMORY_SIZE=128 * 1024, MAX_FORM_PARTS=16)
    guard = SubmissionGuard()

    @app.after_request
    def headers(response):
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["X-Icarus-Preview"] = "current-design-system"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

    @app.errorhandler(FormError)
    def form_error(error):
        response = jsonify(ok=False, error=error.code, field=error.field)
        response.status_code = error.status
        if error.status == 429:
            response.headers["Retry-After"] = "900"
        return response

    @app.errorhandler(HTTPException)
    def http_error(error):
        return jsonify(ok=False, error="request_too_large" if error.code == 413 else "invalid_request"), error.code

    @app.post("/api/contact")
    @app.post("/api/applications")
    def submit():
        # Custom header requires a preflight for cross-origin browsers. No CORS is enabled.
        if request.headers.get("X-Icarus-Form") != "1":
            raise FormError("invalid_origin", 403)
        origin = request.headers.get("Origin")
        try:
            if origin and (urlsplit(origin).scheme not in {"http", "https"} or urlsplit(origin).netloc != request.host):
                raise ValueError()
        except ValueError:
            raise FormError("invalid_origin", 403) from None
        if request.headers.get("Sec-Fetch-Site") == "cross-site":
            raise FormError("invalid_origin", 403)
        address = request.remote_addr or "unknown"
        if settings.trust_cloudflare and address in {"127.0.0.1", "::1"}:
            try:
                address = str(ipaddress.ip_address(request.headers.get("CF-Connecting-IP", address)))
            except ValueError:
                raise FormError("invalid_request") from None
        guard.limit(address)
        if request.mimetype != "multipart/form-data":
            raise FormError("invalid_content_type", 415)
        if request.path == "/api/contact":
            request.max_content_length = 64 * 1024
        try:
            submission_id = str(uuid.UUID(request.headers.get("X-Submission-ID", "")))
        except ValueError:
            raise FormError("invalid_submission_id") from None
        application = request.path == "/api/applications"
        allowed = {"name", "email", "language", "website"}
        allowed |= {"phone", "position", "positionTitle", "portfolioUrl", "message", "consent"} if application else {"subject", "message"}
        if any(key not in allowed or len(request.form.getlist(key)) != 1 for key in request.form):
            raise FormError("invalid_fields")
        if any(key not in ({"resume", "portfolio"} if application else set()) or len(request.files.getlist(key)) != 1 for key in request.files):
            raise FormError("invalid_files")
        if field("website", 200, required=False):
            raise FormError("invalid_request")
        name = field("name", 100)
        email = field("email", 254)
        if not EMAIL_PATTERN.fullmatch(email):
            raise FormError("invalid_email", field="email")
        language = field("language", 2)
        if language not in {"ko", "en"}:
            raise FormError("invalid_field", field="language")
        files = []
        lines = [f"이름 / Name: {name}", f"이메일 / Email: {email}", f"언어 / Language: {language}"]
        if application:
            position = field("position", 100)
            try:
                roles = json.loads(roles_path.read_text(encoding="utf-8"))
            except (OSError, ValueError):
                raise FormError("service_unavailable", 503) from None
            if position not in roles:
                raise FormError("invalid_position", field="position")
            title = roles[position][language]
            phone = field("phone", 30)
            if not re.fullmatch(r"[+\d\s().-]+", phone) or not 7 <= len(re.sub(r"\D", "", phone)) <= 15:
                raise FormError("invalid_phone", field="phone")
            if field("consent", 8) not in {"on", "true"}:
                raise FormError("consent_required", field="consent")
            link = field("portfolioUrl", 2000, required=False)
            try:
                if link and (urlsplit(link).scheme not in {"http", "https"} or not urlsplit(link).hostname):
                    raise ValueError()
            except ValueError:
                raise FormError("invalid_link", field="portfolioUrl") from None
            files = [item for item in (attachment("resume", True), attachment("portfolio")) if item]
            extra = field("message", 5000, required=False, multiline=True)
            subject = f"[ICARUS 채용 지원] {title} — {name}"
            lines += [f"연락처 / Phone: {phone}", f"지원 직무 / Position: {title} ({position})",
                      "개인정보 수집·이용 동의 / Privacy consent: 동의 / Agreed",
                      f"포트폴리오 링크 / Portfolio URL: {link or '-'}", "", "추가 내용 / Message:", extra or "-"]
        else:
            inquiry_subject = field("subject", 160)
            subject = f"[ICARUS 문의] {inquiry_subject} — {name}"
            lines += [f"제목 / Subject: {inquiry_subject}", "", "문의 내용 / Message:", field("message", 5000, multiline=True)]
        if not settings.ready():
            raise FormError("service_unavailable", 503)
        fingerprint = hashlib.sha256(json.dumps([request.path, lines], ensure_ascii=False).encode())
        for filename, mime, data in files:
            fingerprint.update(filename.encode())
            fingerprint.update(data)
        message = EmailMessage(policy=SMTP)
        message["Subject"] = subject
        message["From"] = formataddr(("ICARUS Website", settings.sender))
        message["To"] = RECIPIENT
        message["Reply-To"] = email
        message["Date"] = format_datetime(datetime.now(timezone.utc))
        message["Message-ID"] = make_msgid(idstring=submission_id, domain=settings.sender.split("@")[1])
        lines += ["", f"접수 번호 / Submission: {submission_id}"]
        message.set_content("\n".join(lines))
        for filename, mime, data in files:
            main, sub = mime.split("/", 1)
            message.add_attachment(data, maintype=main, subtype=sub, filename=filename)
        if len(message.as_bytes()) > settings.max_mail_bytes:
            raise FormError("email_too_large", 413)
        if not guard.reserve(submission_id, fingerprint.hexdigest()):
            return jsonify(ok=True, submissionId=submission_id)
        try:
            mailer(settings, message)
        except (smtplib.SMTPException, OSError):
            guard.finish(submission_id, False)
            # No addresses, contents, credentials, provider replies, or documents in logs.
            logger.warning("Mail delivery failed for submission %s", submission_id)
            raise FormError("delivery_failed", 502) from None
        except Exception:
            guard.finish(submission_id, False)
            raise
        guard.finish(submission_id, True)
        return jsonify(ok=True, submissionId=submission_id)

    @app.get("/", defaults={"path": ""})
    @app.get("/<path:path>")
    def site(path):
        target = (preview / path).resolve()
        if not target.is_relative_to(preview) or any(part.startswith(".") for part in Path(path).parts):
            abort(404)
        if target.is_dir():
            if path and not request.path.endswith("/"):
                return redirect(request.path + "/" + ("?" + request.query_string.decode() if request.query_string else ""))
            path = str(Path(path) / "index.html")
        # Retain byte-range support for video, but do not return stale 304 responses.
        request.environ.pop("HTTP_IF_MODIFIED_SINCE", None)
        request.environ.pop("HTTP_IF_NONE_MATCH", None)
        return send_from_directory(preview, path, conditional=True, etag=False, max_age=0)

    return app
