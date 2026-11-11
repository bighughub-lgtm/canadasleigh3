import {
  MEDIA_COLUMNS,
  MEDIA_WRITABLE,
  TEXT_COLUMNS,
  TEXT_WRITABLE,
  VIDEO_COLUMNS,
  VIDEO_WRITABLE,
} from './schema.js'
import { HttpError, assertSameOrigin, json, nowIso, pickColumns, readJson, rowToApi } from './http.js'

const MEDIA_SELECT = `SELECT ${MEDIA_COLUMNS.join(', ')} FROM site_media`
const VIDEO_SELECT = `SELECT ${VIDEO_COLUMNS.join(', ')} FROM site_videos`
const TEXT_SELECT = `SELECT ${TEXT_COLUMNS.join(', ')} FROM site_texts`

const UPLOAD_FOLDERS = new Set(['gallery', 'sections', 'product-galleries'])
const UPLOAD_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

function rows(result) {
  return (result?.results || []).map(rowToApi)
}

// ---------- Public (read-only, active rows) ----------

export async function publicMedia(env) {
  try {
    const result = await env.DB.prepare(
      `${MEDIA_SELECT} WHERE is_active = 1 ORDER BY section ASC, sort_order ASC, created_at ASC`,
    ).all()
    return json({ items: rows(result) })
  } catch {
    return json({ items: [] })
  }
}

export async function publicVideos(env) {
  try {
    const result = await env.DB.prepare(
      `${VIDEO_SELECT} WHERE is_active = 1 ORDER BY sort_order ASC, created_at ASC`,
    ).all()
    return json({ items: rows(result) })
  } catch {
    return json({ items: [] })
  }
}

export async function publicTexts(env) {
  try {
    const result = await env.DB.prepare(
      `${TEXT_SELECT} WHERE is_active = 1 ORDER BY group_id ASC, text_key ASC`,
    ).all()
    return json({ items: rows(result) })
  } catch {
    return json({ items: [] })
  }
}

// ---------- Admin: media ----------

async function getMediaRow(env, id) {
  const row = await env.DB.prepare(`${MEDIA_SELECT} WHERE id = ?`).bind(id).first()
  if (!row) throw new HttpError(404, 'Ieraksts nav atrasts.')
  return rowToApi(row)
}

export async function adminListMedia(request, env) {
  const section = new URL(request.url).searchParams.get('section')
  const statement = section
    ? env.DB.prepare(`${MEDIA_SELECT} WHERE section = ? ORDER BY section ASC, sort_order ASC, created_at DESC`).bind(section)
    : env.DB.prepare(`${MEDIA_SELECT} ORDER BY section ASC, sort_order ASC, created_at DESC`)
  return json({ items: rows(await statement.all()) })
}

export async function adminCreateMedia(request, env) {
  assertSameOrigin(request)
  const payload = await readJson(request)
  const { columns, values } = pickColumns(payload, MEDIA_WRITABLE)
  if (!payload.section || !payload.url) throw new HttpError(400, 'Trūkst sadaļas vai attēla adreses.')

  const id = crypto.randomUUID()
  const now = nowIso()
  const allColumns = ['id', ...columns, 'created_at', 'updated_at']
  const placeholders = allColumns.map(() => '?').join(', ')
  await env.DB.prepare(`INSERT INTO site_media (${allColumns.join(', ')}) VALUES (${placeholders})`)
    .bind(id, ...values, now, now)
    .run()

  return json({ item: await getMediaRow(env, id) })
}

export async function adminUpdateMedia(request, env, id) {
  assertSameOrigin(request)
  const payload = await readJson(request)
  const { columns, values } = pickColumns(payload, MEDIA_WRITABLE)

  if (columns.length > 0) {
    const assignments = [...columns.map((column) => `${column} = ?`), 'updated_at = ?'].join(', ')
    const result = await env.DB.prepare(`UPDATE site_media SET ${assignments} WHERE id = ?`)
      .bind(...values, nowIso(), id)
      .run()
    if (!result.meta?.changes) throw new HttpError(404, 'Ieraksts nav atrasts.')
  }

  return json({ item: await getMediaRow(env, id) })
}

