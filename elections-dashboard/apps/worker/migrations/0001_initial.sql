-- Constituency master (543 Lok Sabha seats)
CREATE TABLE IF NOT EXISTS constituencies (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  state        TEXT NOT NULL,
  total_voters INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ECI feed timeseries snapshots (upserted every 30s during counting)
CREATE TABLE IF NOT EXISTS eci_snapshots (
  id                  TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  constituency_id     TEXT NOT NULL REFERENCES constituencies(id),
  captured_at         TEXT NOT NULL DEFAULT (datetime('now')),
  leading_party       TEXT,
  lead_margin         INTEGER NOT NULL DEFAULT 0,
  total_votes_counted INTEGER NOT NULL DEFAULT 0,
  percent_counted     REAL NOT NULL DEFAULT 0.0,
  raw_json            TEXT NOT NULL DEFAULT '{}',
  UNIQUE(constituency_id, captured_at)
);
CREATE INDEX IF NOT EXISTS idx_eci_snapshots_constituency_time
  ON eci_snapshots(constituency_id, captured_at DESC);

-- Recorded citizen votes (EPIC stored as SHA-256 hash only)
CREATE TABLE IF NOT EXISTS recorded_votes (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  epic_hash       TEXT NOT NULL UNIQUE,
  constituency_id TEXT NOT NULL REFERENCES constituencies(id),
  party           TEXT NOT NULL,
  recorded_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_votes_constituency ON recorded_votes(constituency_id);

-- Citizen reports (no PII stored)
CREATE TABLE IF NOT EXISTS citizen_reports (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  text            TEXT NOT NULL,
  r2_key          TEXT,
  lat             REAL,
  lng             REAL,
  constituency_id TEXT REFERENCES constituencies(id),
  sentiment       TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reports_created ON citizen_reports(created_at DESC);

-- AI-generated prediction cache (per-constituency)
CREATE TABLE IF NOT EXISTS predictions (
  constituency_id TEXT PRIMARY KEY,
  win_probs_json  TEXT NOT NULL DEFAULT '{}',
  ci_low          REAL,
  ci_high         REAL,
  narrative       TEXT,
  generated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
