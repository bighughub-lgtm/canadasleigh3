const BASE_FOLDER = 'canadasleigh'
const ALLOWED_FOLDERS = new Set(['gallery', 'sections'])

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function requiredEnv(env, key) {
  const value = env[key]
  if (!value) throw new Error(`Missing ${key}`)
  return value
}

async function sha1Hex(input) {
  const bytes = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-1', bytes)
  return [...new Uint8Array(hashBuffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function buildSignatureParams(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

async function verifySupabaseUser(env, token) {
  const supabaseUrl = requiredEnv(env, 'SUPABASE_URL').replace(/\/$/, '')
  const supabaseAnonKey = requiredEnv(env, 'SUPABASE_ANON_KEY')

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) return null
  return response.json()
}

async function verifyAdmin(env, userId) {
  const supabaseUrl = requiredEnv(env, 'SUPABASE_URL').replace(/\/$/, '')
  const serviceRoleKey = requiredEnv(env, 'SUPABASE_SERVICE_ROLE_KEY')
  const query = new URLSearchParams({
    select: 'user_id',
    user_id: `eq.${userId}`,
    limit: '1',
  })

  const response = await fetch(`${supabaseUrl}/rest/v1/admin_users?${query.toString()}`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) return false
  const rows = await response.json()
  return Array.isArray(rows) && rows.length > 0
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return json({ ok: true })
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  try {
    const authHeader = request.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''

    if (!token) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const user = await verifySupabaseUser(env, token)
    if (!user?.id) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const isAdmin = await verifyAdmin(env, user.id)
    if (!isAdmin) {
      return json({ error: 'Forbidden' }, 403)
    }

    const body = await request.json().catch(() => ({}))
    const requestedFolder = ALLOWED_FOLDERS.has(body.folder) ? body.folder : 'gallery'
    const folder = `${BASE_FOLDER}/${requestedFolder}`
    const timestamp = Math.floor(Date.now() / 1000).toString()

    const cloudName = requiredEnv(env, 'CLOUDINARY_CLOUD_NAME')
    const apiKey = requiredEnv(env, 'CLOUDINARY_API_KEY')
    const apiSecret = requiredEnv(env, 'CLOUDINARY_API_SECRET')
    const signatureBase = buildSignatureParams({ folder, timestamp })
    const signature = await sha1Hex(`${signatureBase}${apiSecret}`)

    return json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
    })
  } catch (error) {
    return json({ error: error.message || 'Server error' }, 500)
  }
}
