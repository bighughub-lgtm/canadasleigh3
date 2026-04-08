import { Link, NavLink } from 'react-router-dom'
import './LegalLayout.css'

const LEGAL_LINKS = [
  { to: '/sikdatnu-politika', label: 'Sīkdatņu politika' },
  { to: '/piegade-atgriešana', label: 'Piegāde un atgriešana' },
  { to: '/privatuma-politika', label: 'Privātuma politika' },
  { to: '/pirksanas-noteikumi', label: 'Pirkšanas noteikumi' },
]

export default function LegalLayout({ title, effectiveDate, children }) {
  return (
    <div className="legal-layout">
      <div className="legal-layout__hero">
        <div className="container legal-layout__container">
          <Link to="/" className="legal-layout__back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M19 12H5M5 12l7 7M5 12l7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Atpakaļ uz sākumlapu
          </Link>

          <nav className="legal-layout__nav" aria-label="Juridisko lapu navigācija">
            {LEGAL_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `legal-layout__nav-link${isActive ? ' legal-layout__nav-link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="legal-layout__title-block">
            <p className="legal-layout__eyebrow">Juridiskā informācija</p>
            <h1 className="legal-layout__title">{title}</h1>
            {effectiveDate ? (
              <p className="legal-layout__meta">Spēkā no: {effectiveDate}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="legal-layout__content">
        <div className="container legal-layout__container">
          <article className="legal-layout__article">{children}</article>
        </div>
      </div>
    </div>
  )
}
