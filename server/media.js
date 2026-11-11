// Serves CMS images stored in R2 (binding: MEDIA) at /media/<key>
export async function serveMedia({ request, env, params }) {
  const parts = Array.isArray(params.path) ? params.path : [params.path]
  const key = parts.filter(Boolean).join('/')

  const allowed = (key.startsWith('uploads/') || key.startsWith('migrated/')) && !key.includes('..')
  if (!env.MEDIA || !allowed) {
    return new Response('Not found', { status: 404 })
  }

  const object = await env.MEDIA.get(key, { onlyIf: request.headers })
  if (object === null) {
    return new Response('Not found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('ETag', object.httpEtag)
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('X-Content-Type-Options', 'nosniff')

  // onlyIf matched (e.g. If-None-Match): R2 returns the object without a body
  if (!('body' in object) || !object.body) {
    return new Response(null, { status: 304, headers })
  }

  return new Response(request.method === 'HEAD' ? null : object.body, { headers })
}
