import './Benefits.css'
import { motion } from 'framer-motion'
import { useImageSlot } from '../lib/useImageSlot'
import { useLocale } from '../lib/publicI18n.jsx'

export default function Benefits() {
  const { text } = useLocale()
  const benefits = text.benefits
  const benefitsImage = useImageSlot('benefits', '/KRJ01720.jpg', benefits.imageAlt)

  return (
    <section className="section benefits" id="priekšrocības">
      <div className="container">
        <div className="benefits-grid">
          <motion.div
            className="benefits-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">{benefits.label}</span>
            <h2 className="section-title">{benefits.title}</h2>
            <p className="section-subtitle" style={{ marginBottom: 36 }}>
              {benefits.subtitle}
            </p>

            <ul className="benefits-list">
              {benefits.items.map((b, i) => (
                <motion.li
                  key={i}
                  className="benefit-item"
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <svg className="benefit-check" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="rgba(78,125,94,0.14)"/>
                    <path d="M6 10l3 3 5-5" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="benefits-image"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={benefitsImage.src}
              alt={benefitsImage.alt}
              loading="lazy"
              decoding="async"
            />
            <div className="benefits-badge">
              <span className="benefits-badge-label">{benefits.badgeLabel}</span>
              <strong>{benefits.badgeText}</strong>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
