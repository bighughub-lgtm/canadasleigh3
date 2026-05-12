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
