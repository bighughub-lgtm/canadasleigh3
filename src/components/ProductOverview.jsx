import './ProductOverview.css'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useImageSlot } from '../lib/useImageSlot'
import { useLocale } from '../lib/publicI18n.jsx'

export default function ProductOverview() {
  const { text } = useLocale()
  const overview = text.productOverview
  const models = overview.models
  const features = overview.features
  const overviewCompactImage = useImageSlot(
    'product_overview_compact',
    '/mazasragavas.jpg',
    overview.imageAlts.compact,
    { legacySlotId: 'product_overview' },
  )
  const overviewClassicImage = useImageSlot(
    'product_overview_classic',
    '/canadaplukan.jpg',
    overview.imageAlts.classic,
    { legacySlotId: 'product_classic' },
  )
  const overviewClassicOpenImage = useImageSlot(
    'product_overview_classic_open',
    '/ragavasbig.png',
    overview.imageAlts.classicOpen,
    { legacySlotId: 'product_classic_open' },
  )
  const [activeModelId, setActiveModelId] = useState(models[0].id)
  const modelImages = {
    compact: overviewCompactImage,
    classic: overviewClassicImage,
    'classic-open': overviewClassicOpenImage,
  }
  const modelsWithImages = models.map((model) => ({
    ...model,
    image: modelImages[model.id]?.src || model.image,
    alt: modelImages[model.id]?.alt || model.alt,
  }))
  const activeModel = modelsWithImages.find((model) => model.id === activeModelId) ?? modelsWithImages[0]

  const handleModelSelect = (modelId) => {
    setActiveModelId((current) => (current === modelId ? current : modelId))
  }

  return (
    <section className="section product-overview" id="par-produktu">
      <div className="container">
        <div className="product-overview-inner">
          <motion.div
            className="product-overview-visual"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="overview-panel">
              <div className="overview-topbar">
                <div className="overview-model-meta">
                  <span className="overview-model-kicker">{overview.modelKicker}</span>
                  <div className="overview-model-name">{activeModel.name}</div>
                  <p>{activeModel.spec}</p>
                </div>

                <div className="overview-logo-badge">
                  <img
                    src="/apviduskamanaswhite.png"
                    alt="Canada Pulkan"
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{text.common.madeInSweden}</span>
                </div>
              </div>

              <div className="overview-switcher" role="tablist" aria-label={overview.modelSelectorLabel}>
                {modelsWithImages.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    role="tab"
                    aria-selected={activeModelId === model.id}
                    className={`overview-switcher-btn${activeModelId === model.id ? ' overview-switcher-btn--active' : ''}`}
                    onPointerDown={() => handleModelSelect(model.id)}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    {model.tabLabel}
                  </button>
                ))}
              </div>

              <div className={`overview-stage overview-stage--${activeModel.id}`}>
                <img
                  src={activeModel.image}
                  alt={activeModel.alt}
                  className={`overview-main-img overview-main-img--${activeModel.id}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="product-overview-text"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">{overview.label}</span>
            <h2 className="section-title">{overview.title}</h2>
            <p className="section-subtitle product-overview-subtitle">
              {overview.subtitle}
            </p>

            <div className="overview-features">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="overview-feature"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                >
                  <span className="overview-feature-label">{feature.label}</span>
                  <span className="overview-feature-value">{feature.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
