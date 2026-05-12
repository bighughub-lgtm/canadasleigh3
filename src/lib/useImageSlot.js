import { useEffect, useState } from 'react'
import { getImageSlot } from './cmsApi'
import { getImageSlotDefinition } from './mediaSlots'

function textFallback(item, field, fallback = '') {
  return item?.[`${field}_lv`] || item?.[`${field}_en`] || item?.[`${field}_ru`] || fallback
}

export function useImageSlot(slotId, fallbackUrl, fallbackAlt = '') {
  const slot = getImageSlotDefinition(slotId)
  const [media, setMedia] = useState(null)
  const safeFallbackUrl = fallbackUrl || slot?.fallbackUrl || ''
  const safeFallbackAlt = fallbackAlt || slot?.alt_lv || ''

  useEffect(() => {
    let mounted = true

    getImageSlot(slotId)
      .then((image) => {
        if (mounted && image?.url) setMedia(image)
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [slotId])

  return {
    media,
    src: media?.url || safeFallbackUrl,
    alt: textFallback(media, 'alt', safeFallbackAlt),
  }
}
