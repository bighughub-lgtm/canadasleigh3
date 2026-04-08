import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'))
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/"><img src="/logopng2.png" alt="Canada Pulkan" className="footer-logo" /></a>
            <p className="footer-tagline">
              Zviedrijā ražotas apvidus ragavas smagu kravu pārvadāšanai bezceļu apstākļos.
            </p>
            
            <div className="footer-company">
    
              <span className="footer-company-name">VS Home SIA</span>
              <span>Reģ. Nr.: <span className="footer-placeholder">40203212218</span></span>
              <span>PVN: <span className="footer-placeholder">LV40203212218</span></span>
              <span>Bankas konts: <span className="footer-placeholder">LV25HABA0551053485464</span></span>
              <span>Darba laiks: <span className="footer-placeholder">darba dienās 9:00–18:00</span></span>
              <span><span className="footer-placeholder">K. Valdemāra 77-53, Rīga, LV-1013</span></span>
              <span>Tālrunis: <span className="footer-placeholder">   <a href="tel:+37129206554">+371 29206554</a></span></span>
            </div>
          </div>

          <div className="footer-nav-row">
            <div className="footer-col">
              <h4>Produkti</h4>
              <a href="/#produkti">COMPACT — €250</a>
              <a href="/#produkti">CLASSIC — €490</a>
              <a href="/#produkti">CLASSIC OPEN — €490</a>
            </div>
            <div className="footer-col">
              <h4>Informācija</h4>
              <a href="/#pielietojums">Pielietojums</a>
              <a href="/#priekšrocības">Priekšrocības</a>
              <a href="/#galerija">Galerija</a>
              <a href="/#video">Videoklipi</a>
            </div>
            <div className="footer-col">
              <h4>Pakalpojumi</h4>
              <a href="/#pasūtījums">Kā pasūtīt</a>
              <a href="/#piegāde">Piegāde</a>
              <a href="/#jautājumi">BUJ</a>
              <a href="/#kontakti">Kontakti</a>
            </div>
            <div className="footer-col">
              <h4>Juridiskā info</h4>
              <Link to="/privatuma-politika">Privātuma politika</Link>
              <Link to="/sikdatnu-politika">Sīkdatņu politika</Link>
              <button className="footer-cookie-btn" onClick={openCookieSettings}>
                Sīkdatņu iestatījumi
              </button>
              <Link to="/pirksanas-noteikumi">Pirkšanas noteikumi</Link>
              <Link to="/piegade-atgriešana">Piegāde un atgriešana</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} VS Home SIA. Visas tiesības aizsargātas.</span>
          <span className="footer-bottom-legal">
            <Link to="/privatuma-politika">Privātuma politika</Link>
            <span className="footer-sep">·</span>
            <Link to="/sikdatnu-politika">Sīkdatnes</Link>
            <span className="footer-sep">·</span>
            <Link to="/pirksanas-noteikumi">Pirkšanas noteikumi</Link>
            <span className="footer-sep">·</span>
            <Link to="/piegade-atgriešana">Piegāde</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
