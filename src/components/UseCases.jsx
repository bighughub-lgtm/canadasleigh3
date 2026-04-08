import './UseCases.css'
import { motion } from 'framer-motion'

const cases = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="var(--gold)" strokeWidth="1.6" strokeLinejoin="round"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke="var(--gold)" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Medībām',
    desc: 'Viegli pārvadājiet medījumu un aprīkojumu pa mežu un bezceļiem. Higiēniska un ērta transportēšana.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M18 16.58A5 5 0 0015.5 8h-1.8A7 7 0 106 15.29" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 19.5V14l-2.5 1.5L8 14v5.5M6 22h12" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Makšķerēšanai',
    desc: 'Ērts risinājums makšķerēšanas piederumu un nozvejas transportēšanai uz ziemas makšķerēšanu.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="var(--gold)" strokeWidth="1.6"/>
        <path d="M12 6v6l4 2" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Lauksaimniecībai',
    desc: 'Pārvietojiet ražu un lauksaimniecības materiālus bez regulāriem ceļiem un grūtos laukos.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M17 8C8 10 5.9 16.17 3.82 19.82A1 1 0 004.7 21C8 21 16 21 21 21" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M7 15C5 17 4 19 4 21" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="17" cy="6" r="2" stroke="var(--gold)" strokeWidth="1.6"/>
      </svg>
    ),
    title: 'Mežistrādei',
    desc: 'Ideāli darbam starp kokiem, celmiem un akmeņiem — tur, kur treileri nevar tikt.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Ekspedīcijām',
    desc: 'Uzticams pavadonis ilgstošās ekspedīcijās aukstā klimatā. Izturīgs no +40°C līdz −40°C.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="var(--gold)" strokeWidth="1.6"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="var(--gold)" strokeWidth="1.6"/>
        <line x1="12" y1="22.08" x2="12" y2="12" stroke="var(--gold)" strokeWidth="1.6"/>
      </svg>
    ),
    title: 'Smagu kravu pārvadāšanai',
    desc: 'Droša un efektīva smagu kravu transportēšana bezceļa apstākļos — jebkurā sezonā.',
  },
]

export default function UseCases() {
  return (
    <section className="section use-cases" id="pielietojums">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-label">Pielietojums</span>
          <h2 className="section-title">Kur noderēs Canada Pulkan?</h2>
          <p className="section-subtitle">
            Izstrādātas skarbajai dabai — ragavas, kas darbojas jebkurā vidē un reljefā.
          </p>
        </motion.div>

        <div className="use-cases-grid">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              className="use-case-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <div className="use-case-icon">{c.icon}</div>
              <h3 className="use-case-title">{c.title}</h3>
              <p className="use-case-desc">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
