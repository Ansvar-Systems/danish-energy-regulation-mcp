/**
 * SQLite database access layer for the Danish Energy Regulation MCP server.
 *
 * Schema covers four Danish energy regulators:
 *   - regulations      — Energistyrelsen BEKs/VEJs, Sikkerhedsstyrelsen safety rules
 *   - grid_codes       — Energinet technical and market regulations
 *   - decisions        — Forsyningstilsynet tariff decisions, revenue caps, methodologies
 *
 * FTS5 virtual tables back full-text search on all three domains.
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env["DK_ENERGY_DB_PATH"] ?? "data/dk-energy.db";

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS regulators (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  full_name   TEXT,
  url         TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS regulations (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  regulator_id   TEXT    NOT NULL,
  reference      TEXT    NOT NULL,
  title          TEXT,
  text           TEXT    NOT NULL,
  type           TEXT,
  status         TEXT    DEFAULT 'in_force',
  effective_date TEXT,
  url            TEXT,
  FOREIGN KEY (regulator_id) REFERENCES regulators(id)
);

CREATE INDEX IF NOT EXISTS idx_regulations_regulator ON regulations(regulator_id);
CREATE INDEX IF NOT EXISTS idx_regulations_status    ON regulations(status);

CREATE VIRTUAL TABLE IF NOT EXISTS regulations_fts USING fts5(
  reference, title, text,
  content='regulations',
  content_rowid='id'
);

CREATE TRIGGER IF NOT EXISTS regulations_ai AFTER INSERT ON regulations BEGIN
  INSERT INTO regulations_fts(rowid, reference, title, text)
  VALUES (new.id, new.reference, COALESCE(new.title, ''), new.text);
END;

CREATE TRIGGER IF NOT EXISTS regulations_ad AFTER DELETE ON regulations BEGIN
  INSERT INTO regulations_fts(regulations_fts, rowid, reference, title, text)
  VALUES ('delete', old.id, old.reference, COALESCE(old.title, ''), old.text);
END;

CREATE TRIGGER IF NOT EXISTS regulations_au AFTER UPDATE ON regulations BEGIN
  INSERT INTO regulations_fts(regulations_fts, rowid, reference, title, text)
  VALUES ('delete', old.id, old.reference, COALESCE(old.title, ''), old.text);
  INSERT INTO regulations_fts(rowid, reference, title, text)
  VALUES (new.id, new.reference, COALESCE(new.title, ''), new.text);
END;

CREATE TABLE IF NOT EXISTS grid_codes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  reference      TEXT    NOT NULL,
  title          TEXT,
  text           TEXT    NOT NULL,
  code_type      TEXT,
  version        TEXT,
  effective_date TEXT,
  url            TEXT
);

CREATE INDEX IF NOT EXISTS idx_grid_codes_type ON grid_codes(code_type);

CREATE VIRTUAL TABLE IF NOT EXISTS grid_codes_fts USING fts5(
  reference, title, text,
  content='grid_codes',
  content_rowid='id'
);

CREATE TRIGGER IF NOT EXISTS grid_codes_ai AFTER INSERT ON grid_codes BEGIN
  INSERT INTO grid_codes_fts(rowid, reference, title, text)
  VALUES (new.id, new.reference, COALESCE(new.title, ''), new.text);
END;

CREATE TRIGGER IF NOT EXISTS grid_codes_ad AFTER DELETE ON grid_codes BEGIN
  INSERT INTO grid_codes_fts(grid_codes_fts, rowid, reference, title, text)
  VALUES ('delete', old.id, old.reference, COALESCE(old.title, ''), old.text);
END;

CREATE TRIGGER IF NOT EXISTS grid_codes_au AFTER UPDATE ON grid_codes BEGIN
  INSERT INTO grid_codes_fts(grid_codes_fts, rowid, reference, title, text)
  VALUES ('delete', old.id, old.reference, COALESCE(old.title, ''), old.text);
  INSERT INTO grid_codes_fts(rowid, reference, title, text)
  VALUES (new.id, new.reference, COALESCE(new.title, ''), new.text);
END;

CREATE TABLE IF NOT EXISTS decisions (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  reference       TEXT    NOT NULL,
  title           TEXT,
  text            TEXT    NOT NULL,
  decision_type   TEXT,
  date_decided    TEXT,
  parties         TEXT,
  url             TEXT
);

CREATE INDEX IF NOT EXISTS idx_decisions_type ON decisions(decision_type);
CREATE INDEX IF NOT EXISTS idx_decisions_date ON decisions(date_decided);

CREATE VIRTUAL TABLE IF NOT EXISTS decisions_fts USING fts5(
  reference, title, text, parties,
  content='decisions',
  content_rowid='id'
);

CREATE TRIGGER IF NOT EXISTS decisions_ai AFTER INSERT ON decisions BEGIN
  INSERT INTO decisions_fts(rowid, reference, title, text, parties)
  VALUES (new.id, new.reference, COALESCE(new.title, ''), new.text, COALESCE(new.parties, ''));
END;

CREATE TRIGGER IF NOT EXISTS decisions_ad AFTER DELETE ON decisions BEGIN
  INSERT INTO decisions_fts(decisions_fts, rowid, reference, title, text, parties)
  VALUES ('delete', old.id, old.reference, COALESCE(old.title, ''), old.text, COALESCE(old.parties, ''));
END;

CREATE TRIGGER IF NOT EXISTS decisions_au AFTER UPDATE ON decisions BEGIN
  INSERT INTO decisions_fts(decisions_fts, rowid, reference, title, text, parties)
  VALUES ('delete', old.id, old.reference, COALESCE(old.title, ''), old.text, COALESCE(old.parties, ''));
  INSERT INTO decisions_fts(rowid, reference, title, text, parties)
  VALUES (new.id, new.reference, COALESCE(new.title, ''), new.text, COALESCE(new.parties, ''));
END;

CREATE TABLE IF NOT EXISTS db_metadata (
  key          TEXT PRIMARY KEY,
  value        TEXT,
  last_updated TEXT DEFAULT (datetime('now'))
);
`;

// --- Types ---

export interface Regulator {
  id: string;
  name: string;
  full_name: string | null;
  url: string | null;
  description: string | null;
}

export interface Regulation {
  id: number;
  regulator_id: string;
  reference: string;
  title: string | null;
  text: string;
  type: string | null;
  status: string;
  effective_date: string | null;
  url: string | null;
}

export interface GridCode {
  id: number;
  reference: string;
  title: string | null;
  text: string;
  code_type: string | null;
  version: string | null;
  effective_date: string | null;
  url: string | null;
}

export interface Decision {
  id: number;
  reference: string;
  title: string | null;
  text: string;
  decision_type: string | null;
  date_decided: string | null;
  parties: string | null;
  url: string | null;
}

// --- Database singleton ---

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  _db.exec(SCHEMA_SQL);

  return _db;
}

// --- Regulator queries ---

export function listRegulators(): Regulator[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM regulators ORDER BY id")
    .all() as Regulator[];
}

// --- Regulation queries ---

export interface SearchRegulationsOptions {
  query: string;
  regulator?: string | undefined;
  type?: string | undefined;
  status?: string | undefined;
  limit?: number | undefined;
}

export function searchRegulations(opts: SearchRegulationsOptions): Regulation[] {
  const db = getDb();
  const limit = opts.limit ?? 20;
  const conditions: string[] = [];
  const params: Record<string, unknown> = { query: opts.query, limit };

  if (opts.regulator) {
    conditions.push("r.regulator_id = :regulator");
    params["regulator"] = opts.regulator;
  }
  if (opts.type) {
    conditions.push("r.type = :type");
    params["type"] = opts.type;
  }
  if (opts.status) {
    conditions.push("r.status = :status");
    params["status"] = opts.status;
  }

  const where = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

  return db
    .prepare(
      `SELECT r.* FROM regulations_fts f
       JOIN regulations r ON r.id = f.rowid
       WHERE regulations_fts MATCH :query ${where}
       ORDER BY rank
       LIMIT :limit`,
    )
    .all(params) as Regulation[];
}

export function getRegulation(id: number): Regulation | null {
  const db = getDb();
  return (
    (db
      .prepare("SELECT * FROM regulations WHERE id = ?")
      .get(id) as Regulation | undefined) ?? null
  );
}

export function getRegulationByReference(reference: string): Regulation | null {
  const db = getDb();
  return (
    (db
      .prepare("SELECT * FROM regulations WHERE reference = ? LIMIT 1")
      .get(reference) as Regulation | undefined) ?? null
  );
}

// --- Grid code queries ---

export interface SearchGridCodesOptions {
  query: string;
  code_type?: string | undefined;
  limit?: number | undefined;
}

export function searchGridCodes(opts: SearchGridCodesOptions): GridCode[] {
  const db = getDb();
  const limit = opts.limit ?? 20;

  if (opts.code_type) {
    return db
      .prepare(
        `SELECT g.* FROM grid_codes_fts f
         JOIN grid_codes g ON g.id = f.rowid
         WHERE grid_codes_fts MATCH :query AND g.code_type = :code_type
         ORDER BY rank
         LIMIT :limit`,
      )
      .all({ query: opts.query, code_type: opts.code_type, limit }) as GridCode[];
  }

  return db
    .prepare(
      `SELECT g.* FROM grid_codes_fts f
       JOIN grid_codes g ON g.id = f.rowid
       WHERE grid_codes_fts MATCH :query
       ORDER BY rank
       LIMIT :limit`,
    )
    .all({ query: opts.query, limit }) as GridCode[];
}

export function getGridCode(id: number): GridCode | null {
  const db = getDb();
  return (
    (db
      .prepare("SELECT * FROM grid_codes WHERE id = ?")
      .get(id) as GridCode | undefined) ?? null
  );
}

// --- Decision queries ---

export interface SearchDecisionsOptions {
  query: string;
  decision_type?: string | undefined;
  limit?: number | undefined;
}

export function searchDecisions(opts: SearchDecisionsOptions): Decision[] {
  const db = getDb();
  const limit = opts.limit ?? 20;

  if (opts.decision_type) {
    return db
      .prepare(
        `SELECT d.* FROM decisions_fts f
         JOIN decisions d ON d.id = f.rowid
         WHERE decisions_fts MATCH :query AND d.decision_type = :decision_type
         ORDER BY rank
         LIMIT :limit`,
      )
      .all({ query: opts.query, decision_type: opts.decision_type, limit }) as Decision[];
  }

  return db
    .prepare(
      `SELECT d.* FROM decisions_fts f
       JOIN decisions d ON d.id = f.rowid
       WHERE decisions_fts MATCH :query
       ORDER BY rank
       LIMIT :limit`,
    )
    .all({ query: opts.query, limit }) as Decision[];
}

export function getDecision(id: number): Decision | null {
  const db = getDb();
  return (
    (db
      .prepare("SELECT * FROM decisions WHERE id = ?")
      .get(id) as Decision | undefined) ?? null
  );
}

// --- Metadata queries ---

export function getMetadataValue(key: string): string | null {
  const db = getDb();
  const row = db
    .prepare("SELECT value FROM db_metadata WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function getRecordCounts(): { regulations: number; grid_codes: number; decisions: number } {
  const db = getDb();
  const regs = (db.prepare("SELECT count(*) as n FROM regulations").get() as { n: number }).n;
  const gc = (db.prepare("SELECT count(*) as n FROM grid_codes").get() as { n: number }).n;
  const dec = (db.prepare("SELECT count(*) as n FROM decisions").get() as { n: number }).n;
  return { regulations: regs, grid_codes: gc, decisions: dec };
}

export function getRegulationCountByRegulator(regulatorId: string): number {
  const db = getDb();
  return (db
    .prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = ?")
    .get(regulatorId) as { n: number }).n;
}
