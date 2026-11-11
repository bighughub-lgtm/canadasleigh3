// One-time content import from the old Supabase/Cloudinary setup into D1 + R2.
// Protected by a high-entropy key (only its SHA-256 is stored here). Remove after the move is finished.
import { MEDIA_COLUMNS, TEXT_COLUMNS, VIDEO_COLUMNS, ensureSchema } from './schema.js'
import { sha256Hex } from './auth.js'
import { json, readJson } from './http.js'

const IMPORT_KEY_SHA256 = 'fa8a3b2f06c3f1bc0f09f3362d416a8f5880f076b40b2eecf7f5dcc0aeac09df'
const MAX_IMAGE_BYTES = 20 * 1024 * 1024

function isCloudinaryUrl(url) {
  try {
    return new URL(url).hostname === 'res.cloudinary.com'
  } catch {
    return false
  }
}

function migratedKey(url) {
  const path = new URL(url).pathname
  const afterUpload = path.split('/upload/')[1] || path.split('/').pop()
  const withoutVersion = afterUpload.replace(/^v\d+\//, '')
  return `migrated/${withoutVersion}`
}

async function copyRemoteImage(env, url, report) {
  const key = migratedKey(url)
  const existing = await env.MEDIA.head(key)
  if (!existing) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Could not download ${url} (${response.status})`)
    const type = (response.headers.get('Content-Type') || '').toLowerCase()
    if (!type.startsWith('image/')) throw new Error(`Not an image: ${url}`)
    const body = await response.arrayBuffer()
    if (body.byteLength > MAX_IMAGE_BYTES) throw new Error(`Image too large: ${url}`)
    await env.MEDIA.put(key, body, {
      httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' },
    })
    report.copiedImages += 1
  }
  return key
}

function insertStatement(env, table, columns, row) {
  const values = columns.map((column) => {
    const value = row[column]
    if (column === 'is_active') return value === false || value === 0 ? 0 : 1
    return value === undefined ? null : value
  })
  return env.DB.prepare(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
  ).bind(...values)
}

export async function handleImport(request, env) {
  const key = request.headers.get('X-Import-Key') || ''
  if (!key || (await sha256Hex(key)) !== IMPORT_KEY_SHA256) {
    return json({ error: 'Not found' }, 404)
  }

  const body = await readJson(request)
  const media = Array.isArray(body.media) ? body.media : []
  const videos = Array.isArray(body.videos) ? body.videos : []
  const texts = Array.isArray(body.texts) ? body.texts : []
  const setupTokens = Array.isArray(body.setupTokens) ? body.setupTokens : []
  const dryRun = body.dryRun === true

  await ensureSchema(env.DB)
  const report = { media: media.length, videos: videos.length, texts: texts.length, copiedImages: 0, rewritten: 0, setupTokens: 0, dryRun }

  for (const row of media) {
    if (isCloudinaryUrl(row.url)) {
      const objectKey = dryRun ? migratedKey(row.url) : await copyRemoteImage(env, row.url, report)
      row.url = `/media/${objectKey}`
      row.cloudinary_public_id = objectKey
      report.rewritten += 1
    }
  }

  for (const row of videos) {
    if (row.thumbnail_url && isCloudinaryUrl(row.thumbnail_url)) {
      const objectKey = dryRun ? migratedKey(row.thumbnail_url) : await copyRemoteImage(env, row.thumbnail_url, report)
      row.thumbnail_url = `/media/${objectKey}`
      report.rewritten += 1
    }
  }

  const statements = [
    env.DB.prepare('DELETE FROM site_media'),
    env.DB.prepare('DELETE FROM site_videos'),
    env.DB.prepare('DELETE FROM site_texts'),
    ...media.map((row) => insertStatement(env, 'site_media', MEDIA_COLUMNS, row)),
    ...videos.map((row) => insertStatement(env, 'site_videos', VIDEO_COLUMNS, row)),
    ...texts.map((row) => insertStatement(env, 'site_texts', TEXT_COLUMNS, row)),
  ]

  for (const token of setupTokens) {
    if (!/^[a-f0-9]{64}$/.test(token?.hash || '')) continue
    statements.push(
      env.DB.prepare(
        'INSERT OR IGNORE INTO admin_setup_tokens (token_hash, label, expires_at, created_at) VALUES (?, ?, ?, ?)',
      ).bind(token.hash, String(token.label || '').slice(0, 100), Number(token.expiresAt) || 0, Date.now()),
    )
    report.setupTokens += 1
  }

  if (!dryRun) await env.DB.batch(statements)

  const counts = await env.DB.prepare(
    `SELECT (SELECT COUNT(*) FROM site_media) AS media, (SELECT COUNT(*) FROM site_videos) AS videos,
            (SELECT COUNT(*) FROM site_texts) AS texts, (SELECT COUNT(*) FROM admin_users) AS admins,
            (SELECT COUNT(*) FROM admin_setup_tokens WHERE used_at IS NULL) AS openSetupTokens`,
  ).first()

  return json({ ok: true, report, counts })
}