export async function adminDeleteMedia(request, env, id) {
  assertSameOrigin(request)
  // Only the list entry is removed; the stored file stays in R2 (same as before with Cloudinary)
  await env.DB.prepare('DELETE FROM site_media WHERE id = ?').bind(id).run()
  return json({ ok: true })
}

export async function adminBulkUpdateMedia(request, env) {
  assertSameOrigin(request)
  const body = await readJson(request)
  const ids = Array.isArray(body.ids) ? body.ids.filter((id) => typeof id === 'string').slice(0, 500) : []
  const { columns, values } = pickColumns(body.patch, ['sort_order', 'is_active'])
  if (ids.length === 0 || columns.length === 0) return json({ ok: true })

  const assignments = [...columns.map((column) => `${column} = ?`), 'updated_at = ?'].join(', ')
  const now = nowIso()
  await env.DB.batch(
    ids.map((id) => env.DB.prepare(`UPDATE site_media SET ${assignments} WHERE id = ?`).bind(...values, now, id)),
  )
  return json({ ok: true })
}

async function applyOrder(request, env, table) {
  assertSameOrigin(request)
  const body = await readJson(request)
  const items = Array.isArray(body.items) ? body.items.slice(0, 500) : []
  const now = nowIso()
  const statements = items
    .filter((item) => item && typeof item.id === 'string' && Number.isFinite(Number(item.sort_order)))
    .map((item) =>
      env.DB.prepare(`UPDATE ${table} SET sort_order = ?, updated_at = ? WHERE id = ?`)
        .bind(Math.round(Number(item.sort_order)), now, item.id),
    )
  if (statements.length > 0) await env.DB.batch(statements)
  return json({ ok: true })
}

export function adminOrderMedia(request, env) {
  return applyOrder(request, env, 'site_media')
}

// ---------- Admin: videos ----------

async function getVideoRow(env, id) {
  const row = await env.DB.prepare(`${VIDEO_SELECT} WHERE id = ?`).bind(id).first()
  if (!row) throw new HttpError(404, 'Ieraksts nav atrasts.')
  return rowToApi(row)
}

export async function adminListVideos(env) {
  const result = await env.DB.prepare(`${VIDEO_SELECT} ORDER BY sort_order ASC, created_at DESC`).all()
  return json({ items: rows(result) })
}

export async function adminCreateVideo(request, env) {
  assertSameOrigin(request)
  const payload = await readJson(request)
  if (!payload.video_url) throw new HttpError(400, 'Trūkst video saites.')
  const { columns, values } = pickColumns(payload, VIDEO_WRITABLE)
  const id = crypto.randomUUID()
  const now = nowIso()
  const allColumns = ['id', ...columns, 'created_at', 'updated_at']
  await env.DB.prepare(
    `INSERT INTO site_videos (${allColumns.join(', ')}) VALUES (${allColumns.map(() => '?').join(', ')})`,
  )
    .bind(id, ...values, now, now)
    .run()
  return json({ item: await getVideoRow(env, id) })
}

export async function adminUpdateVideo(request, env, id) {
  assertSameOrigin(request)
  const payload = await readJson(request)
  const { columns, values } = pickColumns(payload, VIDEO_WRITABLE)
  if (columns.length > 0) {
    const assignments = [...columns.map((column) => `${column} = ?`), 'updated_at = ?'].join(', ')
    const result = await env.DB.prepare(`UPDATE site_videos SET ${assignments} WHERE id = ?`)
      .bind(...values, nowIso(), id)
      .run()
    if (!result.meta?.changes) throw new HttpError(404, 'Ieraksts nav atrasts.')
  }
  return json({ item: await getVideoRow(env, id) })
}

export async function adminDeleteVideo(request, env, id) {
  assertSameOrigin(request)
  await env.DB.prepare('DELETE FROM site_videos WHERE id = ?').bind(id).run()
  return json({ ok: true })
}

export function adminOrderVideos(request, env) {
  return applyOrder(request, env, 'site_videos')
}

// ---------- Admin: texts ----------

