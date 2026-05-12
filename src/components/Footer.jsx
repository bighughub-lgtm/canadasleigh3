import { Link } from 'react-router-dom'
import './Footer.css'
import { useLocale } from '../lib/publicI18n.jsx'

export default function Footer() {
  const { text } = useLocale()
  const footer = text.footer
  const legal = text.legal.titles
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
              {footer.tagline}
            </p>
            
            <div className="footer-company">
    
              <span className="footer-company-name">VS Home SIA</span>
              <span>{footer.company.reg} <span className="footer-placeholder">40203212218</span></span>
              <span>{footer.company.vat} <span className="footer-placeholder">LV40203212218</span></span>
              <span>{footer.company.bank} <span className="footer-placeholder">LV25HABA0551053485464</span></span>
              <span>{footer.company.hours} <span className="footer-placeholder">{footer.company.hoursValue}</span></span>
              <span><span className="footer-placeholder">K. Valdemāra 77-53, Rīga, LV-1013</span></span>
              <span>{footer.company.phone} <span className="footer-placeholder">   <a href="tel:+37129206554">+371 29206554</a></span></span>
            </div>
          </div>

          <div className="footer-nav-row">
            <div className="footer-col">
              <h4>{footer.columns.products}</h4>
              {footer.productLinks.map((label) => (
                <a key={label} href="/#produkti">{label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>{footer.columns.info}</h4>
              {footer.infoLinks.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>{footer.columns.services}</h4>
              {footer.serviceLinks.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>{footer.columns.legal}</h4>
              <Link to="/privatuma-politika">{legal.privacy}</Link>
              <Link to="/sikdatnu-politika">{legal.cookies}</Link>
              <button className="footer-cookie-btn" onClick={openCookieSettings}>
                {footer.cookieSettings}
              </button>
              <Link to="/pirksanas-noteikumi">{legal.purchaseTerms}</Link>
              <Link to="/piegade-atgriešana">{legal.deliveryReturns}</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{footer.rights(year)}</span>
          <span className="footer-bottom-legal">
            <Link to="/privatuma-politika">{legal.privacy}</Link>
            <span className="footer-sep">·</span>
            <Link to="/sikdatnu-politika">{footer.bottom.cookiesShort}</Link>
            <span className="footer-sep">·</span>
            <Link to="/pirksanas-noteikumi">{legal.purchaseTerms}</Link>
            <span className="footer-sep">·</span>
            <Link to="/piegade-atgriešana">{footer.bottom.deliveryShort}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
