import './Gallery.css'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const fallbackGalleryImages = [
  {
    src: '/DSC06432.jpg',
    alt: 'Canada Pulkan ragavas reālā meža maršrutā',
    title: 'Meža maršruts',
    sort_order: 1,
  },
  {
    src: '/KRJ02427.jpg',
    alt: 'Ragavas skarbā apvidū',
    title: 'Apvidus darbs',
    sort_order: 2,
  },
  {
    src: '/KRJ02257.jpg',
    alt: 'Ragavas pārvietošanas brīdī',
    title: 'Vilcēja līnija',
    sort_order: 3,
  },
  {
    src: '/hngfbdv.jpg',
    alt: 'Ragavas meža un lauka apstākļos',
    title: 'Pārvadājums dabā',
    sort_order: 4,
  },
  {
    src: '/rtdgf.jpg',
    alt: 'Tuvplāna kadrs ar ragavām dabiskā vidē',
    title: 'Tuvplāna kadrs',
    sort_order: 5,
  },
  {
    src: '/yuthgdf.jpg',
    alt: 'Ragavas mežā un smaguma transportēšanā',
    title: 'Noslēdzošais kadrs',
    sort_order: 6,
  },
  {
    src: '/DSC06417.jpg',
    alt: 'Canada Pulkan ragavas slīpākā meža posmā',
    title: 'Stāvā trase',
    sort_order: 7,
  },
  {
    src: '/KRJ02364.jpg',
    alt: 'Ragavas smaguma pārvietošanai mežā',
    title: 'Meža transportēšana',
    sort_order: 8,
  },
  {
    src: '/htgbfdf.jpg',
    alt: 'Ragavas nelīdzenā reljefā',
    title: 'Nelīdzens reljefs',
    sort_order: 9,
  },
  {
    src: '/KRJ01743.jpg',
    alt: 'Ragavas smagākai kravai apvidū',
    title: 'Kravas maršruts',
    sort_order: 10,
  },
  {
    src: '/thrgdf.jpg',
    alt: 'Ragavas autentiskā lietošanā dabā',
    title: 'Pierādīta lietošana',
    sort_order: 11,
  },
  {
    src: '/ytr.jpg',
    alt: 'Vertikāls bezceļa kadrs ar ragavām',
    title: 'Bezceļa aina',
    sort_order: 12,
  },
]

const galleryText = {
  count: (count) => `Galerijā redzami ${count} attēli.`,
  openFullscreen: 'Atvērt pilnekrāna galeriju',
  close: 'Aizvērt',
  previous: 'Iepriekšējais attēls',
  next: 'Nākamais attēls',
  zoom: 'Tālummaiņa',
  image: (number) => `Attēls ${String(number).padStart(2, '0')}`,
}

function textFallback(item, field, fallback = '') {
  return item[`${field}_lv`] || item[`${field}_en`] || item[`${field}_ru`] || fallback
}

