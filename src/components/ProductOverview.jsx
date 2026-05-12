import './ProductOverview.css'
import { useState } from 'react'
import { motion } from 'framer-motion'

const models = [
  {
    id: 'compact',
    tabLabel: 'KOMPAKTS',
    name: 'CANADA COMPACT',
    spec: '1.4 x 0.65 m · 5 kg',
    image: '/mazasragavas.jpg',
    alt: 'CANADA COMPACT ragavas',
  },
  {
    id: 'classic',
    tabLabel: 'SLODZEI',
    name: 'CANADA CLASSIC',
    spec: '2.33 x 0.85 m · 14 kg',
    image: '/canadaplukan.jpg',
    alt: 'CANADA CLASSIC ragavas',
  },
  {
    id: 'classic-open',
    tabLabel: 'ATVĒRTAIS',
    name: 'CANADA CLASSIC OPEN',
    spec: '2.33 x 0.85 m · 14 kg',
    image: '/ragavasbig.png',
    alt: 'CANADA CLASSIC OPEN ragavas',
  },
]

const features = [
  { label: 'Materiāls', value: 'HD polietilēns (HDPE)' },
  { label: 'Temperatūra', value: 'No −40°C līdz +40°C' },
  { label: 'Savietojamība', value: 'ATV, sniega motocikls, rokas vilkšana' },
  { label: 'Kopšana', value: 'Vienkārša — neabsorbē mitrumu vai smakas' },
  { label: 'Lietojums', value: 'Visu gadu — ziemā un vasarā' },
  { label: 'Ražots', value: 'Zviedrijā' },
]

export default function ProductOverview() {
  const [activeModelId, setActiveModelId] = useState(models[0].id)
  const activeModel = models.find((model) => model.id === activeModelId) ?? models[0]

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
                  <span className="overview-model-kicker">3 modeļu līnija</span>
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
                  <span>Ražots Zviedrijā</span>
                </div>
              </div>

              <div className="overview-switcher" role="tablist" aria-label="Modeļu izvēle">
                {models.map((model) => (
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
            <span className="section-label">Produkta pārskats</span>
            <h2 className="section-title">Testētas Skandināvijā. Ražotas Zviedrijā.</h2>
            <p className="section-subtitle product-overview-subtitle">
              Canada apvidus ragavas ir izgatavotas no īpaša HD polietilēna. Materiāls ir gan elastīgs, gan triecienizturīgs, tādēļ ragavas neplaisā atsitoties pret akmeņiem un saglabā savu formu arī pie smagas slodzes.
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
