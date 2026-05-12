import './OrderSteps.css'
import { motion } from 'framer-motion'
import { useLocale } from '../lib/publicI18n.jsx'

export default function OrderSteps() {
  const { text } = useLocale()
  const orderText = text.orderSteps

  return (
    <section className="section order-steps" id="pasūtījums">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-label">{orderText.label}</span>
          <h2 className="section-title">{orderText.title}</h2>
          <p className="section-subtitle">
            {orderText.subtitle}
          </p>
        </motion.div>

        <div className="steps-grid">
          {orderText.steps.map((s, i) => (
            <motion.div
              key={i}
              className="step-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="step-num">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