function normalizeGalleryImages(items) {
  return items
    .filter((item) => item?.src || item?.url)
    .map((item, index) => {
      const src = item.src || item.url
      const title = item.title || textFallback(item, 'title', '')
      const alt = item.alt || textFallback(item, 'alt', title || galleryText.image(index + 1))

      return {
        src,
        title: title || alt || galleryText.image(index + 1),
        alt: alt || title || galleryText.image(index + 1),
        sort_order: Number(item.sort_order) || index + 1,
      }
    })
    .sort((a, b) => a.sort_order - b.sort_order)
}

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState(() => normalizeGalleryImages(fallbackGalleryImages))
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [brokenSources, setBrokenSources] = useState(() => new Set())
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })

  useEffect(() => {
    let active = true

    import('../lib/cmsApi')
      .then(({ getActiveMedia }) => getActiveMedia('gallery'))
      .then((media) => {
        if (!active || media.length === 0) return
        setGalleryImages(normalizeGalleryImages(media))
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  const visibleImages = useMemo(
    () => galleryImages.filter((image) => image.src && !brokenSources.has(image.src)),
    [brokenSources, galleryImages],
  )

  const selectedImage = visibleImages[selectedIndex] || visibleImages[0] || null

  const resetZoom = useCallback(() => {
    setZoom(100)
    setPan({ x: 0, y: 0 })
    dragRef.current.active = false
    dragRef.current.moved = false
  }, [])

  const selectImage = useCallback((index) => {
    setSelectedIndex(index)
    resetZoom()
  }, [resetZoom])

  useEffect(() => {
    if (selectedIndex >= visibleImages.length) {
      setSelectedIndex(0)
      resetZoom()
    }
  }, [resetZoom, selectedIndex, visibleImages.length])

  useEffect(() => {
    document.body.style.overflow = fullscreenOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [fullscreenOpen])

  const closeFullscreen = useCallback(() => {
    setFullscreenOpen(false)
    resetZoom()
  }, [resetZoom])

  const openFullscreen = useCallback(() => {
    if (!selectedImage) return
    setFullscreenOpen(true)
  }, [selectedImage])

  const prevImage = useCallback(() => {
    setSelectedIndex((index) => {
      const nextIndex = (index - 1 + visibleImages.length) % visibleImages.length
      return Number.isFinite(nextIndex) ? nextIndex : 0
    })
    resetZoom()
  }, [resetZoom, visibleImages.length])

  const nextImage = useCallback(() => {
    setSelectedIndex((index) => {
      const nextIndex = (index + 1) % visibleImages.length
      return Number.isFinite(nextIndex) ? nextIndex : 0
    })
    resetZoom()
  }, [resetZoom, visibleImages.length])

  useEffect(() => {
    if (!fullscreenOpen) return

    const handler = (event) => {
      if (event.key === 'Escape') closeFullscreen()
      if (event.key === 'ArrowLeft') prevImage()
      if (event.key === 'ArrowRight') nextImage()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeFullscreen, fullscreenOpen, nextImage, prevImage])

  const handleImageError = useCallback((src) => {
    setBrokenSources((current) => {
      const next = new Set(current)
      next.add(src)
      return next
    })
  }, [])

  const updateZoom = useCallback((value) => {
    const nextZoom = Number(value)
    setZoom(nextZoom)
    if (nextZoom <= 100) {
      setPan({ x: 0, y: 0 })
    }
  }, [])

  const handlePointerDown = (event) => {
    if (zoom <= 100) return

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    }

    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (Math.abs(deltaX) + Math.abs(deltaY) > 6) drag.moved = true

    setPan({
      x: drag.originX + deltaX,
      y: drag.originY + deltaY,
    })
  }

  const handlePointerUp = (event) => {
    const drag = dragRef.current
    if (drag.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture?.(event.pointerId)
      window.setTimeout(() => {
        dragRef.current.moved = false
      }, 0)
      dragRef.current.active = false
      dragRef.current.pointerId = null
    }
  }

  if (!selectedImage) return null

  return (
    <section className="section gallery" id="galerija">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-label">Galerija</span>
          <h2 className="section-title">Atlasīta izlase no reālas lietošanas</h2>
          <p className="section-subtitle">
            Īss ieskats brīžos, kuros Canada apvidus ragavas sevi pierāda bezceļa un mežā apstākļos.
          </p>
        </motion.div>

        <motion.div
          className="gallery-shell"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <div className="gallery-browser">
            <button
              type="button"
              className="gallery-main"
              onClick={openFullscreen}
              aria-label={galleryText.openFullscreen}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                decoding="async"
                onError={() => handleImageError(selectedImage.src)}
              />
              <div className="gallery-main-shade" />
              <div className="gallery-main-copy">
                <span>Aktīvais attēls</span>
                <p>{selectedImage.title || selectedImage.alt}</p>
              </div>
              <span className="gallery-expand-btn" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <aside className="gallery-thumbs" aria-label="Galerijas sīktēli">
              <div className="gallery-thumbs-head">
                <span>Visi attēli</span>
                <strong>{visibleImages.length}</strong>
              </div>

              <div className="gallery-thumb-scroll">
                {visibleImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    className={`gallery-thumb${selectedIndex === index ? ' gallery-thumb--active' : ''}`}
                    onClick={() => selectImage(index)}
                    aria-pressed={selectedIndex === index}
                  >
                    <img
                      src={image.src}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      onError={() => handleImageError(image.src)}
                    />
                    <span>{image.title || galleryText.image(index + 1)}</span>
                  </button>
                ))}
              </div>
            </aside>
          </div>

          <div className="gallery-footer">
            <p>{galleryText.count(visibleImages.length)}</p>
            <button type="button" className="gallery-more-btn" onClick={openFullscreen}>
              Atvērt pilnekrāna galeriju
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {fullscreenOpen && selectedImage && (
          <motion.div
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeFullscreen}
          >
            <motion.div
              className="gallery-modal-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Pilnekrāna galerija"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="gallery-modal-topbar">
                <div className="gallery-modal-title">
                  <span>{selectedIndex + 1} / {visibleImages.length}</span>
                  <p>{selectedImage.title || selectedImage.alt}</p>
                </div>

                <div className="gallery-modal-actions">
                  <div className="gallery-zoom-control" aria-label={galleryText.zoom}>
                    <span>{galleryText.zoom}</span>
                    <input
                      type="range"
                      min="100"
                      max="500"
                      step="25"
                      value={zoom}
                      onChange={(event) => updateZoom(event.target.value)}
                    />
                    <button type="button" className="gallery-zoom-btn" onClick={() => updateZoom(100)}>
                      {zoom}%
                    </button>
                  </div>
                  <button type="button" className="gallery-modal-icon-btn" onClick={closeFullscreen} aria-label={galleryText.close}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="gallery-modal-stage">
                <button type="button" className="gallery-modal-nav gallery-modal-nav--prev" onClick={prevImage} aria-label={galleryText.previous}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div
                  className={`gallery-modal-media${zoom > 100 ? ' gallery-modal-media--zoomed' : ''}`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    decoding="async"
                    draggable="false"
                    style={{
                      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom / 100})`,
                    }}
                    onError={() => handleImageError(selectedImage.src)}
                  />
                </div>

                <button type="button" className="gallery-modal-nav gallery-modal-nav--next" onClick={nextImage} aria-label={galleryText.next}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="gallery-modal-thumbs" aria-label="Pilnekrāna galerijas sīktēli">
                {visibleImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    className={`gallery-modal-thumb${selectedIndex === index ? ' gallery-modal-thumb--active' : ''}`}
                    onClick={() => selectImage(index)}
                    aria-label={image.title || galleryText.image(index + 1)}
                    aria-pressed={selectedIndex === index}
                  >
                    <img
                      src={image.src}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      onError={() => handleImageError(image.src)}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
