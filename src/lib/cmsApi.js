import { supabase, supabaseConfigured } from './supabaseClient'

const MEDIA_COLUMNS = [
  'id',
  'section',
  'title_lv',
  'title_en',
  'title_ru',
  'title_lt',
  'title_est',
  'alt_lv',
  'alt_en',
  'alt_ru',
  'alt_lt',
  'alt_est',
  'url',
  'cloudinary_public_id',
  'width',
  'height',
  'format',
  'sort_order',
  'is_active',
  'created_at',
  'updated_at',
].join(',')

const VIDEO_COLUMNS = [
  'id',
  'title_lv',
  'title_en',
  'title_ru',
  'title_lt',
  'title_est',
  'description_lv',
  'description_en',
  'description_ru',
  'description_lt',
  'description_est',
  'video_url',
  'thumbnail_url',
  'sort_order',
  'is_active',
  'created_at',
  'updated_at',
].join(',')

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

async function runUpdates(updates) {
  const results = await Promise.all(updates)
  const failed = results.find((result) => result?.error)
  if (failed?.error) throw failed.error
}

function ensureClient() {
  if (!supabaseConfigured || !supabase) {
    throw new Error('Supabase nav nokonfigurēts.')
  }
  return supabase
}

export async function getActiveMedia(section) {
  if (!supabaseConfigured || !supabase) return []

  try {
    const { data, error } = await supabase
      .from('site_media')
      .select(MEDIA_COLUMNS)
      .eq('section', section)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) return []
    return safeArray(data)
  } catch {
    return []
  }
}

export async function getSectionImage(section) {
  const media = await getActiveMedia(section)
  return media[0] ?? null
}

export async function getImageSlot(slotId) {
  return getSectionImage(slotId)
}

export async function getActiveVideos() {
  if (!supabaseConfigured || !supabase) return []

  try {
    const { data, error } = await supabase
      .from('site_videos')
      .select(VIDEO_COLUMNS)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) return []
    return safeArray(data)
  } catch {
    return []
  }
}

export async function isCurrentUserAdmin(userId) {
  if (!userId) return false
  if (!supabaseConfigured || !supabase) return false

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id,email')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) return false
    return Boolean(data?.user_id)
  } catch {
    return false
  }
}

export async function adminListMedia(section) {
  const client = ensureClient()
  let query = client
    .from('site_media')
    .select(MEDIA_COLUMNS)
    .order('section', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (section) {
    query = query.eq('section', section)
  }

  const { data, error } = await query
  if (error) throw error
  return safeArray(data)
}

export async function normalizeMediaOrder(section) {
  const client = ensureClient()
  const normalized = normalizeOrderLocally(await adminListMedia(section))

  await runUpdates(
    normalized.map((item) =>
      client
        .from('site_media')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id),
    ),
  )

  return normalized
}

export async function moveMediaItem(section, id, direction) {
  const client = ensureClient()
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

  await runUpdates(
    updates.map((item) =>
      client
        .from('site_media')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id),
    ),
  )

  return updates
}

export async function adminCreateMedia(payload) {
  const client = ensureClient()
  const { data, error } = await client
    .from('site_media')
    .insert(payload)
    .select(MEDIA_COLUMNS)
    .single()

  if (error) throw error
  return data
}

export async function adminUpdateMedia(id, payload) {
  const client = ensureClient()
  const { data, error } = await client
    .from('site_media')
    .update(payload)
    .eq('id', id)
    .select(MEDIA_COLUMNS)
    .single()

  if (error) throw error
  return data
}

export async function adminDeleteMedia(id) {
  const client = ensureClient()
  const { error } = await client.from('site_media').delete().eq('id', id)
  if (error) throw error
}

export async function adminUpsertSectionImage(slotId, imageData) {
  const client = ensureClient()
  const existingRows = await adminListMedia(slotId)
  const primary = existingRows
    .slice()
    .sort((a, b) => {
      if (Boolean(a.is_active) !== Boolean(b.is_active)) return Boolean(b.is_active) - Boolean(a.is_active)
      return byOrderThenCreated(a, b)
    })[0]
  const payload = {
    ...imageData,
    section: slotId,
    sort_order: 1,
    is_active: true,
  }

  let saved

  if (primary) {
    const { data, error } = await client
      .from('site_media')
      .update(payload)
      .eq('id', primary.id)
      .select(MEDIA_COLUMNS)
      .single()

    if (error) throw error
    saved = data
  } else {
    const { data, error } = await client
      .from('site_media')
      .insert(payload)
      .select(MEDIA_COLUMNS)
      .single()

    if (error) throw error
    saved = data
  }

  const duplicateIds = existingRows
    .filter((item) => item.id !== saved.id)
    .map((item) => item.id)

  if (duplicateIds.length > 0) {
    const { error } = await client
      .from('site_media')
      .update({ is_active: false, sort_order: 2 })
      .in('id', duplicateIds)

    if (error) throw error
  }

  return saved
}

export async function adminListVideos() {
  const client = ensureClient()
  const { data, error } = await client
    .from('site_videos')
    .select(VIDEO_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw error
  return safeArray(data)
}

export async function normalizeVideosOrder() {
  const client = ensureClient()
  const normalized = normalizeOrderLocally(await adminListVideos())

  await runUpdates(
    normalized.map((video) =>
      client
        .from('site_videos')
        .update({ sort_order: video.sort_order })
        .eq('id', video.id),
    ),
  )

  return normalized
}

export async function moveVideoItem(id, direction) {
  const client = ensureClient()
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

  await runUpdates(
    updates.map((video) =>
      client
        .from('site_videos')
        .update({ sort_order: video.sort_order })
        .eq('id', video.id),
    ),
  )

  return updates
}

export async function adminCreateVideo(payload) {
  const client = ensureClient()
  const { data, error } = await client
    .from('site_videos')
    .insert(payload)
    .select(VIDEO_COLUMNS)
    .single()

  if (error) throw error
  return data
}

export async function adminUpdateVideo(id, payload) {
  const client = ensureClient()
  const { data, error } = await client
    .from('site_videos')
    .update(payload)
    .eq('id', id)
    .select(VIDEO_COLUMNS)
    .single()

  if (error) throw error
  return data
}

export async function adminDeleteVideo(id) {
  const client = ensureClient()
  const { error } = await client.from('site_videos').delete().eq('id', id)
  if (error) throw error
}
