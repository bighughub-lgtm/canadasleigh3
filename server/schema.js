// D1 schema for the Canada Sleigh CMS (Cloudflare D1 binding: DB).
// Statements are idempotent and safe to run more than once.
const NOW = "(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))"

export const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS site_media (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    title_lv TEXT, title_en TEXT, title_ru TEXT, title_lt TEXT, title_est TEXT,
    alt_lv TEXT, alt_en TEXT, alt_ru TEXT, alt_lt TEXT, alt_est TEXT,
    url TEXT NOT NULL,
    cloudinary_public_id TEXT,
    width INTEGER,
    height INTEGER,
    format TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT ${NOW},
    updated_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  'CREATE INDEX IF NOT EXISTS site_media_section_idx ON site_media (section, is_active, sort_order)',
  `CREATE TABLE IF NOT EXISTS site_videos (
    id TEXT PRIMARY KEY,
    title_lv TEXT, title_en TEXT, title_ru TEXT, title_lt TEXT, title_est TEXT,
    description_lv TEXT, description_en TEXT, description_ru TEXT, description_lt TEXT, description_est TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT ${NOW},
    updated_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  `CREATE TABLE IF NOT EXISTS site_texts (
    text_key TEXT PRIMARY KEY,
    group_id TEXT,
    label_lv TEXT,
    description_lv TEXT,
    input_type TEXT,
    value_lv TEXT, value_en TEXT, value_ru TEXT,
    default_lv TEXT, default_en TEXT, default_ru TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT ${NOW},
    updated_at TEXT NOT NULL DEFAULT ${NOW}
  )`,
  `CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_iterations INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT ${NOW},
    last_login_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS admin_sessions_user_idx ON admin_sessions (user_id)',
  `CREATE TABLE IF NOT EXISTS admin_setup_tokens (
    token_hash TEXT PRIMARY KEY,
    label TEXT,
    expires_at INTEGER NOT NULL,
    used_at INTEGER,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS admin_login_attempts (
    attempt_key TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS admin_login_attempts_idx ON admin_login_attempts (attempt_key, created_at)',
]

export const MEDIA_COLUMNS = [
  'id', 'section',
  'title_lv', 'title_en', 'title_ru', 'title_lt', 'title_est',
  'alt_lv', 'alt_en', 'alt_ru', 'alt_lt', 'alt_est',
  'url', 'cloudinary_public_id', 'width', 'height', 'format',
  'sort_order', 'is_active', 'created_at', 'updated_at',
]

export const VIDEO_COLUMNS = [
  'id',
  'title_lv', 'title_en', 'title_ru', 'title_lt', 'title_est',
  'description_lv', 'description_en', 'description_ru', 'description_lt', 'description_est',
  'video_url', 'thumbnail_url', 'sort_order', 'is_active', 'created_at', 'updated_at',
]

export const TEXT_COLUMNS = [
  'text_key', 'group_id', 'label_lv', 'description_lv', 'input_type',
  'value_lv', 'value_en', 'value_ru', 'default_lv', 'default_en', 'default_ru',
  'is_active', 'created_at', 'updated_at',
]

// Columns an admin is allowed to write through the API
export const MEDIA_WRITABLE = [
  'section',
  'title_lv', 'title_en', 'title_ru', 'title_lt', 'title_est',
  'alt_lv', 'alt_en', 'alt_ru', 'alt_lt', 'alt_est',
  'url', 'cloudinary_public_id', 'width', 'height', 'format',
  'sort_order', 'is_active',
]

export const VIDEO_WRITABLE = [
  'title_lv', 'title_en', 'title_ru', 'title_lt', 'title_est',
  'description_lv', 'description_en', 'description_ru', 'description_lt', 'description_est',
  'video_url', 'thumbnail_url', 'sort_order', 'is_active',
]

export const TEXT_WRITABLE = [
  'group_id', 'label_lv', 'description_lv', 'input_type',
  'value_lv', 'value_en', 'value_ru', 'default_lv', 'default_en', 'default_ru',
  'is_active',
]

export async function ensureSchema(db) {
  await db.batch(SCHEMA_STATEMENTS.map((statement) => db.prepare(statement)))
}
