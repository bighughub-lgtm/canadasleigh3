import './DeliveryPayment.css'
import { motion } from 'framer-motion'

const deliveryItems = [
  'Piegāde visā Latvijā, Lietuvā un Igaunijā',
  'Piegādes laiks: 3–7 darba dienas',
  'Rūpīgi iepakots transportēšanas aizsardzībai',
  'Piegādes paziņojums ar izsekošanas numuru',
]

const paymentItems = [
  'Apmaksas kārtība tiek saskaņota pēc pasūtījuma apstiprināšanas',
  'Bankas pārskaitījums',
  'Rēķins juridiskām personām ar PVN',
  'Kartes maksājuma iespēja pēc individuālas vienošanās',
  'Individuāli nosacījumi lieliem pasūtījumiem',
]

export default function DeliveryPayment() {
  return (
    <section className="section delivery-payment" id="piegāde">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="dp-header"
        >
          <span className="section-label">Loģistika</span>
          <h2 className="section-title">Piegāde un apmaksa</h2>
        </motion.div>

        <div className="dp-grid">
          <motion.div
            className="dp-card"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            

<div className="dp-card-head">
              <div className="dp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="4" width="22" height="16" rx="2" stroke="var(--gold)" strokeWidth="1.8"/>
                  <line x1="1" y1="10" x2="23" y2="10" stroke="var(--gold)" strokeWidth="1.8"/>
                </svg>
              </div>
              <h3>Apmaksa</h3>
            </div>
<ul className="dp-list">
              {paymentItems.map((item, i) => (
                <li key={i}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="var(--gold)" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
           
          </motion.div>

          <motion.div
            className="dp-card"
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="dp-card-head">
              <div className="dp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="3" width="15" height="13" rx="1" stroke="var(--gold)" strokeWidth="1.8"/>
                  <path d="M16 8h4l3 3v5h-7V8z" stroke="var(--gold)" strokeWidth="1.8" strokeLinejoin="round"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="var(--gold)" strokeWidth="1.8"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="var(--gold)" strokeWidth="1.8"/>
                </svg>
              </div>
              <h3>Piegāde</h3>
            </div>

             <ul className="dp-list">
              {deliveryItems.map((item, i) => (
                <li key={i}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="var(--gold)" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            
          </motion.div>

          <motion.div
            className="dp-contact"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.16 }}
          >
            <span className="dp-contact-label">Jautājumi?</span>
            <h3>Sazināties ar mums</h3>
            <div className="dp-contact-links">
              <a href="tel:+37129206554">+371 29206554</a>
              <a href="tel:+37125715536">+371 25715536</a>
              <a href="mailto:info@canadasleigh.com">info@canadasleigh.com</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
