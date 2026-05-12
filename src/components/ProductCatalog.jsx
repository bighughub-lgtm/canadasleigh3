import './ProductCatalog.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getActiveMedia } from '../lib/cmsApi'
import { useImageSlot } from '../lib/useImageSlot'
import { pickLocalizedField, useLocale } from '../lib/publicI18n.jsx'

const initialActiveMedia = {
  compact: 'sm1',
  classic: 'b1',
  'classic-open': 'a1',
}

const expandTransition = {
  duration: 0.3,
  ease: [0.22, 0.61, 0.36, 1],
}

function normalizeCmsProductMedia(items, locale, mediaText) {
  return items
    .filter((item) => item?.url)
    .map((item, index) => {
      const label = pickLocalizedField(
        item,
        'title',
        locale,
        pickLocalizedField(item, 'alt', locale, mediaText.imageFallback(index + 1)),
      )

      return {
        id: item.id,
        type: 'image',
        src: item.url,
        thumb: item.url,
        alt: pickLocalizedField(item, 'alt', locale, label),
        label,
        sort_order: Number(item.sort_order) || index + 1,
      }
    })
    .sort((a, b) => a.sort_order - b.sort_order)
}

function getProductMedia(product, galleryRows, locale, mediaText) {
  const cmsImages = normalizeCmsProductMedia(galleryRows, locale, mediaText)
  if (cmsImages.length === 0) return product.media

  const fallbackVideo = product.media.find((item) => item.type === 'video')
  if (!fallbackVideo) return cmsImages

  return [
    ...cmsImages,
    {
      ...fallbackVideo,
      thumb: cmsImages[0].thumb,
      poster: cmsImages[0].src,
    },
  ]
}

function getMediaCountLabel(media, mediaText) {
  const imageCount = media.filter((item) => item.type === 'image').length
  const videoCount = media.filter((item) => item.type === 'video').length

  return mediaText.mediaCount(imageCount, videoCount)
}

function getProductMediaLabel(item, mediaText, index = 0) {
  return item?.label || item?.alt || mediaText.mediaFallback(index + 1)
}

function ProductMediaViewer({ product, activeMediaId, onSelect, onOpenFullscreen, mediaText, browserVideoUnsupported }) {
  const activeMedia =
    product.media.find((item) => item.id === activeMediaId) ?? product.media[0]
  const activeIndex = product.media.findIndex((item) => item.id === activeMedia.id)
  const activeLabel = getProductMediaLabel(activeMedia, mediaText, activeIndex)

  return (
    <aside className="catalog-media-viewer">
      {activeMedia.type === 'video' ? (
        <div className="catalog-media-stage catalog-media-stage--video">
          <video
            key={activeMedia.id}
            controls
            playsInline
            preload="metadata"
            poster={activeMedia.poster}
          >
            <source src={activeMedia.src} type="video/mp4" />
            {browserVideoUnsupported}
          </video>
          <button
            type="button"
            className="catalog-media-expand"
            onClick={() => onOpenFullscreen(activeMedia.id)}
          >
            {mediaText.fullscreen}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="catalog-media-stage catalog-media-stage--clickable"
          onClick={() => onOpenFullscreen(activeMedia.id)}
          aria-label={`${mediaText.openFullscreen}: ${activeLabel}`}
        >
          <img
            key={activeMedia.id}
            src={activeMedia.src}
            alt={activeMedia.alt}
            loading="lazy"
            decoding="async"
          />
          <span className="catalog-media-expand">{mediaText.fullscreen}</span>
        </button>
      )}

      <div className="catalog-media-meta">
        <div>
          <span className="catalog-detail-label">
            {activeMedia.type === 'video' ? mediaText.video : mediaText.photo}
          </span>
          <p>{activeLabel}</p>
        </div>
        <span className="catalog-media-count">{getMediaCountLabel(product.media, mediaText)}</span>
      </div>

      <div className="catalog-media-thumbnails" role="list" aria-label={mediaText.mediaList(product.name)}>
        {product.media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`catalog-thumb${activeMedia.id === item.id ? ' catalog-thumb--active' : ''}`}
            onClick={() => onSelect(item.id)}
            aria-label={getProductMediaLabel(item, mediaText, index)}
            aria-pressed={activeMedia.id === item.id}
          >
            <img
              src={item.thumb ?? item.poster ?? item.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            {item.type === 'video' ? (
              <span className="catalog-thumb-badge">{mediaText.video}</span>
            ) : null}
          </button>
        ))}
      </div>
    </aside>
  )
}

