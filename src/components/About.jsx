import './About.css'
import { motion } from 'framer-motion'
import { useImageSlot } from '../lib/useImageSlot'
import { useLocale } from '../lib/publicI18n.jsx'

export default function About() {
  const { text } = useLocale()
  const about = text.about
  const aboutImage = useImageSlot('about', '/KRJ02427.jpg', about.imageAlt)

  return (
    <section className="section about" id="par-mums">
      <div className="container">
        <div className="about-grid">
          <motion.div
            className="about-visual"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="about-img-wrap">
              <img
                src={aboutImage.src}
                alt={aboutImage.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="about-badge">
              <img
                src="/apviduskamanaswhite.png"
                alt="Canada Pulkan"
                loading="lazy"
                decoding="async"
              />
              <span>{about.badge}</span>
            </div>
          </motion.div>

          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">{about.label}</span>
            <h2 className="section-title">
              {about.titleLine1}<br />{about.titleLine2}
            </h2>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="about-para">{paragraph}</p>
            ))}

            <div className="about-stats">
              {about.stats.map((stat) => (
                <div key={stat.label} className="about-stat">
                  <span className="about-stat-num">{stat.num}</span>
                  <span className="about-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="about-contacts">
              <a href="tel:+37129206554" className="about-contact">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.25 3c0-1.09.9-2 2-2h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81L7 7.91a16 16 0 006.29 6.29l2.38-.97a16 16 0 002.81.72A2 2 0 0122 16.92z"
                    stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                +371 29206554
              </a>
              <a href="tel:+37125715536" className="about-contact">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.25 3c0-1.09.9-2 2-2h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81L7 7.91a16 16 0 006.29 6.29l2.38-.97a16 16 0 002.81.72A2 2 0 0122 16.92z"
                    stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                +371 25715536
              </a>
              <a href="mailto:info@canadasleigh.com" className="about-contact">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6l-10 7L2 6" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                info@canadasleigh.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
