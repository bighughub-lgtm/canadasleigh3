// CMS data access. Content lives in Cloudflare D1 behind the site's own /api endpoints
// (Pages Functions in /functions + /server). Public reads never throw: on any error the
// site keeps its built-in fallback content.

function safeArray(data) {
  return Array.isArray(data) ? data : []
}

function byOrderThenCreated(a, b) {
  const orderDiff = (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)
  if (orderDiff !== 0) return orderDiff
  return String(a.created_at || '').localeCompare(String(b.created_at || ''))
}

function normalizeOrderLocally(items) {
  return safeArray(items)
    .slice()
    .sort(byOrderThenCreated)
    .map((item, index) => ({ ...item, sort_order: index + 1 }))
}

async function fetchPublicList(url) {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!response.ok) return []
    const data = await response.json()
    return safeArray(data?.items)
  } catch {
    return []
  }
}

async function adminRequest(method, path, body) {
  const options = {
    method,
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  }

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(path, options)
  } catch {
    throw new Error('Nav savienojuma ar serveri. Pārbaudiet internetu un mēģiniet vēlreiz.')
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(data?.error || 'Darbība neizdevās. Mēģiniet vēlreiz.')
    error.status = response.status
    throw error
  }

  return data
}

// ---------- Public site ----------

let activeMediaPromise = null

export async function getActiveMedia(section) {
  if (!activeMediaPromise) activeMediaPromise = fetchPublicList('/api/cms/media')
  const items = await activeMediaPromise
  return items.filter((item) => item.section === section)
}

export async function getSectionImage(section) {
  const media = await getActiveMedia(section)
  return media[0] ?? null
}

export async function getImageSlot(slotId) {
  return getSectionImage(slotId)
}

export async function getActiveVideos() {
  return fetchPublicList('/api/cms/videos')
}

let textOverridesPromise = null

export async function getActiveTextOverrides() {
  if (!textOverridesPromise) textOverridesPromise = fetchPublicList('/api/cms/texts')
  return textOverridesPromise
}

// ---------- Admin account ----------

