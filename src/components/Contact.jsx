import './Contact.css'
import { motion } from 'framer-motion'

const contactCards = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.25 3c0-1.09.9-2 2-2h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81L7 7.91a16 16 0 006.29 6.29l2.38-.97a16 16 0 002.81.72A2 2 0 0122 16.92z"
          stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Tālrunis',
    value: '+371 29206554',
    href: 'tel:+37129206554',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.25 3c0-1.09.9-2 2-2h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81L7 7.91a16 16 0 006.29 6.29l2.38-.97a16 16 0 002.81.72A2 2 0 0122 16.92z"
          stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Tālrunis',
    value: '+371 25715536',
    href: 'tel:+37125715536',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 6l-10 7L2 6" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'E-pasts',
    value: 'info@canadasleigh.com',
    href: 'mailto:info@canadasleigh.com',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="2" stroke="var(--gold)" strokeWidth="1.8"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="var(--gold)" strokeWidth="1.8"/>
      </svg>
    ),
    label: 'Uzņēmums',
    value: 'VS Home SIA',
    href: null,
  },
]

export default function Contact() {
  return (
    <section className="section contact" id="kontakti">
      <div className="container">
        <div className="contact-inner">
          <motion.div
            className="contact-left"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Kontakti</span>
            <h2 className="section-title">
              Gatavs pasūtīt<br />vai jautāt?
            </h2>
            <p className="section-subtitle" style={{ marginBottom: 44 }}>
              Sazinieties ar mums — atbildēsim ātri un palīdzēsim
              izvēlēties piemērotāko modeli jūsu vajadzībām.
            </p>

            <div className="contact-cards">
              {contactCards.map((c, i) =>
                c.href ? (
                  <a key={i} href={c.href} className="contact-card">
                    <div className="contact-card-icon">{c.icon}</div>
                    <div>
                      <div className="contact-card-label">{c.label}</div>
                      <div className="contact-card-value">{c.value}</div>
                    </div>
                  </a>
                ) : (
                  <div key={i} className="contact-card contact-card--static">
                    <div className="contact-card-icon">{c.icon}</div>
                    <div>
                      <div className="contact-card-label">{c.label}</div>
                      <div className="contact-card-value">{c.value}</div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* STRIPE: Replace href="#produkti" with your main Stripe checkout URL when ready */}
            <div className="contact-cta">
              <a href="#produkti" className="btn-primary" style={{ fontSize: 16, padding: '15px 40px' }}>
                Skatīties ragavu modeļus
              </a>
            </div>
          </motion.div>

          <motion.div
            className="contact-visual"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="/KRJ02364.jpg"
              alt="Canada Pulkan apvidus ragavas"
              loading="lazy"
              decoding="async"
            />
            <div className="contact-visual-overlay">
              <img
                src="/apviduskamanaswhite.png"
                alt="Canada Pulkan"
                className="contact-logo"
                loading="lazy"
                decoding="async"
              />
              <p>VS Home SIA · oficiālais pārstāvis Baltijā</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
