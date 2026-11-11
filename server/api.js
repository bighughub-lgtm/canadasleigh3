import {
  handleLogin,
  handleLogout,
  handleSession,
  handleSetup,
  handleSetupCheck,
  requireAdmin,
} from './auth.js'
import {
  adminBulkUpdateMedia,
  adminCreateMedia,
  adminCreateVideo,
  adminDeleteMedia,
  adminDeleteText,
  adminDeleteVideo,
  adminListMedia,
  adminListTexts,
  adminListVideos,
  adminOrderMedia,
  adminOrderVideos,
  adminUpdateMedia,
  adminUpdateText,
  adminUpdateVideo,
  adminUpload,
  adminUpsertTexts,
  publicMedia,
  publicTexts,
  publicVideos,
} from './cms.js'
import { HttpError, json } from './http.js'

function match(path, pattern) {
  const result = path.match(pattern)
  return result ? decodeURIComponent(result[1]) : null
}

async function routeAdmin(request, env, path, method) {
  await requireAdmin(request, env)
  let id

  // Media
  if (path === '/api/admin/media') {
    if (method === 'GET') return adminListMedia(request, env)
    if (method === 'POST') return adminCreateMedia(request, env)
  }
  if (path === '/api/admin/media/bulk-update' && method === 'POST') return adminBulkUpdateMedia(request, env)
  if (path === '/api/admin/media/order' && method === 'POST') return adminOrderMedia(request, env)
  if ((id = match(path, /^\/api\/admin\/media\/([^/]+)$/))) {
    if (method === 'PATCH') return adminUpdateMedia(request, env, id)
    if (method === 'DELETE') return adminDeleteMedia(request, env, id)
  }

  // Videos
  if (path === '/api/admin/videos') {
    if (method === 'GET') return adminListVideos(env)
    if (method === 'POST') return adminCreateVideo(request, env)
  }
  if (path === '/api/admin/videos/order' && method === 'POST') return adminOrderVideos(request, env)
  if ((id = match(path, /^\/api\/admin\/videos\/([^/]+)$/))) {
    if (method === 'PATCH') return adminUpdateVideo(request, env, id)
    if (method === 'DELETE') return adminDeleteVideo(request, env, id)
  }

  // Texts
  if (path === '/api/admin/texts' && method === 'GET') return adminListTexts(env)
  if (path === '/api/admin/texts/upsert' && method === 'POST') return adminUpsertTexts(request, env)
  if ((id = match(path, /^\/api\/admin\/texts\/([^/]+)$/))) {
    if (method === 'PATCH') return adminUpdateText(request, env, id)
    if (method === 'DELETE') return adminDeleteText(request, env, id)
  }

  // Image upload
  if (path === '/api/admin/upload' && method === 'POST') return adminUpload(request, env)

  return json({ error: 'Not found' }, 404)
}

async function dispatch(request, env) {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/+$/, '')
  const method = request.method

  // Public, read-only content (empty lists if the database is not ready, so the site uses its built-in content)
  if (method === 'GET' && path === '/api/cms/media') return publicMedia(env)
  if (method === 'GET' && path === '/api/cms/videos') return publicVideos(env)
  if (method === 'GET' && path === '/api/cms/texts') return publicTexts(env)

  if (!env.DB) return json({ error: 'Datubāze nav pieslēgta.' }, 500)

  // Account
  if (path === '/api/admin/session' && method === 'GET') return handleSession(request, env)
  if (path === '/api/admin/login' && method === 'POST') return handleLogin(request, env)
  if (path === '/api/admin/logout' && method === 'POST') return handleLogout(request, env)
  if (path === '/api/admin/setup' && method === 'GET') return handleSetupCheck(request, env)
  if (path === '/api/admin/setup' && method === 'POST') return handleSetup(request, env)

  if (path.startsWith('/api/admin/')) return routeAdmin(request, env, path, method)

  return json({ error: 'Not found' }, 404)
}

export async function handleApi({ request, env }) {
  try {
    return await dispatch(request, env)
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status)
    console.error('API error', error)
    return json({ error: 'Servera kļūda. Mēģiniet vēlreiz.' }, 500)
  }
}
