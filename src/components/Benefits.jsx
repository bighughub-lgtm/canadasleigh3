import './Benefits.css'
import { motion } from 'framer-motion'
import { useImageSlot } from '../lib/useImageSlot'

const benefits = [
  'Neplaisā atsitoties pret akmeņiem un var izturēt auto pārbraukšanu pāri tām',
  'Izlokās starp kokiem, celmiem un akmeņiem — ideāli bezceļa apstākļiem',
  'Darbojas gan stiprā aukstumā, gan karstā laikā — visu gadu',
  'Viegli kopjamas — neabsorbē mitrumu, smakas vai netīrumus',
  'Higiēniskāka medījuma transportēšana — nesasmērē, saglabā gaļu tīru',
  'Noderīgas arī baļķiem, lauksaimniecības produktiem un kā nestuves ārkārtās situācijās',
]

export default function Benefits() {
  const benefitsImage = useImageSlot('benefits', '/KRJ01720.jpg', 'Canada Pulkan apvidus ragavas lietošanā')

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
            <span className="section-label">Priekšrocības</span>
            <h2 className="section-title">Kāpēc izvēlēties Canada apvidus ragavas?</h2>
            <p className="section-subtitle" style={{ marginBottom: 36 }}>
              Gadiem testētas Skandināvijas kalnainajos apvidos — ragavas, kas kalpos
              tikpat ilgi, cik pareizi tās lieto.
            </p>

            <ul className="benefits-list">
              {benefits.map((b, i) => (
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
              <span className="benefits-badge-label">Medību sezona</span>
              <strong>Canada apvidus ragavas lietošanā</strong>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
