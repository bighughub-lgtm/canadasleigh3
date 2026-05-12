import './Partners.css'
import { motion } from 'framer-motion'
import { useImageSlot } from '../lib/useImageSlot'
import { useLocale } from '../lib/publicI18n.jsx'

const PHONE_LINK = 'tel:+37129206554'

function buildEmailLink(content) {
  const subject = encodeURIComponent(content.emailSubject)
  const body = encodeURIComponent(content.emailBody)
  return `mailto:info@canadasleigh.com?subject=${subject}&body=${body}`
}

function buildWhatsappLink(content) {
  return `https://wa.me/37129206554?text=${encodeURIComponent(content.whatsappText)}`
}

function PartnerCard({ card, index }) {
  return (
    <motion.article
      className="partner-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <span className="partner-card-index">{String(index + 1).padStart(2, '0')}</span>
      <h3>{card.title}</h3>
      {card.items ? (
        <ul>
          {card.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{card.text}</p>
      )}
    </motion.article>
  )
}

export default function Partners() {
  const { text } = useLocale()
  const content = text.partners
  const partnersImage = useImageSlot('partners', '/PARTNERISSS.jpg', content.imageAlt)

  return (
    <section className="section partners" id="partners">
      <div className="container">
        <div className="partners-grid">
          <div className="partners-left">
            <motion.div
              className="partners-copy"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65 }}
            >
              <span className="section-label">{content.eyebrow}</span>
              <h2 className="section-title">{content.title}</h2>
              <div className="partners-intro">
                {content.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="partners-highlight">{content.highlight}</p>
            </motion.div>

            <motion.div
              className="partners-actions"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              <div className="partners-cta-row">
                <a href={buildEmailLink(content)} className="btn-primary partners-primary">
                  {content.cta.email}
                </a>
                <a
                  href={buildWhatsappLink(content)}
                  className="btn-outline partners-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.cta.whatsapp}
                </a>
                <a href={PHONE_LINK} className="btn-outline partners-secondary">
                  {content.cta.phone}
                </a>
              </div>

              <p className="partners-contact-line">
                <span>{content.contactPrefix}:</span>
                <a href="tel:+37129206554">+371 29206554</a>
                <a href="tel:+37125715536">+371 25715536</a>
                <a href="mailto:info@canadasleigh.com">info@canadasleigh.com</a>
              </p>
            </motion.div>
          </div>

          <div className="partners-right">
            <motion.figure
              className="partners-media"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >
              <img
                src={partnersImage.src}
                alt={partnersImage.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{content.badge}</figcaption>
            </motion.figure>

            <div className="partners-cards">
              {content.cards.map((card, index) => (
                <PartnerCard key={card.title} card={card} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
