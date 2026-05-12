import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CookieBanner.css'
import { useLocale } from '../lib/publicI18n.jsx'

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
  const { text } = useLocale()
  const cookieText = text.cookies
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
        <div className="cookie-modal" role="dialog" aria-modal="true" aria-label={cookieText.settingsLabel}>
          <div className="cookie-modal-header">
            <h2>{cookieText.settingsLabel}</h2>
            <button className="cookie-modal-close" onClick={() => setSettingsOpen(false)} aria-label={cookieText.close}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="cookie-modal-body">
            <p className="cookie-modal-intro">
              {cookieText.intro} <Link to="/sikdatnu-politika" onClick={() => setSettingsOpen(false)}>{cookieText.policyLink}</Link>.
            </p>

            <div className="cookie-option">
              <div className="cookie-option-info">
                <div className="cookie-option-header">
                  <span className="cookie-option-name">{cookieText.options.necessary.name}</span>
                  <span className="cookie-tag cookie-tag--required">{cookieText.required}</span>
                </div>
                <p>{cookieText.options.necessary.desc}</p>
              </div>
              <div className="cookie-toggle cookie-toggle--disabled" aria-label={cookieText.options.necessary.aria}>
                <div className="cookie-toggle-track cookie-toggle-track--on">
                  <div className="cookie-toggle-thumb" />
                </div>
              </div>
            </div>

            <div className="cookie-option">
              <div className="cookie-option-info">
                <div className="cookie-option-header">
                  <span className="cookie-option-name">{cookieText.options.analytics.name}</span>
                  <span className="cookie-tag cookie-tag--optional">{cookieText.optional}</span>
                </div>
                <p>{cookieText.options.analytics.desc}</p>
              </div>
              <button
                className="cookie-toggle"
                role="switch"
                aria-checked={analytics}
                aria-label={cookieText.options.analytics.name}
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
                  <span className="cookie-option-name">{cookieText.options.marketing.name}</span>
                  <span className="cookie-tag cookie-tag--optional">{cookieText.optional}</span>
                </div>
                <p>{cookieText.options.marketing.desc}</p>
              </div>
              <button
                className="cookie-toggle"
                role="switch"
                aria-checked={marketing}
                aria-label={cookieText.options.marketing.name}
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
              {cookieText.buttons.essential}
            </button>
            <button className="cookie-btn cookie-btn--secondary" onClick={saveSettings}>
              {cookieText.buttons.save}
            </button>
            <button className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
              {cookieText.buttons.acceptAll}
            </button>
          </div>
        </div>
      )}

      {/* Banner (first visit) */}
      {visible && !settingsOpen && (
        <div className="cookie-banner" role="region" aria-label={cookieText.bannerAria}>
          <div className="cookie-banner-content">
            <div className="cookie-banner-text">
              <strong>{cookieText.bannerTitle}</strong>
              <p>
                {cookieText.bannerText}{' '}
                <Link to="/sikdatnu-politika">{cookieText.learnMore}</Link>
              </p>
            </div>
            <div className="cookie-banner-actions">
              <button className="cookie-btn cookie-btn--outline" onClick={acceptEssential}>
                {cookieText.buttons.essential}
              </button>
              <button className="cookie-btn cookie-btn--ghost" onClick={() => { setSettingsOpen(true); setVisible(false) }}>
                {cookieText.buttons.customize}
              </button>
              <button className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
                {cookieText.buttons.acceptAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
