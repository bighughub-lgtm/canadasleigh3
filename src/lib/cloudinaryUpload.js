import { supabase } from './supabaseClient'

export async function uploadImageToCloudinary(file, { folder = 'gallery' } = {}) {
  if (!file) throw new Error('Izvēlieties attēla failu.')
  if (!file.type?.startsWith('image/')) throw new Error('Augšupielādei der tikai attēli.')
  if (!supabase) throw new Error('Supabase nav nokonfigurēts.')

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  const accessToken = sessionData?.session?.access_token

  if (sessionError || !accessToken) {
    throw new Error('Lūdzu, piesakieties admin panelī vēlreiz.')
  }

  const signatureResponse = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ folder }),
  })

  const signatureData = await signatureResponse.json().catch(() => null)

  if (!signatureResponse.ok) {
    throw new Error(signatureData?.error || 'Neizdevās sagatavot attēla augšupielādi.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', signatureData.apiKey)
  formData.append('timestamp', signatureData.timestamp)
  formData.append('signature', signatureData.signature)
  formData.append('folder', signatureData.folder)

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  )

  const uploadData = await uploadResponse.json().catch(() => null)

  if (!uploadResponse.ok) {
    throw new Error(uploadData?.error?.message || 'Attēla augšupielāde neizdevās.')
  }

  return {
    secure_url: uploadData.secure_url,
    public_id: uploadData.public_id,
    width: uploadData.width,
    height: uploadData.height,
    format: uploadData.format,
  }
}
