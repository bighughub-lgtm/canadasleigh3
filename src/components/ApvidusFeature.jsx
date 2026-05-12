import './ApvidusFeature.css'
import { motion } from 'framer-motion'
import { useImageSlot } from '../lib/useImageSlot'

/* Light-background section — dark PNG /apvidus kamanas.png looks correct here */
export default function ApvidusFeature() {
  const featureImage = useImageSlot('apvidus_feature', '/apvidus kamanas.png', 'Apvidus kamanas')

  return (
    <section className="apvidus-feature">
      <div className="apvidus-feature-inner container">
        <motion.div
          className="apvidus-feature-text"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="apvidus-label">Apvidus kamanas</span>
          <h2 className="apvidus-title">
            Ragavas, kas iet<br />tur, kur citi nevar
          </h2>
          <p className="apvidus-sub">
            Canada Pulkan apvidus ragavas ir izstrādātas smagumu transportēšanai
            bezceļu apstākļos. Tās ir ļoti elastīgas un viegli velkamas — slīd
            kā pa sniegu pāri dažādām virsmām. Pateicoties materiāla elastībai,
            ragavas izlokās starp kokiem, celmiem un akmeņiem, nevis lūst.
          </p>
          <p className="apvidus-sub" style={{ marginTop: 12 }}>
            <strong>Svarīgi:</strong> ragavas nav paredzētas vilkšanai pa grants ceļiem.
            Ievērojot šo nosacījumu, tās ir praktiski nenolietojamas.
          </p>
          <a href="#produkti" className="apvidus-btn">
            Skatīties modeļus
          </a>
        </motion.div>

        <motion.div
          className="apvidus-feature-visual"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          {/* Dark PNG renders correctly on the light cream background */}
          <img
            src={featureImage.src}
            alt={featureImage.alt}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </div>
    </section>
  )
}