export async function getAdminSession() {
  try {
    const response = await fetch('/api/admin/session', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
    if (!response.ok) return null
    const data = await response.json()
    return data?.email ? { email: data.email } : null
  } catch {
    return null
  }
}

export async function adminLogin(email, password) {
  return adminRequest('POST', '/api/admin/login', { email, password })
}

export async function adminLogout() {
  try {
    await adminRequest('POST', '/api/admin/logout', {})
  } catch {
    // Signing out locally is enough when the server is unreachable
  }
}

export async function checkSetupToken(token) {
  try {
    const response = await fetch(`/api/admin/setup?token=${encodeURIComponent(token)}`, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return false
    const data = await response.json()
    return Boolean(data?.valid)
  } catch {
    return false
  }
}

export async function adminCompleteSetup(token, email, password) {
  return adminRequest('POST', '/api/admin/setup', { token, email, password })
}

// ---------- Admin: media ----------

export async function adminListMedia(section) {
  const query = section ? `?section=${encodeURIComponent(section)}` : ''
  const data = await adminRequest('GET', `/api/admin/media${query}`)
  return safeArray(data?.items)
}

export async function adminListMediaBySection(section) {
  return adminListMedia(section)
}

async function saveMediaOrder(items) {
  await adminRequest('POST', '/api/admin/media/order', {
    items: items.map((item) => ({ id: item.id, sort_order: item.sort_order })),
  })
}

export async function normalizeMediaOrder(section) {
  const normalized = normalizeOrderLocally(await adminListMedia(section))
  await saveMediaOrder(normalized)
  return normalized
}

export async function moveMediaItem(section, id, direction) {
  const normalized = normalizeOrderLocally(await adminListMedia(section))
  const currentIndex = normalized.findIndex((item) => item.id === id)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= normalized.length) {
    return normalized
  }

  const reordered = normalized.slice()
  const [moved] = reordered.splice(currentIndex, 1)
  reordered.splice(targetIndex, 0, moved)

  const updates = reordered.map((item, index) => ({ ...item, sort_order: index + 1 }))
  await saveMediaOrder(updates)
  return updates
}

export async function adminMoveMediaItem(section, id, direction) {
  return moveMediaItem(section, id, direction)
}

export async function adminCreateMedia(payload) {
  const data = await adminRequest('POST', '/api/admin/media', payload)
  return data?.item
}

export async function adminAddGalleryImage(section, imageData) {
  const normalized = normalizeOrderLocally(await adminListMedia(section))
  const saved = await adminCreateMedia({
    ...imageData,
    section,
    sort_order: normalized.length + 1,
    is_active: imageData.is_active ?? true,
  })

  await normalizeMediaOrder(section)
  return saved
}

export async function adminUpdateMedia(id, payload) {
  const data = await adminRequest('PATCH', `/api/admin/media/${encodeURIComponent(id)}`, payload)
  return data?.item
}

export async function adminDeleteMedia(id) {
  await adminRequest('DELETE', `/api/admin/media/${encodeURIComponent(id)}`)
}

async function bulkUpdateMedia(ids, patch) {
  if (ids.length === 0) return
  await adminRequest('POST', '/api/admin/media/bulk-update', { ids, patch })
}

function rankSlotRows(rows) {
  return rows.slice().sort((a, b) => {
    if (Boolean(a.is_active) !== Boolean(b.is_active)) return Boolean(b.is_active) - Boolean(a.is_active)
    return byOrderThenCreated(a, b)
  })
}

export async function deactivateDuplicateActiveSlotRows(slotId) {
  const [primary, ...duplicates] = rankSlotRows(await adminListMedia(slotId))
  if (!primary) return null

  const saved = await adminUpdateMedia(primary.id, { is_active: true, sort_order: 1 })
  await bulkUpdateMedia(duplicates.map((item) => item.id), { is_active: false, sort_order: 2 })
  return saved
}

export async function adminUpsertSectionImage(slotId, imageData) {
  const existingRows = await adminListMedia(slotId)
  const primary = rankSlotRows(existingRows)[0]
  const payload = {
    ...imageData,
    section: slotId,
    sort_order: 1,
    is_active: true,
  }

  const saved = primary ? await adminUpdateMedia(primary.id, payload) : await adminCreateMedia(payload)

  await bulkUpdateMedia(
    existingRows.filter((item) => item.id !== saved.id).map((item) => item.id),
    { is_active: false, sort_order: 2 },
  )

  return saved
}

// ---------- Admin: videos ----------

export async function adminListVideos() {
  const data = await adminRequest('GET', '/api/admin/videos')
  return safeArray(data?.items)
}

async function saveVideoOrder(items) {
  await adminRequest('POST', '/api/admin/videos/order', {
    items: items.map((item) => ({ id: item.id, sort_order: item.sort_order })),
  })
}

export async function normalizeVideosOrder() {
  const normalized = normalizeOrderLocally(await adminListVideos())
  await saveVideoOrder(normalized)
  return normalized
}

export async function moveVideoItem(id, direction) {
  const normalized = normalizeOrderLocally(await adminListVideos())
  const currentIndex = normalized.findIndex((video) => video.id === id)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= normalized.length) {
    return normalized
  }

  const reordered = normalized.slice()
  const [moved] = reordered.splice(currentIndex, 1)
  reordered.splice(targetIndex, 0, moved)

  const updates = reordered.map((video, index) => ({ ...video, sort_order: index + 1 }))
  await saveVideoOrder(updates)
  return updates
}

export async function adminCreateVideo(payload) {
  const data = await adminRequest('POST', '/api/admin/videos', payload)
  return data?.item
}

export async function adminUpdateVideo(id, payload) {
  const data = await adminRequest('PATCH', `/api/admin/videos/${encodeURIComponent(id)}`, payload)
  return data?.item
}

export async function adminDeleteVideo(id) {
  await adminRequest('DELETE', `/api/admin/videos/${encodeURIComponent(id)}`)
}

// ---------- Admin: texts ----------

export async function adminListTexts() {
  const data = await adminRequest('GET', '/api/admin/texts')
  return safeArray(data?.items)
}

export async function adminUpsertText(payload) {
  const data = await adminRequest('POST', '/api/admin/texts/upsert', { row: payload })
  return safeArray(data?.items)[0]
}

export async function adminUpdateText(key, payload) {
  const data = await adminRequest('PATCH', `/api/admin/texts/${encodeURIComponent(key)}`, payload)
  return data?.item
}

export async function adminResetTextOverride(key) {
  return adminUpdateText(key, {
    value_lv: null,
    value_en: null,
    value_ru: null,
    is_active: true,
  })
}

export async function adminDeleteText(key) {
  await adminRequest('DELETE', `/api/admin/texts/${encodeURIComponent(key)}`)
}

export async function adminBulkUpsertTextDefaults(items) {
  const rows = safeArray(items).map((item) => ({
    text_key: item.key ?? item.text_key,
    group_id: item.group_id,
    label_lv: item.label_lv,
    description_lv: item.description_lv ?? null,
    input_type: item.input_type ?? 'text',
    default_lv: item.default_lv ?? '',
    default_en: item.default_en ?? '',
    default_ru: item.default_ru ?? '',
    is_active: item.is_active ?? true,
  }))

  if (rows.length === 0) return []
  const data = await adminRequest('POST', '/api/admin/texts/upsert', { rows })
  return safeArray(data?.items)
}
