import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CookieBanner.css'

const STORAGE_KEY = 'canadasleigh_cookie_consent'

function loadConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {/* ignore */}
  return null
}

function saveConsent(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, timestamp: new Date().toISOString() }))
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const consent = loadConsent()
    if (!consent) {
      setVisible(true)
    } else {
      setAnalytics(consent.analytics ?? false)
      setMarketing(consent.marketing ?? false)
    }

    const openSettings = () => {
      const consent = loadConsent()
      if (consent) {
        setAnalytics(consent.analytics ?? false)
        setMarketing(consent.marketing ?? false)
      }
      setSettingsOpen(true)
      setVisible(false)
    }

    window.addEventListener('open-cookie-settings', openSettings)
    return () => window.removeEventListener('open-cookie-settings', openSettings)
  }, [])

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true })
    setAnalytics(true)
    setMarketing(true)
    setVisible(false)
    setSettingsOpen(false)
  }

  const acceptEssential = () => {
    saveConsent({ essential: true, analytics: false, marketing: false })
    setAnalytics(false)
    setMarketing(false)
    setVisible(false)
    setSettingsOpen(false)
  }

  const saveSettings = () => {
    saveConsent({ essential: true, analytics, marketing })
    setSettingsOpen(false)
    setVisible(false)
  }

  if (!visible && !settingsOpen) return null

  return (
    <>
      {/* Overlay for settings modal */}
      {settingsOpen && (
        <div className="cookie-overlay" onClick={() => setSettingsOpen(false)} />
      )}

      {/* Settings modal */}
      {settingsOpen && (
        <div className="cookie-modal" role="dialog" aria-modal="true" aria-label="Sīkdatņu iestatījumi">
          <div className="cookie-modal-header">
            <h2>Sīkdatņu iestatījumi</h2>
            <button className="cookie-modal-close" onClick={() => setSettingsOpen(false)} aria-label="Aizvērt">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="cookie-modal-body">
            <p className="cookie-modal-intro">
              Mēs izmantojam sīkdatnes, lai nodrošinātu mājaslapas darbību un uzlabotu jūsu pieredzi.
              Varat izvēlēties, kuras sīkdatnes atļaut. Sīkāk: <Link to="/sikdatnu-politika" onClick={() => setSettingsOpen(false)}>Sīkdatņu politika</Link>.
            </p>

            <div className="cookie-option">
              <div className="cookie-option-info">
                <div className="cookie-option-header">
                  <span className="cookie-option-name">Nepieciešamās sīkdatnes</span>
                  <span className="cookie-tag cookie-tag--required">Vienmēr ieslēgtas</span>
                </div>
                <p>Nodrošina mājaslapas tehnisko darbību — sesiju pārvaldību un sīkdatņu izvēles saglabāšanu. Nevar tikt atslēgtas.</p>
              </div>
              <div className="cookie-toggle cookie-toggle--disabled" aria-label="Nepieciešamās sīkdatnes (obligātas)">
                <div className="cookie-toggle-track cookie-toggle-track--on">
                  <div className="cookie-toggle-thumb" />
                </div>
              </div>
            </div>

            <div className="cookie-option">
              <div className="cookie-option-info">
                <div className="cookie-option-header">
                  <span className="cookie-option-name">Analītiskās sīkdatnes</span>
                  <span className="cookie-tag cookie-tag--optional">Pēc izvēles</span>
                </div>
                <p>Palīdz mums saprast, kā apmeklētāji lieto mājaslapu (Google Analytics u.tml.). Dati tiek apkopoti anonimizēti.</p>
              </div>
              <button
                className="cookie-toggle"
                role="switch"
                aria-checked={analytics}
                aria-label="Analītiskās sīkdatnes"
                onClick={() => setAnalytics(v => !v)}
              >
                <div className={`cookie-toggle-track${analytics ? ' cookie-toggle-track--on' : ''}`}>
                  <div className="cookie-toggle-thumb" />
                </div>
              </button>
            </div>

            <div className="cookie-option">
              <div className="cookie-option-info">
                <div className="cookie-option-header">
                  <span className="cookie-option-name">Mārketinga sīkdatnes</span>
                  <span className="cookie-tag cookie-tag--optional">Pēc izvēles</span>
                </div>
                <p>Ļauj rādīt jums atbilstošus reklāmas piedāvājumus (Meta Pixel / Facebook sīkdatnes). Tiek aktivizētas tikai ar jūsu piekrišanu.</p>
              </div>
              <button
                className="cookie-toggle"
                role="switch"
                aria-checked={marketing}
                aria-label="Mārketinga sīkdatnes"
                onClick={() => setMarketing(v => !v)}
              >
                <div className={`cookie-toggle-track${marketing ? ' cookie-toggle-track--on' : ''}`}>
                  <div className="cookie-toggle-thumb" />
                </div>
              </button>
            </div>
          </div>

          <div className="cookie-modal-footer">
            <button className="cookie-btn cookie-btn--outline" onClick={acceptEssential}>
              Tikai nepieciešamās
            </button>
            <button className="cookie-btn cookie-btn--secondary" onClick={saveSettings}>
              Saglabāt izvēli
            </button>
            <button className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
              Akceptēt visas
            </button>
          </div>
        </div>
      )}

      {/* Banner (first visit) */}
      {visible && !settingsOpen && (
        <div className="cookie-banner" role="region" aria-label="Sīkdatņu paziņojums">
          <div className="cookie-banner-content">
            <div className="cookie-banner-text">
              <strong>Mēs izmantojam sīkdatnes</strong>
              <p>
                Šī mājasapa izmanto sīkdatnes mājaslapas darbībai, analītikai un mārketingam (Meta Pixel).
                Mārketinga un analītiskās sīkdatnes tiek aktivizētas tikai ar jūsu piekrišanu.{' '}
                <Link to="/sikdatnu-politika">Uzzināt vairāk</Link>
              </p>
            </div>
            <div className="cookie-banner-actions">
              <button className="cookie-btn cookie-btn--outline" onClick={acceptEssential}>
                Tikai nepieciešamās
              </button>
              <button className="cookie-btn cookie-btn--ghost" onClick={() => { setSettingsOpen(true); setVisible(false) }}>
                Pielāgot
              </button>
              <button className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
                Akceptēt visas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