function ProductMediaFullscreen({ product, activeMediaId, onSelect, onClose, mediaText, browserVideoUnsupported }) {
  const selectedIndex = Math.max(0, product.media.findIndex((item) => item.id === activeMediaId))
  const selectedMedia = product.media[selectedIndex] ?? product.media[0]
  const [zoom, setZoom] = useState(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  })

  const resetZoom = useCallback(() => {
    setZoom(100)
    setPan({ x: 0, y: 0 })
    dragRef.current.active = false
    dragRef.current.moved = false
  }, [])

  const updateZoom = useCallback((value) => {
    const nextZoom = Number(value)
    setZoom(nextZoom)
    if (nextZoom <= 100) {
      setPan({ x: 0, y: 0 })
    }
  }, [])

  const selectMedia = useCallback((index) => {
    if (product.media.length === 0) return
    const nextIndex = (index + product.media.length) % product.media.length
    onSelect(product.media[nextIndex].id)
    resetZoom()
  }, [onSelect, product.media, resetZoom])

  const previousMedia = useCallback(() => {
    selectMedia(selectedIndex - 1)
  }, [selectMedia, selectedIndex])

  const nextMedia = useCallback(() => {
    selectMedia(selectedIndex + 1)
  }, [selectMedia, selectedIndex])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    resetZoom()
  }, [resetZoom, selectedMedia?.id, selectedMedia?.type])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') previousMedia()
      if (event.key === 'ArrowRight') nextMedia()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [nextMedia, onClose, previousMedia])

  const handlePointerDown = (event) => {
    if (selectedMedia.type !== 'image' || zoom <= 100) return

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
      dragRef.current.active = false
      dragRef.current.pointerId = null
    }
  }

  if (!selectedMedia) return null

  const selectedLabel = getProductMediaLabel(selectedMedia, mediaText, selectedIndex)
  const isImage = selectedMedia.type === 'image'

  return (
    <motion.div
      className="catalog-media-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="catalog-media-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={mediaText.mediaViewer(product.name)}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.22 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="catalog-media-modal-topbar">
          <div className="catalog-media-modal-title">
            <span>{selectedIndex + 1} / {product.media.length}</span>
            <p>{selectedLabel}</p>
          </div>

          <div className="catalog-media-modal-actions">
            {isImage ? (
              <div className="catalog-media-zoom-control" aria-label={mediaText.zoom}>
                <span>{mediaText.zoom}</span>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="25"
                  value={zoom}
                  onChange={(event) => updateZoom(event.target.value)}
                />
                <button type="button" className="catalog-media-zoom-btn" onClick={() => updateZoom(100)}>
                  {zoom}%
                </button>
              </div>
            ) : null}

            <button
              type="button"
              className="catalog-media-modal-icon-btn"
              onClick={onClose}
              aria-label={mediaText.close}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="catalog-media-modal-stage">
          <button
            type="button"
            className="catalog-media-modal-nav catalog-media-modal-nav--prev"
            onClick={previousMedia}
            aria-label={mediaText.previous}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className={`catalog-media-modal-media${isImage && zoom > 100 ? ' catalog-media-modal-media--zoomed' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {isImage ? (
              <img
                key={selectedMedia.id}
                src={selectedMedia.src}
                alt={selectedMedia.alt}
                draggable="false"
                decoding="async"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom / 100})`,
                }}
              />
            ) : (
              <video
                key={selectedMedia.id}
                controls
                playsInline
                preload="metadata"
                poster={selectedMedia.poster}
              >
                <source src={selectedMedia.src} type="video/mp4" />
                {browserVideoUnsupported}
              </video>
            )}
          </div>

          <button
            type="button"
            className="catalog-media-modal-nav catalog-media-modal-nav--next"
            onClick={nextMedia}
            aria-label={mediaText.next}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="catalog-media-modal-thumbs" aria-label={mediaText.fullscreenMediaList(product.name)}>
          {product.media.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`catalog-media-modal-thumb${selectedMedia.id === item.id ? ' catalog-media-modal-thumb--active' : ''}`}
              onClick={() => selectMedia(index)}
              aria-label={getProductMediaLabel(item, mediaText, index)}
              aria-pressed={selectedMedia.id === item.id}
            >
              <img
                src={item.thumb ?? item.poster ?? item.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              {item.type === 'video' ? (
                <span>{mediaText.video}</span>
              ) : null}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProductDetailMainSections({ product, detailText }) {
  return (
    <section className="catalog-detail-copy-panel">
      <div className="catalog-detail-block catalog-detail-block--intro">
        <h4>{detailText.intro}</h4>
        <p>{product.details.intro}</p>
      </div>

      <div className="catalog-detail-block">
        <h4>{detailText.useCases}</h4>
        <ul className="catalog-detail-list">
          {product.details.useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="catalog-detail-note">
        <h4>{product.details.importantTitle}</h4>
        <p>{product.details.importantNote}</p>
      </div>
    </section>
  )
}

function ProductDetailSideSections({ product, detailText }) {
  return (
    <>
      <section className="catalog-detail-spec-panel">
        <h4>{detailText.specs}</h4>
        <dl className="catalog-spec-list">
          {product.details.specs.map((spec) => (
            <div key={spec.label} className="catalog-spec-line">
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="catalog-detail-delivery-panel">
        <h4>{product.details.deliveryTitle}</h4>
        <p>{product.details.deliveryNote}</p>
      </section>

      {product.details.extraPanels?.map((panel) => (
        <section key={panel.title} className="catalog-detail-delivery-panel">
          <h4>{panel.title}</h4>
          <p>{panel.content}</p>
        </section>
      ))}
    </>
  )
}

function ProductDetailActions({ product, onClose, buttons }) {
  return (
    <div className="catalog-detail-actions">
      <p>{product.details.footerNote}</p>
      <div className="catalog-detail-actions-row">
        <a
          href={product.buyUrl}
          className="catalog-action-btn catalog-action-btn--primary catalog-action-btn--compact"
        >
          {buttons.buy}
        </a>
        <a href="#kontakti" className="catalog-action-btn catalog-action-btn--secondary catalog-action-btn--compact">
          {buttons.contact}
        </a>
        <button
          type="button"
          className="catalog-action-btn catalog-action-btn--ghost catalog-action-btn--compact"
          onClick={onClose}
        >
          {buttons.closeInfo}
        </button>
      </div>
    </div>
  )
}

function ProductDetails({
  product,
  activeMediaId,
  onSelect,
  onClose,
  onOpenFullscreen,
  catalogText,
  mediaText,
  browserVideoUnsupported,
  variant = 'desktop',
}) {
  const animationProps =
    variant === 'mobile'
      ? {
          initial: { height: 0, opacity: 0 },
          animate: { height: 'auto', opacity: 1 },
          exit: { height: 0, opacity: 0 },
        }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 18 },
        }

  return (
    <motion.div
      className={`catalog-details catalog-details--${variant}`}
      {...animationProps}
      transition={expandTransition}
    >
      <div className="catalog-details-shell">
        <div className="catalog-details-head">
          <span className="catalog-detail-label">{catalogText.detail.fullInfo}</span>
          <h3>{product.name}</h3>
          <p>{product.summary}</p>
        </div>

        <div className="catalog-details-grid">
          <div className="catalog-details-main">
            <ProductDetailMainSections product={product} detailText={catalogText.detail} />
          </div>

          <aside className="catalog-details-side">
            <ProductDetailSideSections product={product} detailText={catalogText.detail} />
            <ProductDetailActions product={product} onClose={onClose} buttons={catalogText.buttons} />
          </aside>
        </div>

        <ProductMediaViewer
          product={product}
          activeMediaId={activeMediaId}
          onSelect={onSelect}
          onOpenFullscreen={onOpenFullscreen}
          mediaText={mediaText}
          browserVideoUnsupported={browserVideoUnsupported}
        />
      </div>
    </motion.div>
  )
}

export default function ProductCatalog() {
  const { text, locale } = useLocale()
  const catalogText = text.productCatalog
  const mediaText = catalogText.mediaText
  const products = catalogText.products.map((product) => ({
    ...product,
    expandable: true,
  }))
  const compactProductText = products.find((product) => product.id === 'compact')
  const classicProductText = products.find((product) => product.id === 'classic')
  const classicOpenProductText = products.find((product) => product.id === 'classic-open')
  const compactImage = useImageSlot('product_compact', '/mazasragavas.jpg', compactProductText?.imageAlt)
  const classicImage = useImageSlot('product_classic', '/canadaplukan.jpg', classicProductText?.imageAlt)
  const classicOpenImage = useImageSlot('product_classic_open', '/ragavasbig.png', classicOpenProductText?.imageAlt)
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [activeMediaByProduct, setActiveMediaByProduct] = useState(initialActiveMedia)
  const [productGalleryMedia, setProductGalleryMedia] = useState({})
  const [fullscreenProductId, setFullscreenProductId] = useState(null)
  const sectionRef = useRef(null)
  const detailsRef = useRef(null)
  const productSlotImages = {
    compact: compactImage,
    classic: classicImage,
    'classic-open': classicOpenImage,
  }
  const productsWithImages = products.map((product) => ({
    ...product,
    image: productSlotImages[product.id]?.src || product.image,
    imageAlt: productSlotImages[product.id]?.alt || product.name,
    media: getProductMedia(product, productGalleryMedia[product.gallerySection] || [], locale, mediaText),
  }))
  const selectedProduct = productsWithImages.find((product) => product.id === expandedProduct)
  const fullscreenProduct = productsWithImages.find((product) => product.id === fullscreenProductId)

  useEffect(() => {
    let mounted = true
    const sections = products.map((product) => product.gallerySection)

    Promise.all(sections.map((section) => getActiveMedia(section)))
      .then((results) => {
        if (!mounted) return

        setProductGalleryMedia(
          sections.reduce((map, section, index) => {
            map[section] = results[index]
            return map
          }, {}),
        )
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    setActiveMediaByProduct((current) => {
      let changed = false
      const next = { ...current }

      productsWithImages.forEach((product) => {
        if (!product.media.some((item) => item.id === current[product.id])) {
          next[product.id] = product.media[0]?.id
          changed = true
        }
      })

      return changed ? next : current
    })
  }, [productGalleryMedia])

  useEffect(() => {
    if (!expandedProduct || !detailsRef.current) return
    if (!window.matchMedia('(min-width: 900px)').matches) return

    window.requestAnimationFrame(() => {
      const top = detailsRef.current.getBoundingClientRect().top + window.scrollY - 92
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })
  }, [expandedProduct])

  const scrollToProductCatalog = useCallback(() => {
    window.requestAnimationFrame(() => {
      const target = sectionRef.current
      if (!target) return

      const top = target.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })
  }, [])

  const updateActiveMedia = useCallback((productId, mediaId) => {
    setActiveMediaByProduct((current) => ({
      ...current,
      [productId]: mediaId,
    }))
  }, [])

  const openProductMedia = useCallback((productId, mediaId) => {
    updateActiveMedia(productId, mediaId)
    setFullscreenProductId(productId)
  }, [updateActiveMedia])

  const closeProductDetails = useCallback(() => {
    setExpandedProduct(null)
    scrollToProductCatalog()
  }, [scrollToProductCatalog])

  const toggleProductDetails = (productId) => {
    if (expandedProduct === productId) {
      closeProductDetails()
      return
    }

    setExpandedProduct(productId)
  }

  return (
    <section className="section product-catalog" id="produkti" ref={sectionRef}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-label">{catalogText.label}</span>
          <h2 className="section-title">{catalogText.title}</h2>
          <p className="section-subtitle">
            {catalogText.subtitle}
          </p>
        </motion.div>

        <div className="catalog-grid">
          {productsWithImages.map((product, index) => {
            const isExpanded = product.expandable && expandedProduct === product.id

            return (
              <motion.article
                key={product.id}
                className={`catalog-card${product.tagFeatured ? ' catalog-card--featured' : ''}${isExpanded ? ' catalog-card--expanded' : ''}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
              >
                <span className={`catalog-tag${product.tagFeatured ? ' catalog-tag--gold' : ''}`}>
                  {product.tag}
                </span>

                <div className="catalog-image">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="catalog-body">
                  <div className="catalog-copy">
                    <h3 className="catalog-name">{product.name}</h3>
                    <p className="catalog-subtitle">{product.subtitle}</p>

                    <div className="catalog-price-row">
                      <div className="catalog-price">{product.price}</div>
                      {product.availability ? (
                        <span className="catalog-availability">{product.availability}</span>
                      ) : null}
                    </div>

                    <p className="catalog-summary">{product.summary}</p>

                    <ul className="catalog-features">
                      {product.features.map((feature) => (
                        <li key={feature}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M2.5 7l3 3 6-6"
                              stroke="var(--gold)"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`catalog-actions${product.expandable ? ' catalog-actions--dual' : ''}`}>
                    <a
                      href={product.buyUrl}
                      className="catalog-action-btn catalog-action-btn--primary"
                    >
                      {catalogText.buttons.buy}
                    </a>

                    {product.expandable ? (
                      <button
                        type="button"
                        className="catalog-action-btn catalog-action-btn--secondary"
                        onClick={() => toggleProductDetails(product.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`${product.id}-details`}
                      >
                        {catalogText.buttons.fullInfo}
                        <svg
                          className="catalog-action-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : null}
                  </div>

                  {product.expandable ? (
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <div id={`${product.id}-details`} className="catalog-mobile-details">
                          <ProductDetails
                            product={product}
                            activeMediaId={activeMediaByProduct[product.id]}
                            onSelect={(mediaId) => updateActiveMedia(product.id, mediaId)}
                            onClose={closeProductDetails}
                            onOpenFullscreen={(mediaId) => openProductMedia(product.id, mediaId)}
                            catalogText={catalogText}
                            mediaText={mediaText}
                            browserVideoUnsupported={text.common.browserVideoUnsupported}
                            variant="mobile"
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  ) : null}
                </div>
              </motion.article>
            )
          })}
        </div>

        <div className="catalog-desktop-details" ref={detailsRef}>
          <AnimatePresence initial={false}>
            {selectedProduct && (
              <ProductDetails
                key={selectedProduct.id}
                product={selectedProduct}
                activeMediaId={activeMediaByProduct[selectedProduct.id]}
                onSelect={(mediaId) => updateActiveMedia(selectedProduct.id, mediaId)}
                onClose={closeProductDetails}
                onOpenFullscreen={(mediaId) => openProductMedia(selectedProduct.id, mediaId)}
                catalogText={catalogText}
                mediaText={mediaText}
                browserVideoUnsupported={text.common.browserVideoUnsupported}
                variant="desktop"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {fullscreenProduct && (
          <ProductMediaFullscreen
            key={fullscreenProduct.id}
            product={fullscreenProduct}
            activeMediaId={activeMediaByProduct[fullscreenProduct.id]}
            onSelect={(mediaId) => updateActiveMedia(fullscreenProduct.id, mediaId)}
            onClose={() => setFullscreenProductId(null)}
            mediaText={mediaText}
            browserVideoUnsupported={text.common.browserVideoUnsupported}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
