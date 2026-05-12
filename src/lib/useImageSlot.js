import { useEffect, useState } from 'react'
import { getImageSlot } from './cmsApi'
import { getImageSlotDefinition } from './mediaSlots'

function textFallback(item, field, fallback = '') {
  return item?.[`${field}_lv`] || item?.[`${field}_en`] || item?.[`${field}_ru`] || fallback
}

export function useImageSlot(slotId, fallbackUrl, fallbackAlt = '', options = {}) {
  const slot = getImageSlotDefinition(slotId)
  const [media, setMedia] = useState(null)
  const legacySlotId = options.legacySlotId
  const safeFallbackUrl = fallbackUrl || slot?.fallbackUrl || ''
  const safeFallbackAlt = fallbackAlt || slot?.alt_lv || ''

  useEffect(() => {
    let mounted = true

    async function loadSlot() {
      const image = await getImageSlot(slotId)
      if (image?.url || !legacySlotId) return image
      return getImageSlot(legacySlotId)
    }

    loadSlot()
      .then((image) => {
        if (mounted && image?.url) setMedia(image)
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [legacySlotId, slotId])

  return {
    media,
    src: media?.url || safeFallbackUrl,
    alt: textFallback(media, 'alt', safeFallbackAlt),
  }
}
