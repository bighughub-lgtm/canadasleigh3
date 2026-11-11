// Uploads an image to the site's own storage (Cloudflare R2 via /api/admin/upload).
// Returns the same shape the admin screens used before: { secure_url, public_id, width, height, format }.

async function readImageSize(file) {
  try {
    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(file)
      const size = { width: bitmap.width, height: bitmap.height }
      bitmap.close?.()
      return size
    }
  } catch {
    // Some formats cannot be decoded in every browser; size is optional
  }
  return { width: null, height: null }
}

export async function uploadImage(file, { folder = 'gallery' } = {}) {
  if (!file) throw new Error('Izvēlieties attēla failu.')
  if (!file.type?.startsWith('image/')) throw new Error('Augšupielādei der tikai attēli.')

  const { width, height } = await readImageSize(file)
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  if (width) formData.append('width', String(width))
  if (height) formData.append('height', String(height))

  let response
  try {
    response = await fetch('/api/admin/upload', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    })
  } catch {
    throw new Error('Nav savienojuma ar serveri. Pārbaudiet internetu un mēģiniet vēlreiz.')
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || 'Attēla augšupielāde neizdevās.')
  }

  return data
}
