import './FAQ.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from '../lib/publicI18n.jsx'

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <button className="faq-q" onClick={onToggle}>
        <span>{q}</span>
        <svg
          className={`faq-chevron${isOpen ? ' faq-chevron--open' : ''}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="faq-answer-inner">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const { text } = useLocale()
  const faq = text.faq
  const [open, setOpen] = useState(0)

  return (
    <section className="section faq" id="jautājumi">
      <div className="container">
        <div className="faq-layout">
          <motion.div
            className="faq-sidebar"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="section-label">{faq.label}</span>
            <h2 className="section-title">{faq.title}</h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>
              {faq.subtitle}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="tel:+37129206554" className="btn-outline" style={{ justifyContent: 'center', fontSize: 14 }}>
                {faq.call}
              </a>
              <a href="mailto:info@canadasleigh.com" className="btn-outline" style={{ justifyContent: 'center', fontSize: 14 }}>
                {faq.email}
              </a>
            </div>
          </motion.div>

          <motion.div
            className="faq-list"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            {faq.items.map((item, i) => (
              <FAQItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