async function getTextRow(env, key) {
  const row = await env.DB.prepare(`${TEXT_SELECT} WHERE text_key = ?`).bind(key).first()
  if (!row) throw new HttpError(404, 'Teksts nav atrasts.')
  return rowToApi(row)
}

export async function adminListTexts(env) {
  const result = await env.DB.prepare(`${TEXT_SELECT} ORDER BY group_id ASC, text_key ASC`).all()
  return json({ items: rows(result) })
}

export async function adminUpsertTexts(request, env) {
  assertSameOrigin(request)
  const body = await readJson(request)
  const list = (Array.isArray(body.rows) ? body.rows : [body.row]).filter(Boolean).slice(0, 500)
  const now = nowIso()
  const statements = []
  const keys = []

  for (const payload of list) {
    const key = String(payload.text_key || '').trim()
    if (!key || key.length > 200) throw new HttpError(400, 'Trūkst teksta atslēgas.')
    const { columns, values } = pickColumns(payload, TEXT_WRITABLE)
    const insertColumns = ['text_key', ...columns, 'created_at', 'updated_at']
    const updates = [...columns.map((column) => `${column} = excluded.${column}`), 'updated_at = excluded.updated_at']
    statements.push(
      env.DB.prepare(
        `INSERT INTO site_texts (${insertColumns.join(', ')}) VALUES (${insertColumns.map(() => '?').join(', ')})
         ON CONFLICT(text_key) DO UPDATE SET ${updates.join(', ')}`,
      ).bind(key, ...values, now, now),
    )
    keys.push(key)
  }

  if (statements.length > 0) await env.DB.batch(statements)
  const saved = await Promise.all(keys.map((key) => getTextRow(env, key)))
  return json({ items: saved })
}

export async function adminUpdateText(request, env, key) {
  assertSameOrigin(request)
  const payload = await readJson(request)
  const { columns, values } = pickColumns(payload, TEXT_WRITABLE)
  if (columns.length > 0) {
    const assignments = [...columns.map((column) => `${column} = ?`), 'updated_at = ?'].join(', ')
    const result = await env.DB.prepare(`UPDATE site_texts SET ${assignments} WHERE text_key = ?`)
      .bind(...values, nowIso(), key)
      .run()
    if (!result.meta?.changes) throw new HttpError(404, 'Teksts nav atrasts.')
  }
  return json({ item: await getTextRow(env, key) })
}

export async function adminDeleteText(request, env, key) {
  assertSameOrigin(request)
  await env.DB.prepare('DELETE FROM site_texts WHERE text_key = ?').bind(key).run()
  return json({ ok: true })
}

// ---------- Admin: image upload to R2 ----------

export async function adminUpload(request, env) {
  assertSameOrigin(request)
  if (!env.MEDIA) throw new HttpError(500, 'Bilžu glabātuve nav pieslēgta.')

  let form
  try {
    form = await request.formData()
  } catch {
    throw new HttpError(400, 'Nederīgs augšupielādes pieprasījums.')
  }

  const file = form.get('file')
  if (!file || typeof file === 'string') throw new HttpError(400, 'Izvēlieties attēla failu.')

  const type = String(file.type || '').toLowerCase()
  const extension = UPLOAD_TYPES[type]
  if (!extension) throw new HttpError(415, 'Augšupielādei der tikai JPG, PNG, WEBP, AVIF vai GIF attēli.')
  if (file.size > MAX_UPLOAD_BYTES) throw new HttpError(413, 'Attēls ir pārāk liels (maksimums 20 MB).')

  const folderValue = String(form.get('folder') || 'gallery')
  const folder = UPLOAD_FOLDERS.has(folderValue) ? folderValue : 'gallery'
  const year = new Date().getUTCFullYear()
  const key = `uploads/${folder}/${year}/${crypto.randomUUID()}.${extension}`

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' },
  })

  const toDimension = (value) => {
    const number = Math.round(Number(value))
    return Number.isFinite(number) && number > 0 && number < 100000 ? number : null
  }

  return json({
    secure_url: `/media/${key}`,
    public_id: key,
    width: toDimension(form.get('width')),
    height: toDimension(form.get('height')),
    format: extension,
  })
}
