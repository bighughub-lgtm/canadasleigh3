import { HttpError, assertSameOrigin, json, nowIso, readJson } from './http.js'

const SESSION_COOKIE = 'cs_admin_session'
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60
const PBKDF2_ITERATIONS = 100000 // Cloudflare Workers maximum
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_FAILURES = 10
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const encoder = new TextEncoder()

function toBase64(bytes) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
}

function toBase64Url(bytes) {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function randomToken(byteLength = 32) {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)))
}

export async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function derivePassword(password, saltBytes, iterations) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations },
    key,
    256,
  )
  return new Uint8Array(bits)
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let index = 0; index < a.length; index += 1) diff |= a[index] ^ b[index]
  return diff === 0
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derivePassword(password, salt, PBKDF2_ITERATIONS)
  return { hash: toBase64(hash), salt: toBase64(salt), iterations: PBKDF2_ITERATIONS }
}

async function verifyPassword(password, user) {
  const expected = fromBase64(user.password_hash)
  const actual = await derivePassword(password, fromBase64(user.password_salt), user.password_iterations)
  return timingSafeEqual(actual, expected)
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') || ''
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return rest.join('=')
  }
  return ''
}

function sessionCookie(token, maxAge) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`
}

function clientKey(request) {
  return `ip:${request.headers.get('CF-Connecting-IP') || 'local'}`
}

function validateCredentials(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanPassword = String(password || '')

  if (!EMAIL_PATTERN.test(cleanEmail) || cleanEmail.length > 200) {
    throw new HttpError(400, 'Ievadiet derīgu e-pasta adresi.')
  }

  if (cleanPassword.length < 10 || cleanPassword.length > 200) {
    throw new HttpError(400, 'Parolei jābūt vismaz 10 rakstzīmes garai.')
  }

  return { email: cleanEmail, password: cleanPassword }
}

async function createSession(db, userId) {
  const token = randomToken()
  const now = Date.now()
  await db
    .prepare('INSERT INTO admin_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .bind(await sha256Hex(token), userId, now + SESSION_TTL_SECONDS * 1000, now)
    .run()
  return token
}

export async function getSessionUser(request, env) {
  const token = readCookie(request, SESSION_COOKIE)
  if (!token || token.length > 100) return null

  const row = await env.DB.prepare(
    `SELECT s.user_id, s.expires_at, u.email
       FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ?`,
  )
    .bind(await sha256Hex(token))
    .first()

  if (!row) return null

  if (row.expires_at < Date.now()) {
    await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run()
    return null
  }

  return { id: row.user_id, email: row.email }
}

export async function requireAdmin(request, env) {
  const user = await getSessionUser(request, env)
  if (!user) throw new HttpError(401, 'Lūdzu, piesakieties admin panelī vēlreiz.')
  return user
}

export async function handleSession(request, env) {
  const user = await getSessionUser(request, env)
  return json({ email: user ? user.email : null })
}

export async function handleLogin(request, env) {
  assertSameOrigin(request)
  const body = await readJson(request)
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const key = clientKey(request)
  const now = Date.now()

  const attempts = await env.DB.prepare(
    'SELECT COUNT(*) AS total FROM admin_login_attempts WHERE attempt_key = ? AND created_at > ?',
  )
    .bind(key, now - LOGIN_WINDOW_MS)
    .first()

  if ((attempts?.total || 0) >= LOGIN_MAX_FAILURES) {
    return json({ error: 'Pārāk daudz neveiksmīgu mēģinājumu. Mēģiniet vēlreiz pēc 15 minūtēm.' }, 429)
  }

  const user = email
    ? await env.DB.prepare('SELECT * FROM admin_users WHERE email = ?').bind(email).first()
    : null

  let valid = false
  if (user && password) {
    valid = await verifyPassword(password, user)
  } else {
    // Same amount of work when the user does not exist
    await derivePassword(password || 'x', new Uint8Array(16), PBKDF2_ITERATIONS)
  }

  if (!valid) {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO admin_login_attempts (attempt_key, created_at) VALUES (?, ?)').bind(key, now),
      env.DB.prepare('DELETE FROM admin_login_attempts WHERE created_at < ?').bind(now - 24 * 60 * 60 * 1000),
    ])
    return json({ error: 'Nepareizs e-pasts vai parole.' }, 401)
  }

  await env.DB.batch([
    env.DB.prepare('DELETE FROM admin_login_attempts WHERE attempt_key = ?').bind(key),
    env.DB.prepare('UPDATE admin_users SET last_login_at = ? WHERE id = ?').bind(nowIso(), user.id),
    env.DB.prepare('DELETE FROM admin_sessions WHERE expires_at < ?').bind(now),
  ])

  const token = await createSession(env.DB, user.id)
  return json({ email: user.email }, 200, { 'Set-Cookie': sessionCookie(token, SESSION_TTL_SECONDS) })
}

export async function handleLogout(request, env) {
  assertSameOrigin(request)
  const token = readCookie(request, SESSION_COOKIE)
  if (token && token.length <= 100) {
    await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run()
  }
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0) })
}

async function findSetupToken(env, token) {
  if (!token || typeof token !== 'string' || token.length > 100) return null
  return env.DB.prepare(
    'SELECT token_hash FROM admin_setup_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?',
  )
    .bind(await sha256Hex(token), Date.now())
    .first()
}

export async function handleSetupCheck(request, env) {
  const token = new URL(request.url).searchParams.get('token') || ''
  const row = await findSetupToken(env, token)
  return json({ valid: Boolean(row) })
}

export async function handleSetup(request, env) {
  assertSameOrigin(request)
  const body = await readJson(request)
  const row = await findSetupToken(env, body.token)
  if (!row) {
    return json({ error: 'Šī saite vairs nav derīga. Palūdziet jaunu saiti.' }, 410)
  }

  const { email, password } = validateCredentials(body.email, body.password)
  const existing = await env.DB.prepare('SELECT id FROM admin_users WHERE email = ?').bind(email).first()
  if (existing) {
    return json({ error: 'Šim e-pastam konts jau ir izveidots. Piesakieties ar savu paroli.' }, 409)
  }

  // Use the token exactly once, even if two requests arrive together
  const claim = await env.DB.prepare(
    'UPDATE admin_setup_tokens SET used_at = ? WHERE token_hash = ? AND used_at IS NULL',
  )
    .bind(Date.now(), row.token_hash)
    .run()

  if (!claim.meta?.changes) {
    return json({ error: 'Šī saite vairs nav derīga. Palūdziet jaunu saiti.' }, 410)
  }

  const userId = crypto.randomUUID()
  const hashed = await hashPassword(password)
  await env.DB.prepare(
    `INSERT INTO admin_users (id, email, password_hash, password_salt, password_iterations, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(userId, email, hashed.hash, hashed.salt, hashed.iterations, nowIso())
    .run()

  const token = await createSession(env.DB, userId)
  return json({ email }, 200, { 'Set-Cookie': sessionCookie(token, SESSION_TTL_SECONDS) })
}
