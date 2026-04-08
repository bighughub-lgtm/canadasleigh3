import './About.css'
import { motion } from 'framer-motion'

export default function About() {
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
                src="/KRJ02427.jpg"
                alt="Canada Pulkan Baltijā"
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
              <span>Oficiālais pārstāvis Baltijā</span>
            </div>
          </motion.div>

          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Par mums</span>
            <h2 className="section-title">
              VS Home SIA —<br />officiālais izplatītājs
            </h2>
            <p className="about-para">
              VS Home SIA ir Canada Pulkan apvidus ragavu oficiālais pārstāvis un
              izplatītājs Latvijā, Lietuvā un Igaunijā. Mēs nodrošinām Baltijas
              medniekiem, makšķerniekiem un saimniecībām piekļuvi Zviedrijā ražotām,
              gadiem testētām ragavām.
            </p>
            <p className="about-para">
              Canada Pulkan ragavas ir ražotas Zviedrijā un pārbaudītas Skandināvijas
              kalnainajos un akmeņainajos apvidos. HD polietilēna materiāls nodrošina
              izturību un elastību no pirmās līdz simtajai ekspedīcijai.
            </p>

            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-num">3</span>
                <span className="about-stat-label">Baltijas valstis</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">3</span>
                <span className="about-stat-label">Modeļi izvēlei</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">5 kg</span>
                <span className="about-stat-label">No minimālā svara</span>
              </div>
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
