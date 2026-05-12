import './ApvidusFeature.css'
import { motion } from 'framer-motion'
import { useImageSlot } from '../lib/useImageSlot'
import { useLocale } from '../lib/publicI18n.jsx'

/* Light-background section — dark PNG /apvidus kamanas.png looks correct here */
export default function ApvidusFeature() {
  const { text } = useLocale()
  const featureText = text.apvidusFeature
  const featureImage = useImageSlot('apvidus_feature', '/apvidus kamanas.png', featureText.imageAlt)

  return (
    <section className="apvidus-feature">
      <div className="apvidus-feature-inner container">
        <motion.div
          className="apvidus-feature-text"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="apvidus-label">{featureText.label}</span>
          <h2 className="apvidus-title">
            {featureText.titleLine1}<br />{featureText.titleLine2}
          </h2>
          <p className="apvidus-sub">
            {featureText.paragraphs[0]}
          </p>
          <p className="apvidus-sub" style={{ marginTop: 12 }}>
            <strong>{featureText.important}</strong> {featureText.paragraphs[1]}
          </p>
          <a href="#produkti" className="apvidus-btn">
            {featureText.cta}
          </a>
        </motion.div>

        <motion.div
          className="apvidus-feature-visual"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          {/* Dark PNG renders correctly on the light cream background */}
          <img
            src={featureImage.src}
            alt={featureImage.alt}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </div>
    </section>
  )
}
