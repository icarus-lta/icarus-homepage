CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created INTEGER NOT NULL,
  expires INTEGER NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('contact', 'applications')),
  payload TEXT,
  files TEXT,
  reserved_bytes INTEGER NOT NULL DEFAULT 0,
  state TEXT NOT NULL DEFAULT 'pending',
  lease INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX submissions_created ON submissions(created);
CREATE INDEX submissions_ip ON submissions(ip_hash, created);
CREATE INDEX submissions_expiry ON submissions(expires, reserved_bytes);
CREATE TABLE uploads (
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  slot TEXT NOT NULL CHECK (slot IN ('resume', 'portfolio')),
  state TEXT NOT NULL DEFAULT 'empty',
  attempts INTEGER NOT NULL DEFAULT 0,
  lease INTEGER NOT NULL DEFAULT 0,
  nonce TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (submission_id, slot)
);
-- Atomic reservations, including abandoned attempts: stay below mail free tiers.
-- KV expires every attempt at the submission deadline. Reserve 3x retry headroom
-- below the 1 GB Free account limit: 200 MiB of logical files, at most 600 MiB stored.
CREATE TRIGGER submission_ip_limit BEFORE INSERT ON submissions
WHEN (SELECT COUNT(*) FROM submissions WHERE created >= NEW.created - 900 AND ip_hash = NEW.ip_hash) >= 5
BEGIN
  SELECT RAISE(ABORT, 'ip_quota');
END;
CREATE TRIGGER submission_daily_limit BEFORE INSERT ON submissions
WHEN (SELECT COUNT(*) FROM submissions WHERE created >= CAST(strftime('%s', NEW.created, 'unixepoch', 'start of day') AS INTEGER)) >= 90
BEGIN
  SELECT RAISE(ABORT, 'mail_quota');
END;
CREATE TRIGGER submission_monthly_limit BEFORE INSERT ON submissions
WHEN (SELECT COUNT(*) FROM submissions WHERE created >= CAST(strftime('%s', NEW.created, 'unixepoch', 'start of month') AS INTEGER)) >= 2800
BEGIN
  SELECT RAISE(ABORT, 'mail_quota');
END;
CREATE TRIGGER submission_storage_limit BEFORE INSERT ON submissions
WHEN (SELECT COALESCE(SUM(reserved_bytes),0) FROM submissions) + NEW.reserved_bytes > 209715200
BEGIN
  SELECT RAISE(ABORT, 'storage_quota');
END;
