import './Header.css'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LANGS = ['LAT', 'LIT', 'EST', 'ENG', 'RUS']
const ACTIVE_LANG = 'LAT'

const navLabels = {
  LAT: { partners: 'Partneriem' },
  LIT: { partners: 'Partneriams' },
  EST: { partners: 'Partneritele' },
  ENG: { partners: 'Partners' },
  RUS: { partners: 'Партнёрам' },
}

const navLinks = [
  { label: 'Modeļi', href: '/#produkti' },
  { label: 'Galerija', href: '/#galerija' },
  { label: 'Videoklipi', href: '/#video' },
  { label: 'Par mums', href: '/#par-mums' },
  { label: navLabels[ACTIVE_LANG].partners, href: '/#partners' },
  { label: 'Kontakti', href: '/#kontakti' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const langMenuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : ''

    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const toggleMenu = () => {
    setLangMenuOpen(false)
    setMenuOpen((open) => !open)
  }

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!langMenuRef.current?.contains(event.target)) {
        setLangMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setLangMenuOpen(false)
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <div className="header-inner container">
          <a href="/" className="header-logo">
            <img src="/logopng2.png" alt="Canada Pulkan" />
          </a>

          <nav className="header-nav">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="header-nav-link">{l.label}</a>
            ))}
          </nav>

          <div className="header-right">
            <div className="lang-dropdown" ref={langMenuRef}>
              <button
                type="button"
                className={`lang-trigger${langMenuOpen ? ' lang-trigger--open' : ''}`}
                onClick={() => setLangMenuOpen((open) => !open)}
                aria-expanded={langMenuOpen}
                aria-haspopup="menu"
                aria-label="Valodas izvēlne"
              >
                <span>{ACTIVE_LANG}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    className="lang-menu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {LANGS.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        className={`lang-option${lang === ACTIVE_LANG ? ' lang-option--active' : ''}`}
                        title={lang !== ACTIVE_LANG ? 'Drīzumā pieejams' : undefined}
                        onClick={() => setLangMenuOpen(false)}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="tel:+37129206554" className="header-phone">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 6.2 2 2 0 0 1 5 4Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              +371 29206554
            </a>

            <button
              className={`burger${menuOpen ? ' burger--open' : ''}`}
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Aizvērt izvēlni' : 'Atvērt izvēlni'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ y: '-100%' }}
            animate={{ y: 0, transition: { duration: 0.44, ease: [0.32, 0.72, 0, 1] } }}
            exit={{ y: '-100%', transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigācijas izvēlne"
          >
            <div className="mm-top">
              <a href="/" className="mm-logo" onClick={closeMenu}>
                <img src="/logopng2.png" alt="Canada Pulkan" />
              </a>
              <button
                className="mm-close"
                onClick={closeMenu}
                aria-label="Aizvērt izvēlni"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path
                    d="M1.5 1.5L13.5 13.5M13.5 1.5L1.5 13.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mm-rule" aria-hidden="true" />

            <nav className="mm-nav" aria-label="Galvenā navigācija">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  className="mm-link"
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.04,
                    duration: 0.28,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <span className="mm-link-num">0{i + 1}</span>
                  <span className="mm-link-label">{l.label}</span>
                </motion.a>
              ))}
            </nav>

            <div className="mm-bottom">
              <div className="mm-langs" role="group" aria-label="Valodas izvēle">
                {LANGS.map(l => (
                  <button
                    key={l}
                    type="button"
                    className={`mm-lang${l === ACTIVE_LANG ? ' mm-lang--active' : ''}`}
                    title={l !== ACTIVE_LANG ? 'Drīzumā pieejams' : undefined}
                    disabled={l !== ACTIVE_LANG}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <a
                href="tel:+37129206554"
                className="mm-contact"
                onClick={closeMenu}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 6.2 2 2 0 0 1 5 4Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>+371 29206554</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
