import './Gallery.css'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const galleryImages = [
  {
    src: '/DSC06432.jpg',
    alt: 'Canada Pulkan ragavas reālā meža maršrutā',
    caption: 'Meža maršruts',
    previewSlot: 'hero',
  },
  {
    src: '/KRJ02427.jpg',
    alt: 'Ragavas skarbā apvidū',
    caption: 'Apvidus darbs',
    previewSlot: 'side-a',
  },
  {
    src: '/KRJ02257.jpg',
    alt: 'Ragavas pārvietošanas brīdī',
    caption: 'Vilcēja līnija',
    previewSlot: 'side-b',
  },
  {
    src: '/hngfbdv.jpg',
    alt: 'Ragavas meža un lauka apstākļos',
    caption: 'Pārvadājums dabā',
    previewSlot: 'bottom-a',
  },
  {
    src: '/rtdgf.jpg',
    alt: 'Tuvplāna kadrs ar ragavām dabiskā vidē',
    caption: 'Tuvplāna kadrs',
    previewSlot: 'bottom-b',
  },
  {
    src: '/yuthgdf.jpg',
    alt: 'Ragavas mežā un smaguma transportēšanā',
    caption: 'Noslēdzošais kadrs',
    previewSlot: 'bottom-c',
  },
  {
    src: '/DSC06417.jpg',
    alt: 'Canada Pulkan ragavas slīpākā meža posmā',
    caption: 'Stāvā trase',
  },
  {
    src: '/KRJ02364.jpg',
    alt: 'Ragavas smaguma pārvietošanai mežā',
    caption: 'Meža transportēšana',
  },
  {
    src: '/htgbfdf.jpg',
    alt: 'Ragavas nelīdzenā reljefā',
    caption: 'Nelīdzens reljefs',
  },
  {
    src: '/KRJ01743.jpg',
    alt: 'Ragavas smagākai kravai apvidū',
    caption: 'Kravas maršruts',
  },
  {
    src: '/thrgdf.jpg',
    alt: 'Ragavas autentiskā lietošanā dabā',
    caption: 'Pierādīta lietošana',
  },
  {
    src: '/ytr.jpg',
    alt: 'Vertikāls bezceļa kadrs ar ragavām',
    caption: 'Bezceļa aina',
  },
]

const previewImages = galleryImages.filter((image) => image.previewSlot)

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  const openLightbox = useCallback((src) => {
    const index = galleryImages.findIndex((image) => image.src === src)
    if (index >= 0) setLightbox(index)
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const prevImage = useCallback(() => {
    setLightbox((index) => {
      if (index === null) return 0
      return (index - 1 + galleryImages.length) % galleryImages.length
    })
  }, [])

  const nextImage = useCallback(() => {
    setLightbox((index) => {
      if (index === null) return 0
      return (index + 1) % galleryImages.length
    })
  }, [])

  useEffect(() => {
    if (lightbox === null) return

    const handler = (event) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') prevImage()
      if (event.key === 'ArrowRight') nextImage()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeLightbox, lightbox, nextImage, prevImage])

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightbox])

  const activeImage = lightbox !== null ? galleryImages[lightbox] : null

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
          <div className="gallery-preview">
            {previewImages.map((image, index) => (
              <motion.button
                key={image.src}
                type="button"
                className={`gallery-card gallery-card--${image.previewSlot}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{ duration: 0.42, delay: Math.min(index * 0.04, 0.2) }}
                onClick={() => openLightbox(image.src)}
                aria-label={`Atvērt foto ${index + 1}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                />
                <div className="gallery-card-shade" />
                <div className="gallery-card-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="gallery-footer">
            <p>Redzama atlasīta izlase no {galleryImages.length} foto.</p>

            <button type="button" className="gallery-more-btn" onClick={() => setLightbox(0)}>
              Atvērt pilnu galeriju
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Galerijas attēls"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Aizvērt">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>

              <div className="lightbox-media">
                <img src={activeImage.src} alt={activeImage.alt} decoding="async" />
              </div>

              <div className="lightbox-footer-panel">
                <div className="lightbox-copy">
                  <span className="lightbox-kicker">Fotogalerija</span>
                  <p>{activeImage.caption}</p>
                </div>

                <div className="lightbox-controls">
                  <div className="lightbox-counter">
                    {lightbox + 1} / {galleryImages.length}
                  </div>

                  <div className="lightbox-nav">
                    <button type="button" className="lightbox-nav-btn" onClick={prevImage} aria-label="Iepriekšējā">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <button type="button" className="lightbox-nav-btn" onClick={nextImage} aria-label="Nākamā">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
