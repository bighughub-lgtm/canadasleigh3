export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  })
}

export async function readJson(request) {
  const type = request.headers.get('Content-Type') || ''
  if (!type.toLowerCase().includes('application/json')) {
    throw new HttpError(415, 'Gaidīts JSON pieprasījums.')
  }

  try {
    return await request.json()
  } catch {
    throw new HttpError(400, 'Nederīgs JSON.')
  }
}

// State-changing requests must come from this same site (CSRF protection on top of SameSite cookies)
export function assertSameOrigin(request) {
  const origin = request.headers.get('Origin')
  const requestOrigin = new URL(request.url).origin
  if (!origin || origin !== requestOrigin) {
    throw new HttpError(403, 'Pieprasījums no citas vietnes nav atļauts.')
  }
}

export function toBool(value) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

export function rowToApi(row) {
  if (!row) return row
  const result = { ...row }
  if ('is_active' in result) result.is_active = Boolean(result.is_active)
  return result
}

// Converts an API payload into a column/value list limited to the allowed columns
export function pickColumns(payload, allowed) {
  const columns = []
  const values = []

  for (const column of allowed) {
    if (!payload || !Object.prototype.hasOwnProperty.call(payload, column)) continue
    let value = payload[column]

    if (column === 'is_active') value = toBool(value) ? 1 : 0
    else if (column === 'sort_order' || column === 'width' || column === 'height') {
      value = value === null || value === '' || value === undefined ? null : Math.round(Number(value))
      if (value !== null && !Number.isFinite(value)) value = null
      if (column === 'sort_order' && value === null) value = 0
    } else if (value !== null && value !== undefined) {
      value = String(value)
      if (value.length > 4000) throw new HttpError(400, `Lauks ${column} ir pārāk garš.`)
    } else {
      value = null
    }

    columns.push(column)
    values.push(value)
  }

  return { columns, values }
}

export function nowIso() {
  return new Date().toISOString()
}
