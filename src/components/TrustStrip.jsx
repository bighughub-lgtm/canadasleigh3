import './TrustStrip.css'
import { motion } from 'framer-motion'
import { useLocale } from '../lib/publicI18n.jsx'

const items = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke="var(--gold)" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="3" width="15" height="13" rx="1" stroke="var(--gold)" strokeWidth="1.8"/>
        <path d="M16 8h4l3 3v5h-7V8z" stroke="var(--gold)" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="5.5" cy="18.5" r="2.5" stroke="var(--gold)" strokeWidth="1.8"/>
        <circle cx="18.5" cy="18.5" r="2.5" stroke="var(--gold)" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="var(--gold)" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.25 3c0-1.09.9-2 2-2h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81L7 7.91a16 16 0 006.29 6.29l2.38-.97a16 16 0 002.81.72A2 2 0 0122 16.92z"
          stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 6l-10 7L2 6" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function TrustStrip() {
  const { text } = useLocale()

  return (
    <div className="trust-strip">
      <div className="trust-inner">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="trust-item"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
          >
            <div className="trust-icon">{item.icon}</div>
            <div className="trust-text">
              <span className="trust-label">{text.trustStrip[i].label}</span>
              <span className="trust-sub">{text.trustStrip[i].sub}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
