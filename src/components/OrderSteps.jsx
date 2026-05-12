import './OrderSteps.css'
import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Izvēlieties modeli',
    desc: 'Apskatiet pieejamos ragavu modeļus un izvēlieties variantu, kas vislabāk atbilst jūsu vajadzībām, darba apstākļiem un paredzētajai slodzei.',
  },
  {
    num: '02',
    title: 'Noformējiet pasūtījumu',
    desc: 'Spiediet "Pirkt" un veiciet apmaksu tiešsaistē ar Stripe, vai sazinieties ar mums pa tālruni, ja vēlaties pasūtīt tieši un precizēt detaļas.',
  },
  {
    num: '03',
    title: 'Apstiprinām detaļas',
    desc: 'Pēc pasūtījuma saņemšanas, ja nepieciešams, precizējam piegādes informāciju, izmaksas un citus svarīgus jautājumus, lai viss būtu skaidrs pirms nosūtīšanas.',
  },
  {
    num: '04',
    title: 'Piegāde',
    desc: 'Ragavas tiek piegādātas uz jūsu norādīto adresi Baltijā. Ja pasūtījums tiek veikts pa tālruni, piegādes un saņemšanas detaļas saskaņojam individuāli.',
  },
]

export default function OrderSteps() {
  return (
    <section className="section order-steps" id="pasūtījums">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-label">Pasūtīšana</span>
          <h2 className="section-title">Kā veikt pasūtījumu?</h2>
          <p className="section-subtitle">
            Izvēlieties sev piemērotāko modeli un noformējiet pasūtījumu sev ērtākajā veidā — tiešsaistē vai sazinoties ar mums.
          </p>
        </motion.div>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="step-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="step-num">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
