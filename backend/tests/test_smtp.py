"""Exercise real SMTP over a local TLS socket; never contact an external mailbox."""
from email import policy
from email.parser import BytesParser
import io
import json
from pathlib import Path
import socketserver
import ssl
import subprocess
import tempfile
import threading
import unittest
from unittest.mock import patch
import uuid

from backend.app import RECIPIENT, Settings, create_app


class SMTPHandler(socketserver.StreamRequestHandler):
    def reply(self, text):
        self.wfile.write(text.encode("ascii") + b"\r\n")
        self.wfile.flush()

    def handle(self):
        self.reply("220 localhost ESMTP test receiver")
        envelope = []
        while line := self.rfile.readline():
            command = line.split(b" ", 1)[0].strip().upper()
            if command == b"EHLO":
                self.reply("250-localhost\r\n250-AUTH PLAIN\r\n250 SIZE 40000000")
            elif command == b"AUTH":
                self.reply("235 Authenticated")
            elif command in {b"MAIL", b"RCPT"}:
                envelope.append(line.decode("ascii").strip())
                self.reply("250 OK")
            elif command == b"DATA":
                self.reply("354 Send message")
                body = bytearray()
                while (line := self.rfile.readline()) and line != b".\r\n":
                    body.extend(line[1:] if line.startswith(b"..") else line)
                self.server.messages.append((envelope, bytes(body)))
                self.reply("250 Accepted")
            elif command == b"QUIT":
                self.reply("221 Bye")
                return
            else:
                self.reply("500 Unsupported")


class TLSReceiver(socketserver.ThreadingTCPServer):
    daemon_threads = True
    def get_request(self):
        connection, address = super().get_request()
        connection.settimeout(5)
        return self.tls.wrap_socket(connection, server_side=True), address


class SMTPIntegrationTests(unittest.TestCase):
    def test_application_delivered_over_tls_with_readable_korean_and_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            cert, key = root / "cert.pem", root / "key.pem"
            subprocess.run(["openssl", "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1",
                            "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost,IP:127.0.0.1",
                            "-keyout", str(key), "-out", str(cert)], check=True, capture_output=True)
            server_tls = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            server_tls.load_cert_chain(cert, key)
            client_tls = ssl.create_default_context(cafile=str(cert))
            roles = root / "roles.json"
            roles.write_text(json.dumps({"test": {"ko": "제어 엔지니어", "en": "Control Engineer"}}))
            with TLSReceiver(("127.0.0.1", 0), SMTPHandler) as receiver:
                receiver.tls, receiver.messages = server_tls, []
                thread = threading.Thread(target=receiver.serve_forever, daemon=True)
                thread.start()
                try:
                    settings = Settings(host="127.0.0.1", port=receiver.server_address[1], security="ssl",
                                        username="test-login", password="test-password", sender="web@example.test")
                    app = create_app(settings, roles_path=roles)
                    headers = {"X-Icarus-Form": "1", "X-Submission-ID": str(uuid.uuid4())}
                    with patch("backend.app.ssl.create_default_context", return_value=client_tls):
                        response = app.test_client().post("/api/applications", headers=headers, data={
                            "name": "테스트 지원자", "email": "applicant@example.test", "phone": "010-1234-5678",
                            "position": "test", "language": "ko", "consent": "on",
                            "resume": (io.BytesIO(b"%PDF-1.7\nresume data"), "테스트 이력서.pdf"),
                        })
                    self.assertEqual(response.status_code, 200)
                    self.assertEqual(len(receiver.messages), 1)
                    envelope, body = receiver.messages[0]
                    self.assertEqual(envelope[1], f"rcpt TO:<{RECIPIENT}>")
                    message = BytesParser(policy=policy.default).parsebytes(body)
                    self.assertIn("테스트 지원자", message["Subject"])
                    self.assertEqual(message["Reply-To"], "applicant@example.test")
                    attachment, = message.iter_attachments()
                    self.assertEqual(attachment.get_filename(), "테스트 이력서.pdf")
                    self.assertEqual(attachment.get_payload(decode=True), b"%PDF-1.7\nresume data")
                    response.close()
                finally:
                    receiver.shutdown()
                    thread.join(3)


if __name__ == "__main__":
    unittest.main()
