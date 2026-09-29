import io
import json
from pathlib import Path
import smtplib
import tempfile
import threading
import unittest
from unittest.mock import Mock, patch
import uuid
import zipfile

from werkzeug.datastructures import MultiDict
from backend.app import MAX_FILE_BYTES, RECIPIENT, Settings, create_app, send_email


class FormTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.roles = self.root / "roles.json"
        self.roles.write_text(json.dumps({"control": {"ko": "비행선 제어 엔지니어", "en": "Control Engineer"}}))
        (self.root / "index.html").write_text("Current site")
        (self.root / "video.mp4").write_bytes(b"0123456789")
        (self.root / ".env").write_text("private")
        self.messages = []
        self.settings = Settings(host="smtp.example.test", username="login", password="test-only", sender="web@example.test")
        self.app = self.make_app()
        self.client = self.app.test_client()

    def make_app(self, settings=None, mailer=None):
        app = create_app(settings=settings or self.settings,
                         mailer=mailer or (lambda settings, message: self.messages.append(message)),
                         preview=self.root, roles_path=self.roles)
        app.testing = True
        return app

    def headers(self, **extra):
        return {"X-Icarus-Form": "1", "X-Submission-ID": str(uuid.uuid4()), "Origin": "http://localhost", **extra}

    def contact(self, **extra):
        return {"name": "홍길동", "email": "applicant@example.test", "subject": "협업 문의",
                "message": "안녕하세요.\n함께 이야기하고 싶습니다.", "language": "ko", "website": "", **extra}

    def application(self, **extra):
        return {"name": "홍길동", "email": "applicant@example.test", "phone": "010-1234-5678",
                "position": "control", "positionTitle": "Untrusted title", "language": "ko", "consent": "on",
                "resume": (io.BytesIO(b"%PDF-1.7\nresume"), "이력서.pdf"),
                "portfolio": (io.BytesIO(b"%PDF-1.7\nportfolio"), "포트폴리오.pdf"),
                "portfolioUrl": "https://example.test/projects", "message": "지원합니다.", **extra}

    def post(self, path="/api/contact", data=None, headers=None, client=None):
        response = (client or self.client).post(path, data=data if data is not None else self.contact(),
                                               headers=headers or self.headers(), content_type="multipart/form-data")
        response.request.input_stream.close()
        self.addCleanup(response.close)
        return response

    def test_inquiry_contains_name_and_fixed_recipient_and_reply_to(self):
        response = self.post()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json["ok"])
        message, = self.messages
        self.assertEqual(message["To"], RECIPIENT)
        self.assertEqual(message["Reply-To"], "applicant@example.test")
        self.assertIn("web@example.test", message["From"])
        self.assertIn("[ICARUS 문의]", message["Subject"])
        self.assertIn("홍길동", message.get_content())
        self.assertIn("함께 이야기", message.get_content())

    def test_application_attachments_and_server_position(self):
        response = self.post("/api/applications", self.application())
        self.assertEqual(response.status_code, 200)
        message, = self.messages
        self.assertIn("비행선 제어 엔지니어", message["Subject"])
        self.assertNotIn("Untrusted title", message.as_string())
        attachments = list(message.iter_attachments())
        self.assertEqual([x.get_filename() for x in attachments], ["이력서.pdf", "포트폴리오.pdf"])
        self.assertEqual(attachments[0].get_payload(decode=True), b"%PDF-1.7\nresume")
        self.assertIn("Privacy consent: 동의 / Agreed", message.get_body().get_content())

    def test_docx_and_optional_empty_portfolio(self):
        file = io.BytesIO()
        with zipfile.ZipFile(file, "w") as z:
            z.writestr("[Content_Types].xml", "<Types/>")
            z.writestr("word/document.xml", "<document/>")
        file.seek(0)
        response = self.post("/api/applications", self.application(resume=(file, "resume.docx"), portfolio=(io.BytesIO(), "")))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(list(self.messages[0].iter_attachments())), 1)

    def test_name_email_and_header_injection_validation(self):
        for field, value in [("name", ""), ("email", "invalid"), ("subject", "x\r\nBcc: bad@example.test"), ("name", "x" * 101)]:
            with self.subTest(field=field):
                response = self.post(data=self.contact(**{field: value}))
                self.assertEqual(response.status_code, 400)
        self.assertEqual(self.messages, [])

    def test_required_application_fields(self):
        for field, value in [("position", "missing"), ("consent", ""), ("phone", "12"), ("portfolioUrl", "javascript:alert(1)")]:
            with self.subTest(field=field):
                response = self.post("/api/applications", self.application(**{field: value}))
                self.assertEqual(response.status_code, 400)
        self.assertEqual(self.messages, [])

    def test_no_resume_and_disguised_file_rejected(self):
        for content, filename in [(b"", ""), (b"<html>bad</html>", "resume.pdf"), (b"%PDF-1.7", "resume.exe")]:
            response = self.post("/api/applications", self.application(resume=(io.BytesIO(content), filename)))
            self.assertEqual(response.status_code, 400)
        self.assertEqual(self.messages, [])

    def test_per_file_and_encoded_message_limits(self):
        response = self.post("/api/applications", self.application(resume=(io.BytesIO(b"%PDF-" + b"x" * MAX_FILE_BYTES), "resume.pdf")))
        self.assertEqual(response.status_code, 413)
        settings = Settings(host="host", username="user", password="pass", max_mail_bytes=100)
        response = self.post(client=self.make_app(settings).test_client())
        self.assertEqual(response.json["error"], "email_too_large")
        self.assertEqual(self.messages, [])

    def test_request_size_limit(self):
        response = self.post(data=self.contact(message="x" * 70000))
        self.assertEqual(response.status_code, 413)
        self.assertEqual(self.messages, [])

    def test_foreign_origin_and_missing_custom_header(self):
        for headers in [{"Origin": "http://localhost"}, self.headers(Origin="https://foreign.test"), self.headers(Origin="http://[")]:
            self.assertEqual(self.post(headers=headers).status_code, 403)
        self.assertEqual(self.messages, [])

    def test_unexpected_fields_duplicates_and_bot_trap(self):
        for data in [self.contact(to="someone@example.test"), self.contact(website="bot"), MultiDict(list(self.contact().items()) + [("email", "other@example.test")])]:
            self.assertEqual(self.post(data=data).status_code, 400)
        self.assertEqual(self.messages, [])

    def test_unconfigured_never_reports_sent(self):
        response = self.post(client=self.make_app(Settings()).test_client())
        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.json["ok"])
        self.assertEqual(self.messages, [])

    def test_smtp_failure_is_retryable_without_leaking_error(self):
        mailer = Mock(side_effect=[smtplib.SMTPAuthenticationError(535, b"secret provider message"), None])
        client = self.make_app(mailer=mailer).test_client()
        headers = self.headers()
        response = self.post(client=client, headers=headers)
        self.assertEqual(response.status_code, 502)
        self.assertNotIn("secret", response.text)
        self.assertEqual(self.post(client=client, headers=headers).status_code, 200)

    def test_retry_after_success_sends_once_and_payload_change_rejected(self):
        headers = self.headers()
        self.assertEqual(self.post(headers=headers).status_code, 200)
        self.assertEqual(self.post(headers=headers).status_code, 200)
        self.assertEqual(len(self.messages), 1)
        response = self.post(headers=headers, data=self.contact(name="Changed"))
        self.assertEqual(response.status_code, 409)

    def test_simultaneous_submission_has_one_sender(self):
        started, release = threading.Event(), threading.Event()
        def mailer(settings, message):
            self.messages.append(message)
            started.set()
            release.wait(3)
        app = self.make_app(mailer=mailer)
        headers = self.headers()
        results = []
        worker = threading.Thread(target=lambda: results.append(self.post(client=app.test_client(), headers=headers).status_code))
        worker.start()
        self.assertTrue(started.wait(3))
        try:
            self.assertEqual(self.post(client=app.test_client(), headers=headers).status_code, 409)
        finally:
            release.set()
            worker.join(3)
        self.assertEqual(results, [200])
        self.assertEqual(len(self.messages), 1)

    def test_rate_limit(self):
        for _ in range(5):
            self.assertEqual(self.post().status_code, 200)
        response = self.post()
        self.assertEqual(response.status_code, 429)
        self.assertIn("Retry-After", response.headers)
        self.assertEqual(len(self.messages), 5)

    def test_static_video_and_private_paths(self):
        with self.client.get("/") as response:
            self.assertEqual(response.data, b"Current site")
            self.assertIn("no-store", response.headers["Cache-Control"])
        with self.client.get("/video.mp4", headers={"Range": "bytes=2-5"}) as response:
            self.assertEqual(response.data, b"2345")
        with self.client.get("/video.mp4", headers={"If-Modified-Since": "Wed, 01 Jan 2099 00:00:00 GMT"}) as response:
            self.assertEqual(response.status_code, 200)
        for path in ["/.env", "/../roles.json", "/api/contact"]:
            self.assertEqual(self.client.get(path).status_code, 404)

    def test_smtp_requires_tls_before_login_and_fixed_envelope(self):
        self.post()
        client = Mock()
        client.send_message.return_value = {}
        with patch("backend.app.smtplib.SMTP", return_value=client):
            send_email(self.settings, self.messages[0])
        calls = [call[0] for call in client.method_calls]
        self.assertLess(calls.index("starttls"), calls.index("login"))
        self.assertEqual(client.send_message.call_args.kwargs["to_addrs"], [RECIPIENT])
        self.assertEqual(client.send_message.call_args.kwargs["from_addr"], "web@example.test")
        self.assertEqual(calls[-1], "close")


if __name__ == "__main__":
    unittest.main()
