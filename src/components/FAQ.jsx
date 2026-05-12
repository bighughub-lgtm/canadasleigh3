import './FAQ.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'Kādi ir piegādes laiki?',
    a: 'Piegāde parasti notiek 3–7 darba dienu laikā pēc pasūtījuma apstiprināšanas. Sazinieties ar mums pa tālruni vai e-pastu, lai uzzinātu pasūtījuma statusu un vienotos par saņemšanu.',
  },
  {
    q: 'Kāds materiāls tiek izmantots?',
    a: 'Ragavas ir izgatavotas no HD polietilēna (HDPE) — tas ir gan elastīgs, gan triecienizturīgs pie jebkurām temperatūrām. Ragavas neplaisā atsitoties pret akmeņiem un var izturēt auto pārbraukšanu pāri tām. Materiāls neabsorbē mitrumu vai smakas.',
  },
  {
    q: 'Vai ragavas var vilkt pa grants ceļiem?',
    a: 'Nē — ragavas nav paredzētas vilkšanai pa grants jeb asfalta ceļiem. Ja šo nosacījumu ievēro, ragavas ir praktiski nenolietojamas un kalpos ļoti ilgu laiku.',
  },
  {
    q: 'Kādā temperatūrā var lietot ragavas?',
    a: 'Ragavas darbojas plašā temperatūras diapazonā — no −40°C līdz +40°C. HD polietilēns saglabā elastību stiprā aukstumā un augstspiediena siltākā laikā, tādēļ ragavas der izmantošanai visu gadu.',
  },
  {
    q: 'Vai ragavas var pievienot ATV vai sniega motociklam?',
    a: 'Jā, Canada Apvidus ragavas var vilkt ar ATV, sniega motociklu vai ar rokām. Tās ir ļoti elastīgas un viegli velkamas — slīd kā pa sniegu pāri dažādām virsmām.',
  },
  {
    q: 'Kādiem mērķiem vēl der ragavas, ne tikai medībām?',
    a: 'Ragavas ir piemērotas arī makšķerēšanai, lauksaimniecības darbiem, ekspedīcijām un mežistrādei. Tajās var pārvadāt baļķus, lauksaimniecības produktus, smagu aprīkojumu, un tās var izmantot arī kā nestuves ārkārtās situācijās.',
  },
  {
    q: 'Kā tīrīt un kopt ragavas?',
    a: 'Kopšana ir ļoti vienkārša. HD polietilēns neabsorbē mitrumu, smakas vai netīrumus. Pēc lietošanas pietiek noskalot ar ūdeni. Nav nepieciešama īpaša apstrāde vai konservācija.',
  },
  {
    q: 'Vai var pasūtīt piegādi uz uzņēmuma adresi?',
    a: 'Jā, piegādājam gan privātpersonām, gan uzņēmumiem visā Latvijā, Lietuvā un Igaunijā. Uzņēmumiem izrakstām rēķinu ar PVN. Lieliem vai regulāriem pasūtījumiem pieejami individuāli nosacījumi.',
  },
]

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
            <span className="section-label">BUJ</span>
            <h2 className="section-title">Biežāk uzdotie jautājumi</h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>
              Neatradāt atbildi? Sazinieties ar mums pa tiešo.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="tel:+37129206554" className="btn-outline" style={{ justifyContent: 'center', fontSize: 14 }}>
                Zvanīt +371 29206554
              </a>
              <a href="mailto:info@canadasleigh.com" className="btn-outline" style={{ justifyContent: 'center', fontSize: 14 }}>
                Rakstīt e-pastu
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
            {faqs.map((item, i) => (
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
