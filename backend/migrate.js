/**
 * Creates SQLite DB file and schema if missing.
 */
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const dbFile = process.env.DATABASE_FILE || path.join(__dirname,'../data/ukrtwitch.db');
const dir = path.dirname(dbFile);
if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});
const db = new Database(dbFile);
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'viewer',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS streams (
  id TEXT PRIMARY KEY,
  streamer_id TEXT,
  title TEXT,
  category TEXT,
  status TEXT DEFAULT 'offline',
  rtmp_key TEXT,
  started_at TEXT,
  stopped_at TEXT,
  viewer_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  stream_id TEXT,
  user_id TEXT,
  content TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  streamer_id TEXT,
  amount_cents INTEGER,
  currency TEXT DEFAULT 'UAH',
  status TEXT DEFAULT 'pending',
  provider TEXT,
  provider_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);
console.log('Migration: DB ready at', dbFile);
db.close();
